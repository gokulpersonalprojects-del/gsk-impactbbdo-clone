from PIL import Image
import os

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    
    print("Listing dimensions of cropped Behance screen images:")
    for idx in range(1, 16):
        filename = f"behance_screen_crop_{idx}.png"
        filepath = os.path.join(root_dir, filename)
        if os.path.exists(filepath):
            try:
                with Image.open(filepath) as img:
                    w, h = img.size
                    aspect = h / w
                    print(f"{filename} : Size: {w} x {h} | Aspect Ratio: {aspect:.2f} | Mode: {img.mode}")
            except Exception as e:
                print(f"Error opening {filename}: {e}")

if __name__ == "__main__":
    main()
