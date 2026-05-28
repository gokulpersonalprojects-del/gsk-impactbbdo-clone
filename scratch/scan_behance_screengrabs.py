import os
from PIL import Image

def detect_regions(img_path):
    print(f"Opening {img_path} for layout detection...")
    img = Image.open(img_path)
    width, height = img.size
    
    # We want to scan the image row by row to find where sections change,
    # or identify high-contrast rectangular blocks.
    # Since it is a dark mode Netflix app case study, let's scan for black/dark sections.
    # Let's convert to grayscale for simpler analysis.
    gray = img.convert('L')
    
    # Let's find vertical lines or columns that are constant.
    # An infographic often has centered phone mockups.
    # Let's save thumbnails of 10 equal parts of the image to check what is in each.
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "scratch", "previews"))
    os.makedirs(out_dir, exist_ok=True)
    
    print("Saving 20 equal segment previews for visual checks...")
    segment_height = height // 20
    for i in range(20):
        ymin = i * segment_height
        ymax = min((i + 1) * segment_height, height)
        segment = img.crop((0, ymin, width, ymax))
        # Resize to smaller width for fast viewing if needed, but keeping full is okay
        segment.thumbnail((600, 600))
        # Convert to RGB if needed to prevent JPEG saving error
        if segment.mode != 'RGB':
            segment = segment.convert('RGB')
        segment.save(os.path.join(out_dir, f"segment_{i+1:02d}.jpg"), "JPEG", quality=70)
        print(f"Saved segment {i+1} (range: {ymin} - {ymax})")

if __name__ == "__main__":
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_path = os.path.join(root_dir, "behance_screen_2.png")
    detect_regions(img_path)
