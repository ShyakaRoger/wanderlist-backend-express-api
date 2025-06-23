const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ err: 'Username or email already taken.' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    const payload = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Login route (using email)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = {
      id: user._id,
      username: user.username,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Verify route
router.get('/verify', authMiddleware, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
