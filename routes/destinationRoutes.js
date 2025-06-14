const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
const verifyToken = require('../middlewares/AuthMiddleware');

// Get all destinations (protected)
router.get('/', verifyToken, async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get destination by ID (protected)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ err: 'Not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create destination (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newDestination = await Destination.create(req.body);
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Update destination (protected)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ err: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete destination (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Destination.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ err: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
