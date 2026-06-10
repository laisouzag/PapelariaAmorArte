console.log('Sistema de dados com API iniciado!');

// Product Manager using API
const ProductManager = {
    getAll: async function() {
        try {
            return await api.getProducts();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    },
    
    getById: async function(id) {
        try {
            return await api.getProduct(id);
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    },
    
    add: async function(product) {
        try {
            return await api.createProduct(product);
        } catch (error) {
            console.error('Error creating product:', error);
            return null;
        }
    },
    
    update: async function(id, updatedProduct) {
        try {
            return await api.updateProduct(id, updatedProduct);
        } catch (error) {
            console.error('Error updating product:', error);
            return null;
        }
    },
    
    delete: async function(id) {
        try {
            return await api.deleteProduct(id);
        } catch (error) {
            console.error('Error deleting product:', error);
            return null;
        }
    }
};

// Customer Manager using API
const CustomerManager = {
    getAll: async function() {
        // This would require admin endpoint
        console.log('getAll customers requires admin access');
        return [];
    },
    
    getById: async function(id) {
        // This would require admin endpoint
        console.log('getById requires admin access');
        return null;
    },
    
    getByEmail: async function(email) {
        // This would require admin endpoint
        console.log('getByEmail requires admin access');
        return null;
    },
    
    add: async function(customer) {
        try {
            return await api.register(customer);
        } catch (error) {
            console.error('Error creating customer:', error);
            return null;
        }
    },
    
    update: async function(id, updatedCustomer) {
        try {
            return await api.updateProfile(updatedCustomer);
        } catch (error) {
            console.error('Error updating customer:', error);
            return null;
        }
    }
};

// Order Manager using API
const OrderManager = {
    getAll: async function() {
        try {
            return await api.getAllOrders();
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    },
    
    getById: async function(id) {
        try {
            return await api.getOrder(id);
        } catch (error) {
            console.error('Error fetching order:', error);
            return null;
        }
    },
    
    add: async function(order) {
        try {
            return await api.createOrder(order);
        } catch (error) {
            console.error('Error creating order:', error);
            return null;
        }
    },
    
    updateStatus: async function(id, status) {
        try {
            return await api.updateOrderStatus(id, status);
        } catch (error) {
            console.error('Error updating order status:', error);
            return null;
        }
    }
};

// Cart Manager (still uses localStorage for cart, but orders go to API)
const CartManager = {
    get: function() {
        const cart = localStorage.getItem('cart');
        return cart ? JSON.parse(cart) : [];
    },
    
    save: function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    },
    
    add: function(product, quantity = 1) {
        const cart = this.get();
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                customization: product.customization || null
            });
        }
        this.save(cart);
        this.updateCount();
        return cart;
    },
    
    remove: function(productId) {
        const cart = this.get();
        const filtered = cart.filter(item => item.id !== productId);
        this.save(filtered);
        this.updateCount();
        return filtered;
    },
    
    updateQuantity: function(productId, quantity) {
        const cart = this.get();
        const item = cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                return this.remove(productId);
            }
            item.quantity = quantity;
            this.save(cart);
        }
        this.updateCount();
        return cart;
    },
    
    clear: function() {
        localStorage.removeItem('cart');
        this.updateCount();
    },
    
    getTotal: function() {
        const cart = this.get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateCount: function() {
        const cart = this.get();
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountEls = document.querySelectorAll('#cart-count');
        cartCountEls.forEach(el => {
            el.textContent = totalItems;
        });
    }
};

// Session Manager using API
const SessionManager = {
    getCurrentCustomer: function() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    },
    
    setCurrentCustomer: function(customer) {
        localStorage.setItem('currentUser', JSON.stringify(customer));
    },
    
    clearSession: function() {
        localStorage.removeItem('currentUser');
        api.logout();
    },
    
    isLoggedIn: function() {
        return this.getCurrentCustomer() !== null;
    }
};

// Initialize
CartManager.updateCount();

console.log('Sistema de dados com API carregado com sucesso!');
