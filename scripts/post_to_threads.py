#!/usr/bin/env python3
"""
Post Genuary submissions to Threads as a thread.
Combines outputs from both /genuary (recipes) and /genuary-skills projects.

Threads API docs: https://developers.facebook.com/docs/threads

Note: Threads API requires publicly accessible image URLs. This script uses
GitHub raw URLs, so the repo must be public and images must be committed.
"""

import os
import sys
import json
import time
import requests
from datetime import datetime
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


# Threads API endpoint
THREADS_API = "https://graph.threads.net/v1.0"
MAX_IMAGE_SIZE = 8000000  # Threads allows up to 8MB for images


def compress_image(image_path: Path, max_size: int = MAX_IMAGE_SIZE) -> tuple[bytes, str]:
    """Compress an image to fit within max_size bytes. Returns (data, mime_type)."""
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    suffix = image_path.suffix.lower()
    
    # GIFs - Threads supports them but check size
    if suffix == ".gif":
        if len(image_data) <= max_size:
            return image_data, "image/gif"
        print(f"Warning: GIF {image_path} is too large ({len(image_data)} bytes)")
        return image_data, "image/gif"
    
    # If already under limit, return as-is
    if len(image_data) <= max_size:
        mime_types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}
        return image_data, mime_types.get(suffix, "image/png")
    
    # Need to compress
    if not HAS_PIL:
        print(f"Warning: Image {image_path} is {len(image_data)} bytes (>{max_size}), but PIL not available")
        return image_data, "image/png"
    
    print(f"Compressing {image_path} ({len(image_data)} bytes)...")
    
    img = Image.open(image_path)
    
    # Convert to RGB if necessary (for JPEG)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Try progressively lower quality
    for quality in [85, 70, 55, 40, 25]:
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=quality, optimize=True)
        compressed_data = buffer.getvalue()
        
        if len(compressed_data) <= max_size:
            print(f"Compressed to {len(compressed_data)} bytes (quality={quality})")
            return compressed_data, "image/jpeg"
    
    # If still too big, resize
    scale = 0.8
    while scale > 0.2:
        new_size = (int(img.width * scale), int(img.height * scale))
        resized = img.resize(new_size, Image.Resampling.LANCZOS)
        
        buffer = BytesIO()
        resized.save(buffer, format='JPEG', quality=50, optimize=True)
        compressed_data = buffer.getvalue()
        
        if len(compressed_data) <= max_size:
            print(f"Resized to {new_size} and compressed to {len(compressed_data)} bytes")
            return compressed_data, "image/jpeg"
        
        scale -= 0.1
    
    print(f"Warning: Could not compress image below {max_size} bytes")
    return compressed_data, "image/jpeg"


def get_public_image_url(image_path: Path) -> str:
    """Get a publicly accessible URL for an image using GitHub raw URL."""
    repo_root = Path(__file__).parent.parent
    relative_path = image_path.relative_to(repo_root)
    github_raw_url = f"https://raw.githubusercontent.com/blackgirlbytes/genuary2026/main/{relative_path}"
    print(f"Using GitHub URL: {github_raw_url}")
    return github_raw_url


