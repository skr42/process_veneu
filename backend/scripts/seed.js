const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Work = require('../models/Work');
const Link = require('../models/Link');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Profile.deleteMany({}),
      Skill.deleteMany({}),
      Project.deleteMany({}),
      Work.deleteMany({}),
      Link.deleteMany({})
    ]);

    console.log('Cleared existing data');

    // Create sample user
    const user = new User({
      name: 'Sujeet Kumar',
      email: 'sujeetkrgupta9122@gmail.com',
      password: 'sujeet87097'
    });

    await user.save();
    console.log('Created sample user');

    // Create profile
    const profile = new Profile({
      user: user._id,
      name: 'Sujeet Kumar',
      email: 'sujeetkrgupta9122@gmail.com',
      bio: 'Full-stack developer with 1+ years of experience in web development. Passionate about creating scalable applications and learning new technologies.',
      location: 'Lucknow',
      phone: '8709711810',
      website: 'https://portfolio-sigma-pink-54.vercel.app/',
      education: [
        {
          institution: 'IIIT Kottayam',
          degree: 'Bachelor of Technology',
          field: 'Computer Science',
          startDate: new Date('2022-09-01'),
          endDate: new Date('2026-06-01'),
          current: false
        }
      ]
    });

    await profile.save();
    console.log('Created sample profile');

    // Create skills
    const skills = [
      { user: user._id, name: 'JavaScript', proficiency: 9, category: 'Programming', yearsOfExperience: 2 },
      { user: user._id, name: 'React', proficiency: 8, category: 'Framework', yearsOfExperience: 2 },
      { user: user._id, name: 'Node.js', proficiency: 8, category: 'Framework', yearsOfExperience: 2 },
      { user: user._id, name: 'MongoDB', proficiency: 7, category: 'Database', yearsOfExperience: 3 },
      { user: user._id, name: 'Python', proficiency: 7, category: 'Programming', yearsOfExperience: 3 },
      { user: user._id, name: 'Express.js', proficiency: 8, category: 'Framework', yearsOfExperience: 2 },
      { user: user._id, name: 'c++', proficiency: 9, category: 'Programming', yearsOfExperience: 2 },
      { user: user._id, name: 'Docker', proficiency: 9, category: 'Tool', yearsOfExperience: 2 },
      { user: user._id, name: 'Kubernetes', proficiency: 7, category: 'Tool', yearsOfExperience: 2 },
      { user: user._id, name: 'AWS', proficiency: 9, category: 'Tool', yearsOfExperience: 2 },
      { user: user._id, name: 'FastAPI', proficiency: 9, category: 'Framework', yearsOfExperience: 2 },
      { user: user._id, name: 'PostgreSQL', proficiency: 9, category: 'Database', yearsOfExperience: 2 },
      { user: user._id, name: 'SQL', proficiency: 9, category: 'Database', yearsOfExperience: 2 },
      { user: user._id, name: 'Competitive Programming', proficiency: 7, category: 'Programming', yearsOfExperience: 2 },
      { user: user._id, name: 'AI/ML', proficiency: 9, category: 'Framework', yearsOfExperience: 2 }

    ];

    await Skill.insertMany(skills);
    console.log('Created sample skills');

    // Create projects
    const projects = [
      {
        user: user._id,
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce platform built with React, Node.js, and MongoDB. Features include user authentication, product catalog, shopping cart, and payment integration.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js'],
        links: [
          { type: 'github', url: 'https://github.com/skr42/BookStore_application', label: 'Source Code' },
          { type: 'demo', url: 'https://book-store-application-one.vercel.app/', label: 'Live Demo' }
        ],
        status: 'completed',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-01'),
        featured: true
      },
      {
        user: user._id,
        title: ' WhatsApp Guest Request Logging Workflow',
        description: 'Developed a WhatsApp Guest Request Logging Workflow using WhatsApp Sandbox API and n8n, automating guest requests from WhatsApp and storing them in a NestJS + PostgreSQL backend, reducing manual data entry by 70%.',
        skills: ['Next.js', 'Nest.js', 'Socket.io', 'PostgreSQL','n8n.io','whatsapp API sandbox'],
        links: [
          { type: 'github', url: 'https://github.com/skr42/WhatsApp-Guest-Request-Logging-Workflow', label: 'Repository' }
        ],
        status: 'in-progress',
        startDate: new Date('2025-07-01'),
        featured: false
      }
    ];

    await Project.insertMany(projects);
    console.log('Created sample projects');

    // Create work experiences
    const workExperiences = [
      {
        user: user._id,
        company: 'NTS Nihon Global',
        position: 'SDE Intern',
        description: 'Led development of multiple web applications using React and Node.js. Mentored junior developers and implemented best practices for code quality and testing.',
        startDate: new Date('2025-03-01'),
        current: true,
        location: 'remote',
        employmentType: 'full-time',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'AWS']
      },
      {
        user: user._id,
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        description: 'Developed and maintained web applications for a fast-growing startup. Worked closely with product team to implement new features and optimize performance.',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-02-28'),
        current: false,
        location: 'Lucknow',
        employmentType: 'full-time',
        skills: ['JavaScript', 'React', 'Python', 'PostgreSQL']
      }
    ];

    await Work.insertMany(workExperiences);
    console.log('Created sample work experiences');

    // Create links
    const links = new Link({
      user: user._id,
      github: 'https://github.com/skr42',
      linkedin: 'https://www.linkedin.com/in/sujeet-kumar-861253312',
      portfolio: 'https://portfolio-sigma-pink-54.vercel.app/',
      twitter: 'https://twitter.com/sujeetkrgupta9122',
      website: 'https://leetcode.com/u/skr42/',
      other: [
        { label: 'Medium Blog', url: 'https://medium.com/@sujeet' },
        { label: 'Dev.to', url: 'https://dev.to/sujeet' }
      ]
    });

    await links.save();
    console.log('Created sample links');

    console.log('✅ Database seeded successfully!');
    console.log('\nSample user credentials:');
    console.log('Email:sujeetkrgupta9122@gmail.com ');
    console.log('Password: sujeet87097');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedData();
