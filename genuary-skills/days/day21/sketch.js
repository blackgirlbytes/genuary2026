// Genuary 2026 - Day 21
// Prompt: Bauhaus Poster
// "Das Tanzende Bauhaus" - The Dancing Bauhaus
// A living, breathing poster where geometric shapes dance in harmonic motion

/*
 * 🎨 BAUHAUS PRINCIPLES EMBODIED:
 * - Primary colors: Red, Yellow, Blue (Kandinsky's holy trinity)
 * - Geometric primitives: Circle, Triangle, Rectangle
 * - Form follows function: each shape moves according to its nature
 * - Golden ratio proportions throughout
 * - Typography from pure geometry (no fonts!)
 * - The unity of art and craft
 */

const WIDTH = 800;
const HEIGHT = 1000; // Poster proportions!

// Bauhaus color palette
const BAUHAUS_RED = '#E53935';
const BAUHAUS_YELLOW = '#FDD835';
const BAUHAUS_BLUE = '#1E88E5';
const BAUHAUS_BLACK = '#1A1A1A';
const BAUHAUS_CREAM = '#F5F5DC';

// Golden ratio for proportions
const PHI = 1.618033988749;

// Dancing shapes
let dancers = [];
let bauhausLetters = [];

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-container');
  
  // Initialize the dancing shapes
  createDancers();
  
  // Create the BAUHAUS letters from geometry
  createBauhausText();
  
  frameRate(60);
}

function draw() {
  // Cream background - classic Bauhaus poster feel
  background(BAUHAUS_CREAM);
  
  // Draw subtle grid lines (Bauhaus loved grids)
  drawBauhausGrid();
  
  // Draw the geometric "BAUHAUS" text at top
  drawBauhausText();
  
  // Update and draw all dancing shapes
  for (let dancer of dancers) {
    dancer.update();
    dancer.display();
  }
  
  // Draw decorative elements
  drawDecorativeElements();
  
  // Signature line at bottom
  drawSignature();
}

function createDancers() {
  dancers = [];
  
  // Large central circle - the sun/eye of the composition
  dancers.push(new CircleDancer(
    WIDTH / 2,
    HEIGHT * 0.45,
    120,
    BAUHAUS_RED,
    0.02
  ));
  
  // Yellow triangles - pointing, pivoting
  dancers.push(new TriangleDancer(
    WIDTH * 0.25,
    HEIGHT * 0.35,
    80,
    BAUHAUS_YELLOW,
    0.015,
    PI / 6
  ));
  
  dancers.push(new TriangleDancer(
    WIDTH * 0.75,
    HEIGHT * 0.55,
    60,
    BAUHAUS_YELLOW,
    -0.02,
    -PI / 4
  ));
  
  // Blue rectangles - sliding, stacking
  dancers.push(new RectDancer(
    WIDTH * 0.2,
    HEIGHT * 0.6,
    100,
    40,
    BAUHAUS_BLUE,
    0.01,
    'horizontal'
  ));
  
  dancers.push(new RectDancer(
    WIDTH * 0.8,
    HEIGHT * 0.4,
    40,
    100,
    BAUHAUS_BLUE,
    -0.015,
    'vertical'
  ));
  
  // Smaller accent shapes
  dancers.push(new CircleDancer(
    WIDTH * 0.15,
    HEIGHT * 0.75,
    40,
    BAUHAUS_BLACK,
    0.03
  ));
  
  dancers.push(new CircleDancer(
    WIDTH * 0.85,
    HEIGHT * 0.7,
    30,
    BAUHAUS_BLACK,
    -0.025
  ));
  
  // More triangles for rhythm
  dancers.push(new TriangleDancer(
    WIDTH * 0.5,
    HEIGHT * 0.7,
    50,
    BAUHAUS_RED,
    0.018,
    PI
  ));
  
  // Thin black rectangles - like Mondrian meets Bauhaus
  dancers.push(new RectDancer(
    WIDTH * 0.35,
    HEIGHT * 0.5,
    8,
    150,
    BAUHAUS_BLACK,
    0.008,
    'vertical'
  ));
  
  dancers.push(new RectDancer(
    WIDTH * 0.65,
    HEIGHT * 0.5,
    150,
    8,
    BAUHAUS_BLACK,
    -0.008,
    'horizontal'
  ));
}

