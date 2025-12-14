from pydantic import BaseModel
from typing import List
from datetime import datetime

# Character schemas
class CharacterBase(BaseModel):
    name: str

class CharacterResponse(CharacterBase):
    id: int

    class Config:
        from_attributes = True

# Game Image schemas
class GameImageResponse(BaseModel):
    id: int
    name: str
    image_url: str
    width: int
    height: int
    characters: List[CharacterResponse]

    class Config:
        from_attributes = True

# Validation schemas
class ValidationRequest(BaseModel):
    session_id: str
    character_id: int
    x: float  # Click x coordinate (normalized 0-1)
    y: float  # Click y coordinate (normalized 0-1)

class ValidationResponse(BaseModel):
    valid: bool
    message: str

# Game session schemas
class GameSessionCreate(BaseModel):
    game_image_id: int

class GameSessionResponse(BaseModel):
    session_id: str
    game_image_id: int
    start_time: datetime

    class Config:
        from_attributes = True

class GameSessionEnd(BaseModel):
    session_id: str

class GameSessionEndResponse(BaseModel):
    time_seconds: float
    message: str

# High score schemas
class HighScoreCreate(BaseModel):
    session_id: str
    player_name: str

class HighScoreResponse(BaseModel):
    id: int
    player_name: str
    time_seconds: float
    created_at: datetime

    class Config:
        from_attributes = True
