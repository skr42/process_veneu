import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    profile: null,
    topSkills: [],
    recentProjects: [],
    workExperiences: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, skillsRes, projectsRes, workRes] = await Promise.all([
        api.get('/profile').catch(() => ({ data: { profile: null } })),
        api.get('/skills/top?limit=5').catch(() => ({ data: { skills: [] } })),
        api.get('/projects').catch(() => ({ data: { projects: [] } })),
        api.get('/work').catch(() => ({ data: { workExperiences: [] } }))
      ]);

      setData({
        profile: profileRes.data.profile,
        topSkills: skillsRes.data.skills,
        recentProjects: projectsRes.data.projects.slice(0, 3),
        workExperiences: workRes.data.workExperiences.slice(0, 2)
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.results);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="card">
        <h1>Welcome back, {user?.name}!</h1>
        <p>Manage your portfolio and track your professional growth.</p>
      </div>

      {/* Search */}
      <div className="card">
        <h2>Search Your Portfolio</h2>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search skills, projects, work experience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {searchResults && (
          <div style={{ marginTop: '1rem' }}>
            <h3>Search Results ({searchResults.totalResults} found)</h3>
            {searchResults.totalResults === 0 ? (
              <p>No results found for "{searchQuery}"</p>
            ) : (
              <div className="grid grid-2">
                {searchResults.skills.length > 0 && (
                  <div>
                    <h4>Skills</h4>
                    {searchResults.skills.map(skill => (
                      <div key={skill._id} className="skill-item">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-proficiency">{skill.proficiency}/10</span>
                      </div>
                    ))}
                  </div>
                )}
                {searchResults.projects.length > 0 && (
                  <div>
                    <h4>Projects</h4>
                    {searchResults.projects.map(project => (
                      <div key={project._id} className="card">
                        <h5>{project.title}</h5>
                        <p>{project.description.substring(0, 100)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-2">
        {/* Profile Summary */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Profile Summary</h2>
          </div>
          {data.profile ? (
            <div>
              <p><strong>Name:</strong> {data.profile.name}</p>
              <p><strong>Email:</strong> {data.profile.email}</p>
              {data.profile.location && <p><strong>Location:</strong> {data.profile.location}</p>}
              {data.profile.bio && <p><strong>Bio:</strong> {data.profile.bio}</p>}
            </div>
          ) : (
            <div>
              <p>No profile created yet.</p>
              <a href="/profile" className="btn btn-primary">Create Profile</a>
            </div>
          )}
        </div>

        {/* Top Skills */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Skills</h2>
          </div>
          {data.topSkills.length > 0 ? (
            <div>
              {data.topSkills.map(skill => (
                <div key={skill._id} className="skill-item">
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-proficiency">{skill.proficiency}/10</span>
                </div>
              ))}
              <a href="/skills" className="btn btn-secondary btn-small">View All Skills</a>
            </div>
          ) : (
            <div>
              <p>No skills added yet.</p>
              <a href="/skills" className="btn btn-primary">Add Skills</a>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-2">
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Projects</h2>
          </div>
          {data.recentProjects.length > 0 ? (
            <div>
              {data.recentProjects.map(project => (
                <div key={project._id} className="card project-card" style={{ marginBottom: '1rem' }}>
                  <h4>{project.title}</h4>
                  <p>{project.description.substring(0, 150)}...</p>
                  <span className={`project-status status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
              ))}
              <a href="/projects" className="btn btn-secondary btn-small">View All Projects</a>
            </div>
          ) : (
            <div>
              <p>No projects added yet.</p>
              <a href="/projects" className="btn btn-primary">Add Projects</a>
            </div>
          )}
        </div>

        {/* Work Experience */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Work Experience</h2>
          </div>
          {data.workExperiences.length > 0 ? (
            <div>
              {data.workExperiences.map(work => (
                <div key={work._id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                  <h4>{work.position}</h4>
                  <p><strong>{work.company}</strong></p>
                  <p>{work.current ? 'Current' : `${new Date(work.startDate).getFullYear()} - ${new Date(work.endDate).getFullYear()}`}</p>
                </div>
              ))}
              <a href="/work" className="btn btn-secondary btn-small">View All Experience</a>
            </div>
          ) : (
            <div>
              <p>No work experience added yet.</p>
              <a href="/work" className="btn btn-primary">Add Experience</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