// Circle dancer - rotates and pulses
class CircleDancer {
  constructor(x, y, size, col, speed) {
    this.baseX = x;
    this.baseY = y;
    this.size = size;
    this.color = col;
    this.speed = speed;
    this.phase = random(TWO_PI);
    this.pulsePhase = random(TWO_PI);
  }
  
  update() {
    this.phase += this.speed;
    this.pulsePhase += this.speed * 0.7;
  }
  
  display() {
    push();
    let pulse = sin(this.pulsePhase) * 0.1 + 1;
    let wobbleX = sin(this.phase) * 10;
    let wobbleY = cos(this.phase * 0.7) * 8;
    
    translate(this.baseX + wobbleX, this.baseY + wobbleY);
    
    // Shadow
    noStroke();
    fill(0, 30);
    ellipse(5, 5, this.size * pulse, this.size * pulse);
    
    // Main circle
    fill(this.color);
    ellipse(0, 0, this.size * pulse, this.size * pulse);
    
    // Inner ring for depth
    noFill();
    stroke(255, 100);
    strokeWeight(2);
    ellipse(0, 0, this.size * pulse * 0.6, this.size * pulse * 0.6);
    
    pop();
  }
}

// Triangle dancer - pivots and points
class TriangleDancer {
  constructor(x, y, size, col, speed, baseAngle) {
    this.baseX = x;
    this.baseY = y;
    this.size = size;
    this.color = col;
    this.speed = speed;
    this.baseAngle = baseAngle;
    this.phase = random(TWO_PI);
  }
  
  update() {
    this.phase += this.speed;
  }
  
  display() {
    push();
    let wobble = sin(this.phase) * 15;
    let rotation = sin(this.phase * 0.5) * 0.3;
    
    translate(this.baseX + wobble * 0.5, this.baseY);
    rotate(this.baseAngle + rotation);
    
    // Shadow
    noStroke();
    fill(0, 30);
    triangle(
      5, -this.size / 2 + 5,
      -this.size / 2 + 5, this.size / 2 + 5,
      this.size / 2 + 5, this.size / 2 + 5
    );
    
    // Main triangle
    fill(this.color);
    triangle(
      0, -this.size / 2,
      -this.size / 2, this.size / 2,
      this.size / 2, this.size / 2
    );
    
    // Inner line for depth
    stroke(0, 50);
    strokeWeight(2);
    line(0, -this.size / 4, 0, this.size / 4);
    
    pop();
  }
}

// Rectangle dancer - slides and stacks
class RectDancer {
  constructor(x, y, w, h, col, speed, direction) {
    this.baseX = x;
    this.baseY = y;
    this.w = w;
    this.h = h;
    this.color = col;
    this.speed = speed;
    this.direction = direction;
    this.phase = random(TWO_PI);
  }
  
  update() {
    this.phase += this.speed;
  }
  
  display() {
    push();
    let slide = sin(this.phase) * 20;
    
    let x = this.baseX;
    let y = this.baseY;
    
    if (this.direction === 'horizontal') {
      x += slide;
    } else {
      y += slide;
    }
    
    translate(x, y);
    rectMode(CENTER);
    
    // Shadow
    noStroke();
    fill(0, 30);
    rect(4, 4, this.w, this.h);
    
    // Main rectangle
    fill(this.color);
    rect(0, 0, this.w, this.h);
    
    // Highlight edge
    stroke(255, 80);
    strokeWeight(1);
    line(-this.w / 2, -this.h / 2, this.w / 2, -this.h / 2);
    line(-this.w / 2, -this.h / 2, -this.w / 2, this.h / 2);
    
    pop();
  }
}

