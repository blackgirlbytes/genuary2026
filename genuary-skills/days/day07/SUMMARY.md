# Day 07: Boolean Algebra (Skills Version)

## Prompt
- **Title:** "Boolean algebra"
- **Credit:** PaoloCurtoni
- **Description:** Get inspired by Boolean algebra, in any way.

## Concept
**"The Gate Keeper"** — A cute Black girl guardian who stands at an ornate gate, evaluating boolean logic (AND, OR, XOR) to decide if adorable blob travelers can pass through.

The idea was to take cold, abstract boolean algebra and turn it into a warm, character-driven story. Each logic operation has a *personality*:
- **AND** — "I need BOTH of you" (stern but fair)
- **OR** — "Anyone is welcome!" (generous and open)
- **XOR** — "Exactly one, please" (picky and mysterious)

## Key Decisions
1. **Focused scope** — User requested fewer elements done well rather than many elements done poorly. We chose 4 main elements: Gate Keeper, Gate, and 2 Travelers.
2. **Character design** — User requested the gate keeper be a cute Black girl. Added afro puffs with pink bows, warm brown skin, sparkly anime-style eyes, and rosy blush cheeks.
3. **Storybook aesthetic** — Soft pastels, rolling green hills, warm sky gradient, path leading to gate.
4. **Educational element** — Shows the boolean expression and result at bottom (e.g., "1 AND 1 = ✓ PASS").

## Implementation
- **p5.js** with object-oriented design (GateKeeper, Gate, Traveler classes)
- **Phase-based animation** — approaching → evaluating → result → reset
- **Expressive states** — Gate keeper has thinking (sparkles, looking up), happy (big smile, teeth showing), and neutral expressions
- **Smooth animations** — lerp() for movement, sin() for bobbing, smooth gate opening
- **Layered rendering** — Proper z-ordering for characters passing through gate
- **Color-coded modes** — Each boolean operation has its own color (dusty rose for AND, sage green for OR, lavender for XOR)

## Iterations
1. **Initial pitch** — "The Logic Garden" with many flowers representing different logic gates
2. **User feedback** — Requested fewer, more refined elements
3. **Second pitch** — 6 focused ideas including "The Gate Keeper"
4. **User selection** — Chose Gate Keeper concept
5. **Character update** — Changed from wizard-like figure to cute Black girl with afro puffs

## Final Result
A charming, animated scene where:
- Two cute blob travelers (A and B) approach from opposite sides
- The gate keeper evaluates the boolean logic
- The gate opens or stays closed based on the result
- Travelers either pass through triumphantly or bounce back gently
- The mode cycles through AND → OR → XOR with different colors and descriptions

**Files:**
- `sketch.js` — Main p5.js code (~500 lines)
- `index.html` — Page template with controls
- `output/day07-gatekeeper.png` — Full page screenshot
- `output/day07-gatekeeper.gif` — Animated GIF of the full page
- `output/day07-gatekeeper-canvas.gif` — Cropped GIF of just the canvas
