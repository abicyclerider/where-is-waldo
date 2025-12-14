# Image Setup Guide

## Finding a Suitable Image

You need a busy, detailed illustration with multiple characters to find. Here are some recommended sources:

### Free/Public Domain Options:

1. **Pixabay** (CC0 - Public Domain)
   - Visit: https://pixabay.com/illustrations/search/crowd/
   - Search for: "busy crowd", "market scene", "city crowd"
   - Look for detailed illustrations with many people
   - Download full-size image (1920x1080 or larger recommended)

2. **Unsplash** (Free to use)
   - Visit: https://unsplash.com/s/photos/crowd
   - Great for realistic crowd photos
   - All images free to use

3. **Wikimedia Commons** (Public Domain)
   - Visit: https://commons.wikimedia.org/
   - Search for "crowd illustration" or "busy scene"
   - Check license (look for CC0 or Public Domain)

4. **rawpixel** (Free with attribution)
   - Visit: https://www.rawpixel.com/search/crowd
   - Has public domain crowd illustrations

### Hosting Your Image:

Once you have an image, you need to host it:

1. **Put in public folder** (Easiest for development):
   ```bash
   # Copy image to frontend public folder
   cp your-image.jpg ../public/waldo-scene.jpg
   ```
   Then use URL: `/waldo-scene.jpg` in seed_database.py

2. **Use Imgur** (Free image hosting):
   - Go to https://imgur.com/upload
   - Upload your image
   - Get direct link (ends in .jpg or .png)
   - Use that URL in seed_database.py

3. **GitHub** (If your repo is public):
   - Commit image to repo
   - Use GitHub raw URL

## Finding Character Coordinates

After you have your image:

1. **Open image in an image editor** (Preview, GIMP, Photoshop, etc.)

2. **Enable pixel/coordinate display** in your editor

3. **For each character you want to hide:**
   - Note the image dimensions (e.g., 1920 x 1080)
   - Find where the character is located
   - Note the bounding box coordinates (x, y, width, height)

4. **Convert to normalized coordinates (0-1)**:
   ```python
   # If character is at pixel (300, 400) to (380, 520) in a 1920x1080 image:
   x_min = 300 / 1920  # = 0.156
   y_min = 400 / 1080  # = 0.370
   x_max = 380 / 1920  # = 0.198
   y_max = 520 / 1080  # = 0.481
   ```

5. **Update seed_database.py** with these coordinates

## Quick Start (Using a Test Image)

For development/testing, you can use a placeholder:

```python
# In seed_database.py, use any busy image URL:
image_url = "https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc"
width = 1920
height = 1280
```

Then pick random spots for characters to test the functionality.

## Running the Seed Script

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python seed_database.py
```

You should see: ✅ Database seeded successfully!
