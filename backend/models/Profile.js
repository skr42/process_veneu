const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true
  },
  education: [{
    institution: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: String,
    startDate: Date,
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    }
  }],
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  location: String,
  phone: String,
  website: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
