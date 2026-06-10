console.log('Página de produtos - JavaScript iniciado!');

async function loadAllProducts() {
    console.log('Carregando todos os produtos...');
    try {
        const products = await api.getProducts();
        console.log('Produtos carregados:', products);
        const productsGrid = document.getElementById('all-products-grid');
        console.log('Elemento all-products-grid:', productsGrid);
        
        if (productsGrid) {
            if (products.length === 0) {
                document.getElementById('no-products').style.display = 'block';
                productsGrid.style.display = 'none';
            } else {
                productsGrid.innerHTML = products.map(product => `
                    <div class="product-card">
                        <div class="product-image-container">
                            <img src="${product.image || 'img/logo.png'}" alt="${product.name}" 
                                 onerror="this.src='img/logo.png'" 
                                 loading="lazy">
                        </div>
                        <h3>${product.name}</h3>
                        <p class="price">R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</p>
                        <button class="btn-view-options" onclick="window.location.href='index.html'">
                            <i class="fas fa-shopping-cart"></i> Ver Detalhes
                        </button>
                    </div>
                `).join('');
                console.log('Produtos renderizados no grid');
            }
        } else {
            console.log('Elemento all-products-grid não encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    loadAllProducts();
    CartManager.updateCount();
});

console.log('JavaScript da página de produtos carregado com sucesso!');
