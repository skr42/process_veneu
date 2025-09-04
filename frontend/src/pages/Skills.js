import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 5,
    category: 'Other',
    yearsOfExperience: 0
  });
  const [editingSkill, setEditingSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const categories = ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Other'];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/skills');
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (editingSkill) {
        const response = await axios.put(`/skills/${editingSkill._id}`, formData);
        setSkills(skills.map(skill => 
          skill._id === editingSkill._id ? response.data.skill : skill
        ));
        setMessage('Skill updated successfully!');
      } else {
        const response = await axios.post('/skills', formData);
        setSkills([...skills, response.data.skill]);
        setMessage('Skill added successfully!');
      }

      setFormData({
        name: '',
        proficiency: 5,
        category: 'Other',
        yearsOfExperience: 0
      });
      setEditingSkill(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving skill');
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
      yearsOfExperience: skill.yearsOfExperience
    });
  };

  const handleDelete = async (skillId) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`/skills/${skillId}`);
        setSkills(skills.filter(skill => skill._id !== skillId));
        setMessage('Skill deleted successfully!');
      } catch (error) {
        setMessage('Error deleting skill');
      }
    }
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      proficiency: 5,
      category: 'Other',
      yearsOfExperience: 0
    });
  };

  if (loading) {
    return <div className="loading">Loading skills...</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Skills</h1>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label htmlFor="name">Skill Name</label>
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
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="proficiency">Proficiency (1-10)</label>
              <input
                type="number"
                id="proficiency"
                name="proficiency"
                className="form-control"
                min="1"
                max="10"
                value={formData.proficiency}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearsOfExperience">Years of Experience</label>
              <input
                type="number"
                id="yearsOfExperience"
                name="yearsOfExperience"
                className="form-control"
                min="0"
                value={formData.yearsOfExperience}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              {editingSkill ? 'Update Skill' : 'Add Skill'}
            </button>
            {editingSkill && (
              <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your Skills ({skills.length})</h2>
        </div>

        {skills.length === 0 ? (
          <p>No skills added yet. Add your first skill above!</p>
        ) : (
          <div className="grid grid-3">
            {skills.map(skill => (
              <div key={skill._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3>{skill.name}</h3>
                    <p><strong>Category:</strong> {skill.category}</p>
                    <p><strong>Proficiency:</strong> {skill.proficiency}/10</p>
                    <p><strong>Experience:</strong> {skill.yearsOfExperience} years</p>
                  </div>
                  <div className="skill-proficiency">
                    {skill.proficiency}/10
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => handleEdit(skill)}
                    className="btn btn-secondary btn-small"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(skill._id)}
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

export default Skills;
