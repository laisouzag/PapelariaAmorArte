console.log('Painel do Cliente - JavaScript iniciado!');

// Load customer information
async function loadCustomerInfo() {
    try {
        const customer = await api.getCurrentUser();
        if (customer) {
            // Populate form fields
            document.getElementById('customer-name').value = customer.name || '';
            document.getElementById('customer-email').value = customer.email || '';
            document.getElementById('customer-phone').value = customer.phone || '';
            document.getElementById('customer-cpf').value = customer.cpf || '';
            
            // Load address if available
            if (customer.address) {
                document.getElementById('customer-cep').value = customer.address.zip_code || '';
                document.getElementById('customer-address').value = customer.address.street || '';
                document.getElementById('customer-neighborhood').value = customer.address.neighborhood || '';
                document.getElementById('customer-city').value = customer.address.city || '';
                document.getElementById('customer-state').value = customer.address.state || '';
            }
        }
    } catch (error) {
        console.error('Erro ao carregar dados do cliente:', error);
    }
}

// Load customer orders
async function loadOrders() {
    try {
        const orders = await api.getMyOrders();
        const ordersContainer = document.getElementById('orders-container');
        
        if (!orders || orders.length === 0) {
            ordersContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-shopping-bag" style="font-size: 48px; color: #ccc; margin-bottom: 15px;"></i>
                    <p style="color: #666;">Você ainda não possui pedidos.</p>
                    <a href="index.html" class="btn-primary" style="display: inline-block; margin-top: 15px;">Começar a Comprar</a>
                </div>
            `;
            return;
        }
        
        ordersContainer.innerHTML = orders.map(order => `
            <div class="order-card" style="background: white; border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                    <div>
                        <h4 style="margin: 0;">Pedido #${order.id || order.order_number || 'N/A'}</h4>
                        <small style="color: #666;">${order.created_at ? new Date(order.created_at).toLocaleDateString('pt-BR') : 'Data não disponível'}</small>
                    </div>
                    <div class="order-status" style="padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; background-color: ${getStatusColor(order.status)};">
                        ${getStatusText(order.status)}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <strong>Itens do Pedido:</strong>
                    ${order.items ? order.items.map(item => `
                        <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0;">
                            <span>${item.name} ${item.customization ? `<small>(Personalizado)</small>` : ''} x${item.quantity}</span>
                            <span>R$ ${parseFloat(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                        </div>
                    `).join('') : '<p style="color: #666;">Itens não disponíveis</p>'}
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Total:</strong> R$ ${parseFloat(order.total || 0).toFixed(2).replace('.', ',')}
                    </div>
                    ${order.tracking_code ? `
                        <div style="text-align: right;">
                            <small style="color: #666;">Código de Rastreio:</small><br>
                            <strong>${order.tracking_code}</strong>
                        </div>
                    ` : ''}
                </div>
                
                ${order.customization ? `
                    <div style="margin-top: 15px; padding: 10px; background-color: #f9f9f9; border-radius: 5px;">
                        <strong>Personalização:</strong>
                        ${order.customization.name ? `<p>✏️ Nome: ${order.customization.name}</p>` : ''}
                        ${order.customization.saint ? `<p>⛪ Santo: ${order.customization.saint}</p>` : ''}
                        ${order.customization.color ? `<p>🎨 Cor: ${order.customization.color}</p>` : ''}
                        ${order.customization.coverType ? `<p>📖 Capa: ${order.customization.coverType}</p>` : ''}
                        ${order.customization.notes ? `<p>📝 Obs: ${order.customization.notes}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        document.getElementById('orders-container').innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #e91e63; margin-bottom: 15px;"></i>
                <p style="color: #666;">Erro ao carregar pedidos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Get status color
function getStatusColor(status) {
    const colors = {
        'pending': '#ffc107',
        'processing': '#17a2b8',
        'shipped': '#28a745',
        'delivered': '#6c757d',
        'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
}

// Get status text in Portuguese
function getStatusText(status) {
    const texts = {
        'pending': 'Pendente',
        'processing': 'Em Processamento',
        'shipped': 'Enviado',
        'delivered': 'Entregue',
        'cancelled': 'Cancelado'
    };
    return texts[status] || status;
}

// Handle customer update form submission
async function handleCustomerUpdate(event) {
    event.preventDefault();
    
    const customerData = {
        name: document.getElementById('customer-name').value,
        email: document.getElementById('customer-email').value,
        phone: document.getElementById('customer-phone').value,
        cpf: document.getElementById('customer-cpf').value,
        address: {
            zip_code: document.getElementById('customer-cep').value,
            street: document.getElementById('customer-address').value,
            neighborhood: document.getElementById('customer-neighborhood').value,
            city: document.getElementById('customer-city').value,
            state: document.getElementById('customer-state').value
        }
    };
    
    try {
        await api.updateProfile(customerData);
        showNotification('Dados atualizados com sucesso!');
    } catch (error) {
        console.error('Erro ao atualizar dados:', error);
        showNotification('Erro ao atualizar dados. Tente novamente.');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!SessionManager.isLoggedIn()) {
        showNotification('Você precisa fazer login para acessar esta página.');
        setTimeout(() => {
            window.location.href = 'pages/cadastro.html';
        }, 1500);
        return;
    }
    
    loadCustomerInfo();
    loadOrders();
    CartManager.updateCount();
    
    // Add input focus effects
    const inputs = document.querySelectorAll('.customer-info-form input, .customer-info-form select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#e91e63';
        });
        input.addEventListener('blur', function() {
            this.style.borderColor = '#e0e0e0';
        });
    });
});

console.log('Painel do Cliente carregado com sucesso!');
