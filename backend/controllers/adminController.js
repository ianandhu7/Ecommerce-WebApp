const { User, Order, Product, Wishlist, OrderProduct } = require('../models');
const { Sequelize, Op } = require('sequelize');
const bcrypt = require('bcryptjs');

// Get all users with summary
const getUsersSummary = async (req, res) => {
    try {
        const users = await User.findAll({
            where: { role: 'customer' },
            attributes: ['id', 'name', 'email', 'role', 'createdAt', 'lastLogin', 'status'],
            include: [
                {
                    model: Order,
                    attributes: ['id', 'total'],
                    required: false, // LEFT OUTER JOIN to include users without orders
                    include: [
                        {
                            model: OrderProduct,
                            attributes: ['ProductId', 'quantity'],
                            required: false,
                            include: [
                                {
                                    model: Product,
                                    attributes: ['category'],
                                    required: false
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        const usersSummary = await Promise.all(users.map(async (user) => {
            const orders = user.Orders || [];
            const totalOrders = orders.length;
            const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);

            // Calculate favorite category
            const categoryCount = {};
            orders.forEach(order => {
                if (order.OrderProducts) {
                    order.OrderProducts.forEach(op => {
                        if (op.Product && op.Product.category) {
                            const category = op.Product.category;
                            categoryCount[category] = (categoryCount[category] || 0) + op.quantity;
                        }
                    });
                }
            });

            const favoriteCategory = Object.keys(categoryCount).length > 0
                ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
                : 'N/A';

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                totalOrders,
                totalSpent: totalSpent.toFixed(2),
                lastLogin: user.lastLogin || user.createdAt,
                joinedDate: user.createdAt,
                favoriteCategory,
                status: user.status,
                role: user.role
            };
        }));

        res.json(usersSummary);
    } catch (error) {
        console.error('Get users summary error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get detailed user analytics
const getUserDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Order,
                    include: [
                        {
                            model: OrderProduct,
                            include: [Product]
                        }
                    ]
                },
                {
                    model: Wishlist,
                    include: [Product]
                }
            ]
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const orders = user.Orders || [];
        const wishlist = user.Wishlists || [];

        // Calculate statistics
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

        // Category statistics
        const categoryCount = {};
        orders.forEach(order => {
            if (order.OrderProducts) {
                order.OrderProducts.forEach(op => {
                    if (op.Product && op.Product.category) {
                        const category = op.Product.category;
                        categoryCount[category] = (categoryCount[category] || 0) + op.quantity;
                    }
                });
            }
        });

        const mostPurchasedCategory = Object.keys(categoryCount).length > 0
            ? Object.keys(categoryCount).reduce((a, b) => categoryCount[a] > categoryCount[b] ? a : b)
            : 'N/A';

        // Order history with details
        const orderHistory = orders.map(order => ({
            id: order.id,
            date: order.createdAt,
            total: order.total,
            status: order.status,
            items: order.OrderProducts ? order.OrderProducts.length : 0,
            products: order.OrderProducts ? order.OrderProducts.map(op => ({
                name: op.Product ? op.Product.name : 'Unknown',
                quantity: op.quantity,
                price: op.Product ? op.Product.price : 0
            })) : []
        }));

        // Activity timeline
        const timeline = [
            ...orders.map(order => ({
                type: 'order',
                date: order.createdAt,
                description: `Placed order #${order.id}`,
                amount: order.total
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

        res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                status: user.status,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt
            },
            statistics: {
                totalOrders,
                totalSpent: totalSpent.toFixed(2),
                avgOrderValue: avgOrderValue.toFixed(2),
                mostPurchasedCategory,
                wishlistItems: wishlist.length
            },
            orderHistory,
            wishlist: wishlist.map(w => ({
                productId: w.productId,
                product: w.Product ? {
                    id: w.Product.id,
                    name: w.Product.name,
                    price: w.Product.price,
                    image: w.Product.image
                } : null,
                addedAt: w.createdAt
            })),
            timeline
        });
    } catch (error) {
        console.error('Get user detail error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get user growth analytics
const getUsersGrowth = async (req, res) => {
    try {
        const usersGrowth = await User.findAll({
            where: { role: 'customer' },
            attributes: [
                [Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM'), 'month'],
                [Sequelize.fn('COUNT', Sequelize.col('id')), 'count']
            ],
            group: [Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM')],
            order: [[Sequelize.fn('TO_CHAR', Sequelize.col('createdAt'), 'YYYY-MM'), 'ASC']],
            raw: true
        });

        res.json(usersGrowth);
    } catch (error) {
        console.error('Get users growth error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get top customers
const getTopCustomers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const users = await User.findAll({
            where: { role: 'customer' },
            attributes: ['id', 'name', 'email'],
            include: [
                {
                    model: Order,
                    attributes: ['total']
                }
            ]
        });

        const topCustomers = users.map(user => {
            const orders = user.Orders || [];
            const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                totalOrders: orders.length,
                totalSpent: totalSpent.toFixed(2)
            };
        })
            .sort((a, b) => parseFloat(b.totalSpent) - parseFloat(a.totalSpent))
            .slice(0, limit);

        res.json(topCustomers);
    } catch (error) {
        console.error('Get top customers error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get category statistics
const getCategoryStats = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderProduct,
                    include: [
                        {
                            model: Product,
                            attributes: ['category']
                        }
                    ]
                }
            ]
        });

        const categoryStats = {};
        orders.forEach(order => {
            if (order.OrderProducts) {
                order.OrderProducts.forEach(op => {
                    if (op.Product && op.Product.category) {
                        const category = op.Product.category;
                        if (!categoryStats[category]) {
                            categoryStats[category] = {
                                category,
                                count: 0,
                                revenue: 0
                            };
                        }
                        categoryStats[category].count += op.quantity;
                        categoryStats[category].revenue += parseFloat(order.total) / order.OrderProducts.length;
                    }
                });
            }
        });

        const stats = Object.values(categoryStats).map(stat => ({
            ...stat,
            revenue: stat.revenue.toFixed(2)
        }));

        res.json(stats);
    } catch (error) {
        console.error('Get category stats error:', error);
        res.status(500).json({ message: error.message });
    }
};

// CRUD Operations for Users

// Create user (Admin)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'customer' } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update user status
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.status = status;
        await user.save();

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            status: user.status
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users' });
        }

        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all users (list)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] },
            order: [['createdAt', 'DESC']]
        });

        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUsersSummary,
    getUserDetail,
    getUsersGrowth,
    getTopCustomers,
    getCategoryStats,
    createUser,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getAllUsers
};
