import os
from PIL import Image

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_path = os.path.join(root_dir, "behance_screen_2.png")
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return
        
    print(f"Opening {img_path} for column scanning...")
    img = Image.open(img_path)
    # Convert to RGB to read colors
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    width, height = img.size
    print(f"Image dimensions: {width} x {height}")
    
    # We will scan the image vertically.
    # At each row, we scan horizontally to find continuous dark runs (R < 30, G < 30, B < 30)
    # that have a width between 300 and 700 pixels.
    # Let's count how many such runs we find and group them vertically.
    
    dark_blocks = []
    
    # Scan every 10th row to make it super fast
    step_y = 10
    for y in range(0, height, step_y):
        dark_runs = []
        in_run = False
        run_start = 0
        
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            is_dark = (r < 30 and g < 30 and b < 30)
            
            if is_dark:
                if not in_run:
                    in_run = True
                    run_start = x
            else:
                if in_run:
                    in_run = False
                    run_width = x - run_start
                    if 300 <= run_width <= 700:
                        dark_runs.append((run_start, x, run_width))
                        
        if in_run:
            run_width = width - run_start
            if 300 <= run_width <= 700:
                dark_runs.append((run_start, width, run_width))
                
        if dark_runs:
            # We found a dark run at row y!
            dark_blocks.append((y, dark_runs))
            
    print(f"Scanned {len(dark_blocks)} rows containing candidate dark runs.")
    
    # Group contiguous rows with similar dark runs to identify dark rectangles
    rectangles = []
    current_rect = None
    
    # We allow a gap of up to 40 pixels vertically for continuity
    for y, runs in dark_blocks:
        # For simplicity, let's take the first run on this row
        x1, x2, w = runs[0]
        
        if current_rect is None:
            current_rect = {
                'y_start': y,
                'y_end': y,
                'x_start': x1,
                'x_end': x2,
                'widths': [w],
                'rows': [y]
            }
        else:
            # Check if this row is contiguous and overlaps horizontally
            # with the current rectangle
            prev_y = current_rect['y_end']
            overlap_x = max(0, min(current_rect['x_end'], x2) - max(current_rect['x_start'], x1))
            
            if y - prev_y <= 50 and overlap_x > 200:
                # Contiguous! Extend the rectangle
                current_rect['y_end'] = y
                current_rect['x_start'] = min(current_rect['x_start'], x1)
                current_rect['x_end'] = max(current_rect['x_end'], x2)
                current_rect['widths'].append(w)
                current_rect['rows'].append(y)
            else:
                # Not contiguous. Save previous and start new
                rectangles.append(current_rect)
                current_rect = {
                    'y_start': y,
                    'y_end': y,
                    'x_start': x1,
                    'x_end': x2,
                    'widths': [w],
                    'rows': [y]
                }
                
    if current_rect:
        rectangles.append(current_rect)
        
    print(f"\nDetected {len(rectangles)} continuous vertical dark regions:")
    valid_screens = []
    for idx, r in enumerate(rectangles):
        h_span = r['y_end'] - r['y_start']
        w_avg = sum(r['widths']) / len(r['widths'])
        # A phone screen typically has a height between 600 and 1500px in this 1920px width
        if h_span >= 400:
            print(f"[{idx+1}] Y-range: {r['y_start']} - {r['y_end']} (height: {h_span}) | X-range: {r['x_start']} - {r['x_end']} (avg width: {w_avg:.1f})")
            valid_screens.append(r)
            
    # Crop these candidate screens from behance_screen_2.png and save them as screen_candidate_*.png
    print("\nCropping and saving candidate screens...")
    for idx, r in enumerate(valid_screens):
        # Add some margin
        margin_y = 20
        margin_x = 10
        
        ymin = max(0, r['y_start'] - margin_y)
        ymax = min(height, r['y_end'] + margin_y)
        xmin = max(0, r['x_start'] - margin_x)
        xmax = min(width, r['x_end'] + margin_x)
        
        box = (xmin, ymin, xmax, ymax)
        crop_img = img.crop(box)
        
        out_name = f"behance_crop_{idx+1}.png"
        out_path = os.path.join(root_dir, out_name)
        crop_img.save(out_path)
        print(f"Saved candidate screen {idx+1} to {out_name} (dimensions: {xmax-xmin} x {ymax-ymin})")

if __name__ == "__main__":
    main()
