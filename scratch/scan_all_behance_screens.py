import os
from PIL import Image

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_path = os.path.join(root_dir, "behance_screen_2.png")
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return
        
    img = Image.open(img_path)
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    width, height = img.size
    print(f"Image dimensions: {width} x {height}")
    
    # We will scan the image vertically.
    # At each row, we find continuous dark runs (R < 35, G < 35, B < 35)
    # that have a width between 200 and 1200 pixels.
    dark_blocks = []
    step_y = 5 # finer scan
    
    for y in range(0, height, step_y):
        dark_runs = []
        in_run = False
        run_start = 0
        
        for x in range(width):
            r, g, b = img.getpixel((x, y))
            # Dark mode Netflix colors are often slightly reddish or charcoal, so let's allow tolerance
            is_dark = (r < 40 and g < 40 and b < 40)
            
            if is_dark:
                if not in_run:
                    in_run = True
                    run_start = x
            else:
                if in_run:
                    in_run = False
                    run_width = x - run_start
                    if 200 <= run_width <= 1200:
                        dark_runs.append((run_start, x, run_width))
                        
        if in_run:
            run_width = width - run_start
            if 200 <= run_width <= 1200:
                dark_runs.append((run_start, width, run_width))
                
        if dark_runs:
            dark_blocks.append((y, dark_runs))
            
    # Group contiguous rows
    rectangles = []
    current_rects = [] # list of active rectangles
    
    for y, runs in dark_blocks:
        # Match each run on this row with active rectangles
        next_rects = []
        for x1, x2, w in runs:
            matched = False
            for r in current_rects:
                # Check overlap and vertical continuity
                prev_y = r['y_end']
                overlap_x = max(0, min(r['x_end'], x2) - max(r['x_start'], x1))
                overlap_ratio = overlap_x / min(r['x_end'] - r['x_start'], x2 - x1)
                
                if y - prev_y <= 25 and overlap_ratio > 0.6:
                    r['y_end'] = y
                    r['x_start'] = min(r['x_start'], x1)
                    r['x_end'] = max(r['x_end'], x2)
                    r['widths'].append(w)
                    next_rects.append(r)
                    current_rects.remove(r)
                    matched = True
                    break
            
            if not matched:
                next_rects.append({
                    'y_start': y,
                    'y_end': y,
                    'x_start': x1,
                    'x_end': x2,
                    'widths': [w]
                })
                
        # Any current_rects that were not matched are finished!
        for r in current_rects:
            rectangles.append(r)
        current_rects = next_rects
        
    rectangles.extend(current_rects)
    
    print(f"\nDetected {len(rectangles)} continuous vertical dark regions:")
    valid_regions = []
    for r in rectangles:
        h_span = r['y_end'] - r['y_start']
        w_avg = sum(r['widths']) / len(r['widths'])
        
        # A phone screen should be vertical, so height > width (usually height >= 1.5 * width)
        if h_span >= 300 and w_avg >= 200:
            aspect_ratio = h_span / w_avg
            if 1.0 <= aspect_ratio <= 3.0:
                valid_regions.append((h_span, w_avg, r))
                
    # Sort by height descending
    valid_regions.sort(key=lambda x: x[0], reverse=True)
    
    print(f"Found {len(valid_regions)} potential mobile screens in Behance presentation:")
    for idx, (h, w, r) in enumerate(valid_regions[:15]):
        print(f"[{idx+1}] Y-range: {r['y_start']} - {r['y_end']} (height: {h}) | X-range: {r['x_start']} - {r['x_end']} (width: {w:.1f}) | Aspect: {h/w:.2f}")
        
        # Crop and save these top screens
        ymin = max(0, r['y_start'] - 10)
        ymax = min(height, r['y_end'] + 10)
        xmin = max(0, r['x_start'] - 10)
        xmax = min(width, r['x_end'] + 10)
        
        box = (xmin, ymin, xmax, ymax)
        crop_img = img.crop(box)
        crop_img.save(os.path.join(root_dir, f"behance_screen_crop_{idx+1}.png"))

if __name__ == "__main__":
    main()
