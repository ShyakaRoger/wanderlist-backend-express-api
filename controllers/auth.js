const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const saltRounds = 10; // Number of salt rounds for password hashing

// User Registration Endpoint
// PATH: /register
// METHOD: POST
// Creates a new user account with hashed password
router.post('/register', async (req, res) => {
  try {
    //Check if username already exists in database
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) return res.status(409).json({ err: 'Username taken' });

    //Hash the plaintext password for secure storage
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    // Create new user document in database
    const newUser = await User.create({
      username: req.body.username,
      hashedPassword,
    });

    //Generate JWT token for authenticated sessions
    const token = jwt.sign(
      { username: newUser.username, _id: newUser._id }, // Payload
      process.env.JWT_SECRET // Secret key
    );

    // Return success response with auth token
    res.status(201).json({ token });
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).json({ err: err.message });
  }
});

// User Login Endpoint
// PATH: /login
// METHOD: POST
// DESCRIPTION: Authenticates user and returns JWT token
router.post('/login', async (req, res) => {
  try {
    // Finding user by username in database
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ err: 'Invalid credentials' });

    // Compare provided password with stored hash
    const isValid = bcrypt.compareSync(req.body.password, user.hashedPassword);
    if (!isValid) return res.status(401).json({ err: 'Invalid credentials' });

    // Generate JWT token for authenticated sessions
    const token = jwt.sign(
      { username: user.username, _id: user._id }, // Payload
      process.env.JWT_SECRET // Secret key
    );

    // Return success response with auth token
    res.status(200).json({ token });
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;