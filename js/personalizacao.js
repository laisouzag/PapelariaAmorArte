console.log('Personalização - JavaScript iniciado!');

// Get product ID from URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('productId');

// Load product details
async function loadProductDetails() {
    if (productId) {
        try {
            const product = await api.getProduct(productId);
            document.getElementById('product-name').value = product.name;
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
        }
    }
}

// Handle personalization form submission
async function handlePersonalization(event) {
    event.preventDefault();

    const customName = document.getElementById('custom-name').value;
    const customSaint = document.getElementById('custom-saint').value;
    const customColor = document.getElementById('custom-color').value;
    const coverType = document.getElementById('cover-type').value;
    const additionalNotes = document.getElementById('additional-notes').value;

    // Get product from cart or create new
    let product;
    if (productId) {
        try {
            product = await api.getProduct(productId);
        } catch (error) {
            console.error('Erro ao carregar produto:', error);
            showNotification('Erro ao carregar produto');
            return;
        }
    } else {
        showNotification('Produto não especificado');
        return;
    }

    // Add customization to product
    const customizedProduct = {
        ...product,
        customization: {
            name: customName,
            saint: customSaint,
            color: customColor,
            coverType: coverType,
            notes: additionalNotes
        }
    };

    // Add to cart
    CartManager.add(customizedProduct, 1);
    showNotification('Produto personalizado adicionado ao carrinho!');

    // Redirect to cart
    setTimeout(() => {
        window.location.href = 'carrinho.html';
    }, 1500);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #e91e63;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadProductDetails();
    CartManager.updateCount();
});

console.log('JavaScript de personalização carregado com sucesso!');
