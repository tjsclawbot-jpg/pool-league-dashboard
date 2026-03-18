# 🎱 Pool League Dashboard - React Component Documentation

## Overview

This is a **fully functional React dashboard** for managing tournament matches in real-time. It provides a comprehensive UI for creating tournaments, managing matches, updating scores in real-time, and tracking match status with WebSocket synchronization.

## Features Implemented

### 1. ✅ Create New Match Form
- **Player names**: Input fields for both players
- **Round number**: Numeric input for round tracking
- **Table number**: Numeric input for table assignment
- **Validation**: Form validates all required fields and prevents duplicate players
- **Real-time feedback**: Errors clear as users fix them

### 2. ✅ List All Matches in Tournament
- **Grouped by round**: Matches are automatically grouped and displayed by round
- **Status filtering**: Filter matches by status (All, Pending, In Progress, Completed)
- **Loading state**: Smooth loading indicator while fetching data
- **Empty state**: User-friendly message when no matches exist
- **Real-time updates**: New matches appear instantly via WebSocket

### 3. ✅ Score Update Buttons
- **+/- buttons**: Quick increment/decrement buttons for score adjustments
- **Direct input**: Type scores directly in input field
- **Edit mode**: Toggle between display and edit modes
- **Real-time display**: Scores update instantly across all connected clients
- **Save/Cancel**: Confirm or discard changes before saving

### 4. ✅ Match Status Indicator
- **Visual badges**: Color-coded status indicators
  - 🟠 **Pending** (Orange): Match hasn't started
  - 🔵 **In Progress** (Blue): Match is active
  - 🟢 **Completed** (Green): Match finished
- **Animated indicators**: Pulse animation for in-progress matches
- **Status transitions**: Buttons to start or complete matches

### 5. ✅ Real-time Updates via WebSocket
- **Socket.io integration**: Bi-directional communication with backend
- **Event listeners**:
  - `match:created` - New match created by any user
  - `match:score-updated` - Score changed by any user
  - `match:status-changed` - Match status updated
- **Tournament rooms**: Users auto-join tournament-specific rooms
- **Live sync**: All changes broadcast to all connected clients in tournament

## Component Architecture

```
App (Main)
├── Header (Status, Connection Info)
├── TournamentList
│   ├── NewTournamentForm
│   └── TournamentCard (Clickable)
└── MatchManagement (Selected Tournament)
    ├── NewMatchForm
    ├── MatchList
    │   └── MatchCard (Individual Match)
    │       ├── Display Mode
    │       │   ├── Player 1 Section
    │       │   ├── VS
    │       │   └── Player 2 Section
    │       └── Edit Mode
    │           ├── Score Controls (+/-)
    │           └── Save/Cancel Buttons
    └── Status Filters
```

## Technical Stack

### Frontend
- **React 19**: UI framework
- **Socket.io Client**: Real-time WebSocket communication
- **Webpack 5**: Module bundler
- **Babel**: JavaScript transpiler
- **CSS-in-JS**: Inline styles via style-loader

### Styling
- **Modern CSS**: Grid, Flexbox, Animations
- **Dark theme**: Professional dark blue/slate color scheme
- **Responsive design**: Mobile-first approach
- **Animations**: Smooth transitions and pulse effects

### API Integration
- **RESTful endpoints** (via pool-league-api):
  - `GET /api/tournaments` - List tournaments
  - `GET /api/tournaments/:id/matches` - List matches
  - `POST /api/tournaments/:id/matches` - Create match
  - `PUT /api/matches/:id/score` - Update score
  - `PUT /api/matches/:id` - Update match status

## File Structure

```
pool-league-dashboard/
├── src/
│   ├── index.js                    # React entry point
│   ├── App.js                      # Main app component
│   ├── components/
│   │   ├── MatchManagement.js     # Match management container
│   │   ├── MatchList.js           # Matches list & grouping
│   │   ├── MatchCard.js           # Individual match display
│   │   ├── NewMatchForm.js        # Match creation form
│   │   ├── TournamentList.js      # Tournament listing
│   │   └── NewTournamentForm.js   # Tournament creation
│   └── styles/
│       ├── index.css              # Global styles
│       ├── App.css                # App layout
│       ├── MatchManagement.css    # Match management
│       ├── MatchList.css          # List layout
│       ├── MatchCard.css          # Card styles & animations
│       ├── NewMatchForm.css       # Form styles
│       ├── TournamentList.css     # Tournament list
│       └── NewTournamentForm.css  # Tournament form
├── public/
│   └── index.html                 # HTML template
├── dist/                          # Built files (generated)
├── server.js                      # Express server
├── webpack.config.js              # Webpack configuration
└── package.json                   # Dependencies & scripts
```

