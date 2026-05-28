import os
from moviepy import VideoFileClip

workspace = r"c:\Users\ASUS\Desktop\impactbbdo cone"
raw_dir = os.path.join(workspace, "downloaded_videos")

videos = [
    {
        "raw": "video_1_raw.mp4",
        "full": "trailer_1_full.mp4",
        "preview": "trailer_1_preview.mp4",
        "aspect_ratio": "widescreen"
    },
    {
        "raw": "video_2_raw.mp4",
        "full": "trailer_2_full.mp4",
        "preview": "trailer_2_preview.mp4",
        "aspect_ratio": "widescreen"
    },
    {
        "raw": "video_3_raw.mp4",
        "full": "trailer_3_full.mp4",
        "preview": "trailer_3_preview.mp4",
        "aspect_ratio": "widescreen"
    },
    {
        "raw": "video_4_raw.mp4",
        "full": "trailer_4_full.mp4",
        "preview": "trailer_4_preview.mp4",
        "aspect_ratio": "custom"
    }
]

def process_video(info):
    raw_path = os.path.join(raw_dir, info["raw"])
    full_path = os.path.join(workspace, info["full"])
    preview_path = os.path.join(workspace, info["preview"])
    
    if not os.path.exists(raw_path):
        print(f"Raw file {raw_path} not found!")
        return
        
    print(f"\n==========================================")
    print(f"PROCESSING: {info['raw']}")
    print(f"==========================================")
    
    # 1. Compress Full Video
    print("Step 1: Compressing full video...")
    try:
        clip = VideoFileClip(raw_path)
        
        # Resize to max 1280 width (720p equivalent) to save space while maintaining sharpness
        target_width = 1280
        if clip.w > target_width:
            print(f"Resizing full video from {clip.w}x{clip.h} to width {target_width}...")
            full_clip = clip.resized(width=target_width)
        else:
            full_clip = clip
            
        print(f"Saving full video to {full_path} (H.264 @ 1000k)...")
        full_clip.write_videofile(
            full_path,
            codec="libx264",
            audio_codec="aac",
            bitrate="1000k",
            threads=4,
            logger=None
        )
        print(f"Full video successfully created: {os.path.getsize(full_path)} bytes")
        
        if full_clip != clip:
            full_clip.close()
        clip.close()
    except Exception as e:
        print(f"Error compressing full video {info['raw']}: {e}")
        # Try a fallback without audio if audio codec failed
        print("Retrying full video compression without audio...")
        try:
            clip = VideoFileClip(raw_path)
            if clip.w > target_width:
                full_clip = clip.resized(width=target_width)
            else:
                full_clip = clip
            full_clip.write_videofile(
                full_path,
                codec="libx264",
                audio=False,
                bitrate="1000k",
                threads=4,
                logger=None
            )
            print(f"Full video successfully created (NO AUDIO): {os.path.getsize(full_path)} bytes")
            if full_clip != clip:
                full_clip.close()
            clip.close()
        except Exception as e2:
            print(f"Fallback also failed: {e2}")

    # 2. Create 3-Second Lightweight Preview Loop
    print("\nStep 2: Creating 3-second lightweight preview loop...")
    try:
        clip = VideoFileClip(raw_path)
        
        # Clip to first 3 seconds
        duration = min(3.0, clip.duration)
        sub_clip = clip.subclipped(0, duration)
        
        # Downscale to 480px width for fast loading on grid cards
        preview_width = 480
        preview_clip = sub_clip.resized(width=preview_width)
        
        print(f"Saving preview loop to {preview_path} (H.264 @ 200k, MUTED)...")
        preview_clip.write_videofile(
            preview_path,
            codec="libx264",
            audio=False, # Mute it to save significant bytes and ensure fast loading
            bitrate="200k",
            threads=4,
            logger=None
        )
        print(f"Preview loop successfully created: {os.path.getsize(preview_path)} bytes")
        
        preview_clip.close()
        sub_clip.close()
        clip.close()
    except Exception as e:
        print(f"Error creating preview loop for {info['raw']}: {e}")

if __name__ == "__main__":
    for video in videos:
        process_video(video)
    print("\nAll video processing complete!")
