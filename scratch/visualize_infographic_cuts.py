from PIL import Image
import os

def main():
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    img_path = os.path.join(root_dir, "behance_screen_2.png")
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} does not exist.")
        return
        
    out_dir = os.path.join(root_dir, "scratch", "behance_cuts")
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"Opening {img_path}...")
    with Image.open(img_path) as img:
        width, height = img.size
        print(f"Width: {width}, Height: {height}")
        
        # We will slice the image into blocks of 1920 x 1500 pixels.
        block_height = 1500
        num_blocks = (height + block_height - 1) // block_height
        
        print(f"Slicing into {num_blocks} blocks of height {block_height}...")
        
        for i in range(num_blocks):
            ymin = i * block_height
            ymax = min((i + 1) * block_height, height)
            
            box = (0, ymin, width, ymax)
            crop_img = img.crop(box)
            
            # Save as low-quality JPG to save space
            out_path = os.path.join(out_dir, f"cut_{i+1:02d}.jpg")
            # Convert to RGB if needed (mode P or RGBA)
            if crop_img.mode != 'RGB':
                crop_img = crop_img.convert('RGB')
            crop_img.save(out_path, "JPEG", quality=60)
            print(f"Saved block {i+1} to {out_path} (vertical range: {ymin} to {ymax})")

if __name__ == "__main__":
    main()
