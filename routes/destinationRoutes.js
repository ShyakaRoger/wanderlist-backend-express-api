const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
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

// Protected: Get all destinations 
router.get('/', verifyToken, async (req, res) => {
  try {
    const destinations = await Destination.find({ user: req.user.id });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Get destination by ID 
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) return res.status(404).json({ err: 'Not found' });
    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Access denied' });
    }

    res.json(destination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create destination 
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

// Update destination 
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ err: 'Not found' });

    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Access denied' });
    }

    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete destination 
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ err: 'Not found' });

    if (destination.user.toString() !== req.user.id) {
      return res.status(403).json({ err: 'Access denied' });
    }

    await destination.remove();
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
