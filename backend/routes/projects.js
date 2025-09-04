const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

const router = express.Router();

// Add project
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, skills, links, status, startDate, endDate, featured } = req.body;

    const project = new Project({
      user: req.user._id,
      title,
      description,
      skills,
      links,
      status,
      startDate,
      endDate,
      featured
    });

    await project.save();

    res.status(201).json({
      message: 'Project added successfully',
      project
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all projects with optional skill filter
router.get('/', auth, async (req, res) => {
  try {
    let query = { user: req.user._id };
    
    // Filter by skill if provided
    if (req.query.skill) {
      query.skills = { $in: [new RegExp(req.query.skill, 'i')] };
    }

    const projects = await Project.find(query).sort({ featured: -1, createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get project by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.user._id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, skills, links, status, startDate, endDate, featured } = req.body;

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { title, description, skills, links, status, startDate, endDate, featured },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
