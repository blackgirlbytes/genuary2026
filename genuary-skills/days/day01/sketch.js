// Genuary 2026 - Day 01
// Prompt: One Color, One Shape
// "A Thousand Heartbeats" - circles breathing at different rhythms

const WIDTH = 800;
const HEIGHT = 800;

// Our breathing circles
let circles = [];
const NUM_CIRCLES = 400;

// The ONE color - deep indigo
const HUE = 235;

class BreathingCircle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    
    // Base size varies to create depth (smaller = further away)
    this.baseSize = random(8, 60);
    
    // Each circle breathes at its own rate
    // Slower for bigger circles (like larger creatures breathe slower)
    this.breathRate = map(this.baseSize, 8, 60, 0.08, 0.02);
    
    // Random phase so they don't all sync up
    this.phase = random(TWO_PI);
    
    // How much the circle expands/contracts (as percentage of base size)
    this.breathDepth = random(0.2, 0.5);
    
    // Opacity based on size (smaller = more transparent = further away)
    this.baseAlpha = map(this.baseSize, 8, 60, 15, 50);
    
    // Slight drift for organic feel
    this.driftX = random(-0.3, 0.3);
    this.driftY = random(-0.3, 0.3);
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
  }
  
  update() {
    // Gentle drift using noise for organic movement
    this.x += (noise(this.noiseOffsetX + frameCount * 0.005) - 0.5) * this.driftX;
    this.y += (noise(this.noiseOffsetY + frameCount * 0.005) - 0.5) * this.driftY;
    
    // Wrap around edges softly
    if (this.x < -this.baseSize) this.x = width + this.baseSize;
    if (this.x > width + this.baseSize) this.x = -this.baseSize;
    if (this.y < -this.baseSize) this.y = height + this.baseSize;
    if (this.y > height + this.baseSize) this.y = -this.baseSize;
  }
  
  display() {
    // Calculate current breath state
    let breathCycle = sin(frameCount * this.breathRate + this.phase);
    
    // Current size based on breath
    let currentSize = this.baseSize * (1 + breathCycle * this.breathDepth);
    
    // Alpha pulses slightly with breath too
    let currentAlpha = this.baseAlpha + breathCycle * 10;
    
    // Saturation varies slightly with breath for subtle shimmer
    let sat = 70 + breathCycle * 15;
    
    // Draw the circle
    noStroke();
    fill(HUE, sat, 85, currentAlpha);
    ellipse(this.x, this.y, currentSize, currentSize);
  }
}

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create circles with organic distribution
  // Use rejection sampling to avoid too much clustering
  circles = [];
  let attempts = 0;
  
  while (circles.length < NUM_CIRCLES && attempts < NUM_CIRCLES * 10) {
    // Use noise for organic clustering
    let x = random(width);
    let y = random(height);
    
    // Add some noise-based density variation
    let density = noise(x * 0.005, y * 0.005);
    
    if (random() < density + 0.3) {
      circles.push(new BreathingCircle(x, y));
    }
    attempts++;
  }
  
  // Sort by size so smaller (further) circles are drawn first
  circles.sort((a, b) => a.baseSize - b.baseSize);
}

function draw() {
  // Deep, dark background that lets the indigo glow
  background(240, 30, 8);
  
  // Update and display all circles
  for (let circle of circles) {
    circle.update();
    circle.display();
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day01', 'png');
  }
}
