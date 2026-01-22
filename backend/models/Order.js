const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, processing, shipped, delivered, cancelled
    },
    // Shipping Address Fields
    shippingAddress: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shippingCity: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shippingState: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shippingZip: {
        type: DataTypes.STRING,
        allowNull: true
    },
    shippingCountry: {
        type: DataTypes.STRING,
        defaultValue: 'USA'
    },
    shippingPhone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    // Shipping Method and Cost
    shippingMethod: {
        type: DataTypes.STRING,
        allowNull: true // standard, express, overnight
    },
    shippingCost: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    // Tracking Information
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
    },
    carrier: {
        type: DataTypes.STRING,
        allowNull: true // FedEx, UPS, USPS, DHL
    },
    estimatedDelivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actualDelivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // Payment Information
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: true, // razorpay, stripe, etc.
        defaultValue: 'razorpay'
    },
    paymentDetails: {
        type: DataTypes.TEXT,
        allowNull: true // JSON string of payment details
    }
});

module.exports = Order;
