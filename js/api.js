// API Client for Papelaria Amor e Arte
const API_BASE_URL = window.location.origin + '/api';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('authToken');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(email, password) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(data.token);
        return data;
    }

    async logout() {
        this.setToken(null);
        localStorage.removeItem('currentUser');
    }

    async getCurrentUser() {
        if (!this.token) return null;
        try {
            return await this.request('/auth/me');
        } catch (error) {
            this.setToken(null);
            return null;
        }
    }

    // Products endpoints
    async getProducts() {
        return this.request('/products');
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async getProductsByCategory(categoryId) {
        return this.request(`/products/category/${categoryId}`);
    }

    async createProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return this.request(`/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return this.request(`/products/${id}`, {
            method: 'DELETE'
        });
    }

    // Orders endpoints
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getMyOrders() {
        return this.request('/orders/my-orders');
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    // Users endpoints
    async updateProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async getProfile() {
        return this.request('/users/profile');
    }

    async getAllCustomers() {
        return this.request('/users/all');
    }

    async deleteCustomer(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE'
        });
    }

    // Categories endpoints
    async getCategories() {
        return this.request('/categories');
    }

    async getCategory(id) {
        return this.request(`/categories/${id}`);
    }

    // Admin endpoints
    async adminLogin(email, password) {
        const data = await this.request('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        this.setToken(data.token);
        return data;
    }

    async getAdminStats() {
        return this.request('/admin/stats');
    }

    async getAllOrders() {
        return this.request('/admin/orders');
    }

    async updateOrderStatus(id, status) {
        return this.request(`/admin/orders/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }
}

// Create global API client instance
const api = new ApiClient();

// Make API client available globally
window.api = api;
