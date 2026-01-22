const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Shipment = sequelize.define('Shipment', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Orders',
            key: 'id'
        }
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    carrier: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Standard Carrier'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, processing, in_transit, out_for_delivery, delivered
    },
    currentLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    estimatedDelivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    actualDelivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    trackingEvents: {
        type: DataTypes.JSON,
        defaultValue: []
    }
});

module.exports = Shipment;
