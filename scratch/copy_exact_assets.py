import shutil
import os

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    screenshots_dir = os.path.join(root_dir, "extracted_figma_screens")
    
    print("Copying and renaming extracted exact screens to root folder...")
    for i in range(1, 7):
        src = os.path.join(screenshots_dir, f"screen_{i}_exact.png")
        dest = os.path.join(root_dir, f"netflix_screen_{i}.png")
        if os.path.exists(src):
            shutil.copy(src, dest)
            print(f"Copied {os.path.basename(src)} -> {os.path.basename(dest)}")
        else:
            print(f"Error: {src} does not exist.")

if __name__ == "__main__":
    main()
