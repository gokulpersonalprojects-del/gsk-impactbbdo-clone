import re

files = {
    'project-1': r'C:\Users\ASUS\.gemini\antigravity\brain\ad2a62a7-9e19-4507-9453-e9a220983c5d\.system_generated\steps\1684\content.md',
    'project-2': r'C:\Users\ASUS\.gemini\antigravity\brain\ad2a62a7-9e19-4507-9453-e9a220983c5d\.system_generated\steps\1686\content.md',
    'about':     r'C:\Users\ASUS\.gemini\antigravity\brain\ad2a62a7-9e19-4507-9453-e9a220983c5d\.system_generated\steps\1688\content.md',
}

for name, path in files.items():
    print(f'\n========== {name.upper()} ==========')
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    text = re.sub(r'<[^>]+>', ' ', content)
    text = re.sub(r'\s+', ' ', text).strip()
    imgs = list(set(re.findall(r'https://framerusercontent\.com/images/[^\s"\'\\)]+', content)))
    print('TEXT:', text[:3000])
    print('IMAGES:', imgs[:6])
