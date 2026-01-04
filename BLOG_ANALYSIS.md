# Genuary 2026: An Experiment in Agentic Workflows

## Overview

This document analyzes the conversations and process of using Goose (an AI agent) to participate in Genuary 2026 - a month-long generative art challenge. The goal is to help readers understand how they can use agentic workflows for creative coding projects.

---

## What is a "Harness"?

From the Discord conversation with Zig:

> "A harness is just what goes over the model so you can interact with it. Goose and Claude Code are harnesses. They wrap the LLM and your conversation in whatever UX/tools you're using."

> "When people say they 'build a harness' they usually mean creating some deterministic scripts for an LLM to use. You basically build a toolbox for it."

**Key insight**: A harness is about creating **repeatable, deterministic workflows** that an AI can execute reliably. Instead of asking the AI to figure everything out from scratch each time, you give it scripts and tools that handle the boring parts.

---

## The Experiment: Two Approaches Compared

This project tested two different approaches to automating Genuary participation:

### Approach 1: Recipe + Harness (`/genuary`)
- **Location**: `genuary/`
- **How it works**: A Goose recipe calls a shell script (`harness.sh`) that handles scaffolding
- **Philosophy**: Deterministic scripts do the heavy lifting; AI focuses on creativity

### Approach 2: Recipe + Skill (`/genuary-skills`)
- **Location**: `genuary-skills/`
- **How it works**: A Goose skill (SKILL.md) teaches the AI the workflow; no shell scripts
- **Philosophy**: AI learns the knowledge and figures out the tooling itself

---

## Key Components Built

### 1. Prompts Database (`prompts.json`)
All 31 Genuary prompts scraped from genuary.art, structured as JSON for easy access.

### 2. Template System
- `template/index.html` - Beautiful presentation page with:
  - Day number and prompt title
  - Credit to prompt creator
  - "made by goose and blackgirlbytes" footer
  - Dark theme, modern fonts (Space Grotesk)
  - Save/Pause/Regenerate controls
- `template/sketch.js` - p5.js boilerplate with creative coding inspiration

### 3. Harness Script (`harness.sh`)
Shell commands for:
- `prompt <day|today>` - Show the prompt
- `new <day>` - Scaffold a new day folder
- `preview <day>` - Open in browser
- `export <day>` - Save outputs
- `list` - Show progress

### 4. Goose Skill (`SKILL.md`)
A comprehensive guide teaching Goose:
- The creative philosophy (whimsy is mandatory!)
- What to avoid (AI art clichés)
- The full workflow from prompt to GitHub push
- p5.js techniques and color theory

### 5. Recipes (`genuary.yaml`)
YAML files that define the automated workflow:
- Find the day's prompt
- Explain what you'll learn
- Pitch a whimsical idea
- Wait for user approval
- Write the code
- Verify with Chrome DevTools
- Iterate until satisfied
- Save outputs (GIF + PNG)
- Push to GitHub

---

## The Feedback Loop: Chrome DevTools Integration

A critical component was using Chrome DevTools MCP to create a **visual feedback loop**:

1. Navigate to the sketch's `index.html`
2. Take a screenshot
3. Evaluate: "Does this art match the prompt?"
4. If not satisfied, edit `sketch.js` and repeat
5. When satisfied, save the final output

This mirrors how a human creative coder works - write code, see result, iterate.

---

## Anti-AI-Cliché System

One of the most interesting innovations was the **BANNED list** to prevent generic AI art:

### Color Crimes
- Salmon/coral pink (`fill(255, 100, 100)`) - THE #1 AI ART CLICHÉ
- Teal and orange together (movie poster palette)
- Purple-pink-blue gradient (synthwave default)
- Plain RGB primaries
- Neon on black (screensaver vibes)

### Composition Crimes
- Single shape centered on canvas
- Perfect symmetry with no organic variation
- Uniform grids with identical elements
- Basic spirals, flower mandalas, tree fractals

### Motion Crimes
- Slow, floaty particles with no purpose
- Everything rotating at the same speed
- Basic `sin(frameCount)` pulsing

### The Test
> "If you've seen it as an AI Twitter bot's output, DON'T DO IT."

