from PIL import Image
import os

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_path = os.path.join(root_dir, "figma_screenshot_full.png")
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return
        
    print(f"Opening {img_path}...")
    img = Image.open(img_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    width, height = img.size
    
    # Get background color from the top-left corner
    bg_color = img.getpixel((5, 5))
    print(f"Background color detected: {bg_color}")
    
    # Find bounding box of pixels that are different from the background color
    xmin, ymin, xmax, ymax = width, height, 0, 0
    
    # Scan to find non-bg pixels
    # To be extremely robust, we allow a tolerance
    tolerance = 15
    for y in range(0, height, 2):
        for x in range(0, width, 2):
            r, g, b = img.getpixel((x, y))
            # Calculate distance from background color
            dist = abs(r - bg_color[0]) + abs(g - bg_color[1]) + abs(b - bg_color[2])
            if dist > tolerance:
                if x < xmin: xmin = x
                if x > xmax: xmax = x
                if y < ymin: ymin = y
                if y > ymax: ymax = y
                
    if xmin >= xmax or ymin >= ymax:
        print("Could not detect any bounding box different from background!")
        # Fallback to a hardcoded center crop
        xmin, ymin, xmax, ymax = width // 4, height // 6, 3 * width // 4, 5 * height // 6
        
    print(f"Bounding box detected: X: {xmin} to {xmax} | Y: {ymin} to {ymax}")
    print(f"Width: {xmax - xmin} | Height: {ymax - ymin}")
    
    # Crop the image
    crop_img = img.crop((xmin, ymin, xmax, ymax))
    out_path = os.path.join(root_dir, "figma_screen_cropped.png")
    crop_img.save(out_path)
    print(f"Saved cropped screen to: {out_path}")

if __name__ == "__main__":
    main()
