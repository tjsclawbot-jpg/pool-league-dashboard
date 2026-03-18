const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist directory (built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'), (err) => {
    if (err) {
      res.status(500).json({
        error: 'Failed to serve index.html',
        message: err.message,
      });
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`✅ Dashboard running on http://localhost:${PORT}`);
  console.log(`📦 Serving React app from dist/`);
  console.log(`🔗 API: ${process.env.REACT_APP_API_URL || 'https://pool-league-api-production.up.railway.app'}`);
});
