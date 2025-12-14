"""
Create a test image with known character locations (shapes)
This makes it easy to test the validation system with precise coordinates
"""
from PIL import Image, ImageDraw, ImageFont
import os

# Image dimensions
WIDTH = 1920
HEIGHT = 1280

# Create a new image with a light background
img = Image.new('RGB', (WIDTH, HEIGHT), color='#f0e6d2')
draw = ImageDraw.Draw(img)

# Define character locations in pixels (we'll convert to normalized coordinates)
# Each character is a 100x100 shape with some padding

# Character 1: RED SQUARE (top-left area)
square_x = 300  # 300 pixels from left
square_y = 250  # 250 pixels from top
square_size = 100
draw.rectangle(
    [square_x, square_y, square_x + square_size, square_y + square_size],
    fill='red',
    outline='darkred',
    width=3
)
draw.text((square_x + 10, square_y + 35), "WALDO", fill='white', font=None)

# Character 2: BLUE CIRCLE (center area)
circle_x = 900  # Center-ish horizontally
circle_y = 600  # Center-ish vertically
circle_radius = 50
draw.ellipse(
    [circle_x - circle_radius, circle_y - circle_radius,
     circle_x + circle_radius, circle_y + circle_radius],
    fill='blue',
    outline='darkblue',
    width=3
)
draw.text((circle_x - 30, circle_y - 10), "WIZARD", fill='white', font=None)

# Character 3: GREEN TRIANGLE (bottom-right area)
triangle_x = 1500  # Right side
triangle_y = 950   # Bottom area
triangle_size = 100
triangle_points = [
    (triangle_x, triangle_y + triangle_size),  # Bottom left
    (triangle_x + triangle_size, triangle_y + triangle_size),  # Bottom right
    (triangle_x + triangle_size // 2, triangle_y),  # Top center
]
draw.polygon(triangle_points, fill='green', outline='darkgreen')
draw.text((triangle_x + 15, triangle_y + 60), "ODLAW", fill='white', font=None)

# Add some decorative elements to make it more interesting
# Add random colored circles across the image
import random
random.seed(42)  # Consistent random patterns
for _ in range(30):
    x = random.randint(0, WIDTH)
    y = random.randint(0, HEIGHT)
    r = random.randint(10, 30)
    color = random.choice(['#ffcccc', '#ccffcc', '#ccccff', '#ffffcc', '#ffccff', '#ccffff'])
    draw.ellipse([x-r, y-r, x+r, y+r], fill=color, outline=color)

# Save the image
output_path = 'test_game_image.png'
img.save(output_path)

print(f"✅ Test image created: {output_path}")
print(f"   Dimensions: {WIDTH}x{HEIGHT}")
print("\n📍 Character locations (in pixels):")
print(f"   1. RED SQUARE (Waldo):   x={square_x}-{square_x + square_size}, y={square_y}-{square_y + square_size}")
print(f"   2. BLUE CIRCLE (Wizard): x={circle_x - circle_radius}-{circle_x + circle_radius}, y={circle_y - circle_radius}-{circle_y + circle_radius}")
print(f"   3. GREEN TRIANGLE (Odlaw): x={triangle_x}-{triangle_x + triangle_size}, y={triangle_y}-{triangle_y + triangle_size}")

print("\n📐 Normalized coordinates (0-1 range):")
print(f"   1. RED SQUARE (Waldo):")
print(f"      x_min={square_x / WIDTH:.4f}, x_max={(square_x + square_size) / WIDTH:.4f}")
print(f"      y_min={square_y / HEIGHT:.4f}, y_max={(square_y + square_size) / HEIGHT:.4f}")

print(f"   2. BLUE CIRCLE (Wizard):")
print(f"      x_min={(circle_x - circle_radius) / WIDTH:.4f}, x_max={(circle_x + circle_radius) / WIDTH:.4f}")
print(f"      y_min={(circle_y - circle_radius) / HEIGHT:.4f}, y_max={(circle_y + circle_radius) / HEIGHT:.4f}")

print(f"   3. GREEN TRIANGLE (Odlaw):")
print(f"      x_min={triangle_x / WIDTH:.4f}, x_max={(triangle_x + triangle_size) / WIDTH:.4f}")
print(f"      y_min={triangle_y / HEIGHT:.4f}, y_max={(triangle_y + triangle_size) / HEIGHT:.4f}")

print(f"\n💡 To use this image:")
print(f"   1. Upload it to an image host (Imgur, etc.) or serve it locally")
print(f"   2. Update seed_database.py with the image URL and coordinates above")
