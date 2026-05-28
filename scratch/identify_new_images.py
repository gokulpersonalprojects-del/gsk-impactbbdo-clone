import os
from PIL import Image

brain_dir = r"C:\Users\ASUS\\.gemini\antigravity-ide\brain\db0f1768-89bf-4ae3-bd02-a151d406dd6b"
files = ["media__1779957994162.png", "media__1779958026727.jpg"]

for f in files:
    path = os.path.join(brain_dir, f)
    if os.path.exists(path):
        img = Image.open(path)
        print(f"File: {f}")
        print(f"  Format: {img.format}")
        print(f"  Size: {img.size[0]}x{img.size[1]}")
        print(f"  Bytes: {os.path.getsize(path)}")
    else:
        print(f"Not found: {path}")
