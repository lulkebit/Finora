import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    employmentStatus?: string;
    monthlyIncome?: number;
    savingsGoal?: number;
    riskTolerance?: 'low' | 'medium' | 'high';
}

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Service
export const authApi = {
    login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    register: async (userData: RegisterData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
};

export const dashboardApi = {
    getOverview: async () => {
        const response = await api.get('/plaid/dashboard/overview');
        return response.data;
    },
    getTransactions: async () => {
        const response = await api.get('/plaid/transactions');
        return response.data;
    },
    getCategories: async () => {
        const response = await api.get('/plaid/categories');
        return response.data;
    },
    getContracts: async () => {
        const response = await api.get('/plaid/contracts');
        return response.data;
    },
    getAccounts: async () => {
        const response = await api.get('/plaid/accounts');
        return response.data.accounts;
    },
};

export default api;
