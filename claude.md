# Project Context

## Repository
This is a Where's Waldo photo tagging game following The Odin Project specifications.
Location: `/Users/alex/repos/where-is-waldo`

## Project Status: Phase 7 Complete ✅

### Completed Phases

- ✅ **Phase 1**: Project Setup & Architecture
- ✅ **Phase 2**: Frontend UI Components
- ✅ **Phase 3**: Database Schema & Backend API
- ✅ **Phase 4**: Image Click Detection & Coordinate Normalization
- ✅ **Phase 5**: Backend Integration & Validation
- ✅ **Phase 6**: Game State Management
- ✅ **Phase 7**: Timer & Scoring System

### Current Phase

- 🔄 **Phase 8**: Polish & UX Improvements (Next)

### Remaining Phases

- Phase 9: Testing & Quality Assurance
- Phase 10: Deployment

## MCP Server Setup - Completed

We have successfully configured an MCP (Model Context Protocol) server to provide access to The Odin Project React curriculum content.

### What Was Done

1. **Installed uv/uvx tool**
   - Installed via: `curl -LsSf https://astral.sh/uv/install.sh | sh`
   - Location: `/Users/alex/.local/bin/uvx`
   - Purpose: Required to run the official Anthropic MCP server

2. **Added mcp-server-fetch MCP Server**
   - Command used: `claude mcp add --transport stdio fetch -- /Users/alex/.local/bin/uvx mcp-server-fetch`
   - Status: ✓ Connected and verified
   - Configuration saved to: `/Users/alex/.claude.json`

3. **Verification**
   - Ran `claude mcp list` and confirmed the fetch server is connected
   - The server will be available after restarting the Claude Code session

### Next Steps

**IMPORTANT**: The MCP server tools will only be available after restarting the Claude Code session.

Once restarted, Claude will have access to the `mcp__fetch` tool which can:
- Fetch content from The Odin Project React curriculum website
- Convert HTML content to markdown for easier reading
- Access any web-based React learning materials

### Purpose

This setup allows Claude to access and reference The Odin Project's React curriculum content directly during our conversations, making it easier to:
- Answer questions about React concepts from the curriculum
- Reference specific lessons or sections
- Help with exercises and projects from The Odin Project

### System Information

- Platform: macOS (Darwin 24.6.0)
- Node.js: Available (npx found at `/Users/alex/.nvm/versions/node/v22.14.0/bin/npx`)
- Python: Available (v3.12)
- Git: Repository initialized

## Phase 5 Summary: Backend Integration & Validation

### What Was Built

**Core Functionality:**

- Full end-to-end integration between React frontend and FastAPI backend
- Character validation system working with normalized coordinates (0-1 range)
- Successfully tested with 3 characters (all can be found and validated)

**Test Infrastructure:**

- Created test image generator (`backend/create_test_image.py`)
- Test image with known character positions (red square, blue circle, green triangle)
- Database reset script for test data (`backend/reset_with_test_image.py`)
- Static file serving for images via FastAPI

**Key Technical Achievements:**

- Coordinate normalization working correctly across different screen sizes
- Backend validation logic correctly matching click coordinates to character bounding boxes
- Character found state tracked in frontend
- Visual feedback for successful/failed selections
- Already-found characters disabled in targeting menu

### Current Architecture

**Frontend Stack:**

- React 18 with Vite
- Component structure: App → GameBoard → TargetingBox
- State management via useState/useEffect hooks
- PicoCSS for styling

**Backend Stack:**

- FastAPI with SQLAlchemy ORM
- SQLite database
- CORS configured for local development
- Static file serving for images

**Database Schema:**

- `game_images`: Stores game image metadata
- `characters`: Character locations with normalized coordinates
- `game_sessions`: Track individual game sessions (ready for Phase 7)
- `high_scores`: Leaderboard data (ready for Phase 7)

### API Endpoints Implemented

- `GET /game-image`: Fetch game image and character list
- `POST /validate`: Validate character selection coordinates
- `POST /start-game`: Start game session (for Phase 7)
- `POST /end-game`: End game session and calculate time (for Phase 7)
- `GET /high-scores`: Get leaderboard (for Phase 7)
- `POST /high-scores`: Submit score (for Phase 7)

### Test Image Details

**Generated Test Image:**

