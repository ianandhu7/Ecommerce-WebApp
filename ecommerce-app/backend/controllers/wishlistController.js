const { Wishlist, Product } = require('../models');

// Get user's wishlist
const getUserWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.findAll({
            where: { userId },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'brand', 'price', 'image']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        // Check if already in wishlist
        const existing = await Wishlist.findOne({
            where: { userId, productId }
        });

        if (existing) {
            return res.status(400).json({ message: 'Product already in wishlist' });
        }

        const wishlistItem = await Wishlist.create({
            userId,
            productId
        });

        const itemWithProduct = await Wishlist.findOne({
            where: { id: wishlistItem.id },
            include: [{
                model: Product,
                attributes: ['id', 'name', 'brand', 'price', 'image']
            }]
        });

        res.status(201).json(itemWithProduct);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
    }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Wishlist.destroy({
            where: { id }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
};

// Remove by userId and productId
const removeByUserAndProduct = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const deleted = await Wishlist.destroy({
            where: { userId, productId }
        });

        if (!deleted) {
            return res.status(404).json({ message: 'Wishlist item not found' });
        }

        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Error removing from wishlist' });
    }
};

module.exports = {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    removeByUserAndProduct
};
