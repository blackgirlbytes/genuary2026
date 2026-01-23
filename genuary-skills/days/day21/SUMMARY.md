# Day 21: Bauhaus Poster (Skills Version)

## Prompt
- **Title:** Bauhaus Poster
- **Description:** Create a poster design inspired by the German art school Bauhaus.
- **Credit:** Piero

## Concept
**"Das Tanzende Bauhaus" (The Dancing Bauhaus)** - A generative Bauhaus poster that *breathes*. Not static—ALIVE.

The Bauhaus wasn't just an art school—it was a revolution. They believed in the unity of art and craft, in geometric purity, in primary colors singing against stark backgrounds. But Bauhaus was also deeply playful (Kandinsky and Klee taught there!). This piece brings that spirit to life with shapes that dance to an unheard rhythm.

## Key Decisions
1. **Poster proportions** (800x1000) - taller than wide, like a real poster
2. **"BAUHAUS" text from pure geometry** - no fonts allowed! Each letter constructed from circles, triangles, and rectangles
3. **Primary colors only** - Red (#E53935), Yellow (#FDD835), Blue (#1E88E5) - Kandinsky's holy trinity
4. **Form follows function** - each shape moves according to its geometric nature:
   - Circles pulse and wobble smoothly
   - Triangles pivot and point
   - Rectangles slide horizontally or vertically
5. **Cream background** (#F5F5DC) - classic Bauhaus poster aesthetic
6. **Subtle grid lines** - Bauhaus loved structure and grids

## Implementation
- **p5.js** for canvas rendering and animation
- **Object-oriented dancers** - CircleDancer, TriangleDancer, RectDancer classes
- **Sinusoidal motion** using `sin()` and `cos()` for smooth, harmonic movement
- **Geometric letter construction** - custom functions for B, A, U, H, S using primitives
- **Layered shadows** for subtle depth (very Bauhaus poster style)
- **Orbital dots** floating around the composition (Kandinsky influence)
- **Corner brackets** framing the poster
- **Signature trio** at bottom - circle, triangle, square (the Bauhaus shape trinity)

## Iterations
- Initial implementation worked on first try!
- Verified the geometric BAUHAUS text rendered correctly at the top
- Confirmed all dancing shapes were animating smoothly
- No iterations needed - the vision came together beautifully

## Final Result
A living, breathing Bauhaus poster where geometric shapes dance in harmonic motion. The "BAUHAUS" title is spelled out in pure geometry (no fonts!), primary-colored shapes pulse, pivot, and slide across a cream background with subtle grid lines. Floating dots orbit the composition like Kandinsky's cosmic paintings. The poster feels like it came from 1926 Dessau but is secretly alive, winking at you, inviting you to the party.

**Outputs:**
- `output/day21-bauhaus.png` - Static poster capture
- `output/day21-bauhaus.gif` - Animated dancing Bauhaus

**Tags:** #genuary #genuary2026 #day21 #bauhaus #creativecoding #p5js
