import React, { useState } from 'react';
import NewTournamentForm from './NewTournamentForm';
import '../styles/TournamentList.css';

const TournamentList = ({ tournaments, onSelect, apiUrl, socket }) => {
  const [showForm, setShowForm] = useState(false);

  const handleCreateTournament = async (tournamentData) => {
    try {
      const response = await fetch(`${apiUrl}/api/tournaments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tournamentData),
      });
      const newTournament = await response.json();
      onSelect(newTournament);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating tournament:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'active';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  return (
    <div className="tournament-list">
      <div className="list-header">
        <h2>Tournaments</h2>
        <button
          className="create-tournament-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ New Tournament'}
        </button>
      </div>

      {showForm && (
        <NewTournamentForm
          onSubmit={handleCreateTournament}
          onCancel={() => setShowForm(false)}
        />
      )}

      {tournaments.length === 0 ? (
        <div className="empty-state">
          <p>No tournaments yet</p>
          <p className="empty-sub">Create one to get started</p>
        </div>
      ) : (
        <div className="tournament-grid">
          {tournaments.map(tournament => (
            <div
              key={tournament.id}
              className={`tournament-card ${getStatusColor(tournament.status)}`}
              onClick={() => onSelect(tournament)}
            >
              <div className="tournament-header">
                <h3>{tournament.name}</h3>
                <span className={`status-badge ${tournament.status}`}>
                  {tournament.status === 'active' ? '🔴 Active' : '✓ Completed'}
                </span>
              </div>

              <div className="tournament-info">
                <div className="info-item">
                  <span className="label">Type:</span>
                  <span className="value">{tournament.type}</span>
                </div>
                <div className="info-item">
                  <span className="label">Players:</span>
                  <span className="value">{tournament.players?.length || 0}</span>
                </div>
                <div className="info-item">
                  <span className="label">Started:</span>
                  <span className="value">
                    {new Date(tournament.start_time).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="card-footer">
                <span className="click-hint">Click to manage matches →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TournamentList;
