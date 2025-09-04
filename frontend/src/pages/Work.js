import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Work = () => {
  const [workExperiences, setWorkExperiences] = useState([]);
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    current: false,
    location: '',
    employmentType: 'full-time',
    skills: ''
  });
  const [editingWork, setEditingWork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const employmentTypes = ['full-time', 'part-time', 'contract', 'internship', 'freelance'];

  useEffect(() => {
    fetchWorkExperiences();
  }, []);

  const fetchWorkExperiences = async () => {
    try {
      const response = await axios.get('/work');
      setWorkExperiences(response.data.workExperiences);
    } catch (error) {
      console.error('Error fetching work experiences:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const workData = {
      ...formData,
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
    };

    try {
      if (editingWork) {
        const response = await axios.put(`/work/${editingWork._id}`, workData);
        setWorkExperiences(workExperiences.map(work => 
          work._id === editingWork._id ? response.data.work : work
        ));
        setMessage('Work experience updated successfully!');
      } else {
        const response = await axios.post('/work', workData);
        setWorkExperiences([response.data.work, ...workExperiences]);
        setMessage('Work experience added successfully!');
      }

      resetForm();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving work experience');
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      startDate: '',
      endDate: '',
      current: false,
      location: '',
      employmentType: 'full-time',
      skills: ''
    });
    setEditingWork(null);
  };

  const handleEdit = (work) => {
    setEditingWork(work);
    setFormData({
      company: work.company,
      position: work.position,
      description: work.description || '',
      startDate: work.startDate ? new Date(work.startDate).toISOString().split('T')[0] : '',
      endDate: work.endDate ? new Date(work.endDate).toISOString().split('T')[0] : '',
      current: work.current,
      location: work.location || '',
      employmentType: work.employmentType,
      skills: work.skills ? work.skills.join(', ') : ''
    });
  };

  const handleDelete = async (workId) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      try {
        await axios.delete(`/work/${workId}`);
        setWorkExperiences(workExperiences.filter(work => work._id !== workId));
        setMessage('Work experience deleted successfully!');
      } catch (error) {
        setMessage('Error deleting work experience');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading work experiences...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Work Experience</h1>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                name="company"
                className="form-control"
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="position">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                className="form-control"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="employmentType">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                className="form-control"
                value={formData.employmentType}
                onChange={handleChange}
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
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
                required
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
                disabled={formData.current}
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>
                <input
                  type="checkbox"
                  name="current"
                  checked={formData.current}
                  onChange={handleChange}
                  style={{ marginRight: '0.5rem' }}
                />
                I currently work here
              </label>
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
                placeholder="Describe your role, responsibilities, and achievements..."
              />
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="skills">Skills (comma-separated)</label>
              <input
                type="text"
                id="skills"
                name="skills"
                className="form-control"
                value={formData.skills}
                onChange={handleChange}
                placeholder="JavaScript, React, Project Management"
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingWork ? 'Update Experience' : 'Add Experience'}
            </button>
            {editingWork && (
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Work Experience ({workExperiences.length})</h2>
        </div>

        {workExperiences.length === 0 ? (
          <p>No work experience added yet. Add your first experience above!</p>
        ) : (
          <div>
            {workExperiences.map(work => (
              <div key={work._id} className="card" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3>{work.position}</h3>
                    <h4 style={{ color: '#2563eb', marginBottom: '0.5rem' }}>{work.company}</h4>
                    <p style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                      {work.location && `${work.location} • `}
                      {work.employmentType.charAt(0).toUpperCase() + work.employmentType.slice(1).replace('-', ' ')}
                    </p>
                    <p style={{ color: '#6b7280' }}>
                      {new Date(work.startDate).toLocaleDateString()} - {
                        work.current ? 'Present' : new Date(work.endDate).toLocaleDateString()
                      }
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleEdit(work)}
                      className="btn btn-secondary btn-small"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(work._id)}
                      className="btn btn-danger btn-small"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {work.description && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p>{work.description}</p>
                  </div>
                )}

                {work.skills && work.skills.length > 0 && (
                  <div>
                    <strong>Skills:</strong> {work.skills.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Work;
