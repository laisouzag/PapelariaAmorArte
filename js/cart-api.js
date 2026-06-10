console.log('Carrinho de compras com API iniciado!');

async function loadCart() {
    const cart = CartManager.get();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (!cartItemsContainer) return;
    if (cart.length === 0) {
        if (emptyCartMessage) emptyCartMessage.style.display = 'block';
        return;
    }
    if (emptyCartMessage) emptyCartMessage.style.display = 'none';
    cartItemsContainer.innerHTML = cart.map(item => {
        const price = parseFloat(item.price) || 0;
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/100x100?text=Produto'">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="price">R$ ${price.toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <input type="number" value="${item.quantity}" min="1" class="quantity-input" onchange="updateQuantity(${item.id}, this.value)">
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <div class="cart-item-total">
                <p class="total">R$ ${(price * item.quantity).toFixed(2).replace('.', ',')}</p>
                <button class="remove-btn" onclick="removeItem(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `}).join('');
    updateValues();
}

function calculateSubtotal() {
    const cart = CartManager.get();
    return cart.reduce((total, item) => total + ((parseFloat(item.price) || 0) * item.quantity), 0);
}

function calculateTotal() {
    const subtotal = calculateSubtotal();
    const cart = CartManager.get();
    const shipping = cart.length > 0 ? 15.00 : 0;
    const discount = 0;
    return subtotal + shipping - discount;
}

function updateValues() {
    const subtotal = calculateSubtotal();
    const cart = CartManager.get();
    const shipping = cart.length > 0 ? 15.00 : 0;
    const total = calculateTotal();
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    if (subtotalEl) subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (shippingEl) shippingEl.textContent = `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    if (totalEl) totalEl.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    CartManager.updateCount();
}

function increaseQuantity(productId) {
    const cart = CartManager.get();
    const item = cart.find(i => i.id === productId);
    if (item) {
        CartManager.updateQuantity(productId, item.quantity + 1);
        loadCart();
    }
}

function decreaseQuantity(productId) {
    const cart = CartManager.get();
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        CartManager.updateQuantity(productId, item.quantity - 1);
        loadCart();
    }
}

function updateQuantity(productId, quantity) {
    const qty = parseInt(quantity);
    if (qty > 0) {
        CartManager.updateQuantity(productId, qty);
        loadCart();
    }
}

function removeItem(productId) {
    CartManager.remove(productId);
    loadCart();
    showNotification('Item removido do carrinho!');
}

// Make cart functions available globally
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.checkout = checkout;

async function checkout() {
    // Check if user is logged in
    if (!SessionManager.isLoggedIn()) {
        showNotification('Você precisa fazer login ou cadastro para finalizar o pedido.');
        setTimeout(() => {
            window.location.href = 'pages/cadastro.html';
        }, 1500);
        return;
    }

    const cart = CartManager.get();
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// showNotification is defined in main.js, removing duplicate definition

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    CartManager.updateCount();
});

console.log('Funcionalidades do carrinho com API carregadas com sucesso!');
