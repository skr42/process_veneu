const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

// Add skill
router.post('/', auth, async (req, res) => {
  try {
    const { name, proficiency, category, yearsOfExperience } = req.body;

    const skill = new Skill({
      user: req.user._id,
      name,
      proficiency,
      category,
      yearsOfExperience
    });

    await skill.save();

    res.status(201).json({
      message: 'Skill added successfully',
      skill
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Skill already exists' });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all skills
router.get('/', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id }).sort({ proficiency: -1, name: 1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get top skills (highest proficiency)
router.get('/top', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const skills = await Skill.find({ user: req.user._id })
      .sort({ proficiency: -1, yearsOfExperience: -1 })
      .limit(limit);
    
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update skill
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, proficiency, category, yearsOfExperience } = req.body;

    const skill = await Skill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, proficiency, category, yearsOfExperience },
      { new: true, runValidators: true }
    );

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({
      message: 'Skill updated successfully',
      skill
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
