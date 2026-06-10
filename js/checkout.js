console.log('Checkout - JavaScript iniciado!');

// WhatsApp number for orders
const WHATSAPP_NUMBER = '5512996591618';

// Fetch address by CEP using ViaCEP API
async function fetchAddressByCEP() {
    const cep = document.getElementById('checkout-cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        showNotification('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showNotification('CEP não encontrado');
            return;
        }
        
        // Fill address fields
        document.getElementById('checkout-street').value = data.logradouro || '';
        document.getElementById('checkout-neighborhood').value = data.bairro || '';
        document.getElementById('checkout-city').value = data.localidade || '';
        document.getElementById('checkout-state').value = data.uf || '';
        
        showNotification('Endereço preenchido automaticamente!');
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        showNotification('Erro ao buscar CEP. Tente novamente.');
    }
}

// Format CEP input
document.addEventListener('DOMContentLoaded', function() {
    const cepInput = document.getElementById('checkout-cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 8) value = value.slice(0, 8);
            value = value.replace(/^(\d{5})(\d{3})$/, '$1-$2');
            e.target.value = value;
        });
    }
    
    // Load cart items
    loadCheckoutSummary();
});

// Load checkout summary
function loadCheckoutSummary() {
    // Check if user is logged in
    if (!SessionManager.isLoggedIn()) {
        showNotification('Você precisa fazer login ou cadastro para finalizar o pedido.');
        setTimeout(() => {
            window.location.href = 'pages/cadastro.html';
        }, 1500);
        return;
    }

    const cart = CartManager.get();
    const itemsContainer = document.getElementById('checkout-items');
    
    if (!cart || cart.length === 0) {
        window.location.href = 'carrinho.html';
        return;
    }
    
    let subtotal = 0;
    let itemsHTML = '';
    
    cart.forEach(item => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        subtotal += itemTotal;

        let customizationDetails = '';
        if (item.customization) {
            customizationDetails = `<br><small>`;
            if (item.customization.name) customizationDetails += `✏️ Nome: ${item.customization.name}<br>`;
            if (item.customization.saint) customizationDetails += `⛪ Santo: ${item.customization.saint}<br>`;
            if (item.customization.color) customizationDetails += `🎨 Cor: ${item.customization.color}<br>`;
            if (item.customization.coverType) customizationDetails += `📖 Capa: ${item.customization.coverType}<br>`;
            if (item.customization.notes) customizationDetails += `📝 Obs: ${item.customization.notes}`;
            customizationDetails += `</small>`;
        }

        itemsHTML += `
            <div class="summary-item" style="border-bottom: 1px solid #e0e0e0; padding-bottom: 15px; margin-bottom: 15px;">
                <div>
                    <strong>${item.name}</strong>
                    ${customizationDetails}
                </div>
                <div>
                    ${quantity}x R$ ${price.toFixed(2).replace('.', ',')}
                </div>
            </div>
        `;
    });
    
    itemsContainer.innerHTML = itemsHTML;
    
    // Calculate shipping (fixed rate for now)
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;
    
    document.getElementById('checkout-subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'GRÁTIS' : `R$ ${shipping.toFixed(2).replace('.', ',')}`;
    document.getElementById('checkout-total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// Handle checkout form submission
async function handleCheckout(event) {
    event.preventDefault();
    
    // Get form data
    const name = document.getElementById('checkout-name').value;
    const email = document.getElementById('checkout-email').value;
    const phone = document.getElementById('checkout-phone').value;
    const cep = document.getElementById('checkout-cep').value;
    const street = document.getElementById('checkout-street').value;
    const number = document.getElementById('checkout-number').value;
    const complement = document.getElementById('checkout-complement').value;
    const neighborhood = document.getElementById('checkout-neighborhood').value;
    const city = document.getElementById('checkout-city').value;
    const state = document.getElementById('checkout-state').value;
    const notes = document.getElementById('checkout-notes').value;
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    
    // Get cart items
    const cart = CartManager.get();
    if (!cart || cart.length === 0) {
        showNotification('Seu carrinho está vazio');
        return;
    }
    
    // Calculate totals
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += parseFloat(item.price) * (item.quantity || 1);
    });
    const shipping = subtotal > 200 ? 0 : 15;
    const total = subtotal + shipping;
    
    // Generate order number
    const orderNumber = 'PED' + Date.now().toString().slice(-8);
    
    // Build WhatsApp message
    let message = `🛒 *NOVO PEDIDO - ${orderNumber}*\n\n`;
    message += `👤 *DADOS DO CLIENTE*\n`;
    message += `Nome: ${name}\n`;
    message += `E-mail: ${email}\n`;
    message += `Telefone: ${phone}\n\n`;
    
    message += `📍 *ENDEREÇO DE ENTREGA*\n`;
    message += `CEP: ${cep}\n`;
    message += `Rua: ${street}, ${number}\n`;
    if (complement) message += `Complemento: ${complement}\n`;
    message += `Bairro: ${neighborhood}\n`;
    message += `Cidade: ${city} - ${state}\n\n`;
    
    message += `📦 *ITENS DO PEDIDO*\n`;
    cart.forEach((item, index) => {
        const price = parseFloat(item.price);
        const quantity = item.quantity || 1;
        const itemTotal = price * quantity;
        message += `${index + 1}. ${item.name}\n`;
        message += `   Qtd: ${quantity} x R$ ${price.toFixed(2).replace('.', ',')} = R$ ${itemTotal.toFixed(2).replace('.', ',')}\n`;
        if (item.customization) {
            message += `   ✏️ Nome: ${item.customization.name}\n`;
            if (item.customization.saint) message += `   ⛪ Santo: ${item.customization.saint}\n`;
            if (item.customization.color) message += `   🎨 Cor: ${item.customization.color}\n`;
            if (item.customization.coverType) message += `   📖 Tipo de Capa: ${item.customization.coverType}\n`;
            if (item.customization.notes) message += `   📝 Observações: ${item.customization.notes}\n`;
        }
        message += `\n`;
    });
    
    message += `💰 *RESUMO FINANCEIRO*\n`;
    message += `Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    message += `Frete: ${shipping === 0 ? 'GRÁTIS' : 'R$ ' + shipping.toFixed(2).replace('.', ',')}\n`;
    message += `*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    
    message += `💳 *FORMA DE PAGAMENTO*\n`;
    const paymentNames = {
        'pix': 'PIX',
        'cartao': 'Cartão de Crédito/Débito'
    };
    message += paymentNames[paymentMethod] + '\n\n';
    
    if (notes) {
        message += `📝 *OBSERVAÇÕES*\n${notes}\n\n`;
    }
    
    message += `🙏 Obrigado pela preferência!`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Clear cart and redirect
    CartManager.clear();
    showNotification('Pedido enviado! Redirecionando...');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
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

console.log('JavaScript de checkout carregado com sucesso!');
