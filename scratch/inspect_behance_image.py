from PIL import Image
import os

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    # We downloaded 5 images, which are different resolutions of the same asset.
    # Let's inspect behance_screen_5.png (source resolution) and others.
    for i in range(1, 6):
        filename = f"behance_screen_{i}.png"
        filepath = os.path.join(root_dir, filename)
        if os.path.exists(filepath):
            try:
                with Image.open(filepath) as img:
                    print(f"File: {filename} | Format: {img.format} | Size: {img.size} | Mode: {img.mode}")
            except Exception as e:
                print(f"Error opening {filename}: {e}")
        else:
            print(f"File {filename} does not exist.")

if __name__ == "__main__":
    main()
