import React, { useState } from 'react';
import '../styles/NewTournamentForm.css';

const NewTournamentForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'singles',
    players: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Tournament name is required';
    }
    if (!formData.type) {
      newErrors.type = 'Tournament type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const playersList = formData.players
      .split(',')
      .map(p => p.trim())
      .filter(p => p.length > 0);

    onSubmit({
      name: formData.name.trim(),
      type: formData.type,
      players: playersList,
      start_time: new Date().toISOString(),
    });

    // Reset form
    setFormData({
      name: '',
      type: 'singles',
      players: '',
    });
  };

  return (
    <div className="new-tournament-form-container">
      <form className="new-tournament-form" onSubmit={handleSubmit}>
        <h3>Create New Tournament</h3>

        <div className="form-group">
          <label htmlFor="name">Tournament Name *</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Weekly Pool Championship"
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type">Tournament Type *</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={errors.type ? 'error' : ''}
          >
            <option value="singles">Singles</option>
            <option value="doubles">Doubles</option>
            <option value="league">League</option>
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="players">Players (comma-separated, optional)</label>
          <textarea
            id="players"
            name="players"
            value={formData.players}
            onChange={handleChange}
            placeholder="e.g., John Smith, Jane Doe, Bob Wilson"
            rows="4"
          />
          <small>Leave empty to add players later</small>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Create Tournament
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewTournamentForm;
