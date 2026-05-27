import urllib.request
import os
import sys

url = "https://drive.usercontent.google.com/download?id=13CQcMvQdrkfH0FGuWzaiJSdHugixsQSU&export=download"
output_path = "hero_video.mp4"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
}

print(f"Downloading video to {output_path}...")

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=120) as response:
        total = int(response.info().get('Content-Length', 0))
        downloaded = 0
        chunk_size = 1024 * 64  # 64KB chunks
        
        with open(output_path, 'wb') as f:
            while True:
                chunk = response.read(chunk_size)
                if not chunk:
                    break
                f.write(chunk)
                downloaded += len(chunk)
                if total:
                    pct = downloaded / total * 100
                    print(f"\r  {pct:.1f}% ({downloaded // 1024}KB / {total // 1024}KB)", end='', flush=True)

    print(f"\nDone! Saved as: {output_path}")
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"File size: {size_mb:.2f} MB")
except Exception as e:
    print(f"\nERROR: {e}")
    sys.exit(1)
