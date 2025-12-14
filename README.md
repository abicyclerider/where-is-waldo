# Where's Waldo - Photo Tagging Game

A full-stack Where's Waldo photo tagging game built with React and FastAPI, following The Odin Project specifications.

## Tech Stack

**Frontend:**
- React 18 with Vite
- PicoCSS for styling
- PropTypes for type checking

**Backend:**
- FastAPI (Python)
- SQLAlchemy ORM
- SQLite database

## Features

- Interactive image click detection with coordinate normalization
- Character validation system
- Visual markers for found characters
- Game progress tracking
- Timer and scoring system
- High score leaderboard
- Responsive design

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

## Development

This project follows The Odin Project curriculum. See [CLAUDE.md](CLAUDE.md) for detailed phase-by-phase development notes.

## License

MIT