---

## Lessons Learned from the Transcripts

### Day 1: "One Color, One Shape"

**Harness approach** created "Breathing Circles" - coral pink circles that pulse
**Skills approach** created "A Thousand Heartbeats" - 400 indigo circles breathing at different rhythms

**Key difference**: The skills version avoided the salmon pink cliché because the SKILL.md explicitly banned it.

### Day 2: "Twelve Principles of Animation"

Both approaches went through multiple iterations:
1. Initial pitch rejected as "too basic"
2. User requested "non-circular, creative shape"
3. Final concepts: "The Sleepy G" (harness) and "Walking Staircase" (skills)

**Lesson**: The human-in-the-loop approval step was crucial for pushing beyond generic ideas.

### Day 3: "Fibonacci Forever"

Both initially proposed obvious ideas (golden spiral, sunflower) that were rejected.

**Skills version** pivoted to butterflies in phyllotaxis formation - where Fibonacci spirals are visually undeniable (13 spirals one direction, 21 the other).

**Lesson**: When the AI's first idea is "basic," push back! The iteration process produces better results.

---

## Technical Challenges Solved

### 1. Chrome DevTools Conflicts
**Problem**: Running both approaches simultaneously caused Chrome profile conflicts.
**Solution**: Each approach uses a different Chrome profile directory.

### 2. Path Confusion
**Problem**: Skills approach was saving to wrong directory.
**Solution**: Absolute paths in both recipe and skill files.

### 3. GitHub Push Verification
**Problem**: AI would sometimes skip the push step.
**Solution**: Added explicit "MUST complete this step" warnings in recipes.

### 4. Output Format
**Problem**: Static PNGs don't capture animation magic.
**Solution**: GIF/video first, PNG second (for thumbnails).

---

## The Workflow in Practice

Here's what a typical Genuary day looks like with this system:

```
User: /genuary day=3

Goose: 
1. Reads prompt: "Fibonacci forever"
2. Explains the concept and what you'll learn
3. Pitches: "Sunflowers blooming in golden ratio spirals..."

User: "too basic"

Goose:
4. Pitches alternatives: breathing box, butterfly migration, rabbit breeding...

User: "butterflies!"

Goose:
5. Scaffolds day03/ folder
6. Writes sketch.js with phyllotaxis positioning
7. Opens in Chrome, takes screenshot
8. Shows result: "Does this spark joy?"

User: "is this actually fibonacci?"

Goose:
9. Realizes the spirals aren't visible enough
10. Rewrites to make 13 + 21 spirals undeniable
11. Takes new screenshot

User: "yes! push it"

Goose:
12. Saves GIF + PNG
13. Commits and pushes to GitHub
```

---

## Key Takeaways for Blog Post

### 1. Harnesses Reduce Cognitive Load
By automating the boring parts (scaffolding, file management, git), you free up mental energy for creativity.

### 2. Skills vs Scripts: Different Trade-offs
- **Scripts** (harness approach): More predictable, easier to debug, but rigid
- **Skills** (knowledge approach): More flexible, can adapt, but may drift

### 3. Human-in-the-Loop is Essential for Creative Work
The approval step ("Does this spark joy?") prevents generic output and pushes toward extraordinary.

### 4. Explicit Constraints Improve Output
The BANNED list of AI clichés dramatically improved the art quality by forcing novel solutions.

### 5. Visual Feedback Loops Enable Iteration
Using Chrome DevTools to see the actual output (not just imagine it) enables meaningful iteration.

### 6. The "Harness" Concept Applies Beyond Coding
Any repeatable workflow can benefit from:
- Deterministic scripts for boring parts
- Clear instructions for creative parts
- Verification steps for quality control
- Human checkpoints for approval

---

## Files Structure for Reference

