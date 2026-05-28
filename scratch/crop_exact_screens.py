from PIL import Image
import os

def crop_exact_phone(img_path, out_path):
    if not os.path.exists(img_path):
        return False
        
    img = Image.open(img_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    width, height = img.size
    
    # We want to find the horizontal and vertical boundaries of the dark phone screen.
    # The phone screen has a dark charcoal/black background (R < 40, G < 40, B < 40).
    # Let's count how many dark pixels are in each column and each row.
    
    col_dark_counts = [0] * width
    row_dark_counts = [0] * height
    
    dark_threshold = 40
    
    for y in range(height):
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            if r < dark_threshold and g < dark_threshold and b < dark_threshold:
                col_dark_counts[x] += 1
                row_dark_counts[y] += 1
                
    # Find horizontal bounds of the dark column
    # The dark column is continuous and should be centered.
    xmin, xmax = 0, width
    
    # Let's find columns that have a substantial number of dark pixels (e.g. > 10% of height)
    min_dark_pixels_col = height * 0.05
    
    # Scan from left to find start of dark column
    found_start = False
    for x in range(width):
        if col_dark_counts[x] > min_dark_pixels_col:
            xmin = x
            found_start = True
            break
            
    # Scan from right to find end of dark column
    found_end = False
    for x in range(width - 1, -1, -1):
        if col_dark_counts[x] > min_dark_pixels_col:
            xmax = x
            found_end = True
            break
            
    # Find vertical bounds of the dark column
    ymin, ymax = 0, height
    min_dark_pixels_row = (xmax - xmin) * 0.1
    
    for y in range(height):
        if row_dark_counts[y] > min_dark_pixels_row:
            ymin = y
            break
            
    for y in range(height - 1, -1, -1):
        if row_dark_counts[y] > min_dark_pixels_row:
            ymax = y
            break
            
    crop_w = xmax - xmin
    crop_h = ymax - ymin
    print(f"File: {os.path.basename(img_path)} | Exact Screen detected: X: {xmin} to {xmax} ({crop_w}px) | Y: {ymin} to {ymax} ({crop_h}px)")
    
    # If the detected size is reasonable, crop it!
    if 250 <= crop_w <= 900 and 500 <= crop_h <= 1800:
        crop_img = img.crop((xmin, ymin, xmax, ymax))
        crop_img.save(out_path)
        print(f"  Successfully cropped and saved exact screen: {out_path}")
    else:
        # Fallback to standard center crop if scanning fails
        print("  Scanning returned unrealistic dimensions. Using fallback center crop.")
        center_w = 480
        center_h = 1000
        xmin = (width - center_w) // 2
        ymin = (height - center_h) // 2
        crop_img = img.crop((xmin, ymin, xmin + center_w, ymin + center_h))
        crop_img.save(out_path)
        
    return True

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    screenshots_dir = os.path.join(root_dir, "extracted_figma_screens")
    
    for i in range(1, 7):
        in_path = os.path.join(screenshots_dir, f"screen_{i}.png")
        out_path = os.path.join(screenshots_dir, f"screen_{i}_exact.png")
        crop_exact_phone(in_path, out_path)

if __name__ == "__main__":
    main()
