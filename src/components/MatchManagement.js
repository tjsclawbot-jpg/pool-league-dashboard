import React, { useState, useEffect } from 'react';
import NewMatchForm from './NewMatchForm';
import MatchList from './MatchList';
import '../styles/MatchManagement.css';

const MatchManagement = ({ tournament, onBack, apiUrl, socket }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch matches on component mount
  useEffect(() => {
    fetchMatches();
  }, [tournament.id]);

  // Socket.io event listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    socket.emit('join:tournament', tournament.id);

    const handleMatchCreated = (data) => {
      if (data.tournament_id === tournament.id) {
        setMatches(prev => [data, ...prev]);
      }
    };

    const handleMatchScoreUpdated = (data) => {
      if (data.tournament_id === tournament.id) {
        setMatches(prev =>
          prev.map(m => (m.id === data.id ? data : m))
        );
      }
    };

    const handleMatchStatusChanged = (data) => {
      if (data.tournament_id === tournament.id) {
        setMatches(prev =>
          prev.map(m => (m.id === data.id ? data : m))
        );
      }
    };

    socket.on('match:created', handleMatchCreated);
    socket.on('match:score-updated', handleMatchScoreUpdated);
    socket.on('match:status-changed', handleMatchStatusChanged);

    return () => {
      socket.off('match:created', handleMatchCreated);
      socket.off('match:score-updated', handleMatchScoreUpdated);
      socket.off('match:status-changed', handleMatchStatusChanged);
    };
  }, [socket, tournament.id]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiUrl}/api/tournaments/${tournament.id}/matches`
      );
      const data = await response.json();
      setMatches(data);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMatch = async (matchData) => {
    try {
      const response = await fetch(
        `${apiUrl}/api/tournaments/${tournament.id}/matches`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(matchData),
        }
      );
      const newMatch = await response.json();
      setMatches(prev => [newMatch, ...prev]);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  const handleScoreUpdate = async (matchId, player1Score, player2Score) => {
    try {
      const response = await fetch(`${apiUrl}/api/matches/${matchId}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          player1_score: player1Score,
          player2_score: player2Score,
        }),
      });
      const updatedMatch = await response.json();
      setMatches(prev =>
        prev.map(m => (m.id === matchId ? updatedMatch : m))
      );
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleStatusUpdate = async (matchId, status) => {
    try {
      const response = await fetch(`${apiUrl}/api/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const updatedMatch = await response.json();
      setMatches(prev =>
        prev.map(m => (m.id === matchId ? updatedMatch : m))
      );
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    return match.status === filter;
  });

  return (
    <div className="match-management">
      <div className="tournament-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Tournaments
        </button>
        <div>
          <h2>{tournament.name}</h2>
          <p className="tournament-info">
            Type: <strong>{tournament.type}</strong> • Players: <strong>{tournament.players?.length || 0}</strong>
          </p>
        </div>
      </div>

      <div className="controls">
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Matches</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <button
          className="create-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Create Match'}
        </button>
      </div>

      {showForm && (
        <NewMatchForm
          onSubmit={handleCreateMatch}
          onCancel={() => setShowForm(false)}
          tournamentPlayers={tournament.players || []}
        />
      )}

      <MatchList
        matches={filteredMatches}
        loading={loading}
        onScoreUpdate={handleScoreUpdate}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};

export default MatchManagement;
