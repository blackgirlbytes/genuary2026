# Day 2: Twelve Principles of Animation (Skills Version)

## Prompt
**Twelve principles of animation** — The classic Disney animation principles developed in the 1930s.
*Credit: Anna Lucia*

## Concept
The agent proposed creating a **sentient, walking staircase** ("Stairway to Nowhere") — an Escher-inspired impossible staircase that has "woken up" and decided to go for a walk. This was chosen after the user rejected an initial bouncing blob idea and requested a non-circular, more creative shape. Other options pitched included an origami crane and a morphing triangle orchestra.

## Key Decisions
- **Shape**: Isometric 3D staircase (6 steps) instead of typical circular/blob characters
- **Personality**: Added a curious blinking eye on the top step for appeal
- **Movement style**: Caterpillar/inchworm locomotion with wave-like motion through steps
- **Color palette**: Warm terracotta (`#e07a5f`), deep shadow purple (`#3d405b`), cream background (`#f4f1de`) — deliberately avoiding "banned AI art clichés"

## Implementation
- **p5.js** with isometric 3D rendering (top, front, side faces for each step)
- Each step is an independent object with offset, squash/stretch, and rotation properties
- Staggered phase timing creates the wave/follow-through effect
- Perlin noise for eye movement and ambient dust particles
- Eased sine waves (`easeInOutCubic`) for slow-in/slow-out
- Dust particle system spawns on step landings

## Iterations
The creative process involved three rounds of pitching:
1. **Initial pitch**: Bouncing blob creature → User requested non-circular shape
2. **Second pitch**: Three options (origami crane, morphing triangles, walking staircase) → User chose staircase
3. **Final refinement**: Added eye personality, dust particles, and warm color palette

## Final Result
A looping animation of a 6-step isometric staircase that "walks" across the canvas with:
- Visible squash/stretch on each step
- Staggered wave motion demonstrating follow-through
- A blinking, curious eye that looks around
- Golden dust particles on each landing
- Floating ambient dust motes in the background

**Output**: GIF animation + PNG thumbnail saved to `output/` folder and pushed to GitHub.
