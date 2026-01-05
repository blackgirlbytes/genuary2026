# Day 4: Lowres - Transcript Summary

## Project: Genuary (genuary2026/genuary)

### Prompt
**"Lowres"** - An image or graphic with low resolution, where details are simplified or pixelated.
*Credit: Manuel Larino*

---

## Final Artwork: "Starry Night, Deconstructed"

A Van Gogh-inspired night scene with **progressive pixelation** - the sky becomes more abstract and pixelated the higher you look, while the earth stays crisp and grounded.

### Key Features:
- **Top of sky**: Big chunky 50px blocks - the abstract, infinite cosmos
- **Gradual transition**: Pixels smoothly shrink row-by-row as you move down
- **Near horizon**: Tiny 3px pixels - almost smooth
- **Landscape**: Completely crisp - rolling hills, cypress trees, village with glowing windows, church steeple
- **Twinkling stars** pierce through all resolution levels
- **Glowing crescent moon** with soft halos

---

## Creative Journey (Multiple Sessions)

### Session 1: Initial Attempt (20260104_57)
- Started with a pixelated landscape concept
- Created basic lowres sunset scene
- Had some rendering issues with sky colors

### Session 2: Exploration Phase (20260105_6)
**Pitches explored:**
1. "Pixel Sunrise Over a Tiny World" - 32x32 pixel world with day-night cycle → **Rejected as "BORING"**
2. "Pixel Soup" - Bubbling cauldron of pixels
3. "The Glitch Zoo" - Corrupted pixel animals
4. "Lowres Dance Party" - Tiny 24x24 dance floor with pixel people → **Built but rejected as "too flashy"**

**Pivot to Starry Night:**
- User suggested "starry night but pixel"
- Built 48x48 version → Rejected as "too much pixel"
- Tried 64x64 version → Rejected as "too much movement"
- Finally landed on higher resolution (80x80+) with barely any movement

### Session 3: Final Iteration (20260105_18)
- User requested "half and half" - some parts pixelated, some not
- Concept: Sky pixelated (dreamlike), landscape crisp (grounded reality)
- User feedback: "it doesn't seem gradual enough"
- **Final solution**: Progressive resolution gradient
  - Each row of sky rendered at different pixel sizes
  - Smooth quadratic easing from 50px blocks at top to 3px near horizon
  - Seamless transition with no harsh bands

---

## Technical Implementation

```javascript
// Progressive pixelation - each row has different resolution
for (let y = 0; y < skyHeight; y++) {
  let progress = y / skyHeight;  // 0 at top, 1 at bottom
  let eased = progress * progress;  // Quadratic easing
  let pixelSize = lerp(50, 3, eased);  // 50px at top → 3px at bottom
  // Render row at this pixel size...
}
```

---

## User Feedback Loop

| Iteration | User Feedback | Action Taken |
|-----------|---------------|--------------|
| Dance Party | "too flashy" | Pivoted to Starry Night |
| 48x48 Starry Night | "too much pixel" | Increased resolution |
| 64x64 with animation | "too much movement, hate it" | Reduced animation, increased res |
| 80x80 static | "doesn't seem gradual enough" | Added progressive pixelation |
| Progressive gradient | "yeah i like that better" | ✅ Final version |

---

## Sessions Involved
1. `20260104_57` - Initial Day 4 setup
2. `20260105_6` - Dance party exploration, pivot to Starry Night
3. `20260105_18` - Final progressive pixelation version

---

## Output
- **File**: `days/day04/output/day04.png`
- **Live**: genuary2026.vercel.app/genuary/days/day04/
