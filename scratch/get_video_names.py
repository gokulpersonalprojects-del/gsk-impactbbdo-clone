import urllib.request
import re

video_ids = [
    "134RHT4pRO8UWRh2nZwAIblw-rcYGT3fz",
    "1KyF8ccF5KfGghvtSoBcSootvcYSZ21yc"
]

for fid in video_ids:
    url = f"https://docs.google.com/uc?export=download&id={fid}"
    req = urllib.request.Request(url, method='HEAD')
    req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36')
    try:
        with urllib.request.urlopen(req) as response:
            cd = response.getheader('Content-Disposition')
            print(f"ID: {fid}")
            print(f"  Content-Disposition: {cd}")
    except Exception as e:
        print(f"Failed to get headers for {fid}: {e}")
