# Portfolio Management System

A full-stack web application for managing professional portfolios, built with Node.js, Express.js, MongoDB, and React.js.
- **Live Hosted link**:https://process-veneu.vercel.app/
- **Backend link**:https://process-veneu.onrender.com/
- **Resume link**:https://drive.google.com/file/d/1SVtHM2ESvtO4oE-jILlKA1LBaXc_IpkL/view?usp=sharing



# Sample Login Credentials
After running the seed script:
- **Email**: sujeetkrgupta9122@gmail.com
- **Password**: sujeet87097

## 🏗️ Architecture
   
### Backend
- **Framework**: Node.js + Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Security**: Helmet, CORS, Rate limiting
- **API**: RESTful API design

### Frontend
- **Framework**: React.js with functional components and hooks
- **Routing**: React Router DOM
- **State Management**: Context API for authentication
- **HTTP Client**: Axios
- **Styling**: Custom CSS with responsive design

### Database Schema
```
User
├── name: String (required)
├── email: String (required, unique)
├── password: String (required, hashed)
└── timestamps

Profile
├── user: ObjectId (ref: User)
├── name: String (required)
├── email: String (required)
├── bio: String
├── location: String
├── phone: String
├── website: String
├── education: Array
│   ├── institution: String
│   ├── degree: String
│   ├── field: String
│   ├── startDate: Date
│   ├── endDate: Date
│   └── current: Boolean
└── timestamps

Skill
├── user: ObjectId (ref: User)
├── name: String (required)
├── proficiency: Number (1-10)
├── category: String (enum)
├── yearsOfExperience: Number
└── timestamps

Project
├── user: ObjectId (ref: User)
├── title: String (required)
├── description: String (required)
├── skills: Array[String]
├── links: Array
│   ├── type: String (enum)
│   ├── url: String
│   └── label: String
├── status: String (enum)
├── startDate: Date
├── endDate: Date
├── featured: Boolean
└── timestamps

Work
├── user: ObjectId (ref: User)
├── company: String (required)
├── position: String (required)
├── description: String
├── startDate: Date (required)
├── endDate: Date
├── current: Boolean
├── location: String
├── employmentType: String (enum)
├── skills: Array[String]
└── timestamps

Link
├── user: ObjectId (ref: User)
├── github: String
├── linkedin: String
├── portfolio: String
├── twitter: String
├── website: String
├── other: Array
│   ├── label: String
│   └── url: String
└── timestamps
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd portfolio-management-system
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the backend directory:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
NODE_ENV=development
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

#### 4. Database Setup
Seed the database with sample data:
```bash
cd ../backend
npm run seed
```

#### 5. Run the Application
Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Sample Login Credentials
After running the seed script:
- **Email**: sujeetkrgupta9122@gmail.com
- **Password**: sujeet87097

## 📚 API Documentation

### Authentication Endpoints

#### POST /auth/register
Register a new user.
```json
{
  "name": "john doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /auth/login
Login user and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user information (protected).

### Profile Endpoints

#### POST /profile (Protected)
Create user profile.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "bio": "Full-stack developer",
  "location": "San Francisco, CA",
  "education": [
    {
      "institution": "Stanford University",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2015-09-01",
      "endDate": "2019-06-01"
    }
  ]
}
```

#### GET /profile (Protected)
Get user profile.

#### PUT /profile (Protected)
Update user profile.

#### DELETE /profile (Protected)
Delete user profile.

### Skills Endpoints

#### POST /skills (Protected)
Add a new skill.
```json
{
  "name": "JavaScript",
  "proficiency": 9,
  "category": "Programming",
  "yearsOfExperience": 5
}
```

#### GET /skills (Protected)
Get all user skills.

#### GET /skills/top (Protected)
Get top skills by proficiency.

#### PUT /skills/:id (Protected)
Update a skill.

#### DELETE /skills/:id (Protected)
Delete a skill.

### Projects Endpoints

#### POST /projects (Protected)
Add a new project.
```json
{
  "title": "E-commerce Platform",
  "description": "A full-stack e-commerce platform",
  "skills": ["React", "Node.js", "MongoDB"],
  "links": [
    {
      "type": "github",
      "url": "https://github.com/user/project",
      "label": "Source Code"
    }
  ],
  "status": "completed",
  "featured": true
}
```

#### GET /projects (Protected)
Get all user projects.

#### GET /projects?skill=javascript (Protected)
Filter projects by skill.

#### GET /projects/:id (Protected)
Get project by ID.

#### PUT /projects/:id (Protected)
Update a project.

#### DELETE /projects/:id (Protected)
Delete a project.

### Work Experience Endpoints

#### POST /work (Protected)
Add work experience.
```json
{
  "company": "TechCorp Inc.",
  "position": "Senior Developer",
  "description": "Led development of web applications",
  "startDate": "2021-03-01",
  "current": true,
  "location": "San Francisco, CA",
  "employmentType": "full-time",
  "skills": ["JavaScript", "React", "Node.js"]
}
```

#### GET /work (Protected)
Get all work experiences.

#### PUT /work/:id (Protected)
Update work experience.

#### DELETE /work/:id (Protected)
Delete work experience.

### Links Endpoints

#### POST /links (Protected)
Add professional links.
```json
{
  "github": "https://github.com/username",
  "linkedin": "https://linkedin.com/in/username",
  "portfolio": "https://portfolio.com",
  "other": [
    {
      "label": "Medium Blog",
      "url": "https://medium.com/@username"
    }
  ]
}
```

#### GET /links (Protected)
Get user links.

#### PUT /links/:id (Protected)
Update links.

#### DELETE /links/:id (Protected)
Delete links.

### Search Endpoint

#### GET /search?q=keyword (Protected)
Search across profile, skills, projects, and work experience.

### Health Check

#### GET /health
Returns server health status.
```json
{
  "status": "healthy"
}
```

## 🔧 Sample API Requests

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

#### Add Skill (with token)
```bash
curl -X POST http://localhost:5000/skills \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "React",
    "proficiency": 8,
    "category": "Framework",
    "yearsOfExperience": 3
  }'
