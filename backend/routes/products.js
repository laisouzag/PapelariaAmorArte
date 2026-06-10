const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth, adminAuth } = require('../middleware/auth');

// Get all products
router.get('/', async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.*, c.name as category_name, 
             pi.image_url
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
             WHERE p.active = TRUE 
             ORDER BY p.created_at DESC`
        );
        
        // Format products to ensure image field is properly set
        const formattedProducts = products.map(product => ({
            ...product,
            image: product.image_url || 'img/logo.png'
        }));
        
        res.json(formattedProducts);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.*, c.name as category_name, 
             pi.image_url
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
             WHERE p.id = ?`,
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = products[0];
        product.image = product.image_url || 'img/logo.png';
        
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get products by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        const [products] = await pool.query(
            `SELECT p.*, c.name as category_name, 
             pi.image_url
             FROM products p 
             LEFT JOIN categories c ON p.category_id = c.id 
             LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
             WHERE p.category_id = ? AND p.active = TRUE`,
            [req.params.categoryId]
        );
        
        // Format products to ensure image field is properly set
        const formattedProducts = products.map(product => ({
            ...product,
            image: product.image_url || 'img/logo.png'
        }));
        
        res.json(formattedProducts);
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create product (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description, price, image, category_id, stock } = req.body;

        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Insert product
            const [result] = await connection.query(
                'INSERT INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)',
                [name, description || null, price, category_id || null, stock || 0]
            );

            // Insert image if provided
            if (image) {
                await connection.query(
                    'INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES (?, ?, ?, TRUE, 0)',
                    [result.insertId, image, name]
                );
            }

            await connection.commit();
            res.status(201).json({
                message: 'Product created successfully',
                id: result.insertId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { name, description, price, image, category_id, stock, active } = req.body;

        console.log('Update product request:', { id: req.params.id, name, price, category_id, image });

        if (!name || !price) {
            return res.status(400).json({ error: 'Name and price are required' });
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Update product
            const [result] = await connection.query(
                'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ?, active = ? WHERE id = ?',
                [name, description || null, price, category_id || null, stock || 0, active !== undefined ? active : true, req.params.id]
            );

            console.log('Product update result:', result);

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({ error: 'Product not found' });
            }

            // Update or insert image if provided
            if (image) {
                // Check if image exists
                const [existingImages] = await connection.query(
                    'SELECT id FROM product_images WHERE product_id = ? AND is_primary = TRUE',
                    [req.params.id]
                );

                if (existingImages.length > 0) {
                    // Update existing image
                    await connection.query(
                        'UPDATE product_images SET image_url = ?, alt_text = ? WHERE product_id = ? AND is_primary = TRUE',
                        [image, name, req.params.id]
                    );
                } else {
                    // Insert new image
                    await connection.query(
                        'INSERT INTO product_images (product_id, image_url, alt_text, is_primary, display_order) VALUES (?, ?, ?, TRUE, 0)',
                        [req.params.id, image, name]
                    );
                }
            }

            await connection.commit();
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

// Delete product (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const [result] = await pool.query(
            'UPDATE products SET active = FALSE WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