function createBauhausText() {
  // We'll draw BAUHAUS using pure geometry - no fonts!
  // Each letter is constructed from basic shapes
}

function drawBauhausText() {
  push();
  let startX = WIDTH * 0.1;
  let y = HEIGHT * 0.12;
  let letterWidth = WIDTH * 0.1;
  let letterHeight = HEIGHT * 0.08;
  let spacing = letterWidth * 1.1;
  
  // Subtle animation
  let breathe = sin(frameCount * 0.02) * 2;
  
  fill(BAUHAUS_BLACK);
  noStroke();
  
  // B
  drawLetterB(startX, y + breathe, letterWidth * 0.8, letterHeight);
  
  // A
  drawLetterA(startX + spacing, y - breathe, letterWidth * 0.8, letterHeight);
  
  // U
  drawLetterU(startX + spacing * 2, y + breathe * 0.5, letterWidth * 0.8, letterHeight);
  
  // H
  drawLetterH(startX + spacing * 3, y - breathe * 0.5, letterWidth * 0.8, letterHeight);
  
  // A
  drawLetterA(startX + spacing * 4, y + breathe, letterWidth * 0.8, letterHeight);
  
  // U
  drawLetterU(startX + spacing * 5, y - breathe, letterWidth * 0.8, letterHeight);
  
  // S
  drawLetterS(startX + spacing * 6, y + breathe * 0.7, letterWidth * 0.8, letterHeight);
  
  pop();
}

function drawLetterB(x, y, w, h) {
  push();
  translate(x, y);
  rectMode(CORNER);
  
  // Vertical bar
  rect(0, 0, w * 0.25, h);
  
  // Top bump (circle)
  ellipse(w * 0.25, h * 0.25, h * 0.45, h * 0.45);
  
  // Bottom bump (circle)
  ellipse(w * 0.25, h * 0.75, h * 0.55, h * 0.55);
  
  // Cut out the inside
  fill(BAUHAUS_CREAM);
  ellipse(w * 0.25, h * 0.25, h * 0.2, h * 0.2);
  ellipse(w * 0.25, h * 0.75, h * 0.25, h * 0.25);
  
  pop();
}

function drawLetterA(x, y, w, h) {
  push();
  translate(x, y);
  
  // Triangle for A
  fill(BAUHAUS_BLACK);
  triangle(w / 2, 0, 0, h, w, h);
  
  // Cut out the inside triangle
  fill(BAUHAUS_CREAM);
  triangle(w / 2, h * 0.35, w * 0.25, h * 0.7, w * 0.75, h * 0.7);
  
  // Crossbar
  fill(BAUHAUS_BLACK);
  rect(w * 0.15, h * 0.55, w * 0.7, h * 0.12);
  
  pop();
}

function drawLetterU(x, y, w, h) {
  push();
  translate(x, y);
  rectMode(CORNER);
  
  // Left vertical
  rect(0, 0, w * 0.25, h * 0.7);
  
  // Right vertical
  rect(w * 0.75, 0, w * 0.25, h * 0.7);
  
  // Bottom curve (half circle)
  arc(w / 2, h * 0.65, w, h * 0.7, 0, PI);
  
  // Cut out inside
  fill(BAUHAUS_CREAM);
  arc(w / 2, h * 0.65, w * 0.5, h * 0.4, 0, PI);
  
  pop();
}

function drawLetterH(x, y, w, h) {
  push();
  translate(x, y);
  rectMode(CORNER);
  
  // Left vertical
  rect(0, 0, w * 0.25, h);
  
  // Right vertical
  rect(w * 0.75, 0, w * 0.25, h);
  
  // Crossbar
  rect(w * 0.25, h * 0.4, w * 0.5, h * 0.2);
  
  pop();
}

