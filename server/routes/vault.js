const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const VaultItem = require('../models/VaultItem');

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Add vault item
router.post('/', verifyToken, async (req, res) => {
  const { site, username, passwordEncrypted } = req.body;

  try {
    const newItem = new VaultItem({
      site,
      username,
      passwordEncrypted,
      userId: req.userId
    });

    await newItem.save();
    res.json({ message: 'Credential saved' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to save item' });
  }
});

// Get all vault items for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await VaultItem.find({ userId: req.userId });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch vault items' });
  }
});

module.exports = router;
