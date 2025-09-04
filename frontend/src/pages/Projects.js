import React, { useState, useEffect } from 'react';
import api from '../utils/api';

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

  const statuses = ['planning', 'in-progress', 'completed', 'on-hold'];

  // ✅ Fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data.projects || response.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage(error.response?.data?.message || 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // ✅ Links
  const addLink = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { type: 'other', url: '', label: '' }]
    });
  };

  const updateLink = (index, field, value) => {
    const updatedLinks = [...formData.links];
    updatedLinks[index][field] = value;
    setFormData({ ...formData, links: updatedLinks });
  };

  const removeLink = (index) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index)
    });
  };

  // ✅ Add / Update Project
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const projectData = {
      ...formData,
      skills: formData.skills
        ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingProject) {
        const response = await api.put(`/projects/${editingProject._id}`, projectData);
        setProjects(projects.map(p =>
          p._id === editingProject._id ? (response.data.project || response.data) : p
        ));
        setMessage('Project updated successfully!');
      } else {
        const response = await api.post('/projects', projectData);
        const newProject = response.data.project || response.data;
        setProjects([newProject, ...projects]);
        setMessage('Project added successfully!');
      }
      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving project');
    }
  };

  // ✅ Reset form
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

  // ✅ Edit
  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || '',
      skills: project.skills ? project.skills.join(', ') : '',
      status: project.status || 'planning',
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : '',
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : '',
      featured: project.featured || false,
      links: project.links || []
    });
  };

  // ✅ Delete
  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${projectId}`);
        setProjects(projects.filter(p => p._id !== projectId));
        setMessage('Project deleted successfully!');
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting project');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div>
      {/* --- Project Form --- */}
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
              <label>Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {statuses.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={formData.description}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Skills (comma-separated)</label>
              <input
                type="text"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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

            {/* Links */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Project Links</label>
              {formData.links.map((link, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <select
                    value={link.type}
                    onChange={(e) => updateLink(index, 'type', e.target.value)}
                  >
                    <option value="github">GitHub</option>
                    <option value="demo">Demo</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateLink(index, 'label', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                  />
                  <button type="button" onClick={() => removeLink(index)} className="btn btn-danger btn-small">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addLink} className="btn btn-secondary btn-small">
                + Add Link
              </button>
            </div>
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

      {/* --- Project List --- */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">Your Projects ({projects.length})</h2>
        </div>

        {projects.length === 0 ? (
          <p>No projects yet. Add your first one above!</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className="card" style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p><strong>Status:</strong> {project.status}</p>
                  <p><strong>Skills:</strong> {project.skills?.join(', ')}</p>
                  {project.links && project.links.length > 0 && (
                    <p>
                      <strong>Links:</strong>{' '}
                      {project.links.map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: '0.5rem' }}>
                          {link.label || link.type}
                        </a>
                      ))}
                    </p>
                  )}
                </div>
                <div>
                  <button onClick={() => handleEdit(project)} className="btn btn-secondary btn-small">Edit</button>
                  <button onClick={() => handleDelete(project._id)} className="btn btn-danger btn-small">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