```
genuary2026/
├── README.md
├── BLOG_ANALYSIS.md (this file)
├── genuary/                          # Harness approach
│   ├── .goosehints
│   ├── genuary.yaml                  # Recipe
│   ├── harness.sh                    # Shell script
│   ├── prompts.json
│   ├── template/
│   │   ├── index.html
│   │   └── sketch.js
│   └── days/
│       ├── day01/
│       │   ├── index.html
│       │   ├── sketch.js
│       │   ├── SUMMARY.md
│       │   ├── transcript.md
│       │   └── output/
│       ├── day02/
│       └── day03/
└── genuary-skills/                   # Skills approach
    ├── .goose/skills/genuary/SKILL.md
    ├── .goosehints
    ├── genuary.yaml                  # Recipe
    ├── prompts.json
    ├── template/
    └── days/
        ├── day01/
        ├── day02/
        └── day03/
```

---

## Quotes for the Blog

From the original Discord conversation:

> "I spend a bunch of time upfront not only working on a spec but also establishing constraints and establishing what deterministic tools we need to iterate, then we build those first. Then I delegate the rest of the work, and by adding logging to the deterministic tools the LLM is really good at just looping itself with the tool output until it hits its goal." - Zig

From the Genuary sessions:

> "Basic is a bug - if it's boring, fix it."

> "If you've seen it as an AI Twitter bot's output, DON'T DO IT."

> "Whimsy is mandatory - every piece should spark joy."

---

## Suggested Blog Post Structure

1. **Hook**: "I made 31 pieces of generative art in January... but I didn't write most of the code."

2. **Context**: What is Genuary? What is a "harness"?

3. **The Experiment**: Two approaches to AI-assisted creative coding

4. **The Secret Sauce**: Anti-cliché systems and human-in-the-loop approval

5. **Show Don't Tell**: Side-by-side comparisons of the art produced

6. **Lessons Learned**: What worked, what didn't, what surprised you

7. **Try It Yourself**: Links to the repo, how to set up your own harness

---

## Bonus: Social Media Automation

The project goes beyond just generating art - it also automates posting to social media!

### The Challenge
- Two projects complete at different times (genuary/ and genuary-skills/)
- Want to post both outputs together in a single thread
- Need to include images, links, and context
- Should run automatically at a scheduled time

### The Solution: GitHub Actions

A Python script + GitHub Action that:
1. Checks if both outputs exist for the current day
2. Reads the prompt from `prompts.json`
3. Compresses images if needed (Bluesky has 1MB limit)
4. Posts a 6-part thread with:
   - Intro + both images + hashtags
   - Recipe version with link to live site
   - Skills version with link to live site
   - GitHub repo link
   - Context about human direction
   - Examples of creative constraints given to the AI

### Thread Structure

```
Post 1: This is not me posting in real time! I wrote and scheduled 
        this post with goose. It's my submission for Genuary day X: 
        "[prompt]" #genuary #genuaryX
        [both images attached]

Post 2: Made this with goose recipes and a shell script
        genuary2026.vercel.app/genuary/days/dayXX/
        [recipe image]

Post 3: Made this with Agent Skills
        genuary2026.vercel.app/genuary-skills/days/dayXX/
        [skills image]

Post 4: My repo has the code AND transcripts with my agent:
        github.com/blackgirlbytes/genuary2026

Post 5: Although this is heavily automated and built by AI, it still 
        has direction from me. I told goose which AI cliches I did 
        not like and which styles I liked.

Post 6: For example, I told goose: You are a creative coder with 
        artistic vision... And I banned Purple-pink-blue gradient...
```

### Technical Details

**Schedule**: Runs at 2:25 PM EST daily with retries at 5 PM and 9 PM

**Image Handling**:
- Compresses images over 1MB using PIL
- Prefers GIF over PNG (to show animations)
- Falls back to PNG if GIF is too large

**Rich Text**: Uses Bluesky's "facets" system to make links and hashtags clickable

**Duplicate Prevention**: Tracks posted days in `.posted_days` file

### Multi-Platform Challenges

The project also attempted Twitter/X automation but hit issues:
- Twitter's Free tier blocks requests from GitHub Actions IPs (Cloudflare bot protection)
- Solution: Local cron job using macOS Launch Agent instead
- LinkedIn API requires OAuth 2.0 with tokens that expire every 60 days

**Lesson**: Bluesky's API is much more developer-friendly than Twitter's current offering.

---

*Generated by analyzing transcripts and summaries from the Genuary 2026 project.*