- Dimensions: 1920x1280 pixels
- Background: Light beige (#f0e6d2)
- Decorative elements: 30 random colored circles

**Character Locations (normalized):**

1. **Waldo** (Red Square): x=[0.1562, 0.2083], y=[0.1953, 0.2734]
2. **Wizard** (Blue Circle): x=[0.4427, 0.4948], y=[0.4297, 0.5078]
3. **Odlaw** (Green Triangle): x=[0.7812, 0.8333], y=[0.7422, 0.8203]

## Phase 6 Summary: Game State Management

### What Was Built

**Core Game State Features:**

- Game completion detection - automatically detects when all characters are found
- Visual markers system - green checkmark circles appear on found characters
- Game progress tracker - displays "Progress: X / Y" counter
- Game completion screen - celebratory message with "Play Again" button
- New Game functionality - resets all game state for a fresh start

**Key Technical Implementations:**

1. **Completion Detection**
   - Added `useEffect` hook that monitors `foundCharacters` array
   - Triggers `gameComplete` state when all characters are found

2. **Visual Markers**
   - Character markers stored with normalized coordinates (x, y)
   - Markers rendered as green circles with checkmarks on the game image
   - Coordinates converted from normalized (0-1) to pixel positions dynamically
   - Markers scale correctly with image resizing

3. **Game Progress Display**
   - Progress counter: "Progress: X / Y"
   - Character list with strikethrough for found characters
   - Visual feedback with checkmarks

4. **Completion Screen**
   - Conditional rendering based on `gameComplete` state
   - Congratulatory message showing total characters found
   - "Play Again" button to reset game

5. **New Game System**
   - `handleNewGame` function resets all state:
     - Clears `foundCharacters` array
     - Clears `characterMarkers` array
     - Sets `gameComplete` to false
     - Clears any feedback messages

### Updated Components

**App.jsx Changes:**
- Added `gameComplete` and `characterMarkers` state
- Added game completion detection useEffect
- Enhanced `handleCharacterSelect` to create visual markers
- Added `handleNewGame` reset function
- Added completion screen UI with conditional rendering
- Added progress tracker display

**GameBoard.jsx Changes:**
- Added `characterMarkers` prop
- Renders visual markers at normalized coordinates
- Markers update dynamically as characters are found
- Updated PropTypes for new markers prop

### User Experience Flow

1. Player clicks on image and selects character
2. If correct, green checkmark marker appears at click location
3. Progress counter updates: "Progress: 1 / 3"
4. Character name gets strikethrough in the list
5. When all characters found, completion screen appears
6. Player clicks "Play Again" to reset and start over

### Technical Notes

- Markers use normalized coordinates for consistent positioning across screen sizes
- All state managed in App.jsx for centralized game state
- PropTypes updated for type safety
- Visual markers have `pointerEvents: 'none'` to avoid interfering with clicks
- Game completion check includes `foundCharacters.length > 0` to avoid false positive on initial load

## Phase 7 Summary: Timer & Scoring System

### What Was Built

**Core Timer Features:**

- Game timer that starts on first character click
- Real-time elapsed time display (updates every 100ms)
- Automatic timer stop when game completes
- Final time recording and display

**High Score System:**

- High score submission form with player name input
- Integration with backend `/high-scores` API
- Leaderboard display with top scores
- Score submission with skip option

**New Components Created:**

1. **HighScoreForm** - Form component for score submission
   - Player name input field (max 50 characters)
   - Time display in MM:SS.ss format
   - Submit and Skip buttons
   - Loading state during submission

2. **Leaderboard** - Displays top scores
   - Fetches scores from backend API
   - Shows rank, player name, time, and date
   - Medal emojis for top 3 (🥇🥈🥉)
   - Responsive table layout
   - Auto-refreshes after score submission

### Technical Implementation

**Timer State Management:**

- `startTime`: Timestamp when timer starts (Date.now())
- `elapsedTime`: Current elapsed time in seconds
- `finalTime`: Final completion time in seconds
- Timer updates every 100ms using setInterval
- Cleanup on component unmount

**Time Formatting:**

- Helper function `formatTime(seconds)` converts to MM:SS.ss
- Used consistently across all time displays
- Minutes, seconds, and centiseconds displayed

**Score Submission Flow:**

1. Game completes → `showHighScoreForm` set to true
2. User enters name → form submits to `/high-scores` POST
3. Backend saves score → returns success
4. Leaderboard refreshes → shows updated scores
5. Form closes → shows completion message

**API Integration:**

- `POST /high-scores` - Submit new score
  - Payload: `{ player_name, time, image_id }`
- `GET /high-scores` - Fetch leaderboard
  - Returns array of scores sorted by time (fastest first)

### UI Updates

**During Gameplay:**

- Progress bar shows: "Progress: X / Y"
- Timer shows in top-right: "Time: MM:SS.ss"
- Timer only visible after first click

**On Completion:**

- High score form appears first (if finalTime exists)
- Player can submit name or skip
- After submission/skip, shows congratulations message
- "Play Again" button resets all game state

**Leaderboard:**

- Always visible at bottom of page
- Shows "No high scores yet" if empty
- Table with rank, player, time, date columns
- Medal emojis for positions 1-3
- Monospace font for time display
- Date shown in local format

### Component Integration

**App.jsx Changes:**

- Added timer state and effects
- Added high score submission handlers
- Conditional rendering for high score form
- Integrated Leaderboard component
- Added `leaderboardRefresh` trigger

**State Flow:**

```
Game Start → First Click → Start Timer
↓
Find Characters → Timer Running
↓
All Found → Stop Timer → Record Final Time
↓
Show High Score Form → Submit/Skip
↓
Show Completion Screen + Leaderboard
```

### User Experience Flow

1. Player loads game, sees leaderboard at bottom
2. Player clicks on image, timer starts automatically
3. Timer counts up in real-time in top-right corner
4. Player finds all characters
5. Timer stops, final time recorded
6. High score form appears
7. Player enters name and submits (or skips)
8. Leaderboard refreshes with new score
9. Congratulations message shows with final time
10. Player clicks "Play Again" to restart

### Technical Notes

- Timer precision: 100ms (updates 10 times per second)
- Time format: MM:SS.ss (minutes:seconds.centiseconds)
- Score validation: Backend checks for valid image_id
- Leaderboard sorting: Backend handles (ORDER BY time ASC)
- Auto-refresh: Leaderboard re-fetches after score submission
- Error handling: Alert shown if score submission fails
- State cleanup: All timer state reset on "New Game"

### Next Steps for Phase 8

**Polish & UX Improvements:**

1. Add loading states and animations
2. Improve responsive design for mobile
3. Add sound effects and visual polish
4. Implement keyboard shortcuts
5. Add game instructions/tutorial
6. Improve error handling and user feedback
7. Add accessibility features (ARIA labels, keyboard navigation)
8. Optimize performance

**Notes:**

- Consider adding session-based game tracking
- May want to limit leaderboard to top 10 or add pagination
- Could add filters (daily/weekly/all-time leaderboards)
- Test image can be replaced with actual Where's Waldo artwork
