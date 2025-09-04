import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      const response = await axios.get('/links');
      setLinks(response.data.links);
      setFormData(response.data.links);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsEditing(true);
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
        response = await axios.put(`/links/${links._id}`, formData);
      } else {
        response = await axios.post('/links', formData);
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
        await axios.delete(`/links/${links._id}`);
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
              <button 
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Links
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-danger"
              >
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
            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="github">GitHub</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  className="form-control"
                  value={formData.github || ''}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="linkedin">LinkedIn</label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  className="form-control"
                  value={formData.linkedin || ''}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="portfolio">Portfolio</label>
                <input
                  type="url"
                  id="portfolio"
                  name="portfolio"
                  className="form-control"
                  value={formData.portfolio || ''}
                  onChange={handleChange}
                  placeholder="https://yourportfolio.com"
                />
              </div>

              <div className="form-group">
                <label htmlFor="twitter">Twitter</label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  className="form-control"
                  value={formData.twitter || ''}
                  onChange={handleChange}
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="form-control"
                  value={formData.website || ''}
                  onChange={handleChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Other Links</h3>
                <button 
                  type="button" 
                  onClick={addOtherLink}
                  className="btn btn-secondary btn-small"
                >
                  Add Link
                </button>
              </div>

              {formData.other && formData.other.map((link, index) => (
                <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        className="form-control"
                        value={link.label}
                        onChange={(e) => updateOtherLink(index, 'label', e.target.value)}
                        placeholder="e.g., Medium Blog"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>URL</label>
                      <input
                        type="url"
                        className="form-control"
                        value={link.url}
                        onChange={(e) => updateOtherLink(index, 'url', e.target.value)}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeOtherLink(index)}
                    className="btn btn-danger btn-small"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">
                {links ? 'Update Links' : 'Save Links'}
              </button>
              {links && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(links);
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        ) : (
          <div>
            {links ? (
              <div>
                <div className="grid grid-2">
                  <div>
                    <h3>Professional Links</h3>
                    {links.github && (
                      <p><strong>GitHub:</strong> <a href={links.github} target="_blank" rel="noopener noreferrer">{links.github}</a></p>
                    )}
                    {links.linkedin && (
                      <p><strong>LinkedIn:</strong> <a href={links.linkedin} target="_blank" rel="noopener noreferrer">{links.linkedin}</a></p>
                    )}
                    {links.portfolio && (
                      <p><strong>Portfolio:</strong> <a href={links.portfolio} target="_blank" rel="noopener noreferrer">{links.portfolio}</a></p>
                    )}
                    {links.twitter && (
                      <p><strong>Twitter:</strong> <a href={links.twitter} target="_blank" rel="noopener noreferrer">{links.twitter}</a></p>
                    )}
                    {links.website && (
                      <p><strong>Website:</strong> <a href={links.website} target="_blank" rel="noopener noreferrer">{links.website}</a></p>
                    )}
                  </div>

                  <div>
                    {links.other && links.other.length > 0 && (
                      <div>
                        <h3>Other Links</h3>
                        {links.other.map((link, index) => (
                          <p key={index}>
                            <strong>{link.label}:</strong> <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {!links.github && !links.linkedin && !links.portfolio && !links.twitter && !links.website && (!links.other || links.other.length === 0) && (
                  <div className="alert alert-info">
                    No links have been added yet. Click "Edit Links" to add your professional links.
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>No links found. Add your professional links to showcase your online presence.</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
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
