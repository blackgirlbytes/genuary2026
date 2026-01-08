# Day 06: Lights on/off (Skills Version)

## Prompt
**"Lights on/off"** - Make something that changes when you switch on or off the "digital" lights.
*Credit: George Henry Rowe*

## Concept
**"The Koi's Secret"** - A gorgeous koi fish that breathes between flesh and skeleton. The piece explores duality and transformation — the same creature revealing completely different truths depending on the "light." It's about what we see vs. what's hidden, the surface beauty vs. the underlying structure.

## Key Decisions
- **Single creature focus**: Rather than transforming an entire scene, the piece focuses intimately on one koi fish
- **Automatic cycling**: The light phase oscillates smoothly using a sine wave, creating a dreamy, meditative rhythm
- **Overlapping transition**: The flesh fades out while the skeleton fades in, creating beautiful moments where both are visible
- **Beating heart**: A glowing pink heart pulses inside the skeleton's ribcage, adding life to the x-ray view
- **Environmental shift**: Background transforms from warm sunlit water (with caustics) to deep dark water (with floating particles)

## Implementation
- **HSB color mode** for easier color transitions and glow effects
- **Bezier curves** for organic fish body and fin shapes
- **Shadow blur** for the skeleton's electric cyan glow effect
- **Layered alpha blending** for smooth flesh-to-skeleton transition
- **Sine wave animation** for swimming motion, tail movement, and light phase cycling
- **Particle systems** for bubbles (light mode) and floating plankton (dark mode)

## Iterations
- The piece was already complete when this session started
- User requested it be pushed to GitHub and added to the main index
- Added day 6 to the genuary-skills section of the gallery index
- Captured output screenshot showing the transition state

## Final Result
A hauntingly beautiful animated piece where a traditional orange-and-white koi fish smoothly transforms into a glowing cyan skeleton with a beating pink heart. The transition is dreamlike and continuous, with the environment shifting from bright sunlit water to deep dark ocean. The piece captures the prompt's essence of revealing hidden truths when the "lights" change.

**Files:**
- `sketch.js` - 450 lines of p5.js code
- `index.html` - Styled page with controls
- `output/day06.png` - Screenshot of transition state
