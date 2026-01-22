import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Get available shipping methods
export const getShippingMethods = async (orderTotal) => {
    try {
        const response = await axios.get(`${API_URL}/shipping/methods`, {
            params: { orderTotal }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching shipping methods:', error);
        throw error;
    }
};

// Calculate shipping cost
export const calculateShipping = async (method, orderTotal) => {
    try {
        const response = await axios.post(`${API_URL}/shipping/calculate`, {
            method,
            orderTotal
        });
        return response.data;
    } catch (error) {
        console.error('Error calculating shipping:', error);
        throw error;
    }
};

// Get order tracking information
export const getOrderTracking = async (orderId) => {
    try {
        const response = await axios.get(`${API_URL}/orders/${orderId}/tracking`);
        return response.data;
    } catch (error) {
        console.error('Error fetching order tracking:', error);
        throw error;
    }
};

// Track by tracking number
export const trackByNumber = async (trackingNumber) => {
    try {
        const response = await axios.get(`${API_URL}/shipping/track-number/${trackingNumber}`);
        return response.data;
    } catch (error) {
        console.error('Error tracking by number:', error);
        throw error;
    }
};

// Get user orders
export const getUserOrders = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/orders/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
};
