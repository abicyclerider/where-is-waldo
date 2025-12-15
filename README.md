# Where's Waldo - Photo Tagging Game

A full-stack Where's Waldo photo tagging game built with React and FastAPI, following The Odin Project specifications.

## Tech Stack

**Frontend:**
- React 18 with Vite
- PicoCSS for styling
- PropTypes for type checking
- Vitest + React Testing Library for testing

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database

## Features

- Interactive image click detection with coordinate normalization
- Character validation system
- Visual markers for found characters
- Game progress tracking
- Timer and scoring system (tracks time to completion)
- High score leaderboard with top player rankings
- Fully responsive design (mobile, tablet, desktop)
- Smooth animations and loading states
- Interactive instructions modal
- Full keyboard navigation support
- ARIA labels for screen readers
- Comprehensive test suite (70 tests, 100% passing)

## Environment Variables

This project uses environment variables to configure the API URL for different environments.

### Setup

1. The project includes three environment files:
   - `.env.development` - For local development
   - `.env.production` - For production deployment
   - `.env.example` - Template file

2. Vite automatically loads the correct file based on the mode:
   - `npm run dev` uses `.env.development`
   - `npm run build` uses `.env.production`

### Available Variables

- `VITE_API_URL` - Backend API URL (must be prefixed with `VITE_` for Vite to expose it)

### Deployment

When deploying to production:

1. Update `.env.production` with your production API URL:
   ```
   VITE_API_URL=https://your-production-api.com
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. The built files in `dist/` will use the production API URL

### Local Development with Custom URL

If you need to override the API URL locally without modifying tracked files:

1. Create a `.env.local` file (git-ignored):
   ```
   VITE_API_URL=http://your-custom-url:port
   ```

2. Restart the dev server

## Getting Started

### Frontend

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn main:app --reload
```

## Project Structure

```
where-is-waldo/
├── src/                    # Frontend React code
│   ├── components/        # React components
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── backend/               # Backend Python code
│   ├── main.py           # FastAPI app
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   └── database.py       # Database connection
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── .env.example          # Environment variables template
```

## API Endpoints

- `GET /game-image` - Get game image and characters
- `POST /validate` - Validate character selection
- `POST /start-game` - Start a new game session
- `POST /end-game` - End game and calculate time
- `GET /high-scores` - Get leaderboard
- `POST /high-scores` - Submit high score

## Development Phases

This project was built following The Odin Project curriculum in 9 phases:

1. **Phase 1**: Project Setup & Architecture
2. **Phase 2**: Frontend UI Components
3. **Phase 3**: Database Schema & Backend API
4. **Phase 4**: Image Click Detection & Coordinate Normalization
5. **Phase 5**: Backend Integration & Validation
6. **Phase 6**: Game State Management
7. **Phase 7**: Timer & Scoring System
8. **Phase 8**: Polish & UX Improvements
9. **Phase 9**: Testing & Quality Assurance

See [claude.md](claude.md) for detailed phase-by-phase development notes and technical decisions.

## Testing

The project includes a comprehensive test suite with 70 tests covering:

- Component rendering and behavior
- User interactions (clicks, typing, form submissions)
- API integration and error handling
- Accessibility features (ARIA labels, keyboard navigation)
- Loading and error states

Run tests with:
```bash
npm test
```

## Screenshots

The game includes:
- A test image with three findable characters (Waldo, Wizard, Odlaw)
- Visual feedback when characters are found
- Real-time timer display
- Leaderboard with medal emojis for top 3 players
- Responsive design that works on all devices

## Future Enhancements

Potential improvements for the future:
- Replace test image with actual Where's Waldo artwork
- Add multiple game levels/images
- Implement daily/weekly/all-time leaderboards
- Add sound effects for found characters
- Add confetti animation on game completion
- E2E tests with Playwright or Cypress

## License

MIT
