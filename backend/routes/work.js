const express = require('express');
const Work = require('../models/Work');
const auth = require('../middleware/auth');

const router = express.Router();

// Add work experience
router.post('/', auth, async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, current, location, employmentType, skills } = req.body;

    const work = new Work({
      user: req.user._id,
      company,
      position,
      description,
      startDate,
      endDate,
      current,
      location,
      employmentType,
      skills
    });

    await work.save();

    res.status(201).json({
      message: 'Work experience added successfully',
      work
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all work experiences
router.get('/', auth, async (req, res) => {
  try {
    const workExperiences = await Work.find({ user: req.user._id }).sort({ startDate: -1 });
    res.json({ workExperiences });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update work experience
router.put('/:id', auth, async (req, res) => {
  try {
    const { company, position, description, startDate, endDate, current, location, employmentType, skills } = req.body;

    const work = await Work.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { company, position, description, startDate, endDate, current, location, employmentType, skills },
      { new: true, runValidators: true }
    );

    if (!work) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    res.json({
      message: 'Work experience updated successfully',
      work
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete work experience
router.delete('/:id', auth, async (req, res) => {
  try {
    const work = await Work.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!work) {
      return res.status(404).json({ message: 'Work experience not found' });
    }

    res.json({ message: 'Work experience deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
