const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
const verifyToken = require('../middlewares/authMiddleware');

// Public: Get all destinations 
router.get('/public', async (req, res) => {
  try {
    const destinations = await Destination.find({ public: true });
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Get all destinations (all for this project)
router.get('/', verifyToken, async (req, res) => {
  try {
    const destinations = await Destination.find();
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
    res.json(destination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Create destination
router.post('/', verifyToken, async (req, res) => {
  try {
    const data = { ...req.body, user: req.user.id };
    const newDestination = await Destination.create(data);
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Update destination
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ err: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Protected: Delete destination
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
