const express = require('express');
const router = express.Router();
const Destination = require('../models/destination');
const verifyToken = require('../middlewares/authMiddleware');

// Public: Get all destinations (public and private)
router.get('/public', async (req, res) => {
  try {
    // Fetch all destinations, regardless of whether they are public or private
    const destinations = await Destination.find();  // Query the database to get all destinations
    res.json(destinations);  // Return the destinations to all users (logged in or not)
  } catch (err) {
    // If an error occurs during database fetching
    res.status(500).json({ err: err.message });  // Return error response
  }
});

// Protected: Get all destinations for the logged-in user
router.get('/', verifyToken, async (req, res) => {
  try {
    // Verify that the user is logged in using the verifyToken middleware
    const destinations = await Destination.find({ user: req.user.id });  // Fetch destinations for the logged-in user
    res.json(destinations);  // Return destinations that belong to the authenticated user
  } catch (err) {
    // If an error occurs during database fetching
    res.status(500).json({ err: err.message });  // Return error response
  }
});

// Protected: Get a single destination by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    // Fetch a destination by its unique ID from the database
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      // If no destination is found with the given ID
      return res.status(404).json({ err: 'Not found' });  // Return a 404 response
    }

    // Check if the destination belongs to the logged-in user
    if (destination.user.toString() !== req.user.id) {
      // If the user is not authorized to access this destination
      return res.status(403).json({ err: 'Access denied' });  // Return a 403 Forbidden response
    }

    res.json(destination);  // Return the destination data to the user
  } catch (err) {
    // If an error occurs during database fetching
    res.status(500).json({ err: err.message });  // Return error response
  }
});

// Protected: Create a new destination
router.post('/', verifyToken, async (req, res) => {
  try {
    // Create a new destination document using the data from the request body
    const newDestination = new Destination({
      ...req.body,  // Spread the incoming data (name, location, etc.)
      user: req.user.id  // Set the user ID from the authenticated user
    });

    await newDestination.save();  // Save the new destination to the database
    res.status(201).json(newDestination);  // Return the newly created destination
  } catch (err) {
    // If an error occurs during saving
    res.status(500).json({ err: err.message });  // Return error response
  }
});

// Protected: Update a destination
router.put('/:id', verifyToken, async (req, res) => {
  try {
    // Fetch the destination by its ID
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      // If no destination is found with the given ID
      return res.status(404).json({ err: 'Not found' });  // Return a 404 response
    }

    // Check if the destination belongs to the logged-in user
    if (destination.user.toString() !== req.user.id) {
      // If the user is not authorized to update this destination
      return res.status(403).json({ err: 'Access denied' });  // Return a 403 Forbidden response
    }

    // Update the destination with the new data from the request body
    const updated = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json(updated);  // Return the updated destination data
  } catch (err) {
    // If an error occurs during the update
    res.status(500).json({ err: err.message });  // Return error response
  }
});

// Protected: Delete a destination
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Fetch the destination by its ID
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      // If no destination is found with the given ID
      return res.status(404).json({ err: 'Destination not found' });  // Return a 404 response
    }

    // Check if the destination belongs to the logged-in user
    if (destination.user.toString() !== req.user.id) {
      // If the user is not authorized to delete this destination
      return res.status(403).json({ err: 'Unauthorized to delete this destination' });  // Return a 403 Forbidden response
    }

    await Destination.findByIdAndDelete(req.params.id);  // Delete the destination from the database
    res.json({ message: 'Deleted successfully' });  // Return a success message
  } catch (err) {
    // If an error occurs during the delete operation
    console.error('DELETE ERROR:', err.message);
    res.status(500).json({ err: 'Server error during delete' });  // Return error response
  }
});

module.exports = router;  // Export the routes to be used in the main app.js
