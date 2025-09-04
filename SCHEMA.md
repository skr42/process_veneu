# Database Schema Documentation

This document outlines the MongoDB schemas and indexes used in the Portfolio Management System.

## Table of Contents
- [User Schema](#user-schema)
- [Profile Schema](#profile-schema)
- [Skill Schema](#skill-schema)
- [Project Schema](#project-schema)
- [Work Experience Schema](#work-experience-schema)
- [Link Schema](#link-schema)
- [Indexing Strategy](#indexing-strategy)

## User Schema

```javascript
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Never return password in queries
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ email: 1 }` - Unique index for fast email lookups
- `{ createdAt: -1 }` - For sorting users by creation date

## Profile Schema

```javascript
const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters'],
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-()]+$/, 'Please enter a valid phone number']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, 'Please enter a valid URL with http:// or https://']
  },
  education: [{
    institution: {
      type: String,
      required: [true, 'Institution name is required'],
      trim: true
    },
    degree: {
      type: String,
      required: [true, 'Degree is required'],
      trim: true
    },
    field: {
      type: String,
      required: [true, 'Field of study is required'],
      trim: true
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: Date,
    current: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
      trim: true
    }
  }],
  social: {
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    github: {
      type: String,
      trim: true
    },
    portfolio: {
      type: String,
      trim: true
    }
  },
  skills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ user: 1 }` - Unique index for fast user lookups
- `{ 'education.institution': 'text', 'education.degree': 'text', 'education.field': 'text' }` - Text index for education search
- `{ location: 1 }` - For location-based queries

## Skill Schema

```javascript
const skillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [1, 'Proficiency must be at least 1'],
    max: [10, 'Proficiency cannot be more than 10']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Other'],
      message: 'Invalid category'
    }
  },
  yearsOfExperience: {
    type: Number,
    min: [0, 'Years of experience cannot be negative'],
    max: [100, 'Please enter a valid number of years']
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastUsed: Date,
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ user: 1, name: 1 }` - Compound index for user's skills
- `{ category: 1 }` - For filtering by category
- `{ proficiency: -1 }` - For sorting by proficiency
- `{ name: 'text', tags: 'text' }` - Text index for skill search
- `{ lastUsed: -1 }` - For sorting by most recently used

## Project Schema

```javascript
const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Project description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  skills: [{
    type: String,
    trim: true
  }],
  links: [{
    type: {
      type: String,
      enum: ['github', 'demo', 'documentation', 'other'],
      required: [true, 'Link type is required']
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true
    },
    label: {
      type: String,
      trim: true,
      maxlength: [50, 'Label cannot be more than 50 characters']
    }
  }],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning'
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: Date,
  featured: {
    type: Boolean,
    default: false
  },
  teamSize: {
    type: Number,
    min: [1, 'Team size must be at least 1']
  },
  responsibilities: [{
    type: String,
    trim: true,
    maxlength: [200, 'Responsibility cannot be more than 200 characters']
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  images: [{
    url: String,
    caption: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ user: 1 }` - For user's projects
- `{ status: 1 }` - For filtering by status
- `{ featured: -1, createdAt: -1 }` - For featured projects
- `{ skills: 1 }` - For skill-based filtering
- `{ title: 'text', description: 'text', tags: 'text' }` - Text search
- `{ startDate: -1 }` - For sorting by most recent
- `{ endDate: -1 }` - For sorting by completion date

## Work Experience Schema

```javascript
const workExperienceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot be more than 100 characters']
  },
  position: {
    type: String,
    required: [true, 'Position title is required'],
    trim: true,
    maxlength: [100, 'Position title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: Date,
  current: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  skills: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true,
    maxlength: [500, 'Achievement cannot be more than 500 characters']
  }],
  isCurrent: {
    type: Boolean,
    default: false
  },
  isRemote: {
    type: Boolean,
    default: false
  },
  companyWebsite: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, 'Please enter a valid URL with http:// or https://']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ user: 1 }` - For user's work experiences
- `{ company: 1 }` - For company-based queries
- `{ position: 'text', description: 'text', skills: 'text' }` - Text search
- `{ startDate: -1 }` - For reverse chronological order
- `{ endDate: -1 }` - For sorting by end date
- `{ current: -1, endDate: -1 }` - For showing current positions first

## Link Schema

```javascript
const linkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  github: {
    type: String,
    trim: true,
    match: [/^https?:\/\/github\.com\/.+/, 'Please enter a valid GitHub URL']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+/, 'Please enter a valid LinkedIn URL']
  },
  portfolio: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, 'Please enter a valid URL with http:// or https://']
  },
  twitter: {
    type: String,
    trim: true,
    match: [/^https?:\/\/twitter\.com\/.+/, 'Please enter a valid Twitter URL']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\//, 'Please enter a valid URL with http:// or https://']
  },
  other: [{
    label: {
      type: String,
      required: [true, 'Link label is required'],
      trim: true,
      maxlength: [50, 'Label cannot be more than 50 characters']
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
      match: [/^https?:\/\//, 'Please enter a valid URL with http:// or https://']
    },
    icon: {
      type: String,
      trim: true
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  customOrder: [{
    platform: String,
    order: Number
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});
```

**Indexes:**
- `{ user: 1 }` - Unique index for user's links
- `{ 'other.label': 'text' }` - For searching custom links

## Indexing Strategy

### General Indexing Guidelines
1. **Single Field Indexes**: Created on frequently queried fields
2. **Compound Indexes**: For queries that filter on multiple fields
3. **Text Indexes**: For full-text search capabilities
4. **Unique Indexes**: For fields requiring uniqueness
5. **TTL Indexes**: For data that expires (if applicable)

### Index Usage Analysis
- **Read-Heavy Operations**:
  - User profiles (frequent lookups)
  - Project listings (filtering and sorting)
  - Skill matching (searching and filtering)

- **Write-Heavy Operations**:
  - Project updates
  - Work experience additions
  - Skill additions/updates

### Recommended Indexes
1. **For User Authentication**
   - `{ email: 1 }` (unique)
   - `{ 'tokens.token': 1 }` (if using token-based auth)

2. **For Profile Lookups**
   - `{ user: 1 }` (unique)
   - `{ 'skills': 1 }` (for skill-based search)
   - `{ 'education.institution': 'text' }` (for education search)

3. **For Project Discovery**
   - `{ user: 1, status: 1 }` (compound)
   - `{ featured: -1, createdAt: -1 }` (for featured projects)
   - `{ skills: 1, status: 1 }` (for skill-based filtering)

4. **For Work Experience**
   - `{ user: 1, current: -1, endDate: -1 }` (compound)
   - `{ company: 1 }` (for company lookups)

### Index Maintenance
1. **Regular Monitoring**: Check index usage with `$indexStats`
2. **Query Profiling**: Identify slow queries with `db.setProfilingLevel()`
3. **Index Optimization**: Remove unused or duplicate indexes
4. **Background Indexing**: Use `{ background: true }` for production builds

### Example Index Creation
```javascript
// Single field index
db.users.createIndex({ email: 1 }, { unique: true });

// Compound index
db.projects.createIndex({ user: 1, status: 1 });

// Text index
db.skills.createIndex({ name: 'text', tags: 'text' });

// TTL index (for expiring data)
db.sessions.createIndex({ lastAccess: 1 }, { expireAfterSeconds: 3600 });
```

### Index Performance Considerations
- **Index Size**: Larger indexes consume more RAM
- **Write Overhead**: Each insert/update requires index updates
- **Covered Queries**: Design queries to use indexes fully
- **Index Intersection**: MongoDB can use multiple indexes for a single query

This schema documentation provides a comprehensive overview of the database structure and indexing strategy for optimal performance in the Portfolio Management System.
