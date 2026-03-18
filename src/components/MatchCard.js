import React, { useState } from 'react';
import '../styles/MatchCard.css';

const MatchCard = ({ match, onScoreUpdate, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localScores, setLocalScores] = useState({
    player1: match.player1_score || 0,
    player2: match.player2_score || 0,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'pending';
      case 'in_progress':
        return 'in-progress';
      case 'completed':
        return 'completed';
      default:
        return 'pending';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending';
      case 'in_progress':
        return '▶ In Progress';
      case 'completed':
        return '✓ Completed';
      default:
        return 'Unknown';
    }
  };

  const handleScoreChange = (player, value) => {
    const newValue = Math.max(0, parseInt(value) || 0);
    setLocalScores(prev => ({
      ...prev,
      [player]: newValue,
    }));
  };

  const handleSaveScores = () => {
    onScoreUpdate(match.id, localScores.player1, localScores.player2);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setLocalScores({
      player1: match.player1_score || 0,
      player2: match.player2_score || 0,
    });
    setIsEditing(false);
  };

  const incrementScore = (player) => {
    handleScoreChange(player, localScores[player] + 1);
  };

  const decrementScore = (player) => {
    handleScoreChange(player, Math.max(0, localScores[player] - 1));
  };

  const getWinner = () => {
    if (localScores.player1 > localScores.player2) {
      return 'player1';
    } else if (localScores.player2 > localScores.player1) {
      return 'player2';
    }
    return null;
  };

  const winner = getWinner();

  return (
    <div className={`match-card ${getStatusColor(match.status)}`}>
      {/* Status Badge */}
      <div className="status-badge">
        <span className={`status-indicator ${match.status}`}></span>
        {getStatusLabel(match.status)}
      </div>

      {/* Table Info */}
      <div className="table-info">
        Table {match.table}
      </div>

      {/* Match Content */}
      <div className="match-content">
        {!isEditing ? (
          <div className="display-mode">
            {/* Player 1 */}
            <div className={`player-section ${winner === 'player1' ? 'winner' : ''}`}>
              <div className="player-name">{match.player1}</div>
              <div className={`score ${winner === 'player1' ? 'winning-score' : ''}`}>
                {localScores.player1}
              </div>
            </div>

            {/* VS */}
            <div className="vs">VS</div>

            {/* Player 2 */}
            <div className={`player-section ${winner === 'player2' ? 'winner' : ''}`}>
              <div className={`score ${winner === 'player2' ? 'winning-score' : ''}`}>
                {localScores.player2}
              </div>
              <div className="player-name">{match.player2}</div>
            </div>
          </div>
        ) : (
          <div className="edit-mode">
            {/* Edit Player 1 */}
            <div className="player-edit">
              <div className="player-name">{match.player1}</div>
              <div className="score-controls">
                <button
                  className="score-btn minus"
                  onClick={() => decrementScore('player1')}
                  title="Decrease score"
                >
                  −
                </button>
                <input
                  type="number"
                  className="score-input"
                  value={localScores.player1}
                  onChange={(e) => handleScoreChange('player1', e.target.value)}
                  min="0"
                />
                <button
                  className="score-btn plus"
                  onClick={() => incrementScore('player1')}
                  title="Increase score"
                >
                  +
                </button>
              </div>
            </div>

            {/* Edit Player 2 */}
            <div className="player-edit">
              <div className="player-name">{match.player2}</div>
              <div className="score-controls">
                <button
                  className="score-btn minus"
                  onClick={() => decrementScore('player2')}
                  title="Decrease score"
                >
                  −
                </button>
                <input
                  type="number"
                  className="score-input"
                  value={localScores.player2}
                  onChange={(e) => handleScoreChange('player2', e.target.value)}
                  min="0"
                />
                <button
                  className="score-btn plus"
                  onClick={() => incrementScore('player2')}
                  title="Increase score"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="match-actions">
        {!isEditing ? (
          <>
            <button
              className="action-btn edit"
              onClick={() => setIsEditing(true)}
              title="Edit scores"
            >
              ✏️ Edit
            </button>
            {match.status !== 'completed' && (
              <button
                className="action-btn complete"
                onClick={() => onStatusUpdate(match.id, 'completed')}
                title="Mark as completed"
              >
                ✓ Complete
              </button>
            )}
            {match.status === 'pending' && (
              <button
                className="action-btn start"
                onClick={() => onStatusUpdate(match.id, 'in_progress')}
                title="Start match"
              >
                ▶ Start
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="action-btn save"
              onClick={handleSaveScores}
              title="Save changes"
            >
              ✓ Save
            </button>
            <button
              className="action-btn cancel"
              onClick={handleCancel}
              title="Discard changes"
            >
              ✕ Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
