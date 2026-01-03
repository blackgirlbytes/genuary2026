# 🎨 Genuary 2026 Harness

A creative coding harness for [Genuary 2026](https://genuary.art/) - 31 days of generative art prompts!

## Quick Start

```bash
# See today's prompt
./harness.sh prompt today

# Start working on a day
./harness.sh new 3

# Preview your work
./harness.sh preview 3

# Check your progress
./harness.sh list
```

## Commands

| Command | Description |
|---------|-------------|
| `./harness.sh prompt <day\|today>` | Show the prompt for a specific day |
| `./harness.sh new <day\|today>` | Create a new day folder from template |
| `./harness.sh preview <day>` | Open the sketch in your browser |
| `./harness.sh export <day>` | Open for export (use Save PNG button or press 'S') |
| `./harness.sh list` | Show all 31 days and your progress |
| `./harness.sh help` | Show help message |

## Structure

```
genuary/
├── harness.sh          # The main harness script
├── prompts.json        # All 31 prompts
├── template/           # Boilerplate for new days
│   ├── index.html
│   └── sketch.js
├── days/
│   ├── day01/
│   │   ├── index.html
│   │   ├── sketch.js   # ← Edit this!
│   │   └── output/
│   │       └── day01.png
│   ├── day02/
│   └── ...
└── README.md
```

## Workflow

1. **Get the prompt**: `./harness.sh prompt today`
2. **Scaffold the day**: `./harness.sh new today`
3. **Edit `sketch.js`**: Write your p5.js code
4. **Preview**: `./harness.sh preview <day>` (opens in browser)
5. **Iterate**: Edit → Save → Refresh browser
6. **Export**: Click "Save PNG" button or press 'S'
7. **Share**: Post with hashtags `#genuary #genuary2026 #genuary<day>`

## p5.js Basics

Your `sketch.js` has two main functions:

```javascript
function setup() {
  createCanvas(800, 800);  // Set canvas size
  background(20);          // Dark background
  // Runs once at start
}

function draw() {
  // Runs every frame (for animations)
  // Use noLoop() in setup() for static art
}
```

### Useful p5.js Functions

```javascript
// Shapes
ellipse(x, y, w, h)       // Circle/oval
rect(x, y, w, h)          // Rectangle
line(x1, y1, x2, y2)      // Line
triangle(x1,y1,x2,y2,x3,y3)

// Colors
fill(r, g, b)             // Fill color
stroke(r, g, b)           // Outline color
noFill()                  // No fill
noStroke()                // No outline
background(r, g, b)       // Background color

// Randomness
random(min, max)          // Random number
noise(x, y)               // Perlin noise (0-1)

// Math
sin(angle), cos(angle)    // Trig functions
map(val, in1, in2, out1, out2)  // Remap value

// Animation
frameCount                // Current frame number
millis()                  // Milliseconds since start
```

### Static vs Animated

```javascript
// For STATIC art (single image):
function setup() {
  createCanvas(800, 800);
  noLoop();  // ← Don't animate
  // Draw everything here
}

// For ANIMATED art:
function setup() {
  createCanvas(800, 800);
  // Setup only
}

function draw() {
  // This runs 60x per second
}
```

## Saving Your Work

- **In browser**: Click "Save PNG" button or press 'S' key
- **Move to output folder**: `mv ~/Downloads/day03.png days/day03/output/`
- **For GIFs**: Use screen recording or [gifcap](https://gifcap.dev/)

## Resources

- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [Genuary Prompts](https://genuary.art/prompts)
- [The Coding Train (YouTube)](https://www.youtube.com/c/TheCodingTrain)

## 2026 Prompts

| Day | Prompt |
|-----|--------|
| 1 | One color, one shape |
| 2 | Twelve principles of animation |
| 3 | Fibonacci forever |
| 4 | Lowres |
| 5 | Write "Genuary" (no fonts) |
| 6 | Lights on/off |
| 7 | Boolean algebra |
| 8 | A City |
| 9 | Crazy automaton |
| 10 | Polar coordinates |
| 11 | Quine |
| 12 | Boxes only |
| 13 | Self portrait |
| 14 | Everything fits perfectly |
| 15 | Invisible object (shadows only) |
| 16 | Order and disorder |
| 17 | Wallpaper group |
| 18 | Unexpected path |
| 19 | 16x16 |
| 20 | One line |
| 21 | Bauhaus Poster |
| 22 | Pen plotter ready |
| 23 | Transparency |
| 24 | Perfectionist's nightmare |
| 25 | Organic Geometry |
| 26 | Recursive Grids |
| 27 | Lifeform |
| 28 | No libraries, only HTML |
| 29 | Genetic evolution |
| 30 | It's not a bug, it's a feature |
| 31 | GLSL day (shaders) |

---

Happy creating! 🎨✨
