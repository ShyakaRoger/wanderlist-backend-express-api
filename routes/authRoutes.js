const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(409).json({ err: 'Username or email already taken.' });
    }

    // Create new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Create JWT token
    const payload = { id: newUser._id, username: newUser.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(201).json({ token });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Create JWT token
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    res.status(200).json({ token });

  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
