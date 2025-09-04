const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  github: {
    type: String,
    match: [/^https?:\/\/(www\.)?github\.com\/.+/, 'Please enter a valid GitHub URL']
  },
  linkedin: {
    type: String,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Please enter a valid LinkedIn URL']
  },
  portfolio: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid portfolio URL']
  },
  twitter: {
    type: String,
    match: [/^https?:\/\/(www\.)?twitter\.com\/.+/, 'Please enter a valid Twitter URL']
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
  },
  other: [{
    label: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      match: [/^https?:\/\/.+/, 'Please enter a valid URL']
    }
  }]
}, {
  timestamps: true
});


linkSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Link', linkSchema);
