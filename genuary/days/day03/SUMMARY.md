# Day 3: Fibonacci Forever

## Prompt
Create a work that uses the Fibonacci sequence in some way.

## Concept
**"Fibonacci Breathing Box"** — A meditative breathing exercise where breath durations follow the Fibonacci sequence. The user rejected the initial "Fibonacci Bloom" flower idea as "too basic," leading to five alternative pitches. The breathing box concept was chosen for its unique blend of math and meditation.

## Key Decisions
- **Rejected the obvious**: Initial pitch of a golden spiral flower was dismissed as basic
- **Chose experiential over visual**: Rather than just displaying Fibonacci visually, the sequence controls *time* — how long each breath lasts
- **Breath pattern**: Inhale 1 beat → Exhale 1 → Inhale 2 → Exhale 3 → Inhale 5 → Exhale 8
- **Color language**: Warm colors (coral/peach) for inhale, cool colors (blue) for exhale

## Implementation
- **p5.js** with time-based animation using `deltaTime`
- Soft, rounded square ("breathing box") that expands/contracts with breath
- Concentric rings ripple outward on each breath transition
- Ambient particles drift toward center on inhale, away on exhale
- Background darkens as breaths get longer (deeper meditation)
- UI shows current beat count and highlights position in Fibonacci sequence

## Iterations
1. **Initial implementation bug**: Breath pattern was inhale 1 → exhale 1 → inhale 1 → exhale 1 (repeating same number for both phases)
2. **User caught the error**: "is this actually fibonacci"
3. **Fixed**: Changed logic so each breath (in or out) advances to the next Fibonacci number

## Final Result
A hypnotic, meditative animation where a glowing shape breathes on Fibonacci time. As the sequence progresses, breaths become dramatically longer (the 8-beat exhale is notably slow). The piece transforms math into a visceral, almost spiritual experience — "lo-fi meditation app meets generative art."
