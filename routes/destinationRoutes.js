const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const verifyToken = require('../middlewares/authMiddleware');

// Public: Get all public destinations
router.get('/public', async (req, res) => {
  try {
    const destinations = await Destination.find({ public: true });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Get all destinations for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    const destinations = await Destination.find({ user: req.user.id });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Get a single destination by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ err: 'Not found' });
    }

    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Access denied' });
    }

    res.json(destination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Create a new destination
router.post('/', verifyToken, async (req, res) => {
  try {
    const newDestination = new Destination({
      ...req.body,
      user: req.user.id
    });

    await newDestination.save();
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Update a destination
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ err: 'Not found' });
    }

    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Access denied' });
    }

    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Delete a destination
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({ err: 'Destination not found' });
    }

    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Unauthorized to delete this destination' });
    }

    await Destination.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ err: 'Server error during delete' });
  }
});

module.exports = router;
