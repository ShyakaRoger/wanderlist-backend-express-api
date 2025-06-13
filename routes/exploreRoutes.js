const express = require('express');
const router = express.Router();
const Explore = require('../models/explore');

// Get all explore items
router.get('/', async (req, res) => {
  try {
    const explores = await Explore.find();
    res.status(200).json(explores);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Get a single explore item by ID
router.get('/:id', async (req, res) => {
  try {
    const explore = await Explore.findById(req.params.id);
    if (!explore) return res.status(404).json({ err: 'Explore item not found' });
    res.status(200).json(explore);
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
    res.status(500).json({ err: err.message });
  }
});

// Update an explore item by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedExplore = await Explore.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedExplore) return res.status(404).json({ err: 'Explore item not found' });
    res.status(200).json(updatedExplore);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Delete an explore item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedExplore = await Explore.findByIdAndDelete(req.params.id);
    if (!deletedExplore) return res.status(404).json({ err: 'Explore item not found' });
    res.status(200).json({ msg: 'Explore item deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
