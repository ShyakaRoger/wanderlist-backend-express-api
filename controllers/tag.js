const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

// Getting all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Getting a tag by ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ err: 'Tag not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// Creating new tag
router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Updating tag by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedTag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTag) return res.status(404).json({ err: 'Tag not found' });
    res.json(updatedTag);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// Deleting tag by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.findByIdAndDelete(req.params.id);
    if (!deletedTag) return res.status(404).json({ err: 'Tag not found' });
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
