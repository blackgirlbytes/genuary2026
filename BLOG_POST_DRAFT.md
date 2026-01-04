# I Built Two Context Engineering Workflows with Goose in a Few Hours

People talk about context engineering like it's either mystical or impossibly heavyweight. My experience was much simpler.

In a few hours, I set up two different workflows with Goose and ran them against the same creative coding challenge. The goal wasn't to build infrastructure for the sake of it, but to understand how different context strategies actually perform when you're trying to get useful, publishable output quickly.

The task I chose was Genuary 2026, a month-long generative art challenge where you create one piece of code-generated art per day based on a prompt. It's the kind of messy, creative work that exposes weaknesses fast. It requires structure, artistic judgment, and iteration. It's also exactly where vague "just add more context" advice tends to fall apart.

What follows is a clear account of what I did, what Goose did, and what worked better in different situations.

---

## How This Started

My friend Andrew had been doing Genuary using Claude Code. In a Discord conversation, he explained the concept of "harnesses":

> "A harness is just what goes over the model so you can interact with it. When people say they 'build a harness' they usually mean creating some deterministic scripts for an LLM to use. You basically build a toolbox for it."

He'd built harnesses that solved every Advent of Code challenge automatically. The AI would loop through puzzles, run tests, and iterate until it hit the right answer.

I wanted to try something similar with Goose, but I also wanted to compare different approaches. So I set up two workflows side by side:

1. **Recipe + Harness** - A recipe that calls shell scripts for deterministic scaffolding
2. **Recipe + Skill** - A recipe that relies on a skill file (SKILL.md) to teach Goose the workflow

Both approaches used recipes and `.goosehints`. The difference was whether the "how to do things" knowledge lived in shell scripts (harness) or in a skill file that teaches Goose the workflow so it figures out the steps itself.

The key thing: **I didn't spend hours building these systems. Goose set them up.** I just prompted.

---

## What Goose Built

