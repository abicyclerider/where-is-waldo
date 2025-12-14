from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

def get_utc_now():
    return datetime.now(timezone.utc)

class GameImage(Base):
    """Stores information about game images"""
    __tablename__ = "game_images"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    image_url = Column(String)
    width = Column(Integer)  # Image width in pixels
    height = Column(Integer)  # Image height in pixels

    characters = relationship("Character", back_populates="game_image")

class Character(Base):
    """Characters to find in the game"""
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    game_image_id = Column(Integer, ForeignKey("game_images.id"))

    # Bounding box coordinates (normalized 0-1 based on image dimensions)
    x_min = Column(Float)  # Left edge of character location
    y_min = Column(Float)  # Top edge of character location
    x_max = Column(Float)  # Right edge of character location
    y_max = Column(Float)  # Bottom edge of character location

    game_image = relationship("GameImage", back_populates="characters")

class GameSession(Base):
    """Tracks individual game sessions"""
    __tablename__ = "game_sessions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    game_image_id = Column(Integer, ForeignKey("game_images.id"))
    start_time = Column(DateTime, default=get_utc_now)
    end_time = Column(DateTime, nullable=True)
    completed = Column(Integer, default=0)  # 0 = in progress, 1 = completed

class HighScore(Base):
    """Stores high scores"""
    __tablename__ = "high_scores"

    id = Column(Integer, primary_key=True, index=True)
    player_name = Column(String, index=True)
    game_image_id = Column(Integer, ForeignKey("game_images.id"))
    time_seconds = Column(Float)
    created_at = Column(DateTime, default=get_utc_now)
