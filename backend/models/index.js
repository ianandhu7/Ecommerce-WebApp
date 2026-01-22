const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Shipment = require('./Shipment');
const Wishlist = require('./Wishlist');

const OrderProduct = require('./OrderProduct');

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'OrderId', otherKey: 'ProductId' });
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'ProductId', otherKey: 'OrderId' });

// Explicit associations for OrderProduct to allow direct inclusion
Order.hasMany(OrderProduct, { foreignKey: 'OrderId' });
OrderProduct.belongsTo(Order, { foreignKey: 'OrderId' });

Product.hasMany(OrderProduct, { foreignKey: 'ProductId' });
OrderProduct.belongsTo(Product, { foreignKey: 'ProductId' });

// Order-Shipment relationship (one-to-one)
Order.hasOne(Shipment, { foreignKey: 'orderId' });
Shipment.belongsTo(Order, { foreignKey: 'orderId' });

// Wishlist associations
User.hasMany(Wishlist, { foreignKey: 'userId' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

Product.hasMany(Wishlist, { foreignKey: 'productId' });
Wishlist.belongsTo(Product, { foreignKey: 'productId' });

module.exports = { User, Product, Order, Shipment, OrderProduct, Wishlist };
