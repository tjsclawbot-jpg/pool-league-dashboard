import React from 'react';
import MatchCard from './MatchCard';
import '../styles/MatchList.css';

const MatchList = ({ matches, loading, onScoreUpdate, onStatusUpdate }) => {
  if (loading) {
    return (
      <div className="match-list-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="match-list-container">
        <div className="empty-state">
          <p>No matches found</p>
          <p className="empty-sub">Create a new match to get started</p>
        </div>
      </div>
    );
  }

  // Group matches by round
  const groupedByRound = matches.reduce((acc, match) => {
    const round = match.round || 1;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {});

  const sortedRounds = Object.keys(groupedByRound)
    .map(Number)
    .sort((a, b) => b - a); // Newest first

  return (
    <div className="match-list-container">
      {sortedRounds.map(round => (
        <div key={round} className="round-section">
          <h3 className="round-title">Round {round}</h3>
          <div className="match-grid">
            {groupedByRound[round].map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onScoreUpdate={onScoreUpdate}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
