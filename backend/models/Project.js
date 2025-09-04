const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  links: [{
    type: {
      type: String,
      enum: ['github', 'demo', 'documentation', 'other'],
      default: 'other'
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    },
    label: String
  }],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  startDate: Date,
  endDate: Date,
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
