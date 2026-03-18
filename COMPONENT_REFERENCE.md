# Component Reference Guide

## Component Hierarchy

```
App (root)
├── Header
├── TournamentList
│   ├── NewTournamentForm
│   └── TournamentCard[] (clickable)
│
└── MatchManagement (after tournament selected)
    ├── Tournament Header
    ├── Controls (Filter + Create buttons)
    ├── NewMatchForm (conditional)
    └── MatchList
        └── Round[] (grouped)
            └── MatchCard[]
                ├── Status Badge
                ├── Table Info
                ├── Display Mode
                │   ├── Player 1 + Score
                │   ├── VS
                │   └── Player 2 + Score
                ├── Edit Mode
                │   ├── Player 1 Score Controls
                │   └── Player 2 Score Controls
                └── Action Buttons
```

## Component Details

### 1. App.js
**Purpose**: Main application component, manages global state and WebSocket

**Props**: None

**State**:
- `tournaments`: Array of tournament objects
- `selectedTournament`: Currently selected tournament
- `apiStatus`: Connection status ('connected'|'disconnected')
- `socket`: Socket.io instance

**Key Functions**:
- `useEffect`: Initialize Socket.io connection
- `useEffect`: Fetch tournaments on mount
- Socket event handlers for real-time updates

**Renders**: Header + TournamentList OR MatchManagement

---

### 2. TournamentList.js
**Purpose**: Display list of tournaments and allow selection

**Props**:
- `tournaments`: Array of tournament objects
- `onSelect`: Callback when tournament is selected
- `apiUrl`: Base API URL
- `socket`: Socket.io instance

**State**:
- `showForm`: Boolean to show/hide new tournament form

**Key Functions**:
- `handleCreateTournament`: POST to API and navigate to match management

**Renders**: List of tournament cards or empty state

---

### 3. NewTournamentForm.js
**Purpose**: Form to create new tournament

**Props**:
- `onSubmit`: Callback with tournament data
- `onCancel`: Callback to close form

**State**:
- `formData`: { name, type, players }
- `errors`: Field validation errors

**Key Functions**:
- `validate`: Check all fields are valid
- `handleSubmit`: Parse and submit tournament data

**Renders**: Form with name, type dropdown, player textarea

---

### 4. MatchManagement.js
**Purpose**: Main container for managing matches in selected tournament

**Props**:
- `tournament`: Selected tournament object
- `onBack`: Callback to return to tournament list
- `apiUrl`: Base API URL
- `socket`: Socket.io instance

**State**:
- `matches`: Array of match objects
- `loading`: Boolean loading state
- `showForm`: Boolean to show/hide new match form
- `filter`: Current status filter

**Key Functions**:
- `fetchMatches`: GET matches from API
- `handleCreateMatch`: POST new match to API
- `handleScoreUpdate`: PUT match scores to API
- `handleStatusUpdate`: PUT match status to API
- Socket event listeners for real-time updates

**Socket Events**:
- `match:created`: New match created
- `match:score-updated`: Score changed
- `match:status-changed`: Status changed

**Renders**: Header + Controls + Form + MatchList

---

### 5. NewMatchForm.js
**Purpose**: Form to create new match in tournament

**Props**:
- `onSubmit`: Callback with match data
- `onCancel`: Callback to close form
- `tournamentPlayers`: Array of player names (optional)

**State**:
- `formData`: { player1, player2, round, table }
- `errors`: Field validation errors

**Key Functions**:
- `validate`: Check players are different, round/table >= 1
- `handleSubmit`: Validate and submit match data
- `handleChange`: Update form field and clear errors

**Renders**: Form with 4 input fields + actions

---

### 6. MatchList.js
**Purpose**: Display matches grouped by round with filtering

**Props**:
- `matches`: Array of match objects
- `loading`: Boolean loading state
- `onScoreUpdate`: Callback (matchId, p1Score, p2Score)
- `onStatusUpdate`: Callback (matchId, status)

**Key Functions**:
- Groups matches by round number
- Sorts rounds in descending order (newest first)

**Renders**: 
- Loading spinner if loading
- Empty state if no matches
- Matches grouped by round sections

---

### 7. MatchCard.js
**Purpose**: Display individual match with score controls

**Props**:
- `match`: Match object { id, player1, player2, player1_score, player2_score, round, table, status }
- `onScoreUpdate`: Callback (matchId, p1Score, p2Score)
- `onStatusUpdate`: Callback (matchId, status)

**State**:
- `isEditing`: Boolean edit mode
- `localScores`: { player1, player2 } local score state

**Key Functions**:
- `getWinner`: Determine which player has higher score
- `handleScoreChange`: Update local score state
- `handleSaveScores`: Call onScoreUpdate and exit edit mode
- `incrementScore`/`decrementScore`: Adjust scores with buttons

