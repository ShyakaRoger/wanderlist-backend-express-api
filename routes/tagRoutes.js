const express = require('express');
const router = express.Router();
const Tag = require('../models/tag');
const verifyToken = require('../middlewares/authMiddleware'); 

// GET all tags (public route)
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// GET tag by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ err: 'Not found' });
    res.json(tag);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// CREATE tag (protected route)
router.post('/', verifyToken, async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// UPDATE tag (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const updated = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ err: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// DELETE tag (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ err: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
