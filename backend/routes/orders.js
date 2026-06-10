const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');

// Create order
router.post('/', auth, async (req, res) => {
    try {
        const { items, total, shipping, payment_method, whatsapp_message } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain at least one item' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Create order
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total, shipping, payment_method, whatsapp_message) VALUES (?, ?, ?, ?, ?)',
                [userId, total, shipping || 0, payment_method || null, whatsapp_message || null]
            );

            const orderId = orderResult.insertId;

            // Add order items
            for (const item of items) {
                await connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.price]
                );
            }

            await connection.commit();

            res.status(201).json({
                message: 'Order created successfully',
                orderId
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [orders] = await pool.query(
            'SELECT o.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT(' +
            '"id", oi.id, "product_id", oi.product_id, "quantity", oi.quantity, "unit_price", oi.unit_price, ' +
            '"product_name", p.name, "product_image", p.image' +
            ')) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items ' +
            'FROM orders o WHERE o.user_id = ? ORDER BY o.created_at DESC',
            [userId]
        );

        res.json(orders);
    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [orders] = await pool.query(
            'SELECT o.*, (SELECT JSON_ARRAYAGG(JSON_OBJECT(' +
            '"id", oi.id, "product_id", oi.product_id, "quantity", oi.quantity, "unit_price", oi.unit_price, ' +
            '"product_name", p.name, "product_image", p.image' +
            ')) FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = o.id) as items ' +
            'FROM orders o WHERE o.id = ? AND o.user_id = ?',
            [req.params.id, userId]
        );

        if (orders.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(orders[0]);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
