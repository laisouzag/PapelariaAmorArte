const http = require('http');

async function testApiProducts() {
    const apiUrl = 'http://localhost:3000/api/products';
    
    console.log('Testing API products endpoint:', apiUrl);
    
    http.get(apiUrl, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Status:', res.statusCode);
            if (res.statusCode === 200) {
                try {
                    const products = JSON.parse(data);
                    console.log('Products count:', products.length);
                    console.log('First product:', JSON.stringify(products[0], null, 2));
                } catch (e) {
                    console.error('Error parsing JSON:', e.message);
                    console.log('Raw response:', data.substring(0, 500));
                }
            } else {
                console.log('Error response:', data);
            }
        });
    }).on('error', (err) => {
        console.error('Error calling API:', err.message);
    });
}

testApiProducts();