```

## 🚀 Production Deployment

### Backend Deployment (Heroku/Render)

1. **Render**:
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables in Render dashboard

### Frontend Deployment (Vercel)

1. **Vercel**:
```bash
cd frontend
npm install -g vercel
vercel
```

### Environment Variables for Production

**Backend**:
```env
PORT=5000
MONGO_URI=mongodb+srv://sujeetkrgupta9122_db_user:xukgg7f05En9fhRx@cluster0.tpwtirr.mongodb.net/predusk_db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=sujeetkrgupta9122
NODE_ENV=development

```

**Frontend**:
```env
REACT_APP_API_URL=https://process-veneu.onrender.com
```

## 📋 Features

### ✅ Implemented Features
- User registration and authentication with JWT
- Profile management with education history
- Skills tracking with proficiency levels
- Project portfolio with filtering
- Work experience management
- Professional links management
- Global search functionality
- Responsive UI design
- Protected routes
- Error handling and validation
- Database seeding with sample data

### 🔒 Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## ⚠️ Known Limitations

1. **File Uploads**: No image upload functionality for profile pictures or project images
2. **Email Verification**: User registration doesn't include email verification
3. **Password Reset**: No forgot password functionality
4. **Real-time Updates**: No WebSocket implementation for real-time updates
5. **Advanced Search**: Search is basic text matching, no advanced filters
6. **Data Export**: No functionality to export portfolio data
7. **Social Login**: No OAuth integration (Google, GitHub, etc.)
8. **Notifications**: No notification system for updates
9. **Analytics**: No usage analytics or dashboard insights
10. **Multi-language**: No internationalization support

## 🛠️ Development Scripts

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run seed       # Seed database with sample data
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check that MongoDB Atlas is properly configured
2. Ensure all environment variables are set correctly
3. Verify that both backend and frontend servers are running
4. Check browser console for any JavaScript errors
5. Review server logs for API errors

For additional help, please open an issue in the repository.
