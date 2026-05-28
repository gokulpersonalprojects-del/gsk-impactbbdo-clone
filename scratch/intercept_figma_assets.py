import asyncio
from playwright.async_api import async_playwright
import os
import urllib.parse

async def main():
    # Use the prototype URL that is publicly viewable without figma login prompts
    url = "https://www.figma.com/proto/vQCGfU9G9ETS97J9UpUUIb/Design-Challenge_1?page-id=273%3A2118&type=design&node-id=273-3120&viewport=1461%2C278%2C0.18&t=x5CiHHv1QnEC62T8-1&scaling=scale-down&starting-point-node-id=273%3A2151&mode=design"
    print(f"Launching headless browser to load Figma file: {url}")
    
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    assets_dir = os.path.join(dest_dir, "figma_assets")
    os.makedirs(assets_dir, exist_ok=True)
    
    asset_count = 0
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800}
        )
        page = await context.new_page()
        
        # Intercept network responses
        async def handle_response(response):
            nonlocal asset_count
            url = response.url
            # We want to catch Figma S3 image CDN URLs
            if "s3-alpha-sig.figma.com/img" in url or "s3-alpha" in url:
                try:
                    content_type = response.headers.get("content-type", "")
                    if "image" in content_type or "octet-stream" in content_type or url.endswith(('.png', '.jpg', '.jpeg', '.svg')):
                        body = await response.body()
                        asset_count += 1
                        ext = ".png"
                        if "jpeg" in content_type or "jpg" in content_type:
                            ext = ".jpg"
                        elif "svg" in content_type:
                            ext = ".svg"
                            
                        # Generate name based on url hash or index
                        filename = f"figma_asset_{asset_count:02d}{ext}"
                        filepath = os.path.join(assets_dir, filename)
                        with open(filepath, "wb") as f:
                            f.write(body)
                        print(f"Intercepted and saved: {filename} | Size: {len(body)} bytes | URL: {url[:100]}...")
                except Exception as e:
                    # Some responses might not be readable if they are empty or failed
                    pass
                    
        page.on("response", handle_response)
        
        print("Navigating to Figma...")
        try:
            await page.goto(url, wait_until="load", timeout=90000)
        except Exception as e:
            print(f"Navigation timed out or errored: {e}. Continuing to wait for assets...")
            
        print("Waiting 45 seconds to let Figma editor load layers and fetch all image assets from CDN...")
        await asyncio.sleep(45)
        
        # Also take a screenshot of the editor to verify what loaded
        screenshot_path = os.path.join(dest_dir, "figma_editor_screenshot.png")
        await page.screenshot(path=screenshot_path)
        print(f"Editor screenshot saved to: {screenshot_path}")
        
        await browser.close()
        
    print(f"Asset interception finished. Total assets saved: {asset_count}")

if __name__ == "__main__":
    asyncio.run(main())
