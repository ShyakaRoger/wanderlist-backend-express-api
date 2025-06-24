const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');

// Get all destinations
router.get('/', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Gettin one destination by ID
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ err: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Creating a new destination
router.post('/', async (req, res) => {
  try {
    const newDestination = await Destination.create(req.body);
    res.status(201).json(newDestination);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Updating destination by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDestination) return res.status(404).json({ err: 'Destination not found' });
    res.json(updatedDestination);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Deletinf a destination by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedDestination = await Destination.findByIdAndDelete(req.params.id);
    if (!deletedDestination) return res.status(404).json({ err: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
