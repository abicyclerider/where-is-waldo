# Where's Waldo Backend API

FastAPI backend for the Where's Waldo photo tagging game.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

API documentation: `http://localhost:8000/docs`

## Endpoints

- `GET /game-image` - Get game image metadata and character list
- `POST /validate` - Validate if a click location matches a character
- `POST /start-game` - Start a new game session
- `POST /end-game` - End game session and record time
- `GET /high-scores` - Get leaderboard
- `POST /high-scores` - Submit a new score
