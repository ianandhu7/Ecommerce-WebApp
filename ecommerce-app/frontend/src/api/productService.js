import axiosInstance from './axios';

// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get('/products');
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch products. Please try again later.'
        );
    }
};

// Get product by ID (for future use)
export const getProductById = async (id) => {
    try {
        const response = await axiosInstance.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(
            error.response?.data?.message ||
            'Failed to fetch product details.'
        );
    }
};
