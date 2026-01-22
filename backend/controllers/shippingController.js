const { Shipment, Order } = require('../models');

// Shipping methods with costs and delivery times
const SHIPPING_METHODS = {
    standard: {
        name: 'Standard Shipping',
        cost: 5.99,
        deliveryDays: { min: 5, max: 7 },
        carrier: 'USPS'
    },
    express: {
        name: 'Express Shipping',
        cost: 12.99,
        deliveryDays: { min: 2, max: 3 },
        carrier: 'FedEx'
    },
    overnight: {
        name: 'Overnight Shipping',
        cost: 24.99,
        deliveryDays: { min: 1, max: 1 },
        carrier: 'UPS'
    }
};

const FREE_SHIPPING_THRESHOLD = 100;

// Get available shipping methods
exports.getShippingMethods = async (req, res) => {
    try {
        const { orderTotal } = req.query;
        const total = parseFloat(orderTotal) || 0;

        const methods = Object.keys(SHIPPING_METHODS).map(key => {
            const method = SHIPPING_METHODS[key];
            const isFree = total >= FREE_SHIPPING_THRESHOLD && key === 'standard';

            return {
                id: key,
                name: method.name,
                cost: isFree ? 0 : method.cost,
                originalCost: method.cost,
                isFree,
                deliveryDays: method.deliveryDays,
                carrier: method.carrier,
                estimatedDelivery: calculateEstimatedDelivery(method.deliveryDays.max)
            };
        });

        res.status(200).json(methods);
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Calculate shipping cost
exports.calculateShipping = async (req, res) => {
    try {
        const { method, orderTotal } = req.body;
        const total = parseFloat(orderTotal) || 0;

        if (!SHIPPING_METHODS[method]) {
            return res.status(400).json({ message: 'Invalid shipping method' });
        }

        const shippingMethod = SHIPPING_METHODS[method];
        const isFree = total >= FREE_SHIPPING_THRESHOLD && method === 'standard';
        const cost = isFree ? 0 : shippingMethod.cost;

        res.status(200).json({
            method,
            cost,
            isFree,
            carrier: shippingMethod.carrier,
            estimatedDelivery: calculateEstimatedDelivery(shippingMethod.deliveryDays.max)
        });
    } catch (error) {
        console.error('Error calculating shipping:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Generate unique tracking number
exports.generateTrackingNumber = () => {
    const prefix = 'TRK';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}${timestamp}${random}`;
};

// Get tracking information
exports.getTrackingInfo = async (req, res) => {
    try {
        const { orderId } = req.params;

        const shipment = await Shipment.findOne({
            where: { orderId }
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Tracking information not found' });
        }

        res.status(200).json(shipment);
    } catch (error) {
        console.error('Error fetching tracking info:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Track by tracking number
exports.trackByNumber = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const shipment = await Shipment.findOne({
            where: { trackingNumber },
            include: [{ model: Order }]
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Tracking number not found' });
        }

        res.status(200).json(shipment);
    } catch (error) {
        console.error('Error tracking by number:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update shipment status
exports.updateShipmentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, currentLocation } = req.body;

        const shipment = await Shipment.findOne({
            where: { orderId }
        });

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        // Add tracking event
        const trackingEvents = shipment.trackingEvents || [];
        trackingEvents.push({
            status,
            location: currentLocation,
            timestamp: new Date(),
            description: getStatusDescription(status)
        });

        await shipment.update({
            status,
            currentLocation,
            trackingEvents,
            actualDelivery: status === 'delivered' ? new Date() : shipment.actualDelivery
        });

        res.status(200).json({ message: 'Shipment updated successfully', shipment });
    } catch (error) {
        console.error('Error updating shipment:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Helper function to calculate estimated delivery date
function calculateEstimatedDelivery(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

// Helper function to get status description
function getStatusDescription(status) {
    const descriptions = {
        pending: 'Order received and being processed',
        processing: 'Package is being prepared for shipment',
        in_transit: 'Package is on the way',
        out_for_delivery: 'Package is out for delivery',
        delivered: 'Package has been delivered'
    };
    return descriptions[status] || 'Status updated';
}
