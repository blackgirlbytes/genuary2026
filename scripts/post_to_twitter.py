#!/usr/bin/env python3
"""
Post Genuary submissions to Twitter/X as a thread.
Combines outputs from both /genuary (recipes) and /genuary-skills projects.
"""

import os
import sys
import json
import base64
import tweepy
from datetime import datetime
from pathlib import Path
from io import BytesIO

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


MAX_IMAGE_SIZE = 5242880  # Twitter's 5MB limit for images


def get_clients(credentials: dict) -> tuple[tweepy.Client, tweepy.API]:
    """Get authenticated Twitter clients (v2 for tweets, v1.1 for media)."""
    # v2 client for creating tweets
    client = tweepy.Client(
        consumer_key=credentials["api_key"],
        consumer_secret=credentials["api_secret"],
        access_token=credentials["access_token"],
        access_token_secret=credentials["access_token_secret"],
    )
    
    # v1.1 API for media upload only
    auth = tweepy.OAuth1UserHandler(
        credentials["api_key"],
        credentials["api_secret"],
        credentials["access_token"],
        credentials["access_token_secret"],
    )
    api = tweepy.API(auth)
    
    return client, api


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


def upload_media(api: tweepy.API, image_path: Path) -> str:
    """Upload media to Twitter and return media_id."""
    print(f"Uploading {image_path}...")
    media = api.media_upload(filename=str(image_path))
    return media.media_id_string


def create_tweet(client: tweepy.Client, text: str, media_ids: list = None, reply_to: str = None) -> dict:
    """Create a tweet using v2 API, optionally with media and as a reply."""
    kwargs = {"text": text}
    
    if media_ids:
        kwargs["media_ids"] = media_ids
    
    if reply_to:
        kwargs["in_reply_to_tweet_id"] = reply_to
    
    response = client.create_tweet(**kwargs)
    return {"id": str(response.data["id"])}


def find_output_image(day_folder: Path) -> Path | None:
    """Find the best output image in a day's output folder. Prefer PNG over GIF for Twitter Free tier."""
    output_folder = day_folder / "output"
    if not output_folder.exists():
        return None
    
    # Prefer PNG/JPG for Twitter Free tier (GIFs can cause issues)
    for ext in [".png", ".jpg", ".jpeg", ".gif"]:
        images = list(output_folder.glob(f"*{ext}"))
        if images:
            img = images[0]
            if ext == ".gif" and img.stat().st_size > MAX_IMAGE_SIZE:
                print(f"GIF too large ({img.stat().st_size} bytes), skipping...")
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
    
    # Get authenticated clients (v2 for tweets, v1.1 for media)
    print("Authenticating with Twitter...")
    client, api = get_clients(credentials)
    
    # Upload images (v1.1 API)
    print("Uploading images...")
    genuary_media_id = upload_media(api, genuary_image)
    skills_media_id = upload_media(api, skills_image)
    
    # Create thread (v2 API)
    # Tweet 1: Main intro with both images
    tweet1_text = f"""This is not me posting in real time! I wrote and scheduled this post with goose. It's my submission for Genuary day {day}: "{prompt_title}"

Automated end to end using goose recipes, Agent skills, shell scripts, and github actions.

#genuary #genuary{day}"""
    
    print("Creating tweet 1 (intro with both images)...")
    tweet1 = create_tweet(client, tweet1_text, media_ids=[genuary_media_id, skills_media_id])
    tweet1_id = tweet1["id"]
    
    # Tweet 2: Recipe output
    tweet2_text = f"""Made this with goose recipes and a shell script

genuary2026.vercel.app/genuary/days/day{day:02d}/"""
    print("Creating tweet 2 (recipes)...")
    tweet2 = create_tweet(client, tweet2_text, media_ids=[genuary_media_id], reply_to=tweet1_id)
    
    # Tweet 3: Skills output
    tweet3_text = f"""Made this with Agent Skills

genuary2026.vercel.app/genuary-skills/days/day{day:02d}/"""
    print("Creating tweet 3 (skills)...")
    tweet3 = create_tweet(client, tweet3_text, media_ids=[skills_media_id], reply_to=tweet2["id"])
    
    # Tweet 4: Repo link
    tweet4_text = """My repo has the code AND transcripts with my agent:
github.com/blackgirlbytes/genuary2026

I did this to learn agentic coding and participate without heavy commitment."""
    
    print("Creating tweet 4 (repo link)...")
    tweet4 = create_tweet(client, tweet4_text, reply_to=tweet3["id"])
    
    # Tweet 5: Context
    tweet5_text = """Although this is heavily automated and built by AI, it still has direction from me. I told goose which AI cliches I did not like and which styles I liked."""
    
    print("Creating tweet 5 (context)...")
    tweet5 = create_tweet(client, tweet5_text, reply_to=tweet4["id"])
    
    # Tweet 6: Examples
    tweet6_text = """For example, I told goose: You are a creative coder with artistic vision, not just a coding assistant. And I banned Purple-pink-blue gradient that we always see. Lean towards organic movement. 

No boring ideas. if your idea sounds boring to you, it IS boring."""
    
    print("Creating tweet 6 (examples)...")
    create_tweet(client, tweet6_text, reply_to=tweet5["id"])
    
    # Mark as posted
    mark_as_posted(repo_root, day)
    
    print(f"Successfully tweeted thread for Day {day}!")


if __name__ == "__main__":
    main()
