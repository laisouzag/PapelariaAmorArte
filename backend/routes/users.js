const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const { auth } = require('../middleware/auth');
const { adminAuth } = require('../middleware/auth');

// Update user profile
router.put('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, cpf, address } = req.body;

        const [result] = await pool.query(
            'UPDATE users SET name = ?, phone = ?, cpf = ?, address = ? WHERE id = ?',
            [name, phone, cpf, address, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [users] = await pool.query(
            'SELECT id, name, email, phone, cpf, address, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(users[0]);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all customers (admin only)
router.get('/all', adminAuth, async (req, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, name, email, phone, cpf, created_at FROM users ORDER BY created_at DESC'
        );

        res.json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete customer (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        const [result] = await pool.query(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
