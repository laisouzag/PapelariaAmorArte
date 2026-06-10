const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkImagePaths() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Check image paths in product_images table
        const [images] = await connection.query('SELECT id, product_id, image_url FROM product_images');
        
        console.log('\n=== IMAGE PATHS IN DATABASE ===');
        images.forEach(img => {
            console.log(`ID: ${img.id}, Product ID: ${img.product_id}, Image: ${img.image_url}`);
        });
        
        // Check if products table has image field
        const [products] = await connection.query('SELECT id, name, image FROM products LIMIT 5');
        
        console.log('\n=== PRODUCTS TABLE IMAGE FIELD ===');
        products.forEach(prod => {
            console.log(`ID: ${prod.id}, Name: ${prod.name}, Image: ${prod.image}`);
        });
        
        await connection.end();
    } catch (error) {
        console.error('Error checking image paths:', error.message);
        process.exit(1);
    }
}

checkImagePaths();
