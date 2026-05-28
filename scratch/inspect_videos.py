from moviepy import VideoFileClip
import os

video_files = [
    "downloaded_videos/video_1_raw.mp4",
    "downloaded_videos/video_2_raw.mp4",
    "downloaded_videos/video_3_raw.mp4",
    "downloaded_videos/video_4_raw.mp4"
]

for vf in video_files:
    if os.path.exists(vf):
        clip = VideoFileClip(vf)
        print(f"File: {vf}")
        print(f"  Duration: {clip.duration:.2f} seconds")
        print(f"  Dimensions: {clip.w}x{clip.h}")
        print(f"  Size: {os.path.getsize(vf)} bytes")
        clip.close()
    else:
        print(f"File not found: {vf}")
