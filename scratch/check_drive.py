import urllib.request
import re

req = urllib.request.Request(
    'https://drive.google.com/uc?export=download&id=13CQcMvQdrkfH0FGuWzaiJSdHugixsQSU',
    headers={'User-Agent': 'Mozilla/5.0'}
)
try:
    res = urllib.request.urlopen(req)
    body = res.read().decode('utf-8', errors='ignore')
    print("CODE:", res.getcode())
    print("URL:", res.geturl())
    # find all text in the div with class uc-text
    text_content = re.sub('<[^<]+?>', '', body)
    # clean extra whitespace
    text_content = '\n'.join([line.strip() for line in text_content.split('\n') if line.strip()])
    print("PAGE TEXT:")
    print(text_content[:2000])
except Exception as e:
    print("ERROR:", e)
