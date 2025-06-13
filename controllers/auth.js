const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const saltRounds = 10;

router.post('/register', async (req, res) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) return res.status(409).json({ err: 'Username taken' });

    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);

    const newUser = await User.create({
      username: req.body.username,
      hashedPassword,
    });

    const token = jwt.sign(
      { username: newUser.username, _id: newUser._id },
      process.env.JWT_SECRET
    );

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json({ err: 'Invalid credentials' });

    const isValid = bcrypt.compareSync(req.body.password, user.hashedPassword);
    if (!isValid) return res.status(401).json({ err: 'Invalid credentials' });

    const token = jwt.sign(
      { username: user.username, _id: user._id },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
