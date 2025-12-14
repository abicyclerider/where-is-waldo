from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uuid
from datetime import datetime, timezone

import models
import schemas
from database import engine, get_db

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Where's Waldo API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Where's Waldo API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/game-image", response_model=schemas.GameImageResponse)
def get_game_image(db: Session = Depends(get_db)):
    """Get the first available game image with its characters"""
    game_image = db.query(models.GameImage).first()
    if not game_image:
        raise HTTPException(status_code=404, detail="No game image found")
    return game_image

@app.post("/validate", response_model=schemas.ValidationResponse)
def validate_character_location(
    validation: schemas.ValidationRequest,
    db: Session = Depends(get_db)
):
    """Validate if a click location matches a character"""
    # Get the character
    character = db.query(models.Character).filter(
        models.Character.id == validation.character_id
    ).first()

    if not character:
        raise HTTPException(status_code=404, detail="Character not found")

    # Check if click coordinates are within the character's bounding box
    is_valid = (
        character.x_min <= validation.x <= character.x_max and
        character.y_min <= validation.y <= character.y_max
    )

    if is_valid:
        return schemas.ValidationResponse(
            valid=True,
            message=f"You found {character.name}!"
        )
    else:
        return schemas.ValidationResponse(
            valid=False,
            message="Not quite! Try again."
        )

@app.post("/start-game", response_model=schemas.GameSessionResponse)
def start_game(
    session_create: schemas.GameSessionCreate,
    db: Session = Depends(get_db)
):
    """Start a new game session"""
    session_id = str(uuid.uuid4())

    game_session = models.GameSession(
        session_id=session_id,
        game_image_id=session_create.game_image_id,
        start_time=datetime.now(timezone.utc)
    )

    db.add(game_session)
    db.commit()
    db.refresh(game_session)

    return game_session

@app.post("/end-game", response_model=schemas.GameSessionEndResponse)
def end_game(
    session_end: schemas.GameSessionEnd,
    db: Session = Depends(get_db)
):
    """End a game session and calculate time"""
    game_session = db.query(models.GameSession).filter(
        models.GameSession.session_id == session_end.session_id
    ).first()

    if not game_session:
        raise HTTPException(status_code=404, detail="Game session not found")

    if game_session.completed:
        raise HTTPException(status_code=400, detail="Game session already completed")

    end_time = datetime.now(timezone.utc)
    time_seconds = (end_time - game_session.start_time).total_seconds()

    game_session.end_time = end_time
    game_session.completed = 1

    db.commit()

    return schemas.GameSessionEndResponse(
        time_seconds=time_seconds,
        message=f"Game completed in {time_seconds:.2f} seconds!"
    )

@app.get("/high-scores", response_model=List[schemas.HighScoreResponse])
def get_high_scores(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get top high scores"""
    high_scores = db.query(models.HighScore).order_by(
        models.HighScore.time_seconds.asc()
    ).limit(limit).all()

    return high_scores

@app.post("/high-scores", response_model=schemas.HighScoreResponse)
def create_high_score(
    score_create: schemas.HighScoreCreate,
    db: Session = Depends(get_db)
):
    """Submit a high score"""
    # Get the game session
    game_session = db.query(models.GameSession).filter(
        models.GameSession.session_id == score_create.session_id
    ).first()

    if not game_session:
        raise HTTPException(status_code=404, detail="Game session not found")

    if not game_session.completed:
        raise HTTPException(status_code=400, detail="Game session not completed")

    # Calculate time
    time_seconds = (game_session.end_time - game_session.start_time).total_seconds()

    # Create high score
    high_score = models.HighScore(
        player_name=score_create.player_name,
        game_image_id=game_session.game_image_id,
        time_seconds=time_seconds
    )

    db.add(high_score)
    db.commit()
    db.refresh(high_score)

    return high_score
