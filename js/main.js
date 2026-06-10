console.log('Papelaria Amor e Arte - JavaScript iniciado!');

async function loadProducts() {
    console.log('Carregando produtos...');
    try {
        const products = await ProductManager.getAll();
        console.log('Produtos carregados:', products);
        const productsGrid = document.getElementById('products-grid');
        console.log('Elemento products-grid:', productsGrid);
        if (productsGrid) {
            // Limitar a apenas 6 produtos para destaques
            const featuredProducts = products.slice(0, 6);
            productsGrid.innerHTML = featuredProducts.map(product => `
                <div class="product-card">
                    <div class="product-image-container">
                        <img src="${product.image || 'img/logo.png'}" alt="${product.name}" 
                             onerror="this.src='img/logo.png'" 
                             loading="lazy">
                    </div>
                    <h3>${product.name}</h3>
                    <p class="price">R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</p>
                    <div class="product-buttons">
                        <button class="btn-view-options" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i> Adicionar
                        </button>
                        <button class="btn-secondary" onclick="personalizeProduct(${product.id})">
                            <i class="fas fa-paint-brush"></i> Personalizar
                        </button>
                    </div>
                </div>
            `).join('');
            console.log('Produtos renderizados no grid');
        } else {
            console.log('Elemento products-grid não encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function addToCart(productId) {
    try {
        const product = await ProductManager.getById(productId);
        if (product) {
            CartManager.add(product, 1);
            showNotification('Produto adicionado ao carrinho!');
        }
    } catch (error) {
        console.error('Erro ao adicionar produto ao carrinho:', error);
    }
}

function personalizeProduct(productId) {
    window.location.href = `personalizar.html?productId=${productId}`;
}

// Make addToCart, personalizeProduct, and showNotification available globally
window.addToCart = addToCart;
window.personalizeProduct = personalizeProduct;
window.showNotification = showNotification;

// Create notification animations style element (only once)
if (!document.getElementById('notification-animations')) {
    let styleElement = document.createElement('style');
    styleElement.id = 'notification-animations';
    styleElement.textContent = `
        @keyframes slideIn {
            from { transform: translateX(400px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(400px); opacity: 0; }
        }
    `;
    document.head.appendChild(styleElement);
}

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

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.querySelector('.main-nav');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
    });
}

const searchInput = document.querySelector('.search-bar input');
const searchButton = document.querySelector('.search-bar button');
if (searchButton) {
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productName = card.querySelector('h3').textContent.toLowerCase();
            if (productName.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        showNotification('Obrigado por se inscrever! ' + email);
        newsletterForm.reset();
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

let lastScroll = 0;
const header = document.querySelector('.main-header');
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScroll = currentScroll;
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);
document.querySelectorAll('.feature-item, .category-item, .product-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});


document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    CartManager.updateCount();
    if (typeof checkLoginStatus === 'function') {
        checkLoginStatus();
    }
    
    // Fix produtos link navigation
    const produtosLink = document.getElementById('produtos-link');
    if (produtosLink) {
        produtosLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'produtos.html';
        });
    }
});

console.log('JavaScript carregado com sucesso!');