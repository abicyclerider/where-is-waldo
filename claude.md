# Project Context

## Repository
This is a Where's Waldo photo tagging game following The Odin Project specifications.
Location: `/Users/alex/repos/where-is-waldo`

## Project Status: Phase 5 Complete ✅

### Completed Phases

- ✅ **Phase 1**: Project Setup & Architecture
- ✅ **Phase 2**: Frontend UI Components
- ✅ **Phase 3**: Database Schema & Backend API
- ✅ **Phase 4**: Image Click Detection & Coordinate Normalization
- ✅ **Phase 5**: Backend Integration & Validation

### Current Phase

- 🔄 **Phase 6**: Game State Management (Next)

### Remaining Phases

- Phase 7: Timer & Scoring System
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

### Next Steps for Phase 6

**Game State Management:**

1. Detect when all characters are found
2. Display game completion screen
3. Add visual markers on image when characters are found
4. Track and display game progress
5. Add "New Game" functionality

**Notes:**

- Test image can be replaced with actual Where's Waldo artwork later
- Image generation utilities can be reused for other test scenarios
- Database is ready for timer/scoring features in Phase 7
