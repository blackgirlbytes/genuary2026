#!/usr/bin/env python3
"""
Post Genuary submissions to Twitter/X as a thread.
Combines outputs from both /genuary (recipes) and /genuary-skills projects.
"""

import os
import sys
import json
import hashlib
import hmac
import time
import base64
import urllib.parse
import requests
from datetime import datetime
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


# Twitter API endpoints
TWITTER_UPLOAD_API = "https://upload.twitter.com/1.1/media/upload.json"
TWITTER_TWEET_API = "https://api.twitter.com/2/tweets"

MAX_IMAGE_SIZE = 5242880  # Twitter's 5MB limit for images


def get_oauth_header(method: str, url: str, params: dict, credentials: dict) -> str:
    """Generate OAuth 1.0a header for Twitter API."""
    oauth_params = {
        "oauth_consumer_key": credentials["api_key"],
        "oauth_nonce": base64.b64encode(os.urandom(32)).decode("utf-8").replace("+", "").replace("/", "").replace("=", ""),
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_timestamp": str(int(time.time())),
        "oauth_token": credentials["access_token"],
        "oauth_version": "1.0",
    }
    
    # Combine all params for signature
    all_params = {**oauth_params, **params}
    sorted_params = sorted(all_params.items())
    param_string = "&".join(f"{urllib.parse.quote(k, safe='')}={urllib.parse.quote(str(v), safe='')}" for k, v in sorted_params)
    
    # Create signature base string
    base_string = f"{method.upper()}&{urllib.parse.quote(url, safe='')}&{urllib.parse.quote(param_string, safe='')}"
    
    # Create signing key
    signing_key = f"{urllib.parse.quote(credentials['api_secret'], safe='')}&{urllib.parse.quote(credentials['access_token_secret'], safe='')}"
    
    # Generate signature
    signature = base64.b64encode(
        hmac.new(signing_key.encode(), base_string.encode(), hashlib.sha1).digest()
    ).decode()
    
    oauth_params["oauth_signature"] = signature
    
    # Build header
    header_params = ", ".join(f'{k}="{urllib.parse.quote(str(v), safe="")}"' for k, v in sorted(oauth_params.items()))
    return f"OAuth {header_params}"


def compress_image(image_path: Path, max_size: int = MAX_IMAGE_SIZE) -> tuple[bytes, str]:
    """Compress an image to fit within max_size bytes."""
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    suffix = image_path.suffix.lower()
    
    if suffix == ".gif":
        return image_data, "image/gif"
    
    if len(image_data) <= max_size:
        mime_types = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}
        return image_data, mime_types.get(suffix, "image/png")
    
    if not HAS_PIL:
        return image_data, "image/png"
    
    print(f"Compressing {image_path} ({len(image_data)} bytes)...")
    
    img = Image.open(image_path)
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    for quality in [85, 70, 55, 40]:
        buffer = BytesIO()
        img.save(buffer, format='JPEG', quality=quality, optimize=True)
        compressed_data = buffer.getvalue()
        if len(compressed_data) <= max_size:
            print(f"Compressed to {len(compressed_data)} bytes")
            return compressed_data, "image/jpeg"
    
    return compressed_data, "image/jpeg"


