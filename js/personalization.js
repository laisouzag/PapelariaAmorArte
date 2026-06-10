// Personalization Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get all form elements
    const productSelect = document.getElementById('product-select');
    const customName = document.getElementById('custom-name');
    const customMessage = document.getElementById('custom-message');
    const fontSelect = document.getElementById('font-select');
    const colorOptions = document.querySelectorAll('input[name="color"]');
    const imageUpload = document.getElementById('image-upload');
    const fileName = document.getElementById('file-name');
    
    // Get preview elements
    const previewName = document.getElementById('preview-name');
    const previewMessage = document.getElementById('preview-message');
    const previewImg = document.getElementById('preview-img');
    const previewProduct = document.getElementById('preview-product');
    
    // Product images mapping
    const productImages = {
        'caderno': 'img/CadernosAgendas/Agenda2026Personalizada.png',
        'agenda': 'img/CadernosAgendas/AgendaPersonalizadaSãoBento.png',
        'terco': 'img/Terços/TerçoRoxo.png',
        'bloco': 'img/BlocosNotas/BlocoDeNotasCorinthians.png',
        'calendario': 'img/Calendarios/Calendario2025.png'
    };
    
    // Update preview on product change
    productSelect.addEventListener('change', function() {
        const selectedProduct = this.value;
        if (selectedProduct && productImages[selectedProduct]) {
            previewImg.src = productImages[selectedProduct];
        }
    });
    
    // Update preview on name change
    customName.addEventListener('input', function() {
        const name = this.value || 'Seu Nome';
        previewName.textContent = name;
    });
    
    // Update preview on message change
    customMessage.addEventListener('input', function() {
        const message = this.value || 'Sua mensagem especial aqui';
        previewMessage.textContent = message;
    });
    
    // Update preview on font change
    fontSelect.addEventListener('change', function() {
        const selectedFont = this.value;
        previewName.style.fontFamily = `'${selectedFont}', cursive`;
        previewMessage.style.fontFamily = `'${selectedFont}', cursive`;
    });
    
    // Update preview on color change
    colorOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                const color = this.value;
                previewName.style.color = color;
                previewMessage.style.color = color;
            }
        });
    });
    
    // Handle image upload
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('O arquivo é muito grande. Máximo 5MB.');
                this.value = '';
                fileName.textContent = 'Nenhum arquivo selecionado';
                return;
            }
            
            // Check file type
            if (!file.type.match('image.*')) {
                alert('Por favor, selecione apenas arquivos de imagem.');
                this.value = '';
                fileName.textContent = 'Nenhum arquivo selecionado';
                return;
            }
            
            fileName.textContent = file.name;
            
            // Read and display the image
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            fileName.textContent = 'Nenhum arquivo selecionado';
        }
    });
    
    // Initialize with default values
    previewName.style.fontFamily = "'Pacifico', cursive";
    previewMessage.style.fontFamily = "'Pacifico', cursive";
    previewName.style.color = '#E91E63';
    previewMessage.style.color = '#E91E63';
});

// Add to cart function
function addToCart() {
    const productSelect = document.getElementById('product-select');
    const customName = document.getElementById('custom-name');
    const customMessage = document.getElementById('custom-message');
    const fontSelect = document.getElementById('font-select');
    const selectedColor = document.querySelector('input[name="color"]:checked');
    const imageUpload = document.getElementById('image-upload');
    
    // Validate product selection
    if (!productSelect.value) {
        alert('Por favor, selecione um produto.');
        return;
    }
    
    // Validate name
    if (!customName.value.trim()) {
        alert('Por favor, digite um nome para personalização.');
        return;
    }
    
    // Get customization data
    const customization = {
        productId: productSelect.value,
        productName: productSelect.options[productSelect.selectedIndex].text,
        customName: customName.value.trim(),
        customMessage: customMessage.value.trim(),
        font: fontSelect.value,
        color: selectedColor ? selectedColor.value : '#E91E63',
        hasCustomImage: imageUpload.files.length > 0
    };
    
    // Calculate price (base price + customization fee)
    const basePrice = getBasePrice(productSelect.value);
    const customizationFee = 15.00;
    const totalPrice = basePrice + customizationFee;
    
    // Add to cart (you'll need to integrate with your existing cart system)
    console.log('Adding to cart:', customization);
    console.log('Total price:', totalPrice);
    
    // Show success message
    alert('Produto personalizado adicionado ao carrinho!');
    
    // Redirect to cart page
    window.location.href = 'carrinho.html';
}

// Get base price for product
function getBasePrice(productId) {
    const prices = {
        'caderno': 35.00,
        'agenda': 45.00,
        'terco': 25.00,
        'bloco': 20.00,
        'calendario': 30.00
    };
    return prices[productId] || 35.00;
}
