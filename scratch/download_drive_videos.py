import urllib.request
import urllib.parse
import os
import re

video_links = [
    "https://drive.google.com/file/d/134RHT4pRO8UWRh2nZwAIblw-rcYGT3fz/view?usp=sharing",
    "https://drive.google.com/file/d/1I_6DH6SMtThFLGUMtYocHYDS5UmsTPU1/view?usp=sharing",
    "https://drive.google.com/file/d/1yMn-1uvzAud8VTAu8LyjFVpSb5UXDqcK/view?usp=sharing",
    "https://drive.google.com/file/d/1KyF8ccF5KfGghvtSoBcSootvcYSZ21yc/view?usp=sharing"
]

def get_drive_id(url):
    match = re.search(r'/d/([a-zA-Z0-9_-]+)', url)
    return match.group(1) if match else None

def download_file(file_id, output_path):
    # Try the direct usercontent download URL with confirm=t
    download_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"
    print(f"Downloading {file_id} via direct usercontent link...")
    
    try:
        # Create opener with browser-like user agent
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124 Safari/537.36')]
        urllib.request.install_opener(opener)
        
        # Download
        urllib.request.urlretrieve(download_url, output_path)
        size = os.path.getsize(output_path)
        print(f"Downloaded {output_path} ({size} bytes)")
        
        # If the file size is very small, it might be an HTML error/warning page
        if size < 5000:
            with open(output_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            if "Google Drive - Virus scan warning" in content:
                print("Encountered virus scan warning. Trying to parse confirmation token and uuid...")
                # Extract UUID and confirmation form details
                uuid_match = re.search(r'name="uuid"\s+value="([^"]+)"', content)
                confirm_match = re.search(r'name="confirm"\s+value="([^"]+)"', content)
                
                params = {
                    "id": file_id,
                    "export": "download",
                    "confirm": confirm_match.group(1) if confirm_match else "t"
                }
                if uuid_match:
                    params["uuid"] = uuid_match.group(1)
                
                query_string = urllib.parse.urlencode(params)
                bypass_url = f"https://drive.usercontent.google.com/download?{query_string}"
                print(f"Retrying download with bypass URL: {bypass_url}")
                urllib.request.urlretrieve(bypass_url, output_path)
                print(f"Bypassed successfully! Downloaded size: {os.path.getsize(output_path)} bytes")
        return True
    except Exception as e:
        print(f"Failed to download {file_id}: {e}")
        return False

os.makedirs("downloaded_videos", exist_ok=True)

for i, url in enumerate(video_links, 1):
    file_id = get_drive_id(url)
    if file_id:
        download_file(file_id, f"downloaded_videos/video_{i}_raw.mp4")
    else:
        print(f"Could not parse file ID from {url}")