When I told Goose I wanted to participate in Genuary with an automated workflow, it created two different setups. Both use recipes (that's how you invoke a workflow with `/genuary` or `/genuary-skills`), but the recipes are structured very differently.

**For the harness approach (`/genuary`):**
- A **fat recipe** (`genuary.yaml` - 304 lines) containing the entire workflow: all the BANNED clichés, step-by-step instructions, code examples, everything
- A **shell script harness** (`harness.sh`) with commands like `./harness.sh prompt 1` and `./harness.sh new 3`
- The recipe tells Goose to USE the harness scripts for scaffolding
- A `.goosehints` file for project context

**For the skills approach (`/genuary-skills`):**
- A **thin recipe** (`genuary.yaml` - 130 lines) that basically just says "you have the genuary skill loaded, use it"
- A **skill file** (`SKILL.md`) containing all the creative philosophy, BANNED clichés, workflow, and code examples
- The recipe is thin because the skill has all the knowledge
- The same `.goosehints` for project context

Both approaches used Chrome DevTools MCP to create a visual feedback loop: navigate to the sketch, take a screenshot, evaluate if it matches the prompt, iterate if needed.

The entire setup took a few hours. Most of that was me having conversations with Goose about what I wanted, not me writing code.

---

## The Role of `.goosehints`

The `.goosehints` file turned out to be more impactful than I expected. I used it to establish context that I didn't want to repeat in every prompt:

```
This is a Genuary 2026 creative coding project.
Working directory: ~/Documents/agent-experiments/genuary2026/genuary/
Use the harness.sh script for scaffolding.
Always save outputs to days/dayXX/output/
Push to GitHub after user confirms satisfaction.
```

What mattered most is that `.goosehints` reduced friction without overconstraining the task. It didn't tell Goose *how* to create art. It told Goose *how to behave* while trying to create it.

This was especially helpful for the recipe-based workflow, where repetition can amplify small mistakes if they're not caught early.

---

## Progressive Disclosure as the Real Strategy

The most important decision I made wasn't technical. It was interactional.

Instead of providing all my context, opinions, and expectations at once, I started with the smallest prompt that should reasonably work. When the output fell short, I added only the missing piece of context that addressed the specific failure I observed.

For example, on Day 1 ("One color, one shape"), my first run with the harness approach produced this:

> **Goose's pitch:** "Breathing Circles" - A field of soft coral circles that pulse and breathe together

Coral pink. The #1 AI art cliché.

I didn't preemptively ban coral pink. I observed the failure, then added constraints. This led to the BANNED list in the skills version:

```markdown
### 🚫 BANNED AI ART CLICHÉS

**Color Crimes:**
- Salmon/coral pink (`fill(255, 100, 100)`) - THE #1 AI ART CLICHÉ
- Teal and orange together (the "movie poster" palette)
- Purple-pink-blue gradient (the "synthwave" default)

**The Test:** If you've seen it as an AI Twitter bot's output, DON'T DO IT.
```

Each round of context earned its place. Nothing was added preemptively. This sequencing mattered far more than the total amount of context.

---

## Recipe + Skill (the `/genuary-skills` approach)

When I paired a recipe with a skill file, Goose handled the workflow execution. Once the recipe and `.goosehints` were in place, it consistently transformed prompts into structured art pieces. My role was to define what "good" meant and correct ambiguous language before it became baked into the workflow.

Here's what a typical session looked like:

```
Me: /genuary day=3

Goose: [reads prompt: "Fibonacci forever"]
       [explains the concept]
       [pitches: "Sunflowers blooming in golden ratio spirals..."]

Me: "too basic"

Goose: [pitches alternatives: breathing box, butterfly migration...]

Me: "butterflies!"

Goose: [scaffolds day03/ folder]
       [writes sketch.js]
       [opens in Chrome, takes screenshot]
       [shows result]

Me: "is this actually fibonacci?"

Goose: [realizes the spirals aren't visible enough]
       [rewrites to make 13 + 21 spirals undeniable]

Me: "yes! push it"

Goose: [saves GIF + PNG]
       [commits and pushes to GitHub]
```

The biggest strength of this approach was **stability**. Once the recipe worked, it kept working. If I ran it again with similar inputs, the output quality was predictable.

The downside was that early mistakes persisted. The coral pink incident happened because the recipe didn't have the BANNED list yet. Recipes optimize for repeatability, not for discovery.

---

## Recipe + Harness (the `/genuary` approach)

The harness-based approach felt different. Instead of relying on a skill file to teach Goose the workflow, I had shell scripts that handled the deterministic parts. The harness made differences between runs obvious. The shell scripts handled the boring parts (scaffolding, file management), while Goose focused on creativity.

From the Day 1 transcript:

```
Goose: ./harness.sh prompt 1
       [shows: "One color, one shape" by Piero]
       
Goose: ./harness.sh new 1
       [creates days/day01/ with template files]
       
Goose: [writes sketch.js with "Breathing Circles" concept]
       [opens Chrome DevTools]
       [takes screenshot]
       
Goose: "The breathing animation is working beautifully! 
        You can see the circles have shifted - some expanded, 
        some contracted, creating that living, organic feel."
```

This approach excelled at **iteration**. I could see which prompts preserved my creative vision better, which ones overstructured the output, and which ones produced clichés. The harness surfaced these differences quickly.

The tradeoff was portability. A harness is excellent for learning and tuning, but it's not something you casually hand to a teammate and say "just run this."

---

## The Coral Pink Discovery

Here's something interesting I learned from comparing the two approaches.

The harness version of Day 1 produced coral pink circles. The skills version produced deep indigo circles. Why?

The skills version had the BANNED list in `SKILL.md`. But the harness version was running *before* I added those constraints. The recipe didn't know to avoid coral pink because I hadn't told it yet.

This is the value of running both approaches: **the harness helped me discover what constraints were missing, and then I added them to the skill.**

The template file itself was neutral - just placeholder text saying "Your art goes here." Goose chose coral pink on its own. It's apparently a default the model gravitates toward for "soft, organic" visuals.

---

## What Performed Better, and When

**For initial exploration and prompt refinement:** The harness performed better. It helped me reach good output faster by making weaknesses visible early.

**For producing stable, reusable workflows:** The recipe performed better once it incorporated what I learned from the harness.

**`.goosehints`** improved both approaches, but mattered more for the recipe.

**Progressive disclosure** mattered equally for both. It was the strategy that made either approach viable without drowning the agent in context.

If I had to summarize: **the harness helped me learn what to build, and the recipe helped me ship it.**

---

## The Full Automation Stack

By the end of the day, I had:

1. **Two generation workflows** producing art for the same prompts
2. **Chrome DevTools integration** for visual feedback loops
3. **GitHub Actions** posting to Bluesky automatically at 2:25 PM daily
4. **A live site** at genuary2026.vercel.app showing all the outputs
5. **Full transcripts** of every conversation with Goose

The social media automation was its own adventure. Bluesky's API was straightforward. Twitter's Free tier blocked requests from GitHub Actions IPs (Cloudflare bot protection). LinkedIn requires OAuth tokens that expire every 60 days.

Lesson learned: Bluesky is much more developer-friendly than Twitter's current offering.

---

## The Main Lesson

The biggest takeaway from this experiment is that context engineering is less about *how much* context you provide and more about *when* you provide it.

Adding context too early often made the output more generic. Adding context only after observing failure made the output sharper and more aligned with my intent.

Skills, recipes, harnesses, and `.goosehints` are all useful tools, but they're secondary to interaction design. The sequence of prompts, corrections, and constraints is what actually determines quality.

I didn't need a massive system to get there. I needed one clear task, a way to observe outcomes, and the discipline to add context only when it earned its place.

That's the part of context engineering I don't see discussed enough, and it's the part that made Goose genuinely useful in this experiment.

---

## Try It Yourself

The full repo is at [github.com/blackgirlbytes/genuary2026](https://github.com/blackgirlbytes/genuary2026)

It includes:
- Both workflow approaches (`/genuary` and `/genuary-skills`)
- All the prompts, templates, and configuration files
- Complete transcripts of every conversation with Goose
- The GitHub Actions for social media posting

The transcripts are the most interesting part. You can see exactly how the conversations evolved, where I pushed back on "basic" ideas, and how the constraints developed over time.

---

## Side-by-Side Results

| Day | Prompt | Harness Output | Skills Output |
|-----|--------|----------------|---------------|
| 1 | One color, one shape | Coral pink "Breathing Circles" | Deep indigo "Thousand Heartbeats" |
| 2 | Twelve principles of animation | "The Sleepy G" character | "Stairway to Nowhere" walking staircase |
| 3 | Fibonacci forever | Breathing meditation box | Butterfly phyllotaxis migration |

The skills version consistently avoided AI clichés because the SKILL.md explicitly banned them. The harness version helped me discover what to ban.

---

*Built with [Goose](https://github.com/block/goose) in a few hours. The AI wrote the code. I directed the vision.*
