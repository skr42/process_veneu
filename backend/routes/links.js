const express = require('express');
const Link = require('../models/Link');
const auth = require('../middleware/auth');

const router = express.Router();

// Add/Create links
router.post('/', auth, async (req, res) => {
  try {
    const { github, linkedin, portfolio, twitter, website, other } = req.body;

    // Check if links already exist
    const existingLinks = await Link.findOne({ user: req.user._id });
    if (existingLinks) {
      return res.status(400).json({ message: 'Links already exist. Use PUT to update.' });
    }

    const links = new Link({
      user: req.user._id,
      github,
      linkedin,
      portfolio,
      twitter,
      website,
      other
    });

    await links.save();

    res.status(201).json({
      message: 'Links added successfully',
      links
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get links
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.findOne({ user: req.user._id });
    
    if (!links) {
      return res.status(404).json({ message: 'Links not found' });
    }

    res.json({ links });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update links
router.put('/:id', auth, async (req, res) => {
  try {
    const { github, linkedin, portfolio, twitter, website, other } = req.body;

    const links = await Link.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { github, linkedin, portfolio, twitter, website, other },
      { new: true, runValidators: true }
    );

    if (!links) {
      return res.status(404).json({ message: 'Links not found' });
    }

    res.json({
      message: 'Links updated successfully',
      links
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete links
router.delete('/:id', auth, async (req, res) => {
  try {
    const links = await Link.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!links) {
      return res.status(404).json({ message: 'Links not found' });
    }

    res.json({ message: 'Links deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
