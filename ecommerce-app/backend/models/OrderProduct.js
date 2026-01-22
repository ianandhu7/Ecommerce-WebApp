const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderProduct = sequelize.define('OrderProduct', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
});

module.exports = OrderProduct;