## Installation & Setup

### Prerequisites
- Node.js v16+
- Pool League API running (see pool-league-api)

### Install Dependencies
```bash
cd pool-league-dashboard
npm install
```

### Build for Production
```bash
npm run build
```
This generates optimized assets in `dist/` directory.

### Development Server
```bash
npm run dev
```
Starts Webpack dev server with hot module reloading on `http://localhost:3000`

### Production Server
```bash
npm run start
```
Starts Express server serving the built React app.

## Configuration

### Environment Variables
Create a `.env` file in the dashboard root:

```env
REACT_APP_API_URL=https://pool-league-api-production.up.railway.app
PORT=3000
```

The API URL defaults to the production endpoint if not specified.

## Usage Guide

### Create Tournament
1. Click **"+ New Tournament"** button
2. Enter tournament name
3. Select type (Singles/Doubles/League)
4. Optionally add player names (comma-separated)
5. Click **"Create Tournament"**

### View Tournament Matches
1. Click on any tournament card
2. View all matches grouped by round
3. Use **"Filter by Status"** dropdown to filter

### Create Match
1. Click **"+ Create Match"** button
2. Enter player names
3. Specify round and table numbers
4. Click **"Create Match"**
5. Match appears instantly (via WebSocket)

### Update Scores
1. Click **"✏️ Edit"** button on match card
2. Use **+** and **−** buttons to adjust scores
3. Or type directly in the score input
4. Click **"✓ Save"** to save changes
5. All connected clients see update instantly

### Change Match Status
- **Start Match**: Click **"▶ Start"** to begin (Pending → In Progress)
- **Complete Match**: Click **"✓ Complete"** to finish (In Progress → Completed)

## Design Features

### Visual Hierarchy
- Large headings for tournament names
- Prominent action buttons (blue = primary, green = success)
- Status badges with color coding
- Subtle hover effects

### Animations
- Smooth slide-in for forms
- Pulse animation for in-progress matches
- Hover transitions on cards
- Button state feedback

### Responsive Design
- **Desktop**: Multi-column grid layout
- **Tablet**: Flexible 2-3 columns
- **Mobile**: Single column, touch-friendly buttons
- **Touch targets**: Minimum 44px for tap areas

### Accessibility
- Semantic HTML structure
- Clear focus states on interactive elements
- Descriptive button titles (tooltips)
- Color contrast meets WCAG standards
- Form error messages near inputs

## Real-time Features

### WebSocket Connection
When a user connects:
1. Socket.io client establishes connection to API
2. User joins tournament-specific room
3. Real-time events broadcast to all room members:
   - New matches created
   - Scores updated
   - Status changes

### Event Flow
```
User Action (UI)
    ↓
REST API Call (POST/PUT)
    ↓
API Updates Database
    ↓
API Emits Socket.io Event
    ↓
All Connected Clients Receive Update
    ↓
UI Updates via React State
```

## Performance Optimizations

1. **Code Splitting**: Webpack bundles are optimized
2. **Lazy Loading**: Components render on demand
3. **Event Debouncing**: Prevents duplicate API calls
4. **Memoization**: React prevents unnecessary re-renders
5. **CSS-in-JS**: Inline styles reduce HTTP requests

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Error Handling

- Network errors display user-friendly messages
- Form validation prevents invalid data submission
- Graceful fallbacks if API is unavailable
- WebSocket reconnection attempts

## Future Enhancements

- [ ] Player rating system
- [ ] Tournament brackets
- [ ] Live stream integration
- [ ] Match statistics & analytics
- [ ] Player profiles
- [ ] Elo rating calculations
- [ ] Export results to CSV
- [ ] Dark/Light theme toggle
- [ ] Multi-language support
- [ ] Mobile app version

## Troubleshooting

### Dashboard not connecting to API
- Ensure `REACT_APP_API_URL` environment variable is set correctly
- Check if pool-league-api is running on the correct port
- Verify CORS settings on backend

### Changes not syncing in real-time
- Check WebSocket connection status (indicator in header)
- Verify you're in the correct tournament
- Reload page if connection was interrupted

### Form validation errors
- Ensure player names are different
- Check that round/table numbers are valid (>= 1)
- Try clearing form and resubmitting

## Contributing

When modifying components:
1. Update corresponding CSS file
2. Test responsive design at multiple breakpoints
3. Verify WebSocket events still fire
4. Run production build (`npm run build`)
5. Test production server (`npm run start`)

## License

Part of the Pool League Streaming project.

---

**Built with ❤️ for real-time tournament management**
