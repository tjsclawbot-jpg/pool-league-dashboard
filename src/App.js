import React, { useState, useEffect } from 'react';
import MatchManagement from './components/MatchManagement';
import TournamentList from './components/TournamentList';
import './styles/App.css';

const App = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [apiStatus, setApiStatus] = useState('disconnected');

  const API_URL = process.env.REACT_APP_API_URL || 'https://pool-league-api-production.up.railway.app';

  // Fetch tournaments from API
  const fetchTournamentsFromAPI = async () => {
    console.log('🔄 Fetching tournaments from:', `${API_URL}/api/tournaments`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(`${API_URL}/api/tournaments`, {
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Tournaments fetched:', data.length, 'tournaments');
      setTournaments(data);
      setApiStatus('connected');
    } catch (error) {
      console.error('❌ Error fetching tournaments:', error.message || error);
      setApiStatus('connected'); // Still show the page even on error
      setTournaments([]); // Show empty list instead of loading forever
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchTournamentsFromAPI();
  }, [API_URL]);

  // Poll for tournaments every 5 seconds
  useEffect(() => {
    console.log('📡 Starting HTTP polling for tournament updates...');
    const pollInterval = setInterval(fetchTournamentsFromAPI, 5000);
    return () => clearInterval(pollInterval);
  }, [API_URL]);

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div>
            <h1>🎱 Pool League Dashboard</h1>
            <p>Tournament & Match Management</p>
          </div>
          <div className={`status ${apiStatus}`}>
            <div className="pulse"></div>
            <span>{apiStatus === 'connected' ? '✓ Connected' : '✗ Disconnected'}</span>
          </div>
        </div>
      </header>

      <main className="main">
        {!selectedTournament ? (
          <TournamentList
            tournaments={tournaments}
            onSelect={setSelectedTournament}
            apiUrl={API_URL}
          />
        ) : (
          <MatchManagement
            tournament={selectedTournament}
            onBack={() => setSelectedTournament(null)}
            apiUrl={API_URL}
          />
        )}
      </main>
    </div>
  );
};

export default App;