**UI States**:
1. **Display Mode** (default):
   - Shows player names and scores
   - Edit, Start, Complete buttons
   - Winner highlighting
   
2. **Edit Mode**:
   - +/- score buttons
   - Direct input fields
   - Save/Cancel buttons

**Status Colors**:
- Pending: Orange (#f59e0b)
- In Progress: Blue (#3b82f6) with pulse
- Completed: Green (#10b981)

**Renders**: Status badge + Table + Content + Actions

---

## CSS Files Organization

| File | Size | Purpose |
|------|------|---------|
| `styles/index.css` | 444B | Global styles |
| `styles/App.css` | 1.7KB | App layout & header |
| `styles/MatchManagement.css` | 2.2KB | Controls & filters |
| `styles/MatchList.css` | 1.6KB | List layout & loading |
| `styles/MatchCard.css` | 4.9KB | Card styles & animations |
| `styles/NewMatchForm.css` | 2.0KB | Form styling |
| `styles/TournamentList.css` | 3.8KB | Tournament grid |
| `styles/NewTournamentForm.css` | 2.2KB | Tournament form |

## State Flow

### Tournament Selection
```
TournamentList
  ↓ click card
App.setSelectedTournament()
  ↓
MatchManagement renders
```

### Match Creation
```
NewMatchForm
  ↓ submit
MatchManagement.handleCreateMatch()
  ↓
API: POST /api/tournaments/:id/matches
  ↓
Socket: match:created event
  ↓
MatchManagement.setMatches() updates
  ↓
MatchList re-renders with new match
```

### Score Update
```
MatchCard (edit mode)
  ↓ click Save
MatchManagement.handleScoreUpdate()
  ↓
API: PUT /api/matches/:id/score
  ↓
Socket: match:score-updated event
  ↓
MatchManagement.setMatches() updates all clients
  ↓
All MatchCard components re-render
```

### Real-time Sync
```
Client A: Updates score
  ↓
API receives PUT request
  ↓
API emits Socket event
  ↓
All connected clients receive event
  ↓
Client B, C, D: auto-update UI
```

## Props Interface

### Match Object
```javascript
{
  id: string,
  tournament_id: string,
  player1: string,
  player2: string,
  player1_score: number,
  player2_score: number,
  round: number,
  table: number,
  status: 'pending' | 'in_progress' | 'completed',
  created_at: ISO string,
  updated_at: ISO string
}
```

### Tournament Object
```javascript
{
  id: string,
  name: string,
  type: 'singles' | 'doubles' | 'league',
  players: string[],
  status: 'active' | 'completed',
  start_time: ISO string,
  created_at: ISO string,
  updated_at: ISO string
}
```

## Event Callbacks

### MatchManagement Callbacks
```javascript
onScoreUpdate(matchId: string, player1Score: number, player2Score: number)
onStatusUpdate(matchId: string, status: 'pending' | 'in_progress' | 'completed')
```

### Form Callbacks
```javascript
NewMatchForm.onSubmit({ player1, player2, round, table })
NewTournamentForm.onSubmit({ name, type, players[], start_time })
```

## Styling Classes

### Match Card
- `.match-card` - Base card
- `.match-card.pending` - Orange border
- `.match-card.in-progress` - Blue border with animation
- `.match-card.completed` - Green border
- `.display-mode` - Score display
- `.edit-mode` - Score editing
- `.score-controls` - +/- buttons area
- `.action-btn` - Action buttons

### Forms
- `.new-match-form-container` - Form wrapper
- `.form-group` - Individual form field
- `.error` - Error state on input
- `.error-message` - Error text

### Animations
- `@keyframes pulse` - Indicator pulse
- `@keyframes spin` - Loading spinner
- `@keyframes slideDown` - Form slide in
- `@keyframes shine` - Border shine effect

## Common Patterns

### Fetching Data
```javascript
const [data, setData] = useState([]);
useEffect(() => {
  const fetch = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/...`);
      setData(await res.json());
    } catch (err) {
      console.error('Error:', err);
    }
  };
  fetch();
}, []);
```

### Handling Socket Events
```javascript
useEffect(() => {
  if (!socket) return;
  
  socket.on('event:name', (data) => {
    setMatches(prev => [...prev, data]);
  });
  
  return () => socket.off('event:name');
}, [socket]);
```

### Form Validation
```javascript
const validate = () => {
  const errors = {};
  if (!field) errors.field = 'Required';
  setErrors(errors);
  return Object.keys(errors).length === 0;
};
```

---

## Quick Start for Developers

1. **Add new component**: Create file in `src/components/`
2. **Add styles**: Create corresponding CSS in `src/styles/`
3. **Import styles**: `import '../styles/ComponentName.css'`
4. **Use props**: Pass data from parent via props
5. **Handle events**: Use callbacks passed via props
6. **Build & test**: `npm run build && npm run start`

---

Generated: March 17, 2026
