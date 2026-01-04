#!/usr/bin/env python3
"""
Post Genuary submissions to Bluesky as a thread.
Combines outputs from both /genuary (recipes) and /genuary-skills projects.
"""

import os
import sys
import json
import requests
from datetime import datetime
from pathlib import Path


# Bluesky API endpoints
BSKY_API = "https://bsky.social/xrpc"


def get_session(handle: str, app_password: str) -> dict:
    """Authenticate with Bluesky and get session tokens."""
    resp = requests.post(
        f"{BSKY_API}/com.atproto.server.createSession",
        json={"identifier": handle, "password": app_password},
    )
    resp.raise_for_status()
    return resp.json()


def upload_image(session: dict, image_path: Path) -> dict:
    """Upload an image to Bluesky and return the blob reference."""
    with open(image_path, "rb") as f:
        image_data = f.read()
    
    # Determine mime type
    suffix = image_path.suffix.lower()
    mime_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
    }
    mime_type = mime_types.get(suffix, "image/png")
    
    resp = requests.post(
        f"{BSKY_API}/com.atproto.repo.uploadBlob",
        headers={
            "Authorization": f"Bearer {session['accessJwt']}",
            "Content-Type": mime_type,
        },
        data=image_data,
    )
    resp.raise_for_status()
    return resp.json()["blob"]


def create_post(session: dict, text: str, reply_to: dict = None, images: list = None) -> dict:
    """Create a post on Bluesky, optionally as a reply with images."""
    now = datetime.utcnow().isoformat().replace("+00:00", "") + "Z"
    
    record = {
        "$type": "app.bsky.feed.post",
        "text": text,
        "createdAt": now,
    }
    
    if reply_to:
        record["reply"] = reply_to
    
    if images:
        record["embed"] = {
            "$type": "app.bsky.embed.images",
            "images": [{"alt": img.get("alt", ""), "image": img["blob"]} for img in images],
        }
    
    resp = requests.post(
        f"{BSKY_API}/com.atproto.repo.createRecord",
        headers={"Authorization": f"Bearer {session['accessJwt']}"},
        json={
            "repo": session["did"],
            "collection": "app.bsky.feed.post",
            "record": record,
        },
    )
    resp.raise_for_status()
    return resp.json()


def find_output_image(day_folder: Path) -> Path | None:
    """Find the best output image in a day's output folder. Prefer GIF over PNG."""
    output_folder = day_folder / "output"
    if not output_folder.exists():
        return None
    
    # Look for images, prefer gif for animation
    for ext in [".gif", ".png", ".jpg", ".jpeg"]:
        images = list(output_folder.glob(f"*{ext}"))
        if images:
            return images[0]
    
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
    posted_file = repo_root / ".posted_days"
    if not posted_file.exists():
        return False
    
    with open(posted_file) as f:
        posted_days = f.read().strip().split("\n")
    
    return str(day) in posted_days


def mark_as_posted(repo_root: Path, day: int):
    """Mark a day as posted."""
    posted_file = repo_root / ".posted_days"
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
    handle = os.environ.get("BLUESKY_HANDLE")
    app_password = os.environ.get("BLUESKY_APP_PASSWORD")
    
    if not handle or not app_password:
        print("Error: BLUESKY_HANDLE and BLUESKY_APP_PASSWORD must be set")
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
    
    # Authenticate
    print("Authenticating with Bluesky...")
    session = get_session(handle, app_password)
    print(f"Authenticated as {session['handle']}")
    
    # Upload images
    print("Uploading images...")
    genuary_blob = upload_image(session, genuary_image)
    skills_blob = upload_image(session, skills_image)
    
    # Create thread
    # Post 1: Main intro
    post1_text = f"""This is not me posting in real time! I wrote and scheduled this post with goose. It's my submission for Genuary day {day}: "{prompt_title}"

The entire process is automated from end to end using goose recipes, Agent skills, shell scripts, and github actions."""
    
    print("Creating post 1 (intro)...")
    post1 = create_post(session, post1_text)
    post1_uri = post1["uri"]
    post1_cid = post1["cid"]
    
    # Reply reference for threading
    root_ref = {"uri": post1_uri, "cid": post1_cid}
    reply_to = {"root": root_ref, "parent": root_ref}
    
    # Post 2: Recipe output
    post2_text = "Made this with goose recipes and a shell script"
    print("Creating post 2 (recipes)...")
    post2 = create_post(
        session, 
        post2_text, 
        reply_to=reply_to,
        images=[{"blob": genuary_blob, "alt": f"Genuary day {day} created with goose recipes"}]
    )
    
    # Update reply reference
    reply_to = {"root": root_ref, "parent": {"uri": post2["uri"], "cid": post2["cid"]}}
    
    # Post 3: Skills output
    post3_text = "Made this with Agent Skills"
    print("Creating post 3 (skills)...")
    post3 = create_post(
        session,
        post3_text,
        reply_to=reply_to,
        images=[{"blob": skills_blob, "alt": f"Genuary day {day} created with goose skills"}]
    )
    
    # Update reply reference
    reply_to = {"root": root_ref, "parent": {"uri": post3["uri"], "cid": post3["cid"]}}
    
    # Post 4: Repo link and context
    post4_text = """My repo includes the code AND transcripts with my agent:
https://github.com/blackgirlbytes/genuary2026

I did this to teach myself more about agentic coding and participate without heavy commitment. Although this is heavily automated and built by AI, it still has direction from me. I told goose which AI cliches I did not like and which styles I liked."""
    
    print("Creating post 4 (context)...")
    create_post(session, post4_text, reply_to=reply_to)
    
    # Mark as posted
    mark_as_posted(repo_root, day)
    
    print(f"Successfully posted thread for Day {day}!")
    print(f"View at: https://bsky.app/profile/{session['handle']}")


if __name__ == "__main__":
    main()
