import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    status: 'planning',
    startDate: '',
    endDate: '',
    featured: false,
    links: []
  });
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  const statuses = ['planning', 'in-progress', 'completed', 'on-hold'];

  useEffect(() => {
    fetchProjects();
  }, [skillFilter]);

  const fetchProjects = async () => {
    try {
      const url = skillFilter ? `/projects?skill=${encodeURIComponent(skillFilter)}` : '/projects';
      const response = await axios.get(url);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { type: 'other', url: '', label: '' }]
    });
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  const removeLink = (index) => {
    const updatedLinks = formData.links.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      links: updatedLinks
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const projectData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    try {
      if (editingProject) {
        const response = await axios.put(`/projects/${editingProject._id}`, projectData);
        setProjects(projects.map(project => 
          project._id === editingProject._id ? response.data.project : project
        ));
        setMessage('Project updated successfully!');
      } else {
        const response = await axios.post('/projects', projectData);
        setProjects([response.data.project, ...projects]);
        setMessage('Project added successfully!');
      }

      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving project');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      skills: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      featured: false,
      links: []
    });
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      skills: project.skills.join(', '),
      status: project.status,
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      featured: project.featured,
      links: project.links || []
    });
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/projects/${projectId}`);
        setProjects(projects.filter(project => project._id !== projectId));
        setMessage('Project deleted successfully!');
      } catch (error) {
        setMessage('Error deleting project');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Projects</h1>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="title">Project Title</label>
              <input
                type="text"
                id="title"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                Featured Project
              </label>
            </div>

            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>Project Links</h3>
              <button 
                type="button" 
                onClick={addLink}
                className="btn btn-secondary btn-small"
              >
                Add Link
              </button>
            </div>

            {formData.links.map((link, index) => (
              <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                <div className="grid grid-3">
                  <div className="form-group">
                    <label>Type</label>
                    <select
                      className="form-control"
                      value={link.type}
                      onChange={(e) => updateLink(index, 'type', e.target.value)}
                    >
                      <option value="github">GitHub</option>
                      <option value="demo">Demo</option>
                      <option value="documentation">Documentation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>URL</label>
                    <input
                      type="url"
                      className="form-control"
                      value={link.url}
                      onChange={(e) => updateLink(index, 'url', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={link.label}
                      onChange={(e) => updateLink(index, 'label', e.target.value)}
                    />
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => removeLink(index)}
                  className="btn btn-danger btn-small"
                >
                  Remove Link
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Update Project' : 'Add Project'}
            </button>
            {editingProject && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Projects ({projects.length})</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Filter by skill..."
              className="form-control"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              style={{ width: '200px' }}
            />
            <button 
              onClick={() => setSkillFilter('')}
              className="btn btn-secondary btn-small"
            >
              Clear
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <p>No projects found. {skillFilter ? 'Try a different skill filter or ' : ''}Add your first project above!</p>
        ) : (
          <div className="grid grid-2">
            {projects.map(project => (
              <div key={project._id} className="card project-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3>{project.title}</h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span className={`project-status status-${project.status}`}>
                      {project.status}
                    </span>
                    {project.featured && (
                      <span style={{ background: '#fbbf24', color: '#92400e', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem' }}>
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <p>{project.description}</p>

                {project.skills && project.skills.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Skills:</strong> {project.skills.join(', ')}
                  </div>
                )}

                {project.links && project.links.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Links:</strong>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      {project.links.map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" rel="noopener noreferrer">
                            {link.label || link.type}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(project.startDate || project.endDate) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Timeline:</strong> {
                      project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not specified'
                    } - {
                      project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'
                    }
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(project)}
                    className="btn btn-secondary btn-small"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(project._id)}
                    className="btn btn-danger btn-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
