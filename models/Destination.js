const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: {
    type: String,
    required: [true, 'Destination name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  public: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['Planned', 'Visited'],
    default: 'Planned'
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

DestinationSchema.index({
  name: 'text',
  location: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Destination', DestinationSchema);
