import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    # Use the public prototype URL
    url = "https://www.figma.com/proto/vQCGfU9G9ETS97J9UpUUIb/Design-Challenge_1?page-id=273%3A2118&type=design&node-id=273-3120&viewport=1461%2C278%2C0.18&t=x5CiHHv1QnEC62T8-1&scaling=scale-down&starting-point-node-id=273%3A2151&mode=design&hide-ui=1"
    print(f"Launching browser to load Figma prototype...")
    
    dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    screenshots_dir = os.path.join(dest_dir, "extracted_figma_screens")
    os.makedirs(screenshots_dir, exist_ok=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Set a vertical phone viewport with double scale factor for high res
        context = await browser.new_context(
            viewport={"width": 600, "height": 1100},
            device_scale_factor=2
        )
        page = await context.new_page()
        
        print(f"Navigating to Figma: {url}")
        await page.goto(url, wait_until="load", timeout=90000)
        
        print("Waiting 25 seconds for the prototype to load and initialize...")
        await asyncio.sleep(25)
        
        # We will take screenshots of 6 consecutive screens by pressing the Right Arrow key
        for i in range(1, 7):
            filepath = os.path.join(screenshots_dir, f"screen_{i}.png")
            print(f"Capturing Screen {i}...")
            await page.screenshot(path=filepath)
            print(f"  Saved Screen {i} to {filepath}")
            
            # Press the Right Arrow key to navigate to the next frame in figma's flow
            print("  Pressing ArrowRight to navigate to the next frame...")
            await page.keyboard.press("ArrowRight")
            await asyncio.sleep(3)
            
        await browser.close()
        
    print("Sequential prototype screen capture complete!")

if __name__ == "__main__":
    asyncio.run(main())