def create_media_container(access_token: str, user_id: str, image_url: str = None, text: str = None, 
                           media_type: str = "IMAGE", is_carousel_item: bool = False, 
                           reply_to_id: str = None) -> str:
    """Create a media container for a post."""
    params = {
        "access_token": access_token,
        "media_type": media_type,
    }
    
    if image_url:
        params["image_url"] = image_url
    
    if text and not is_carousel_item:
        params["text"] = text
    
    if is_carousel_item:
        params["is_carousel_item"] = "true"
    
    if reply_to_id:
        params["reply_to_id"] = reply_to_id
    
    resp = requests.post(f"{THREADS_API}/{user_id}/threads", params=params)
    
    if not resp.ok:
        print(f"Error creating media container: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()["id"]


def create_carousel_container(access_token: str, user_id: str, children_ids: list, 
                               text: str = None, reply_to_id: str = None,
                               topic_tag: str = None) -> str:
    """Create a carousel container with multiple images."""
    params = {
        "access_token": access_token,
        "media_type": "CAROUSEL",
        "children": ",".join(children_ids),
    }
    
    if text:
        params["text"] = text
    
    if reply_to_id:
        params["reply_to_id"] = reply_to_id
    
    if topic_tag:
        params["text_post_app_info"] = json.dumps({"tagged_topic_display_name": topic_tag})
    
    resp = requests.post(f"{THREADS_API}/{user_id}/threads", params=params)
    
    if not resp.ok:
        print(f"Error creating carousel container: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()["id"]


def check_container_status(access_token: str, container_id: str) -> str:
    """Check the status of a media container."""
    params = {
        "access_token": access_token,
        "fields": "status,error_message",
    }
    
    resp = requests.get(f"{THREADS_API}/{container_id}", params=params)
    resp.raise_for_status()
    
    data = resp.json()
    if "error_message" in data and data["error_message"]:
        print(f"Container error: {data['error_message']}")
    
    return data.get("status", "UNKNOWN")


def wait_for_container(access_token: str, container_id: str, max_wait: int = 60) -> bool:
    """Wait for a container to be ready for publishing."""
    for _ in range(max_wait // 2):
        status = check_container_status(access_token, container_id)
        
        if status == "FINISHED":
            return True
        elif status == "ERROR":
            print(f"Container {container_id} failed processing")
            return False
        elif status in ["IN_PROGRESS", "PENDING"]:
            time.sleep(2)
        else:
            print(f"Unknown status: {status}")
            time.sleep(2)
    
    print(f"Timeout waiting for container {container_id}")
    return False


def publish_container(access_token: str, user_id: str, container_id: str) -> str:
    """Publish a media container."""
    params = {
        "access_token": access_token,
        "creation_id": container_id,
    }
    
    resp = requests.post(f"{THREADS_API}/{user_id}/threads_publish", params=params)
    
    if not resp.ok:
        print(f"Error publishing: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()["id"]


def find_output_image(day_folder: Path) -> Path | None:
    """Find the best output image in a day's output folder."""
    output_folder = day_folder / "output"
    if not output_folder.exists():
        return None
    
    # Look for images, prefer gif for animation, but check size
    for ext in [".gif", ".png", ".jpg", ".jpeg"]:
        images = list(output_folder.glob(f"*{ext}"))
        if images:
            img = images[0]
            # Skip very large files
            if img.stat().st_size > MAX_IMAGE_SIZE:
                print(f"Image too large ({img.stat().st_size} bytes), trying next...")
                continue
            return img
    
    return None


def get_day_number() -> int:
    """Get the day number to post. Uses MANUAL_DAY env var or current date."""
    manual_day = os.environ.get("MANUAL_DAY", "").strip()
    if manual_day:
        return int(manual_day)
    
    # Calculate day based on January 2026
    today = datetime.now()
    if today.month == 1 and today.year == 2026:
        return today.day
    
    # For testing outside January 2026
    return today.day


def load_prompts(repo_root: Path) -> dict:
    """Load prompts from prompts.json."""
    prompts_path = repo_root / "genuary" / "prompts.json"
    if not prompts_path.exists():
        prompts_path = repo_root / "genuary-skills" / "prompts.json"
    
    with open(prompts_path) as f:
        return json.load(f)


def check_already_posted(repo_root: Path, day: int) -> bool:
    """Check if we already posted for this day."""
    posted_file = repo_root / ".posted_days_threads"
    if not posted_file.exists():
        return False
    
    with open(posted_file) as f:
        posted_days = f.read().strip().split("\n")
    
    return str(day) in posted_days


def mark_as_posted(repo_root: Path, day: int):
    """Mark a day as posted."""
    posted_file = repo_root / ".posted_days_threads"
    posted_days = []
    
    if posted_file.exists():
        with open(posted_file) as f:
            posted_days = f.read().strip().split("\n")
    
    if str(day) not in posted_days:
        posted_days.append(str(day))
    
    with open(posted_file, "w") as f:
        f.write("\n".join(posted_days))


def main():
    # Get credentials from environment
    access_token = os.environ.get("THREADS_ACCESS_TOKEN")
    user_id = os.environ.get("THREADS_USER_ID")
    
    if not access_token or not user_id:
        print("Error: THREADS_ACCESS_TOKEN and THREADS_USER_ID must be set")
        sys.exit(1)
    
    # Determine paths
    repo_root = Path(__file__).parent.parent
    day = get_day_number()
    day_str = f"day{day:02d}"
    
    print(f"Preparing to post for Day {day}...")
    
    # Check if already posted
    if check_already_posted(repo_root, day):
        print(f"Day {day} already posted. Skipping.")
        sys.exit(0)
    
    # Find outputs
    genuary_day = repo_root / "genuary" / "days" / day_str
    skills_day = repo_root / "genuary-skills" / "days" / day_str
    
    genuary_image = find_output_image(genuary_day)
    skills_image = find_output_image(skills_day)
    
    if not genuary_image:
        print(f"No output found for genuary/{day_str}")
        sys.exit(0)
    
    if not skills_image:
        print(f"No output found for genuary-skills/{day_str}")
        sys.exit(0)
    
    print(f"Found genuary output: {genuary_image}")
    print(f"Found skills output: {skills_image}")
    
    # Load prompt info
    prompts = load_prompts(repo_root)
    prompt_info = prompts.get(str(day), {})
    prompt_title = prompt_info.get("title", f"Day {day}")
    
    # Get public URLs for images
    print("Getting public URLs for images...")
    genuary_url = get_public_image_url(genuary_image)
    skills_url = get_public_image_url(skills_image)
    
    # Create thread
    # Post 1: Main intro with carousel of both images
    post1_text = f"""This is not me posting in real time! I wrote and scheduled this post with goose. It's my submission for Genuary day {day}: "{prompt_title}"

The entire process is automated from end to end using goose recipes, Agent skills, shell scripts, and github actions.

#genuary #genuary{day}"""
    
    print("Creating carousel items...")
    
    # Create carousel items first
    item1_id = create_media_container(access_token, user_id, genuary_url, is_carousel_item=True)
    item2_id = create_media_container(access_token, user_id, skills_url, is_carousel_item=True)
    
    # Wait for items to process
    print("Waiting for carousel items to process...")
    if not wait_for_container(access_token, item1_id):
        print("Failed to process first carousel item")
        sys.exit(1)
    if not wait_for_container(access_token, item2_id):
        print("Failed to process second carousel item")
        sys.exit(1)
    
    # Create carousel container with AI topic tag
    print("Creating carousel post with AI topic tag...")
    carousel_id = create_carousel_container(access_token, user_id, [item1_id, item2_id], text=post1_text, topic_tag="AI")
    
    if not wait_for_container(access_token, carousel_id):
        print("Failed to process carousel")
        sys.exit(1)
    
    # Publish carousel
    print("Publishing carousel...")
    post1_id = publish_container(access_token, user_id, carousel_id)
    print(f"Published post 1: {post1_id}")
    
    # Small delay between posts
    time.sleep(2)
    
    # Post 2: Recipe output (reply)
    post2_text = f"""Made this with goose recipes and a shell script

genuary2026.vercel.app/genuary/days/day{day:02d}/"""
    
    print("Creating post 2 (recipes)...")
    container2_id = create_media_container(access_token, user_id, genuary_url, text=post2_text, reply_to_id=post1_id)
    if not wait_for_container(access_token, container2_id):
        print("Failed to process post 2")
        sys.exit(1)
    post2_id = publish_container(access_token, user_id, container2_id)
    print(f"Published post 2: {post2_id}")
    
    time.sleep(2)
    
    # Post 3: Skills output (reply)
    post3_text = f"""Made this with Agent Skills

genuary2026.vercel.app/genuary-skills/days/day{day:02d}/"""
    
    print("Creating post 3 (skills)...")
    container3_id = create_media_container(access_token, user_id, skills_url, text=post3_text, reply_to_id=post2_id)
    if not wait_for_container(access_token, container3_id):
        print("Failed to process post 3")
        sys.exit(1)
    post3_id = publish_container(access_token, user_id, container3_id)
    print(f"Published post 3: {post3_id}")
    
    time.sleep(2)
    
    # Post 4: Repo link (text only reply)
    post4_text = """My repo has the code AND transcripts with my agent:
github.com/blackgirlbytes/genuary2026

I did this to learn agentic coding and participate without heavy commitment."""
    
    print("Creating post 4 (repo link)...")
    container4_id = create_media_container(access_token, user_id, text=post4_text, media_type="TEXT", reply_to_id=post3_id)
    if not wait_for_container(access_token, container4_id):
        print("Failed to process post 4")
        sys.exit(1)
    post4_id = publish_container(access_token, user_id, container4_id)
    print(f"Published post 4: {post4_id}")
    
    time.sleep(2)
    
    # Post 5: More context (text only reply)
    post5_text = """Although this is heavily automated and built by AI, it still has direction from me. I told goose which AI cliches I did not like and which styles I liked."""
    
    print("Creating post 5 (context)...")
    container5_id = create_media_container(access_token, user_id, text=post5_text, media_type="TEXT", reply_to_id=post4_id)
    if not wait_for_container(access_token, container5_id):
        print("Failed to process post 5")
        sys.exit(1)
    post5_id = publish_container(access_token, user_id, container5_id)
    print(f"Published post 5: {post5_id}")
    
    time.sleep(2)
    
    # Post 6: Examples (text only reply)
    post6_text = """For example, I told goose: You are a creative coder with artistic vision, not just a coding assistant. And I banned Purple-pink-blue gradient that we always see. Lean towards organic movement. 

And when we come up with what to build. No boring ideas. if your idea sounds boring to you, it IS boring."""
    
    print("Creating post 6 (examples)...")
    container6_id = create_media_container(access_token, user_id, text=post6_text, media_type="TEXT", reply_to_id=post5_id)
    if not wait_for_container(access_token, container6_id):
        print("Failed to process post 6")
        sys.exit(1)
    post6_id = publish_container(access_token, user_id, container6_id)
    print(f"Published post 6: {post6_id}")
    
    # Mark as posted
    mark_as_posted(repo_root, day)
    
    print(f"\nSuccessfully posted thread for Day {day}!")


if __name__ == "__main__":
    main()
