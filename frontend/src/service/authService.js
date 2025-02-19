// src/services/authService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
console.log(API_URL);

// Register User
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Login User
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const fetchAllUsers = async () => {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
};