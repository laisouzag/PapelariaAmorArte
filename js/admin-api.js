console.log('Sistema de admin com API iniciado!');

// Notification function
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

// Create notification animations style element
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

// Check admin authentication on load
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAuth();
});

async function showSection(sectionName) {
    const sections = document.querySelectorAll('.admin-section');
    const navLinks = document.querySelectorAll('.admin-nav a');
    sections.forEach(section => section.classList.remove('active'));
    navLinks.forEach(link => link.classList.remove('active'));
    document.getElementById(`${sectionName}-section`).classList.add('active');
    const linkIndex = { 'products': 0, 'orders': 1, 'customers': 2 };
    navLinks[linkIndex[sectionName]].classList.add('active');
    if (sectionName === 'products') {
        await loadProducts();
    } else if (sectionName === 'orders') {
        await loadOrders();
    } else if (sectionName === 'customers') {
        await loadCustomers();
    }
}

async function loadProducts() {
    try {
        const products = await api.getProducts();
        const tbody = document.getElementById('products-table-body');
        tbody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image}" alt="${product.name}"></td>
                <td>${product.name}</td>
                <td>${product.category_name || 'Sem categoria'}</td>
                <td>R$ ${parseFloat(product.price).toFixed(2).replace('.', ',')}</td>
                <td>
                    <button class="action-btn btn-edit" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn btn-delete" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Erro ao carregar produtos!');
    }
}

async function loadOrders() {
    try {
        const orders = await api.getAllOrders();
        const tbody = document.getElementById('orders-table-body');
        tbody.innerHTML = orders.map(order => `
            <tr>
                <td>#${order.id}</td>
                <td>${order.user_name || 'Cliente'}</td>
                <td>${new Date(order.created_at).toLocaleDateString('pt-BR')}</td>
                <td>R$ ${parseFloat(order.total).toFixed(2).replace('.', ',')}</td>
                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                <td>
                    <button class="action-btn btn-view" onclick="viewOrder(${order.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading orders:', error);
        showNotification('Erro ao carregar pedidos!');
    }
}

async function loadCustomers() {
    try {
        const customers = await api.getAllCustomers();
        const tbody = document.getElementById('customers-table-body');
        
        if (customers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhum cliente cadastrado</td></tr>';
            return;
        }
        
        tbody.innerHTML = customers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || 'N/A'}</td>
                <td>${customer.cpf || 'N/A'}</td>
                <td>${new Date(customer.created_at).toLocaleDateString('pt-BR')}</td>
                <td>
                    <button class="action-btn btn-delete" onclick="deleteCustomer(${customer.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
        showNotification('Erro ao carregar clientes!');
    }
}

async function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const title = document.getElementById('modal-title');
    form.reset();
    document.getElementById('product-id').value = '';
    
    // Load categories
    try {
        const categories = await api.getCategories();
        const categorySelect = document.getElementById('product-category');
        categorySelect.innerHTML = categories.map(cat => 
            `<option value="${cat.id}">${cat.name}</option>`
        ).join('');
    } catch (error) {
        console.error('Error loading categories:', error);
    }
    
    if (productId) {
        try {
            const product = await api.getProduct(productId);
            title.textContent = 'Editar Produto';
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-category').value = product.category_id || '';
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-description').value = product.description || '';
            document.getElementById('product-image').value = product.image || '';
        } catch (error) {
            console.error('Error loading product:', error);
            showNotification('Erro ao carregar produto!');
        }
    } else {
        title.textContent = 'Adicionar Produto';
    }
    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
}

function editProduct(productId) {
    openProductModal(productId);
}

async function deleteProduct(productId) {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
        try {
            await api.deleteProduct(productId);
            await loadProducts();
            showNotification('Produto deletado com sucesso!');
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification('Erro ao deletar produto!');
        }
    }
}

async function deleteCustomer(customerId) {
    if (confirm('Tem certeza que deseja deletar este cliente?')) {
        try {
            await api.deleteCustomer(customerId);
            await loadCustomers();
            showNotification('Cliente deletado com sucesso!');
        } catch (error) {
            console.error('Error deleting customer:', error);
            showNotification('Erro ao deletar cliente!');
        }
    }
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        category_id: parseInt(document.getElementById('product-category').value) || null,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value
    };
    
    try {
        if (productId) {
            await api.updateProduct(parseInt(productId), productData);
            showNotification('Produto atualizado com sucesso!');
        } else {
            await api.createProduct(productData);
            showNotification('Produto adicionado com sucesso!');
        }
        closeProductModal();
        await loadProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showNotification('Erro ao salvar produto!');
    }
}

async function viewOrder(orderId) {
    try {
        const order = await api.getOrder(orderId);
        const modal = document.getElementById('order-modal');
        const details = document.getElementById('order-details');
        
        // Parse items if they're stored as JSON string
        let items = [];
        if (typeof order.items === 'string') {
            items = JSON.parse(order.items);
        } else {
            items = order.items || [];
        }
        
        details.innerHTML = `
            <div class="order-details-header">
                <p><strong>ID do Pedido:</strong> #${order.id}</p>
                <p><strong>Cliente:</strong> ${order.user_name || 'Cliente'}</p>
                <p><strong>Email:</strong> ${order.user_email || 'N/A'}</p>
                <p><strong>Data:</strong> ${new Date(order.created_at).toLocaleString('pt-BR')}</p>
                <p><strong>Status:</strong> <span class="status-badge status-${order.status}">${order.status}</span></p>
            </div>
            <h3>Itens do Pedido</h3>
            <div class="order-items">
                ${items.map(item => `
                    <div class="order-item">
                        <div class="order-item-info">
                            <h4>${item.product_name || item.name}</h4>
                            <p>Quantidade: ${item.quantity} x R$ ${parseFloat(item.price).toFixed(2).replace('.', ',')}</p>
                        </div>
                        <div class="order-item-total">
                            R$ ${(parseFloat(item.price) * item.quantity).toFixed(2).replace('.', ',')}
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">
                Total: R$ ${parseFloat(order.total).toFixed(2).replace('.', ',')}
            </div>
        `;
        modal.classList.add('active');
    } catch (error) {
        console.error('Error loading order:', error);
        showNotification('Erro ao carregar pedido!');
    }
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
}

// showNotification is defined in main.js, removing duplicate definition

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

console.log('Sistema de admin com API carregado com sucesso!');
