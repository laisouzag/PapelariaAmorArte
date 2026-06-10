const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

async function removeProducts() {
    try {
        console.log('Connecting to MySQL...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'papelaria_amor_arte_completo'
        });

        console.log('Connected to MySQL database');
        
        // Find products to remove
        const productsToRemove = [
            'Caneta Esferográfica Premium',
            'Lápis de Madeira Premium',
            'Bíblia Pequena de Bolso',
            'Santinho de Proteção'
        ];
        
        console.log('\n=== PRODUCTS TO REMOVE ===');
        for (const productName of productsToRemove) {
            const [products] = await connection.query(
                'SELECT id, name, active FROM products WHERE name = ?',
                [productName]
            );
            
            if (products.length > 0) {
                const product = products[0];
                console.log(`Found: ${product.name} (ID: ${product.id}, Active: ${product.active})`);
                
                // Mark as inactive instead of deleting
                await connection.query(
                    'UPDATE products SET active = FALSE WHERE id = ?',
                    [product.id]
                );
                console.log(`✓ Marked as inactive: ${product.name}`);
            } else {
                console.log(`✗ Not found: ${productName}`);
            }
        }
        
        // Verify remaining active products
        const [activeProducts] = await connection.query(
            'SELECT id, name FROM products WHERE active = TRUE ORDER BY id'
        );
        
        console.log('\n=== REMAINING ACTIVE PRODUCTS ===');
        activeProducts.forEach(prod => {
            console.log(`- ${prod.name} (ID: ${prod.id})`);
        });
        
        await connection.end();
    } catch (error) {
        console.error('Error removing products:', error.message);
        process.exit(1);
    }
}

removeProducts();
