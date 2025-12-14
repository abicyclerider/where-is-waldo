# Project Context

## Repository
This is a Where's Waldo photo tagging game following The Odin Project specifications.
Location: `/Users/alex/repos/where-is-waldo`

## Project Status: Phase 6 Complete ✅

### Completed Phases

- ✅ **Phase 1**: Project Setup & Architecture
- ✅ **Phase 2**: Frontend UI Components
- ✅ **Phase 3**: Database Schema & Backend API
- ✅ **Phase 4**: Image Click Detection & Coordinate Normalization
- ✅ **Phase 5**: Backend Integration & Validation
- ✅ **Phase 6**: Game State Management

### Current Phase

- 🔄 **Phase 7**: Timer & Scoring System (Next)

### Remaining Phases

- Phase 8: Polish & UX Improvements
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

### Next Steps for Phase 7

**Timer & Scoring System:**

1. Start timer when game begins
2. Stop timer when all characters are found
3. Display elapsed time during gameplay
4. Save high scores to backend
5. Display leaderboard
6. Allow player to submit name with score

**Notes:**

- Test image can be replaced with actual Where's Waldo artwork later
- Image generation utilities can be reused for other test scenarios
- Backend endpoints for timer/scoring already implemented in Phase 5
