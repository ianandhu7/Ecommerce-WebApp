const { Order, Product, User, Shipment } = require('../models');
const { generateTrackingNumber } = require('./shippingController');
const { Op } = require('sequelize');
const { sendOrderConfirmation } = require('../utils/emailService');

// Create a new order
exports.createOrder = async (req, res) => {
    try {
        const {
            userId,
            products,
            total,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingZip,
            shippingCountry,
            shippingPhone,
            shippingMethod,
            shippingCost,
            paymentMethod,
            paymentDetails
        } = req.body; // products = [{ id, quantity }]

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate tracking number
        const trackingNumber = generateTrackingNumber();

        // Determine carrier based on shipping method
        const carriers = {
            standard: 'USPS',
            express: 'FedEx',
            overnight: 'UPS'
        };
        const carrier = carriers[shippingMethod] || 'Standard Carrier';

        // Calculate estimated delivery
        const deliveryDays = {
            standard: 7,
            express: 3,
            overnight: 1
        };
        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + (deliveryDays[shippingMethod] || 7));

        const order = await Order.create({
            userId: userId,
            total: total,
            status: 'pending',
            shippingAddress,
            shippingCity,
            shippingState,
            shippingZip,
            shippingCountry: shippingCountry || 'USA',
            shippingPhone,
            shippingMethod,
            shippingCost: shippingCost || 0,
            trackingNumber,
            carrier,
            estimatedDelivery,
            paymentMethod: paymentMethod || 'razorpay',
            paymentDetails: paymentDetails ? JSON.stringify(paymentDetails) : null
        });

        // Add products to order
        if (products && products.length > 0) {
            for (const item of products) {
                const product = await Product.findByPk(item.id);
                if (product) {
                    await order.addProduct(product, { through: { quantity: item.quantity } });
                }
            }
        }

        // Create shipment record
        const shipment = await Shipment.create({
            orderId: order.id,
            trackingNumber,
            carrier,
            status: 'pending',
            estimatedDelivery,
            trackingEvents: [
                {
                    status: 'pending',
                    location: 'Order Received',
                    timestamp: new Date(),
                    description: 'Order has been received and is being processed'
                }
            ]
        });

        res.status(201).json({
            message: 'Order created successfully',
            order,
            shipment,
            trackingNumber
        });

        // Send confirmation email asynchronously
        sendOrderConfirmation(order, user).catch(err => console.error('Email service error:', err));
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.findAll({
            where: { userId: userId },
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity'] }
                },
                {
                    model: Shipment,
                    required: false
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get order with tracking information
exports.getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findByPk(orderId, {
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity'] }
                },
                {
                    model: Shipment
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order tracking:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update({ status });

        // Update shipment status as well
        const shipment = await Shipment.findOne({ where: { orderId } });
        if (shipment) {
            const shipmentStatus = {
                'pending': 'pending',
                'processing': 'processing',
                'shipped': 'in_transit',
                'delivered': 'delivered',
                'cancelled': 'cancelled'
            };

            const trackingEvents = shipment.trackingEvents || [];
            trackingEvents.push({
                status: shipmentStatus[status],
                location: 'Processing Center',
                timestamp: new Date(),
                description: `Order status updated to ${status}`
            });

            await shipment.update({
                status: shipmentStatus[status],
                trackingEvents
            });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order with products
        const order = await Order.findOne({
            where: { id: orderId },
            include: [
                {
                    model: Product,
                    through: { attributes: ['quantity'] }
                }
            ]
        });

        if (!order) {
            console.log(`Order not found with ID: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if order can be cancelled
        if (['shipped', 'delivered', 'cancelled'].includes(order.status)) {
            return res.status(400).json({
                message: `Order cannot be cancelled. Current status: ${order.status}`
            });
        }

        // Update order status
        order.status = 'cancelled';
        await order.save();

        // Update shipment status if exists
        const shipment = await Shipment.findOne({ where: { orderId: orderId } });
        if (shipment) {
            shipment.status = 'cancelled';

            // Add cancellation event to tracking
            const trackingEvents = shipment.trackingEvents || [];
            trackingEvents.push({
                status: 'cancelled',
                location: 'Order Cancelled',
                timestamp: new Date(),
                description: 'Order has been cancelled by customer'
            });

            shipment.trackingEvents = trackingEvents;
            await shipment.save();
        }

        console.log(`Order ${orderId} cancelled successfully`);
        res.json({
            message: 'Order cancelled successfully',
            order: {
                id: order.id,
                status: order.status,
                total: order.total
            }
        });

    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            message: 'Error cancelling order',
            error: error.message,
            details: error.stack
        });
    }
};
