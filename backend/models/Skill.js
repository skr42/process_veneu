const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [1, 'Proficiency must be at least 1'],
    max: [10, 'Proficiency cannot exceed 10']
  },
  category: {
    type: String,
    enum: ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Other'],
    default: 'Other'
  },
  yearsOfExperience: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

skillSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Skill', skillSchema);
