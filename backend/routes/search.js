const express = require('express');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Work = require('../models/Work');
const auth = require('../middleware/auth');

const router = express.Router();

// Search across all user data
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    const userId = req.user._id;

    // Search in parallel for better performance
    const [profileResults, skillResults, projectResults, workResults] = await Promise.all([
      // Search profiles
      Profile.find({
        user: userId,
        $or: [
          { name: searchRegex },
          { bio: searchRegex },
          { location: searchRegex },
          { 'education.institution': searchRegex },
          { 'education.degree': searchRegex },
          { 'education.field': searchRegex }
        ]
      }).populate('user', 'name email'),

      // Search skills
      Skill.find({
        user: userId,
        $or: [
          { name: searchRegex },
          { category: searchRegex }
        ]
      }),

      // Search projects
      Project.find({
        user: userId,
        $or: [
          { title: searchRegex },
          { description: searchRegex },
          { skills: { $in: [searchRegex] } },
          { status: searchRegex }
        ]
      }),

      // Search work experiences
      Work.find({
        user: userId,
        $or: [
          { company: searchRegex },
          { position: searchRegex },
          { description: searchRegex },
          { location: searchRegex },
          { employmentType: searchRegex },
          { skills: { $in: [searchRegex] } }
        ]
      })
    ]);

    const results = {
      profiles: profileResults,
      skills: skillResults,
      projects: projectResults,
      workExperiences: workResults,
      totalResults: profileResults.length + skillResults.length + projectResults.length + workResults.length
    };

    res.json({
      query: q,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
