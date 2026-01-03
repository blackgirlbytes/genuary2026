# Day 3: Fibonacci Forever (Skills Version)

## Prompt
Create a work that uses the Fibonacci sequence in some way.
*Credit: PaoloCurtoni*

## Concept
**"The Migration"** - 300 monarch butterflies gather in a phyllotaxis formation around a central flower. The golden angle (137.5°) placement creates visible Fibonacci spirals that you can trace with your eyes - 13 spirals one direction, 21 the other (both Fibonacci numbers).

## Key Decisions
- **Initial pitch rejected**: First idea was a "breathing sunflower" - user called it "basic"
- **Second pitch rejected**: Rabbit breeding visualization (literal Fibonacci problem) or impossible Escher staircase
- **User suggested butterflies** → led to monarch migration concept
- **Critical pivot**: User challenged "is this actually fibonacci?" when first implementation just spawned butterflies in Fibonacci-numbered waves. Pivoted to **phyllotaxis** where the Fibonacci spirals are visually undeniable

## Implementation
- **Phyllotaxis positioning**: Each butterfly placed at golden angle (137.5°) from previous, distance = √i × 18
- **Butterflies drawn with pure p5.js**: Bezier curves for wing shapes, no SVGs or images
- **HSB color mode**: Hues shift based on spiral position (`baseHue = 20 + (index % 13) * 3`) creating color bands along spirals
- **Organic movement**: Butterflies fly in from edges with noise-based flutter, settle with gentle wobble
- **Depth via subtle spiral guides**: Faint lines connecting every 13th and 21st butterfly reveal the spiral structure
- **Central flower**: Has its own tiny phyllotaxis seed pattern

## Iterations
1. First version: Butterflies spawning in Fibonacci-numbered waves (1, 1, 2, 3, 5...) - rejected as "not visually Fibonacci"
2. Final version: Phyllotaxis formation where spirals are unmistakable

## Final Result
- Animated piece showing butterflies gathering into sunflower-seed arrangement
- Visible 13 clockwise + 21 counter-clockwise spirals (consecutive Fibonacci numbers)
- Warm monarch color palette (burnt orange, black, white spots)
- Twilight gradient background
- Outputs: `day03.gif` (animation), `day03.png` (still)

**Notable feedback**: Friend commented the butterflies look hand-drawn/soft rather than computer-generated - achieved through bezier curves, HSB color variation, and organic movement patterns.
