"""
Reset the database with test image coordinates
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

def reset_database():
    db = SessionLocal()

    try:
        # Delete all existing data
        db.query(models.HighScore).delete()
        db.query(models.GameSession).delete()
        db.query(models.Character).delete()
        db.query(models.GameImage).delete()
        db.commit()

        print("🗑️  Cleared existing data")

        # Add test image
        game_image = models.GameImage(
            name="Test Game Image",
            image_url="http://localhost:8000/static/test_game_image.png",
            width=1920,
            height=1280
        )

        db.add(game_image)
        db.flush()

        # Add characters with exact coordinates from the generated image
        character1 = models.Character(
            name="Waldo",
            game_image_id=game_image.id,
            x_min=0.1562,  # Red square
            x_max=0.2083,
            y_min=0.1953,
            y_max=0.2734
        )

        character2 = models.Character(
            name="Wizard",
            game_image_id=game_image.id,
            x_min=0.4427,  # Blue circle
            x_max=0.4948,
            y_min=0.4297,
            y_max=0.5078
        )

        character3 = models.Character(
            name="Odlaw",
            game_image_id=game_image.id,
            x_min=0.7812,  # Green triangle
            x_max=0.8333,
            y_min=0.7422,
            y_max=0.8203
        )

        db.add_all([character1, character2, character3])
        db.commit()

        print("✅ Database reset with test image!")
        print(f"   Image URL: {game_image.image_url}")
        print(f"   Characters:")
        print(f"      1. Waldo (Red Square) - x: 15.6-20.8%, y: 19.5-27.3%")
        print(f"      2. Wizard (Blue Circle) - x: 44.3-49.5%, y: 43.0-50.8%")
        print(f"      3. Odlaw (Green Triangle) - x: 78.1-83.3%, y: 74.2-82.0%")

    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
