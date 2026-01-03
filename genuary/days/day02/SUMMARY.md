# Day 2: Twelve Principles of Animation

## Prompt
- **Twelve principles of animation** (Credit: Anna Lucia)
- Reference to Disney's legendary 12 animation principles from the 1930s

## Concept
The agent chose to create a **morphing letter "G"** (for Genuary!) that demonstrates multiple animation principles. The user specifically requested a "creative shape that's not circular," and after the agent pitched several options (wobbly star, slice of toast, blob with tentacles, morphing letter, dancing cactus), the user selected the morphing letter concept.

The final implementation evolved into **"The Sleepy G"** - a character G that wakes up and rises from the bottom of the screen.

## Key Decisions
- **Shape choice**: Letter "G" chosen for its meta-relevance to Genuary and its interesting typographic features (counter/hole, crossbar) that could move independently
- **Character personality**: Added a face with eye and rosy cheek to give the G "appeal" (one of the 12 principles)
- **Color palette**: Muted purple-pink when sleepy → vibrant coral when awake
- **State machine approach**: sleeping → waking → rising → awake

## Implementation
**p5.js techniques used:**
- State machine for animation phases
- Easing functions (`easeInOutQuad`, `easeInOutCubic`) for slow-in/slow-out motion
- `lerp()` and `lerpColor()` for smooth transitions
- Particle system for "Z" sleep symbols that transform into sparkles
- Dynamic squash/stretch based on velocity

**Animation principles demonstrated:**
1. **Squash & Stretch** - G compresses when sleeping, stretches when rising fast
2. **Anticipation** - Squashes down before rising
3. **Slow In/Slow Out** - Eased rise with slow start, fast middle, slow end
4. **Follow-Through** - Eye blinks, particle trails
5. **Secondary Action** - Z particles, sparkles, shadow
6. **Timing** - Different speeds convey weight and mood
7. **Exaggeration** - Dramatic squash ratios (1.5x wide when anticipating)
8. **Appeal** - Face with eye, blinking, rosy cheek

## Iterations
1. **Initial version**: Bouncing G that hops across screen with rotation, trail, and crossbar wiggle
2. **Refinement**: Improved G shape to be more recognizable as a letter (first version looked like "a stylized donut")
3. **Final pivot**: Changed from bouncing animation to a "waking up and rising" concept with character personality

## Final Result
An animated letter "G" character that:
- Starts sleeping at the bottom of the screen with gentle breathing animation
- Emits floating "z" particles
- Wakes up with anticipation squash
- Rises smoothly to center using eased motion (the core slow-in/slow-out principle)
- Z's transform into golden sparkles as it wakes
- Settles into gentle floating with occasional blinking
- Loops back to sleeping state
