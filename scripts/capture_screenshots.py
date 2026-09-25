import os
import sys
import time
import subprocess
import urllib.request
from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SCREENSHOT_DIR = os.path.join(os.getcwd(), 'docs', 'screenshots')
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def wait_for_server(url, timeout=15):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(url) as response:
                if response.status == 200:
                    return True
        except Exception:
            time.sleep(0.5)
    return False

def main():
    print("Starting Vite preview on port 4173...")
    proc = subprocess.Popen(
        ['npx', 'vite', 'preview', '--port', '4173', '--host', '127.0.0.1'],
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    server_url = 'http://127.0.0.1:4173/'
    if not wait_for_server(server_url):
        print("Failed to connect to Vite preview!")
        proc.kill()
        sys.exit(1)

    print("Server ready at", server_url)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(channel="msedge", headless=True)

            # 1. Desktop context
            context = browser.new_context(viewport={"width": 1280, "height": 900})
            page = context.new_page()

            print("Navigating to app...")
            page.goto(server_url, wait_until="networkidle")
            page.wait_for_timeout(1000)

            # 1. desktop_single_default.png
            print("Capturing 1: desktop_single_default.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_single_default.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_single.png"), full_page=False)

            # 2. desktop_single_style.png
            print("Capturing 2: desktop_single_style.png")
            style_tab = page.locator('button[role="tab"]:has-text("Giao diện")').first
            if style_tab.is_visible():
                style_tab.click()
                page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_single_style.png"), full_page=False)

            # 3. desktop_single_logo.png
            print("Capturing 3: desktop_single_logo.png")
            logo_tab = page.locator('button[role="tab"]:has-text("Logo")').first
            if logo_tab.is_visible():
                logo_tab.click()
                page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_single_logo.png"), full_page=False)

            # 4. desktop_single_advanced.png
            print("Capturing 4: desktop_single_advanced.png")
            adv_tab = page.locator('button[role="tab"]:has-text("Nâng cao")').first
            if adv_tab.is_visible():
                adv_tab.click()
                page.wait_for_timeout(500)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_single_advanced.png"), full_page=False)

            # Switch to Bulk Mode
            print("Switching to Bulk Mode...")
            bulk_btn = page.locator('button[role="tab"]:has-text("Tạo Hàng Loạt")').first
            bulk_btn.click()
            page.wait_for_timeout(800)

            # 5. desktop_bulk_data.png
            print("Capturing 5: desktop_bulk_data.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_data.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_step1_data.png"), full_page=False)

            # Switch to Text Mode in Step 1
            print("Switching to text mode and pasting sample data...")
            text_tab = page.locator('button:has-text("Dán danh sách")').first
            text_tab.click()
            page.wait_for_timeout(400)

            sample_btn = page.locator('button:has-text("Dán dữ liệu mẫu")').first
            sample_btn.click()
            page.wait_for_timeout(600)

            # Click Continue to Step 2
            continue_btn = page.locator('button:has-text("Tiếp tục")').first
            continue_btn.click()
            page.wait_for_timeout(800)

            # 6. desktop_bulk_mapping.png
            print("Capturing 6: desktop_bulk_mapping.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_mapping.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_step2_mapping.png"), full_page=False)

            # Click Continue to Step 3
            continue_btn = page.locator('button:has-text("Tiếp tục")').first
            continue_btn.click()
            page.wait_for_timeout(800)

            # 7. desktop_bulk_design.png
            print("Capturing 7: desktop_bulk_design.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_design.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_step3_design.png"), full_page=False)

            # Click Continue to Step 4
            continue_btn = page.locator('button:has-text("Tiếp tục")').first
            continue_btn.click()
            page.wait_for_timeout(800)

            # 8. desktop_bulk_generate.png
            print("Capturing 8: desktop_bulk_generate.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_generate.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_step4_generate.png"), full_page=False)

            # Click Generate button
            print("Clicking Generate button...")
            gen_btn = page.locator('button:has-text("mã QR")').first
            gen_btn.click()
            print("Waiting for batch generation to complete...")
            page.wait_for_selector('text="Hoàn tất xử lý lô mã QR!"', timeout=25000)
            page.wait_for_timeout(1000)

            # 9. desktop_bulk_results.png
            print("Capturing 9: desktop_bulk_results.png")
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_results.png"), full_page=False)
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_bulk_step5_results.png"), full_page=False)

            context.close()

            # 2. Mobile context
            print("Starting Mobile Context (390x844)...")
            mobile_ctx = browser.new_context(viewport={"width": 390, "height": 844}, is_mobile=True)
            mobile_page = mobile_ctx.new_page()
            mobile_page.goto(server_url, wait_until="networkidle")
            mobile_page.wait_for_timeout(1000)

            # 10. mobile_single.png
            print("Capturing 10: mobile_single.png")
            mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_single.png"), full_page=False)

            # Switch to Bulk Mode on mobile
            bulk_mobile_btn = mobile_page.locator('button[role="tab"]:has-text("Tạo Hàng Loạt")').first
            bulk_mobile_btn.click()
            mobile_page.wait_for_timeout(800)

            # 11. mobile_bulk.png
            print("Capturing 11: mobile_bulk.png")
            mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_bulk.png"), full_page=False)

            mobile_ctx.close()
            browser.close()

    finally:
        print("Killing preview process...")
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()

    print("All 11 screenshots successfully captured into:", SCREENSHOT_DIR)

if __name__ == '__main__':
    main()
