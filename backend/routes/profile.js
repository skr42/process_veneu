const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

const router = express.Router();

// Create profile
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, education, bio, location, phone, website } = req.body;

    // Check if profile already exists
    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: 'Profile already exists. Use PUT to update.' });
    }

    const profile = new Profile({
      user: req.user._id,
      name,
      email,
      education,
      bio,
      location,
      phone,
      website
    });

    await profile.save();
    await profile.populate('user', 'name email');

    res.status(201).json({
      message: 'Profile created successfully',
      profile
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate('user', 'name email');
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { name, email, education, bio, location, phone, website } = req.body;

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { name, email, education, bio, location, phone, website },
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete profile
router.delete('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.user._id });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
