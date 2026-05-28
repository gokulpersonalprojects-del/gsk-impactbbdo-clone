import os
from PIL import Image

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    assets_dir = os.path.join(root_dir, "figma_assets")
    
    if not os.path.exists(assets_dir):
        print(f"Error: {assets_dir} does not exist.")
        return
        
    files = sorted(os.listdir(assets_dir))
    print(f"Scanning {len(files)} files in figma_assets folder...")
    
    large_assets = []
    
    for filename in files:
        filepath = os.path.join(assets_dir, filename)
        if os.path.isfile(filepath):
            try:
                with Image.open(filepath) as img:
                    w, h = img.size
                    size_bytes = os.path.getsize(filepath)
                    
                    # We are looking for screen designs, which typically have a substantial width and height
                    if w >= 250 and h >= 500:
                        large_assets.append((filename, w, h, size_bytes, img.format))
            except Exception as e:
                # Not a valid image or couldn't open
                pass
                
    print(f"\nFound {len(large_assets)} screen-sized assets (width >= 250, height >= 500):")
    for idx, (name, w, h, size, fmt) in enumerate(large_assets):
        print(f"[{idx+1}] {name} : {w} x {h} | {fmt} | Size: {size / 1024:.1f} KB")
        
if __name__ == "__main__":
    main()
