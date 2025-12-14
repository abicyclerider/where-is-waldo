"""
Database seeding script for Where's Waldo game

This script populates the database with game image and character data.
You can modify the image URL and character coordinates below.
"""

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

# Create tables
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()

    try:
        # Check if data already exists
        existing = db.query(models.GameImage).first()
        if existing:
            print("Database already seeded. Skipping...")
            return

        # TODO: Replace with your actual image URL
        # Find a busy illustration from:
        # - Pixabay (CC0): https://pixabay.com/illustrations/search/crowd/
        # - Unsplash (free to use): https://unsplash.com/s/photos/crowd
        # - Your own image hosted on Imgur, etc.

        # Using a busy crowd photo from Unsplash for development
        # You can replace this with your own image later
        game_image = models.GameImage(
            name="Busy Crowd Scene",
            image_url="https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?w=1920",
            width=1920,
            height=1280
        )

        db.add(game_image)
        db.flush()  # Get the ID

        # Add characters to find
        # Coordinates are normalized (0-1) based on image dimensions
        # x_min, y_min = top-left corner of character
        # x_max, y_max = bottom-right corner of character

        # Example: Character in top-left quadrant
        character1 = models.Character(
            name="Waldo",
            game_image_id=game_image.id,
            x_min=0.15,  # 15% from left
            y_min=0.20,  # 20% from top
            x_max=0.20,  # 20% from left (5% width)
            y_max=0.28   # 28% from top (8% height)
        )

        # Example: Character in center
        character2 = models.Character(
            name="Wizard",
            game_image_id=game_image.id,
            x_min=0.45,
            y_min=0.40,
            x_max=0.52,
            y_max=0.50
        )

        # Example: Character in bottom-right
        character3 = models.Character(
            name="Odlaw",
            game_image_id=game_image.id,
            x_min=0.70,
            y_min=0.65,
            x_max=0.76,
            y_max=0.75
        )

        db.add_all([character1, character2, character3])
        db.commit()

        print("✅ Database seeded successfully!")
        print(f"   Image: {game_image.name}")
        print(f"   Characters: Waldo, Wizard, Odlaw")
        print(f"\n⚠️  IMPORTANT: Update image_url and character coordinates in seed_database.py")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
