from PIL import Image
import os

def crop_screen(img_path, out_path):
    if not os.path.exists(img_path):
        print(f"File {img_path} does not exist.")
        return False
        
    img = Image.open(img_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    width, height = img.size
    
    # Figma prototype player background is typically charcoal (#0F0F0F) or white.
    # Let's inspect the corner pixels to see what the background is.
    bg_color = img.getpixel((5, 5))
    print(f"File: {os.path.basename(img_path)} | Size: {width} x {height} | BG Detected: {bg_color}")
    
    # We want to find the bounding box of elements that are different from the background.
    xmin, ymin, xmax, ymax = width, height, 0, 0
    tolerance = 20
    
    for y in range(0, height, 2):
        for x in range(0, width, 2):
            r, g, b = img.getpixel((x, y))
            dist = abs(r - bg_color[0]) + abs(g - bg_color[1]) + abs(b - bg_color[2])
            if dist > tolerance:
                if x < xmin: xmin = x
                if x > xmax: xmax = x
                if y < ymin: ymin = y
                if y > ymax: ymax = y
                
    if xmin >= xmax or ymin >= ymax:
        print("  Could not detect any different content. Saving original.")
        img.save(out_path)
        return True
        
    # Crop the detected content
    # Add a tiny margin of 2px for clean borders
    xmin = max(0, xmin - 2)
    ymin = max(0, ymin - 2)
    xmax = min(width, xmax + 2)
    ymax = min(height, ymax + 2)
    
    crop_w = xmax - xmin
    crop_h = ymax - ymin
    print(f"  Cropped area: X: {xmin} to {xmax} | Y: {ymin} to {ymax} | Size: {crop_w} x {crop_h}")
    
    # If the cropped area is extremely small or matches the background, skip cropping
    if crop_w < 100 or crop_h < 100:
        print("  Cropped area too small. Saving original.")
        img.save(out_path)
    else:
        crop_img = img.crop((xmin, ymin, xmax, ymax))
        crop_img.save(out_path)
        print(f"  Successfully saved cropped image to: {out_path}")
        
    return True

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    screenshots_dir = os.path.join(root_dir, "extracted_figma_screens")
    
    for i in range(1, 7):
        in_path = os.path.join(screenshots_dir, f"screen_{i}.png")
        out_path = os.path.join(screenshots_dir, f"screen_{i}_cropped.png")
        crop_screen(in_path, out_path)

if __name__ == "__main__":
    main()
