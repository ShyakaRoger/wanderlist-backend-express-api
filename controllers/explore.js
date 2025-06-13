const express = require('express');
const router = express.Router();
const Explore = require('../models/Explore');

// Get all explore items
router.get('/', async (req, res) => {
  try {
    const exploreItems = await Explore.find();
    res.json(exploreItems);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get one explore item by ID
router.get('/:id', async (req, res) => {
  try {
    const exploreItem = await Explore.findById(req.params.id);
    if (!exploreItem) return res.status(404).json({ err: 'Item not found' });
    res.json(exploreItem);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Create a new explore item
router.post('/', async (req, res) => {
  try {
    const newExplore = await Explore.create(req.body);
    res.status(201).json(newExplore);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Update explore item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedExplore = await Explore.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExplore) return res.status(404).json({ err: 'Item not found' });
    res.json(updatedExplore);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Delete explore item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExplore = await Explore.findByIdAndDelete(req.params.id);
    if (!deletedExplore) return res.status(404).json({ err: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
