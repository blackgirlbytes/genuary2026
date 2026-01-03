// Genuary Day 1: One Color, One Shape
// "Breathing Circles" - A field of soft coral circles that pulse and breathe together

const circles = [];
const numCircles = 80;
const coralPink = '#FF6B6B';

function setup() {
  createCanvas(800, 800);
  noStroke();
  
  // Create circles with random positions and phase offsets
  for (let i = 0; i < numCircles; i++) {
    circles.push({
      x: random(50, width - 50),
      y: random(50, height - 50),
      baseSize: random(30, 100),
      phase: random(TWO_PI),      // Each circle starts at different point in breath cycle
      speed: random(0.015, 0.035), // Slightly different breathing speeds
      breathDepth: random(0.3, 0.6) // How much the circle expands/contracts
    });
  }
  
  // Sort by base size so smaller circles render on top (depth effect)
  circles.sort((a, b) => b.baseSize - a.baseSize);
}

function draw() {
  // Soft warm background
  background(255, 250, 245);
  
  // Draw each breathing circle
  for (let c of circles) {
    // Calculate current breath phase
    let breath = sin(frameCount * c.speed + c.phase);
    
    // Map breath to size multiplier (1 - breathDepth to 1 + breathDepth)
    let sizeMult = map(breath, -1, 1, 1 - c.breathDepth, 1 + c.breathDepth);
    let currentSize = c.baseSize * sizeMult;
    
    // Subtle alpha variation based on breath (more opaque when expanded)
    let alpha = map(breath, -1, 1, 120, 200);
    
    // Draw the circle with coral pink
    fill(255, 107, 107, alpha);
    ellipse(c.x, c.y, currentSize, currentSize);
  }
}
