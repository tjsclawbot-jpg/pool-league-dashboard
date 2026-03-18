import React, { useState } from 'react';
import '../styles/NewMatchForm.css';

const NewMatchForm = ({ onSubmit, onCancel, tournamentPlayers }) => {
  const [formData, setFormData] = useState({
    player1: '',
    player2: '',
    round: 1,
    table: 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'round' || name === 'table' ? parseInt(value) : value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.player1.trim()) {
      newErrors.player1 = 'Player 1 name is required';
    }
    if (!formData.player2.trim()) {
      newErrors.player2 = 'Player 2 name is required';
    }
    if (formData.player1.trim() === formData.player2.trim()) {
      newErrors.player2 = 'Players must be different';
    }
    if (formData.round < 1) {
      newErrors.round = 'Round must be at least 1';
    }
    if (formData.table < 1) {
      newErrors.table = 'Table must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      player1: formData.player1.trim(),
      player2: formData.player2.trim(),
      round: formData.round,
      table: formData.table,
    });

    // Reset form
    setFormData({
      player1: '',
      player2: '',
      round: 1,
      table: 1,
    });
  };

  return (
    <div className="new-match-form-container">
      <form className="new-match-form" onSubmit={handleSubmit}>
        <h3>Create New Match</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="player1">Player 1 *</label>
            <input
              id="player1"
              type="text"
              name="player1"
              value={formData.player1}
              onChange={handleChange}
              placeholder="Enter player name"
              className={errors.player1 ? 'error' : ''}
            />
            {errors.player1 && <span className="error-message">{errors.player1}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="player2">Player 2 *</label>
            <input
              id="player2"
              type="text"
              name="player2"
              value={formData.player2}
              onChange={handleChange}
              placeholder="Enter player name"
              className={errors.player2 ? 'error' : ''}
            />
            {errors.player2 && <span className="error-message">{errors.player2}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="round">Round *</label>
            <input
              id="round"
              type="number"
              name="round"
              value={formData.round}
              onChange={handleChange}
              min="1"
              className={errors.round ? 'error' : ''}
            />
            {errors.round && <span className="error-message">{errors.round}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="table">Table *</label>
            <input
              id="table"
              type="number"
              name="table"
              value={formData.table}
              onChange={handleChange}
              min="1"
              className={errors.table ? 'error' : ''}
            />
            {errors.table && <span className="error-message">{errors.table}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Create Match
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewMatchForm;
