#!/usr/bin/env python3
"""
Post Genuary submissions to LinkedIn.
Combines outputs from both /genuary (recipes) and /genuary-skills projects.

LinkedIn API requires:
- LINKEDIN_ACCESS_TOKEN: OAuth 2.0 access token with w_member_social scope
- LINKEDIN_PERSON_URN: Your LinkedIn person URN (e.g., "urn:li:person:ABC123")

To get these:
1. Create a LinkedIn App at https://www.linkedin.com/developers/
2. Request "Share on LinkedIn" and "Sign In with LinkedIn using OpenID Connect" products
3. Generate an access token with w_member_social scope
4. Get your person URN from the /v2/userinfo endpoint
"""

import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


LINKEDIN_API = "https://api.linkedin.com/v2"
LINKEDIN_REST_API = "https://api.linkedin.com/rest"
MAX_IMAGE_SIZE = 8388608  # LinkedIn's 8MB limit for images


def get_headers(access_token: str, rest_api: bool = False) -> dict:
    """Get headers for LinkedIn API requests."""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }
    if rest_api:
        headers["LinkedIn-Version"] = "202501"
        headers["X-Restli-Protocol-Version"] = "2.0.0"
    return headers


def compress_image(image_path: Path, max_size: int = MAX_IMAGE_SIZE) -> tuple[bytes, str]:
    """Compress an image to fit within max_size bytes."""
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    suffix = image_path.suffix.lower()
    
    # GIFs - LinkedIn supports them but may convert to static
    if suffix == ".gif":
        if len(image_data) <= max_size:
            return image_data, "image/gif"
    
    if len(image_data) <= max_size:
        mime_types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif"}
        return image_data, mime_types.get(suffix, "image/png")
    
    if not HAS_PIL:
        print(f"Warning: Image too large and PIL not available for compression")
        return image_data, "image/png"
    
    print(f"Compressing {image_path} ({len(image_data)} bytes)...")
    
    img = Image.open(image_path)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    for quality in [85, 70, 55, 40, 25]:
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=quality, optimize=True)
        compressed_data = buffer.getvalue()
        if len(compressed_data) <= max_size:
            print(f"Compressed to {len(compressed_data)} bytes (quality={quality})")
            return compressed_data, "image/jpeg"
    
    # Resize if still too large
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
    
    return compressed_data, "image/jpeg"