def upload_media(credentials: dict, image_path: Path) -> str:
    """Upload media to Twitter and return media_id."""
    image_data, mime_type = compress_image(image_path)
    image_b64 = base64.b64encode(image_data).decode()
    
    params = {"media_data": image_b64}
    auth_header = get_oauth_header("POST", TWITTER_UPLOAD_API, {}, credentials)
    
    resp = requests.post(
        TWITTER_UPLOAD_API,
        headers={"Authorization": auth_header},
        data=params,
    )
    
    if not resp.ok:
        print(f"Error uploading media: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()["media_id_string"]


def create_tweet(credentials: dict, text: str, media_ids: list = None, reply_to: str = None) -> dict:
    """Create a tweet, optionally with media and as a reply."""
    payload = {"text": text}
    
    if media_ids:
        payload["media"] = {"media_ids": media_ids}
    
    if reply_to:
        payload["reply"] = {"in_reply_to_tweet_id": reply_to}
    
    # Twitter v2 API uses Bearer token style but we need OAuth 1.0a for posting
    auth_header = get_oauth_header("POST", TWITTER_TWEET_API, {}, credentials)
    
    resp = requests.post(
        TWITTER_TWEET_API,
        headers={
            "Authorization": auth_header,
            "Content-Type": "application/json",
        },
        json=payload,
    )
    
    if not resp.ok:
        print(f"Error creating tweet: {resp.status_code}")
        print(f"Response: {resp.text}")
        resp.raise_for_status()
    
    return resp.json()["data"]


def find_output_image(day_folder: Path) -> Path | None:
    """Find the best output image in a day's output folder."""
    output_folder = day_folder / "output"
    if not output_folder.exists():
        return None
    
    # Twitter has better GIF support (5MB limit)
    for ext in [".gif", ".png", ".jpg", ".jpeg"]:
        images = list(output_folder.glob(f"*{ext}"))
        if images:
            img = images[0]
            if ext == ".gif" and img.stat().st_size > MAX_IMAGE_SIZE:
                print(f"GIF too large ({img.stat().st_size} bytes), looking for PNG...")
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
    posted_file = repo_root / ".posted_days_twitter"
    if not posted_file.exists():
        return False
    
    with open(posted_file) as f:
        posted_days = f.read().strip().split("\n")
    
    return str(day) in posted_days


def mark_as_posted(repo_root: Path, day: int):
    """Mark a day as posted."""
    posted_file = repo_root / ".posted_days_twitter"
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
    credentials = {
        "api_key": os.environ.get("TWITTER_API_KEY"),
        "api_secret": os.environ.get("TWITTER_API_SECRET"),
        "access_token": os.environ.get("TWITTER_ACCESS_TOKEN"),
        "access_token_secret": os.environ.get("TWITTER_ACCESS_TOKEN_SECRET"),
    }
    
    if not all(credentials.values()):
        print("Error: All Twitter credentials must be set")
        sys.exit(1)
    
    # Determine paths
    repo_root = Path(__file__).parent.parent
    day = get_day_number()
    day_str = f"day{day:02d}"
    
    print(f"Preparing to tweet for Day {day}...")
    
    # Check if already posted
    if check_already_posted(repo_root, day):
        print(f"Day {day} already tweeted. Skipping.")
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
    print("Uploading images...")
    genuary_media_id = upload_media(credentials, genuary_image)
    skills_media_id = upload_media(credentials, skills_image)
    
    # Create thread
    # Tweet 1: Main intro with both images
    tweet1_text = f"""This is not me posting in real time! I wrote and scheduled this post with goose. It's my submission for Genuary day {day}: "{prompt_title}"

Automated end to end using goose recipes, Agent skills, shell scripts, and github actions.

#genuary #genuary{day}"""
    
    print("Creating tweet 1 (intro with both images)...")
    tweet1 = create_tweet(credentials, tweet1_text, media_ids=[genuary_media_id, skills_media_id])
    tweet1_id = tweet1["id"]
    
    # Tweet 2: Recipe output
    tweet2_text = f"""Made this with goose recipes and a shell script

genuary2026.vercel.app/genuary/days/day{day:02d}/"""
    print("Creating tweet 2 (recipes)...")
    tweet2 = create_tweet(credentials, tweet2_text, media_ids=[genuary_media_id], reply_to=tweet1_id)
    
    # Tweet 3: Skills output
    tweet3_text = f"""Made this with Agent Skills

genuary2026.vercel.app/genuary-skills/days/day{day:02d}/"""
    print("Creating tweet 3 (skills)...")
    tweet3 = create_tweet(credentials, tweet3_text, media_ids=[skills_media_id], reply_to=tweet2["id"])
    
    # Tweet 4: Repo link
    tweet4_text = """My repo has the code AND transcripts with my agent:
github.com/blackgirlbytes/genuary2026

I did this to learn agentic coding and participate without heavy commitment."""
    
    print("Creating tweet 4 (repo link)...")
    tweet4 = create_tweet(credentials, tweet4_text, reply_to=tweet3["id"])
    
    # Tweet 5: Context
    tweet5_text = """Although this is heavily automated and built by AI, it still has direction from me. I told goose which AI cliches I did not like and which styles I liked."""
    
    print("Creating tweet 5 (context)...")
    tweet5 = create_tweet(credentials, tweet5_text, reply_to=tweet4["id"])
    
    # Tweet 6: Examples
    tweet6_text = """For example, I told goose: You are a creative coder with artistic vision, not just a coding assistant. And I banned Purple-pink-blue gradient that we always see. Lean towards organic movement. 

No boring ideas. if your idea sounds boring to you, it IS boring."""
    
    print("Creating tweet 6 (examples)...")
    create_tweet(credentials, tweet6_text, reply_to=tweet5["id"])
    
    # Mark as posted
    mark_as_posted(repo_root, day)
    
    print(f"Successfully tweeted thread for Day {day}!")


if __name__ == "__main__":
    main()
