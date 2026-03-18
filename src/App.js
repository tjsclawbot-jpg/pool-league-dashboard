import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MatchManagement from './components/MatchManagement';
import TournamentList from './components/TournamentList';
import './styles/App.css';

const App = () => {
  const [tournaments, setTournaments] = useState([]);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [apiStatus, setApiStatus] = useState('disconnected');
  const [socket, setSocket] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://pool-league-api-production.up.railway.app';

  useEffect(() => {
    // Initialize Socket.io connection (with timeout to prevent blocking)
    const newSocket = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 3,
      timeout: 3000, // 3 second timeout
      transports: ['websocket', 'polling'], // Fallback to polling if WebSocket fails
    });

    newSocket.on('connect', () => {
      console.log('🔌 Socket connected:', newSocket.id);
      setApiStatus('connected');
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setApiStatus('disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.log('⚠️ Socket connection error (will use HTTP polling):', error);
      setApiStatus('connected'); // Still allow display with HTTP polling
    });

    newSocket.on('tournament:created', (data) => {
      setTournaments(prev => [data, ...prev]);
    });

    newSocket.on('tournament:updated', (data) => {
      setTournaments(prev =>
        prev.map(t => (t.id === data.id ? data : t))
      );
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [API_URL]);

  // Fetch tournaments on mount
  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        const response = await fetch(`${API_URL}/api/tournaments`);
        const data = await response.json();
        setTournaments(data);
        setApiStatus('connected');
      } catch (error) {
        console.error('Error fetching tournaments:', error);
        setApiStatus('disconnected');
      }
    };

    fetchTournaments();
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
            socket={socket}
          />
        ) : (
          <MatchManagement
            tournament={selectedTournament}
            onBack={() => setSelectedTournament(null)}
            apiUrl={API_URL}
            socket={socket}
          />
        )}
      </main>
    </div>
  );
};

export default App;
