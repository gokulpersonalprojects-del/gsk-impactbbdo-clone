import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    url = "https://www.figma.com/proto/vQCGfU9G9ETS97J9UpUUIb/Design-Challenge_1?page-id=273%3A2118&type=design&node-id=273-3120&viewport=1461%2C278%2C0.18&t=x5CiHHv1QnEC62T8-1&scaling=scale-down&starting-point-node-id=273%3A2151&mode=design&hide-ui=1"
    print(f"Launching headless browser...")
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Set a standard phone-like viewport
        context = await browser.new_context(
            viewport={"width": 800, "height": 1200},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        print(f"Navigating to Figma Prototype URL: {url} ...")
        await page.goto(url, wait_until="load", timeout=60000)
        
        print("Waiting 25 seconds for Figma canvas to initialize and render...")
        await asyncio.sleep(25)
        
        # Take a screenshot of the entire page
        dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        screenshot_path = os.path.join(dest_dir, "figma_screenshot_full.png")
        await page.screenshot(path=screenshot_path)
        print(f"Screenshot successfully saved to: {screenshot_path}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
