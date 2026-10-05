import os
import urllib.request

LOGOS_DIR = os.path.join(os.getcwd(), 'public', 'logos')
os.makedirs(LOGOS_DIR, exist_ok=True)

# 1. Copy our clean VietQR badge to public/logos/vietqr.png
import shutil
shutil.copy('public/vietqr-badge.png', os.path.join(LOGOS_DIR, 'vietqr.png'))
print('Saved public/logos/vietqr.png')

# Other preset logos
items = [
    ('zalo.svg', 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg'),
    ('facebook.svg', 'https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg'),
    ('tiktok.svg', 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg'),
    ('instagram.png', 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png'),
    ('youtube.svg', 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'),
    ('wifi.svg', 'https://upload.wikimedia.org/wikipedia/commons/a/ae/WiFi_Logo.svg'),
]

for filename, url in items:
    dest = os.path.join(LOGOS_DIR, filename)
    if os.path.exists(dest) and os.path.getsize(dest) > 100:
        print(f'Already exists: {filename}')
        continue
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'OlokaQRBot/1.0 (contact@oloka.vn)'})
        with urllib.request.urlopen(req, timeout=10) as resp:
            content = resp.read()
            with open(dest, 'wb') as f:
                f.write(content)
            print(f'Downloaded {filename}: {len(content)} bytes')
    except Exception as e:
        print(f'Error downloading {filename} from {url}: {e}')
