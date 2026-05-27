import urllib.request
import urllib.parse

# Test the usercontent URL with proper headers
url = "https://drive.usercontent.google.com/download?id=13CQcMvQdrkfH0FGuWzaiJSdHugixsQSU&export=download"

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'video/mp4,video/*;q=0.9,*/*;q=0.8',
    'Range': 'bytes=0-1024'
}

req = urllib.request.Request(url, headers=headers)
try:
    res = urllib.request.urlopen(req, timeout=10)
    content_type = res.info().get_content_type()
    print("STATUS:", res.getcode())
    print("CONTENT-TYPE:", content_type)
    print("CONTENT-LENGTH:", res.info().get('Content-Length'))
    print("CONTENT-RANGE:", res.info().get('Content-Range'))
    print("FINAL URL:", res.geturl())
    first_bytes = res.read(16)
    print("FIRST BYTES (hex):", first_bytes.hex())
    print("IS MP4 HEADER (ftyp):", b'ftyp' in first_bytes or b'moov' in first_bytes)
except Exception as e:
    print("ERROR:", e)
