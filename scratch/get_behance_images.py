import urllib.request
import re
import os
import json

def main():
    url = "https://www.behance.net/gallery/191765225/Netflix-E-Shopping-UX-Casestudy-UI-Design"
    print(f"Fetching Behance URL: {url} ...")
    
    # Configure request with User-Agent to avoid being blocked
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
    )
    
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8', errors='ignore')
            print(f"Successfully fetched HTML. Size: {len(html)} characters.")
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return

    # Look for image URLs from Behance CDN (project modules)
    # They usually look like: https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/3ea359191765225.65ccbf178229b.png
    # Or in INITIAL_STATE JSON
    pattern = r'https://mir-s3-cdn-cf\.behance\.net/project_modules/[a-zA-Z0-9_\-]+/[a-f0-9\.]+(?:\.png|\.jpg|\.jpeg)'
    matches = re.findall(pattern, html)
    
    # Also search for wider pattern if standard fails
    if not matches:
        print("Standard CDN pattern returned no matches. Trying a broader match...")
        pattern = r'https://[a-zA-Z0-9\.\-]+\.behance\.net/[^\s"\'<>\{\}\[\]]+\.(?:png|jpg|jpeg)'
        matches = re.findall(pattern, html)

    unique_urls = sorted(list(set(matches)))
    print(f"Found {len(unique_urls)} unique image URLs.")
    
    for i, img_url in enumerate(unique_urls):
        print(f"[{i+1}] {img_url}")
        
    # Save the URLs to a file
    output_path = os.path.join(os.path.dirname(__file__), "behance_images.json")
    with open(output_path, "w") as f:
        json.dump(unique_urls, f, indent=2)
    print(f"Saved image URLs list to: {output_path}")

    # Now let's try to download these images to the root folder as behance_img_1.png, behance_img_2.png, etc.
    # So we can see which ones are the actual screens.
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    print(f"Downloading images to {dest_dir}...")
    for i, img_url in enumerate(unique_urls):
        ext = ".png" if ".png" in img_url.lower() else ".jpg"
        filename = f"behance_screen_{i+1}{ext}"
        filepath = os.path.join(dest_dir, filename)
        print(f"Downloading {img_url} -> {filename}...")
        try:
            img_req = urllib.request.Request(
                img_url,
                headers={'User-Agent': 'Mozilla/5.0'}
            )
            with urllib.request.urlopen(img_req) as img_resp, open(filepath, "wb") as out_file:
                out_file.write(img_resp.read())
            print(f"  Successfully saved {filename}")
        except Exception as e:
            print(f"  Error downloading image {i+1}: {e}")

if __name__ == "__main__":
    main()
