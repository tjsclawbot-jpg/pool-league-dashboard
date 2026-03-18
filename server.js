const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve dashboard
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pool League Streaming Dashboard</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #fff;
          min-height: 100vh;
        }
        header {
          border-bottom: 1px solid #334155;
          background: rgba(30, 41, 59, 0.5);
          padding: 24px;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .header-content h1 {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .header-content p {
          font-size: 12px;
          color: #94a3b8;
        }
        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 14px;
          border: 1px solid #334155;
        }
        .status.connected {
          background: rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.3);
          color: #10b981;
        }
        .status.disconnected {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }
        .pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        .status.connected .pulse { background: #10b981; }
        .status.disconnected .pulse { background: #ef4444; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 24px;
        }
        h2 {
          font-size: 20px;
          margin-bottom: 24px;
          font-weight: bold;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .card {
          background: #1e293b;
          border: 1px solid #334155;
          border-radius: 8px;
          padding: 16px;
        }
        .card h3 {
          font-size: 16px;
          margin-bottom: 8px;
        }
        .card p {
          font-size: 14px;
          color: #94a3b8;
          margin: 4px 0;
        }
        .empty {
          text-align: center;
          padding: 40px;
          color: #64748b;
          border: 1px solid #334155;
          border-radius: 8px;
          background: #1e293b;
        }
        .loading {
          text-align: center;
          padding: 40px;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <header>
        <div class="header-content">
          <div>
            <h1>🎱 Pool League Streaming</h1>
            <p>Tournament Management Dashboard</p>
          </div>
          <div id="status" class="status disconnected">
            <div class="pulse"></div>
            <span id="status-text">Connecting...</span>
          </div>
        </div>
      </header>

      <main>
        <h2>Tournaments</h2>
        <div id="content" class="loading">Loading tournaments...</div>
      </main>

      <script>
        const API_URL = 'https://pool-league-api-production.up.railway.app';

        async function loadTournaments() {
          try {
            const response = await fetch(\`\${API_URL}/api/tournaments\`);
            const tournaments = await response.json();

            // Update status
            const statusEl = document.getElementById('status');
            const statusText = document.getElementById('status-text');
            statusEl.className = 'status connected';
            statusText.textContent = '✓ API Connected';

            // Render tournaments
            const content = document.getElementById('content');
            if (tournaments.length === 0) {
              content.className = 'empty';
              content.innerHTML = '<p>No tournaments yet. Ready to create one!</p>';
            } else {
              content.className = 'grid';
              content.innerHTML = tournaments.map(t => \`
                <div class="card">
                  <h3>\${t.name}</h3>
                  <p>Type: \${t.type}</p>
                  <p>Status: \${t.status}</p>
                  <p>Players: \${t.players?.length || 0}</p>
                </div>
              \`).join('');
            }
          } catch (error) {
            console.error('Error:', error);
            const statusEl = document.getElementById('status');
            const statusText = document.getElementById('status-text');
            statusEl.className = 'status disconnected';
            statusText.textContent = '✗ API Error';

            const content = document.getElementById('content');
            content.className = 'empty';
            content.innerHTML = '<p>Error connecting to API. Make sure the server is running.</p>';
          }
        }

        loadTournaments();
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard running on port ${PORT}`);
});
