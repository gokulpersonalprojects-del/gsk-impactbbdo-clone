import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    url = "https://gokulux.framer.website/project-1"
    print(f"Loading Framer URL: {url} ...")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        # Navigate to the page
        await page.goto(url, wait_until="networkidle", timeout=60000)
        
        # Extract all text on the page
        print("Extracting page body text...")
        text_content = await page.inner_text("body")
        
        # Save the scraped text content
        dest_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
        output_path = os.path.join(dest_dir, "scratch", "upsc_scraped_details.txt")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text_content)
            
        print(f"Successfully scraped text. Length: {len(text_content)} characters.")
        print(f"Saved details to: {output_path}")
        
        # Take a screenshot as well to visually check the page layout
        screenshot_path = os.path.join(dest_dir, "scratch", "upsc_framer_screenshot.png")
        await page.screenshot(path=screenshot_path, full_page=True)
        print(f"Full-page screenshot saved to: {screenshot_path}")
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
