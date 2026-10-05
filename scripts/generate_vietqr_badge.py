import os
from playwright.sync_api import sync_playwright

with open('public/vietqr-full.svg', 'r', encoding='utf-8') as f:
    svg_inner = f.read()

# Remove <?xml... and <svg wrapper to embed inside our badge SVG
import re
inner = re.sub(r'<\?xml[^>]*\?>', '', svg_inner)
inner = re.sub(r'<!--[^>]*-->', '', inner)
inner = re.sub(r'<svg[^>]*>', '', inner)
inner = re.sub(r'</svg>', '', inner)

badge_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.12"/>
    </filter>
  </defs>
  <!-- Background Badge -->
  <rect x="16" y="16" width="480" height="480" rx="96" fill="#ffffff" stroke="#e2e8f0" stroke-width="8" filter="url(#shadow)"/>
  
  <!-- Centered VietQR Logo -->
  <svg x="46" y="196" width="420" height="120" viewBox="0 0 3000 860">
    {inner}
  </svg>
</svg>'''

with open('public/vietqr-badge.svg', 'w', encoding='utf-8') as f:
    f.write(badge_svg)

print('Generated public/vietqr-badge.svg')

with sync_playwright() as p:
    browser = p.chromium.launch(channel="msedge", headless=True)
    page = browser.new_page(viewport={"width": 512, "height": 512})
    html_content = f'''<!DOCTYPE html><html><body style="margin:0;background:transparent;">
    {badge_svg}
    </body></html>'''
    page.set_content(html_content)
    page.screenshot(path="public/vietqr-badge.png", omit_background=True)
    browser.close()

print('Rendered public/vietqr-badge.png')