def initialize_image_upload(access_token: str, person_urn: str) -> dict:
    """Initialize an image upload with LinkedIn REST API and get upload URL."""
    url = f"{LINKEDIN_REST_API}/images?action=initializeUpload"
    
    payload = {
        "initializeUploadRequest": {
            "owner": person_urn
        }
    }
    
    resp = requests.post(url, headers=get_headers(access_token, rest_api=True), json=payload)
    if not resp.ok:
        print(f"Error initializing upload: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()


def upload_image(access_token: str, person_urn: str, image_path: Path) -> str:
    """Upload an image to LinkedIn and return the image URN."""
    # Step 1: Initialize the upload
    init_response = initialize_image_upload(access_token, person_urn)
    
    upload_url = init_response["value"]["uploadUrl"]
    image_urn = init_response["value"]["image"]
    
    # Step 2: Upload the image binary
    image_data, mime_type = compress_image(image_path)
    
    upload_headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": mime_type,
    }
    
    resp = requests.put(upload_url, headers=upload_headers, data=image_data)
    if not resp.ok:
        print(f"Error uploading image: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    print(f"Uploaded {image_path.name} -> {image_urn}")
    return image_urn


def create_post(access_token: str, person_urn: str, text: str, image_urns: list = None) -> dict:
    """Create a post on LinkedIn with optional images."""
    url = f"{LINKEDIN_REST_API}/posts"
    
    payload = {
        "author": person_urn,
        "commentary": text,
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": []
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False
    }
    
    if image_urns:
        payload["content"] = {
            "multiImage": {
                "images": [{"id": urn} for urn in image_urns]
            }
        }
    
    resp = requests.post(url, headers=get_headers(access_token, rest_api=True), json=payload)
    if not resp.ok:
        print(f"Error creating post: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    # REST API returns the post URN in the x-restli-id header
    post_id = resp.headers.get("x-restli-id", resp.text)
    return {"id": post_id}


def find_output_image(day_folder: Path) -> Path | None:
    """Find the best output image in a day's output folder."""
    output_folder = day_folder / "output"
    if not output_folder.exists():
        return None
    
    # Prefer PNG/JPG for LinkedIn (better quality)
    for ext in [".png", ".jpg", ".jpeg", ".gif"]:
        images = list(output_folder.glob(f"*{ext}"))
        if images:
            img = images[0]
            if ext == ".gif" and img.stat().st_size > MAX_IMAGE_SIZE:
                print(f"GIF too large ({img.stat().st_size} bytes), looking for alternatives...")
                continue
            return img
    
    return None


def get_day_number() -> int:
    """Get the day number to post."""
    manual_day = os.environ.get("MANUAL_DAY", "").strip()
    if manual_day:
        return int(manual_day)
    
    today = datetime.now()
    if today.month == 1 and today.year == 2026:
        return today.day
    
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
    posted_file = repo_root / ".posted_days_linkedin"
    if not posted_file.exists():
        return False
    
    with open(posted_file) as f:
        posted_days = f.read().strip().split("\n")
    
    return str(day) in posted_days


def mark_as_posted(repo_root: Path, day: int):
    """Mark a day as posted."""
    posted_file = repo_root / ".posted_days_linkedin"
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
    access_token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    person_urn = os.environ.get("LINKEDIN_PERSON_URN")
    
    if not access_token or not person_urn:
        print("Error: LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN must be set")
        print("\nTo get these credentials:")
        print("1. Create a LinkedIn App at https://www.linkedin.com/developers/")
        print("2. Request 'Share on LinkedIn' product access")
        print("3. Generate an access token with w_member_social scope")
        print("4. Get your person URN from the /v2/userinfo endpoint")
        sys.exit(1)
    
    # Ensure person_urn has correct format
    if not person_urn.startswith("urn:li:person:"):
        person_urn = f"urn:li:person:{person_urn}"
    
    # Determine paths
    repo_root = Path(__file__).parent.parent
    day = get_day_number()
    day_str = f"day{day:02d}"
    
    print(f"Preparing to post to LinkedIn for Day {day}...")
    
    # Check if already posted
    if check_already_posted(repo_root, day):
        print(f"Day {day} already posted to LinkedIn. Skipping.")
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
    
    # Upload images
    print("Uploading images to LinkedIn...")
    genuary_asset = upload_image(access_token, person_urn, genuary_image)
    skills_asset = upload_image(access_token, person_urn, skills_image)
    
    # Create post (LinkedIn doesn't have native threading like Twitter/Bluesky,
    # so we'll create one comprehensive post with both images)
    post_text = f"""This is not me posting in real time! I wrote and scheduled this post with goose. It's my submission for Genuary day {day}: "{prompt_title}"

The entire process is automated from end to end using goose recipes, Agent skills, shell scripts, and github actions.

The left image I made with goose recipes and a shell script

https://genuary2026.vercel.app/genuary/days/day{day:02d}/

The right image I made with agent skills

https://genuary2026.vercel.app/genuary-skills/days/day{day:02d}/

My repo has the code AND transcripts with my agent:
https://github.com/blackgirlbytes/genuary2026

I did this to learn agentic coding and participate without heavy commitment.

Although this is heavily automated and built by AI, it still has direction from me. I told goose which AI cliches I did not like and which styles I liked.

For example, I told goose: You are a creative coder with artistic vision, not just a coding assistant. And I banned Purple-pink-blue gradient that we always see. Lean towards organic movement. 

And when we come up with what to build. No boring ideas. if your idea sounds boring to you, it IS boring.

#genuary{day}"""
    
    print("Creating LinkedIn post...")
    result = create_post(access_token, person_urn, post_text, image_urns=[genuary_asset, skills_asset])
    
    # Mark as posted
    mark_as_posted(repo_root, day)
    
    post_id = result.get("id", "unknown")
    print(f"Successfully posted to LinkedIn for Day {day}!")
    print(f"Post ID: {post_id}")


if __name__ == "__main__":
    main()
