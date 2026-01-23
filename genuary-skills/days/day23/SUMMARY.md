# Day 23: Transparency - Jellyfish Ballet 🪼 (Skills Version)

## Prompt
- **"Transparency"** - Explore the concept of transparency
- Credit: PaoloCurtoni

## Concept
A deep ocean twilight scene where **bioluminescent jellyfish** drift through dark waters. Each jellyfish is made of multiple translucent layers - bell, tendrils, inner organs - all at different opacities.

**The magic happens in the overlap:** When two jellyfish cross paths, their combined transparency creates new colors - like stained glass windows meeting in the deep.

## Key Decisions
- **No light rays** - Initially had vertical "god rays" but they looked like ugly bars in the ocean. Removed them entirely.
- **Depth through fading** - Jellyfish further away are more transparent and smaller (atmospheric perspective)
- **Bioluminescent glow** - Each jellyfish has a soft radial glow around it
- **Subtle vignette** - Very light darkening at edges only, not overpowering
- **Rich color palette** - Pinks, lavenders, ambers, cyans, roses - all in HSB mode for beautiful blending

## Implementation
- **p5.js with HSB color mode** for smooth color transitions
- **Multiple translucent bell layers** per jellyfish (outer, middle, inner) at different opacities
- **Depth sorting** - Jellyfish rendered far-to-near
- **Noise-based movement** - Organic drifting using Perlin noise
- **Pulsing animation** - Bell size and opacity change with sin wave
- **Flowing tentacles** - Multiple strands with wave motion and glowing dots
- **Marine snow particles** - 150 floating particles drifting upward

## Iterations
1. **First version** - Had vertical light rays that looked artificial
2. **Removed light rays** - Tried caustics instead, but vignette was too dark
3. **Fixed vignette** - Made it much more subtle (only edges, low alpha)
4. **Boosted visibility** - Increased jellyfish alpha values and glow intensity
5. **Final version** - Beautiful translucent jellyfish with visible layering

## Final Result
A peaceful, hypnotic underwater scene with 7 bioluminescent jellyfish drifting through deep ocean waters. The transparency effect creates dreamlike color blending where jellyfish overlap. Floating particles add to the underwater atmosphere.

**The vibe:** Like watching a lava lamp made of living light.

---
*Made by Goose 🪿 and [blackgirlbytes](https://github.com/blackgirlbytes)*
