import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

export const getUserWishlist = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/wishlist/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        throw error;
    }
};

export const addToWishlist = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_URL}/wishlist`, {
            userId,
            productId
        });
        return response.data;
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        throw error;
    }
};

export const removeFromWishlist = async (wishlistId) => {
    try {
        const response = await axios.delete(`${API_URL}/wishlist/${wishlistId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};

export const removeByUserAndProduct = async (userId, productId) => {
    try {
        const response = await axios.post(`${API_URL}/wishlist/remove`, {
            userId,
            productId
        });
        return response.data;
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        throw error;
    }
};
