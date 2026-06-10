const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function checkTableStructure() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Check products table structure
        const [productsColumns] = await connection.query('DESCRIBE products');
        console.log('\n=== PRODUCTS TABLE STRUCTURE ===');
        productsColumns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type})`);
        });
        
        // Check product_images table structure
        const [imagesColumns] = await connection.query('DESCRIBE product_images');
        console.log('\n=== PRODUCT_IMAGES TABLE STRUCTURE ===');
        imagesColumns.forEach(col => {
            console.log(`- ${col.Field} (${col.Type})`);
        });
        
        // Test the actual query used by the API
        console.log('\n=== TESTING API QUERY ===');
        const [products] = await connection.query(
            `SELECT p.*, c.name as category_name, 
             COALESCE(pi.image_url, p.image) as image_url
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
             WHERE p.active = TRUE 
             ORDER BY p.created_at DESC
             LIMIT 1`
        );
        
        console.log('Query result:', JSON.stringify(products[0], null, 2));
        
        await connection.end();
    } catch (error) {
        console.error('Error checking table structure:', error.message);
        process.exit(1);
    }
}

checkTableStructure();
