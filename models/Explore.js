const mongoose = require('mongoose');

const exploreSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } 
});

module.exports = mongoose.model('Explore', exploreSchema);
