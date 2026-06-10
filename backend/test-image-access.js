const http = require('http');

async function testImageAccess() {
    const imageUrl = 'http://localhost:3000/img/Agenda2026Personalizada.png';
    
    console.log('Testing image access:', imageUrl);
    
    http.get(imageUrl, (res) => {
        console.log('Status:', res.statusCode);
        console.log('Headers:', res.headers);
        
        if (res.statusCode === 200) {
            console.log('✓ Image is accessible via server');
        } else {
            console.log('✗ Image is NOT accessible via server');
        }
    }).on('error', (err) => {
        console.error('Error accessing image:', err.message);
    });
}

testImageAccess();
