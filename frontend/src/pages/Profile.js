import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    phone: '',
    website: '',
    education: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/profile');
      setProfile(response.data.profile);
      setFormData(response.data.profile);
      setIsEditing(false);
    } catch (error) {
      if (error.response?.status === 404) {
        setIsEditing(true);
      }
      console.error('Error fetching profile:', error);
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

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [...formData.education, {
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        current: false
      }]
    });
  };

  const updateEducation = (index, field, value) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index][field] = value;
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const removeEducation = (index) => {
    const updatedEducation = formData.education.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let response;
      if (profile) {
        response = await axios.put('/profile', formData);
      } else {
        response = await axios.post('/profile', formData);
      }

      setProfile(response.data.profile);
      setIsEditing(false);
      setMessage('Profile saved successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving profile');
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Profile</h1>
          {profile && !isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
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
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
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
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="website">Website</label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className="form-control"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="bio">Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  className="form-control"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Education</h3>
                <button 
                  type="button" 
                  onClick={addEducation}
                  className="btn btn-secondary btn-small"
                >
                  Add Education
                </button>
              </div>

              {formData.education.map((edu, index) => (
                <div key={index} className="card" style={{ marginBottom: '1rem' }}>
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label>Institution</label>
                      <input
                        type="text"
                        className="form-control"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Degree</label>
                      <input
                        type="text"
                        className="form-control"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Field of Study</label>
                      <input
                        type="text"
                        className="form-control"
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label>End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                        disabled={edu.current}
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        Currently studying
                      </label>
                    </div>
                  </div>

                  <button 
                    type="button" 
                    onClick={() => removeEducation(index)}
                    className="btn btn-danger btn-small"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="submit" className="btn btn-primary">
                {profile ? 'Update Profile' : 'Create Profile'}
              </button>
              {profile && (
                <button 
                  type="button" 
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
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
            {profile ? (
              <div>
                <div className="grid grid-2">
                  <div>
                    <h3>Personal Information</h3>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    {profile.location && <p><strong>Location:</strong> {profile.location}</p>}
                    {profile.phone && <p><strong>Phone:</strong> {profile.phone}</p>}
                    {profile.website && <p><strong>Website:</strong> <a href={profile.website} target="_blank" rel="noopener noreferrer">{profile.website}</a></p>}
                  </div>

                  <div>
                    <h3>Bio</h3>
                    <p>{profile.bio || 'No bio provided'}</p>
                  </div>
                </div>

                {profile.education && profile.education.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <h3>Education</h3>
                    {profile.education.map((edu, index) => (
                      <div key={index} className="card">
                        <h4>{edu.degree} in {edu.field}</h4>
                        <p><strong>{edu.institution}</strong></p>
                        <p>
                          {new Date(edu.startDate).getFullYear()} - {
                            edu.current ? 'Present' : new Date(edu.endDate).getFullYear()
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>No profile found. Create your profile to get started.</p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
