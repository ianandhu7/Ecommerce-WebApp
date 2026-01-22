import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

// Get auth token from localStorage
const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
        headers: {
            'Authorization': `Bearer ${user.token}`
        }
    };
};

// User Summary
export const getUsersSummary = async () => {
    const response = await axios.get(`${API_URL}/admin/users-summary`, getAuthHeaders());
    return response.data;
};

// User Detail
export const getUserDetail = async (userId) => {
    const response = await axios.get(`${API_URL}/admin/user/${userId}`, getAuthHeaders());
    return response.data;
};

// User Growth Analytics
export const getUsersGrowth = async () => {
    const response = await axios.get(`${API_URL}/admin/analytics/users-growth`, getAuthHeaders());
    return response.data;
};

// Top Customers
export const getTopCustomers = async (limit = 10) => {
    const response = await axios.get(`${API_URL}/admin/analytics/top-customers?limit=${limit}`, getAuthHeaders());
    return response.data;
};

// Category Stats
export const getCategoryStats = async () => {
    const response = await axios.get(`${API_URL}/admin/analytics/category-stats`, getAuthHeaders());
    return response.data;
};

// Get all users
export const getAllUsers = async () => {
    const response = await axios.get(`${API_URL}/admin/users`, getAuthHeaders());
    return response.data;
};

// Create user
export const createUser = async (userData) => {
    const response = await axios.post(`${API_URL}/admin/users`, userData, getAuthHeaders());
    return response.data;
};

// Update user role
export const updateUserRole = async (userId, role) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role }, getAuthHeaders());
    return response.data;
};

// Update user status
export const updateUserStatus = async (userId, status) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/status`, { status }, getAuthHeaders());
    return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, getAuthHeaders());
    return response.data;
};

// User Profile APIs
export const getUserProfile = async () => {
    const response = await axios.get(`${API_URL}/user/profile`, getAuthHeaders());
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await axios.put(`${API_URL}/user/profile`, profileData, getAuthHeaders());
    return response.data;
};

export const changeUserPassword = async (passwordData) => {
    const response = await axios.put(`${API_URL}/user/password`, passwordData, getAuthHeaders());
    return response.data;
};