function drawLetterS(x, y, w, h) {
  push();
  translate(x, y);
  
  // Top arc
  arc(w / 2, h * 0.25, w, h * 0.5, PI, TWO_PI);
  
  // Bottom arc
  arc(w / 2, h * 0.75, w, h * 0.5, 0, PI);
  
  // Cut out insides
  fill(BAUHAUS_CREAM);
  arc(w / 2, h * 0.25, w * 0.5, h * 0.25, PI, TWO_PI);
  arc(w / 2, h * 0.75, w * 0.5, h * 0.25, 0, PI);
  
  // Connect the arcs
  fill(BAUHAUS_BLACK);
  rect(w * 0.35, h * 0.4, w * 0.3, h * 0.2);
  
  pop();
}

function drawBauhausGrid() {
  push();
  stroke(0, 15);
  strokeWeight(1);
  
  // Vertical lines based on golden ratio divisions
  for (let i = 1; i < 5; i++) {
    let x = WIDTH * (i / 5);
    line(x, 0, x, HEIGHT);
  }
  
  // Horizontal lines
  for (let i = 1; i < 6; i++) {
    let y = HEIGHT * (i / 6);
    line(0, y, WIDTH, y);
  }
  
  pop();
}

function drawDecorativeElements() {
  push();
  
  // Floating dots - like Kandinsky's compositions
  let time = frameCount * 0.01;
  
  for (let i = 0; i < 8; i++) {
    let angle = (TWO_PI / 8) * i + time;
    let radius = 250 + sin(time * 2 + i) * 30;
    let x = WIDTH / 2 + cos(angle) * radius;
    let y = HEIGHT * 0.5 + sin(angle) * radius * 0.6;
    
    noStroke();
    fill(i % 2 === 0 ? BAUHAUS_BLACK : BAUHAUS_RED);
    ellipse(x, y, 8 + sin(time + i) * 3, 8 + sin(time + i) * 3);
  }
  
  // Corner accents
  stroke(BAUHAUS_BLACK);
  strokeWeight(3);
  noFill();
  
  // Top left corner
  line(30, 30, 30, 80);
  line(30, 30, 80, 30);
  
  // Top right corner
  line(WIDTH - 30, 30, WIDTH - 30, 80);
  line(WIDTH - 30, 30, WIDTH - 80, 30);
  
  // Bottom left corner
  line(30, HEIGHT - 30, 30, HEIGHT - 80);
  line(30, HEIGHT - 30, 80, HEIGHT - 30);
  
  // Bottom right corner
  line(WIDTH - 30, HEIGHT - 30, WIDTH - 30, HEIGHT - 80);
  line(WIDTH - 30, HEIGHT - 30, WIDTH - 80, HEIGHT - 30);
  
  pop();
}

function drawSignature() {
  push();
  
  // Year and school reference
  fill(BAUHAUS_BLACK);
  noStroke();
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont('monospace');
  
  // Draw "1919-2026" using small rectangles (staying true to no-font spirit)
  let sigY = HEIGHT - 50;
  
  // Simple geometric signature line
  stroke(BAUHAUS_BLACK);
  strokeWeight(2);
  line(WIDTH * 0.3, sigY, WIDTH * 0.7, sigY);
  
  // Three small shapes as signature
  noStroke();
  fill(BAUHAUS_RED);
  ellipse(WIDTH * 0.4, sigY + 20, 12, 12);
  
  fill(BAUHAUS_YELLOW);
  push();
  translate(WIDTH * 0.5, sigY + 20);
  triangle(0, -6, -6, 6, 6, 6);
  pop();
  
  fill(BAUHAUS_BLUE);
  rectMode(CENTER);
  rect(WIDTH * 0.6, sigY + 20, 10, 10);
  
  pop();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day21-bauhaus', 'png');
  }
  if (key === 'r' || key === 'R') {
    createDancers();
  }
}

// Mouse interaction - shapes react to cursor
function mouseMoved() {
  for (let dancer of dancers) {
    let d = dist(mouseX, mouseY, dancer.baseX, dancer.baseY);
    if (d < 150) {
      dancer.speed *= 1.001; // Subtle acceleration near mouse
    }
  }
}
