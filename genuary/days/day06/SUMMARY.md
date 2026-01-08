# Day 6: Lights on/off

## Prompt
**"Make something that changes when you switch on or off the 'digital' lights."**
- Credit: George Henry Rowe

## Concept
**"The Night Shift"** - A cozy late-night diner scene featuring a sleeping cat and a coffee cup. When the lights go off, the cat awakens with glowing eyes to gaze at a galaxy portal swirling inside the coffee cup.

The piece explores the idea that magic happens when we're not looking - the mundane daytime scene transforms into something mystical at night.

## Key Decisions
- **Proper cat anatomy**: The original version had a floating cat with disconnected parts. We rebuilt it with bezier curves creating a proper loaf shape with connected ears, body, and tucked paws
- **Atmospheric window**: Added a window showing city skyline that transforms - daytime buildings become silhouettes with glowing windows, stars appear, and a crescent moon emerges
- **Galaxy coffee**: The coffee surface becomes a swirling galaxy portal with nebula clouds, spiral arms, and twinkling stars
- **Bioluminescent particles**: Magic particles rise from the cup with trails in cyan and magenta, replacing the daytime steam
- **Cat's eyes**: Closed peaceful curves when sleeping (lights on), glowing golden orbs with vertical slit pupils when awake (lights off)

## Implementation
- **HSB color mode** for smooth color transitions between warm daytime and cool nighttime palettes
- **Bezier curves** for organic cat body shapes and ear connections
- **Particle systems** with trails for both steam (day) and magic particles (night)
- **Layered rendering** for galaxy effect: deep space base → nebula clouds → spiral arms → stars → bright core
- **Smooth transitions** using `lerp()` between all states for seamless light switching
- **Click/spacebar interaction** to toggle lights

## Iterations
1. **v1 (original)**: Basic floating cat, simple ellipse body, underwhelming galaxy effect
2. **v2 (final)**: Complete rewrite with proper anatomy, atmospheric window, stunning galaxy portal, and magical particle trails

## Final Result
An interactive piece where clicking toggles between:
- **Lights ON**: Warm cozy diner, sleeping cat with closed eyes, steaming coffee, daytime city view
- **Lights OFF**: Mysterious night scene, cat awake with glowing eyes, galaxy swirling in coffee cup, starry sky with moon, bioluminescent particles rising

The transformation tells a story of hidden magic revealed in darkness.
