import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Links = () => {
  const [links, setLinks] = useState(null);
  const [formData, setFormData] = useState({
    github: '',
    linkedin: '',
    portfolio: '',
    twitter: '',
    website: '',
    other: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const response = await api.get('/links');
      setLinks(response.data.links);
      setFormData(response.data.links);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsEditing(true); // first time user
      }
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addOtherLink = () => {
    setFormData({
      ...formData,
      other: [...formData.other, { label: '', url: '' }]
    });
  };

  const updateOtherLink = (index, field, value) => {
    const updatedOther = [...formData.other];
    updatedOther[index][field] = value;
    setFormData({
      ...formData,
      other: updatedOther
    });
  };

  const removeOtherLink = (index) => {
    const updatedOther = formData.other.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      other: updatedOther
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let response;
      if (links) {
        response = await api.put(`/links/${links._id}`, formData);
      } else {
        response = await api.post('/links', formData);
      }

      setLinks(response.data.links);
      setIsEditing(false);
      setMessage('Links saved successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving links');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete all your links?')) {
      try {
        await api.delete(`/links/${links._id}`);
        setLinks(null);
        setFormData({
          github: '',
          linkedin: '',
          portfolio: '',
          twitter: '',
          website: '',
          other: []
        });
        setIsEditing(true);
        setMessage('Links deleted successfully!');
      } catch (error) {
        setMessage('Error deleting links');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading links...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Professional Links</h1>
          {links && !isEditing && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                Edit Links
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete All
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>GitHub</label>
              <input type="url" name="github" className="form-control"
                value={formData.github} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>LinkedIn</label>
              <input type="url" name="linkedin" className="form-control"
                value={formData.linkedin} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Portfolio</label>
              <input type="url" name="portfolio" className="form-control"
                value={formData.portfolio} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Twitter</label>
              <input type="url" name="twitter" className="form-control"
                value={formData.twitter} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Website</label>
              <input type="url" name="website" className="form-control"
                value={formData.website} onChange={handleChange} />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <h3>Other Links</h3>
              {formData.other.map((link, index) => (
                <div key={index} className="grid grid-2" style={{ marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Label"
                    className="form-control"
                    value={link.label}
                    onChange={(e) => updateOtherLink(index, 'label', e.target.value)}
                  />
                  <input
                    type="url"
                    placeholder="URL"
                    className="form-control"
                    value={link.url}
                    onChange={(e) => updateOtherLink(index, 'url', e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-small"
                    onClick={() => removeOtherLink(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={addOtherLink} className="btn btn-secondary">
                Add Other Link
              </button>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Save Links
            </button>
          </form>
        ) : (
          <div>
            {links ? (
              <div>
                {links.github && <p><strong>GitHub:</strong> <a href={links.github} target="_blank" rel="noreferrer">{links.github}</a></p>}
                {links.linkedin && <p><strong>LinkedIn:</strong> <a href={links.linkedin} target="_blank" rel="noreferrer">{links.linkedin}</a></p>}
                {links.portfolio && <p><strong>Portfolio:</strong> <a href={links.portfolio} target="_blank" rel="noreferrer">{links.portfolio}</a></p>}
                {links.twitter && <p><strong>Twitter:</strong> <a href={links.twitter} target="_blank" rel="noreferrer">{links.twitter}</a></p>}
                {links.website && <p><strong>Website:</strong> <a href={links.website} target="_blank" rel="noreferrer">{links.website}</a></p>}
                {links.other && links.other.length > 0 && (
                  <div>
                    <strong>Other Links:</strong>
                    <ul>
                      {links.other.map((link, index) => (
                        <li key={index}>
                          <a href={link.url} target="_blank" rel="noreferrer">{link.label || link.url}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>No links found. Add your professional links to showcase your online presence.</p>
                <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                  Add Links
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Links;
