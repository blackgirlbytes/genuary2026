// Day 03: The Migration - Fibonacci Forever
// Butterflies gather in phyllotaxis formation - the golden angle creates visible Fibonacci spirals

const GOLDEN_ANGLE = 137.5077640500378; // degrees - THE magic number
const PHI = 1.618033988749895;

let butterflies = [];
let targetPositions = [];
let numButterflies = 300;
let centerX, centerY;

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  centerX = width / 2;
  centerY = height / 2;
  
  // Pre-calculate phyllotaxis positions (sunflower seed arrangement)
  // This is where Fibonacci spirals EMERGE naturally
  for (let i = 0; i < numButterflies; i++) {
    // Golden angle placement - each seed is 137.5° from the last
    let angle = i * GOLDEN_ANGLE * (PI / 180);
    
    // Distance from center grows with sqrt(i) for even packing
    let radius = sqrt(i) * 18;
    
    let x = centerX + cos(angle) * radius;
    let y = centerY + sin(angle) * radius;
    
    targetPositions.push({ x, y, angle, index: i });
  }
  
  // Create butterflies - they'll fly in from edges
  for (let i = 0; i < numButterflies; i++) {
    // Start from random edge positions
    let startAngle = random(TWO_PI);
    let startDist = random(500, 700);
    let startX = centerX + cos(startAngle) * startDist;
    let startY = centerY + sin(startAngle) * startDist;
    
    // Stagger arrival times
    let delay = i * 2 + random(30);
    
    butterflies.push(new Butterfly(startX, startY, targetPositions[i], delay, i));
  }
}

function draw() {
  // Deep twilight sky
  drawSky();
  
  // Draw spiral guides (subtle, to show the Fibonacci pattern)
  drawFibonacciSpirals();
  
  // Sort by y position for depth
  butterflies.sort((a, b) => a.y - b.y);
  
  // Update and draw butterflies
  for (let butterfly of butterflies) {
    butterfly.update();
    butterfly.draw();
  }
  
  // Draw center flower/attractor
  drawCenterFlower();
}

function drawSky() {
  // Warm sunset gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(
      color(250, 50, 25),  // Deep purple-blue at top
      color(35, 60, 40)    // Warm amber at bottom
    , inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawFibonacciSpirals() {
  // Draw subtle spiral guides showing the Fibonacci pattern
  // In phyllotaxis, you can trace 8, 13, 21, 34 spirals (Fibonacci numbers!)
  
  push();
  noFill();
  strokeWeight(1);
  
  // Draw clockwise spirals (13 of them - Fibonacci number)
  let numSpirals = 13;
  for (let s = 0; s < numSpirals; s++) {
    stroke(45, 30, 60, 15); // Subtle golden color
    beginShape();
    for (let i = s; i < numButterflies; i += numSpirals) {
      let pos = targetPositions[i];
      if (pos) {
        curveVertex(pos.x, pos.y);
      }
    }
    endShape();
  }
  
  // Draw counter-clockwise spirals (21 of them - next Fibonacci number)
  let numSpirals2 = 21;
  for (let s = 0; s < numSpirals2; s++) {
    stroke(25, 40, 50, 12);
    beginShape();
    for (let i = s; i < numButterflies; i += numSpirals2) {
      let pos = targetPositions[i];
      if (pos) {
        curveVertex(pos.x, pos.y);
      }
    }
    endShape();
  }
  
  pop();
}

function drawCenterFlower() {
  // A simple flower at the center - the attractor
  push();
  translate(centerX, centerY);
  
  // Glow
  noStroke();
  for (let r = 40; r > 0; r -= 5) {
    fill(40, 70, 80, map(r, 40, 0, 5, 30));
    ellipse(0, 0, r * 2);
  }
  
  // Center
  fill(35, 90, 90);
  ellipse(0, 0, 25);
  
  // Fibonacci seed pattern in center
  fill(30, 80, 30);
  for (let i = 0; i < 50; i++) {
    let a = i * GOLDEN_ANGLE * PI / 180;
    let r = sqrt(i) * 2;
    let x = cos(a) * r;
    let y = sin(a) * r;
    ellipse(x, y, 2.5);
  }
  
  pop();
}

class Butterfly {
  constructor(x, y, target, delay, index) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.delay = delay;
    this.index = index;
    this.arrived = false;
    this.arrivalTime = 0;
    
    // Movement
    this.vx = 0;
    this.vy = 0;
    
    // Wing animation
    this.wingPhase = random(TWO_PI);
    this.wingSpeed = random(0.2, 0.3);
    
    // Color - monarchs with variation
    // Hue shifts based on position in spiral (makes spirals visible by color too!)
    this.baseHue = 20 + (index % 13) * 3; // 13 is Fibonacci - creates color bands along spirals
    this.saturation = random(80, 100);
    this.brightness = random(85, 100);
    
    // Size varies slightly
    this.size = random(18, 28);
    
    // Settled position wobble
    this.wobbleOffset = random(TWO_PI);
  }
  
  update() {
    // Wait for delay
    if (frameCount < this.delay) return;
    
    let dx = this.target.x - this.x;
    let dy = this.target.y - this.y;
    let dist = sqrt(dx * dx + dy * dy);
    
    if (!this.arrived) {
      // Fly toward target with easing and flutter
      let flutter = noise(this.index * 0.1, frameCount * 0.02);
      
      // Spiral approach - adds golden angle rotation to path
      let approachAngle = atan2(dy, dx);
      let spiralOffset = sin(frameCount * 0.05 + this.index) * 0.5;
      approachAngle += spiralOffset;
      
      let speed = map(dist, 0, 200, 0.5, 4);
      speed = constrain(speed, 0.5, 4);
      
      this.vx += cos(approachAngle) * speed * 0.1;
      this.vy += sin(approachAngle) * speed * 0.1;
      
      // Add flutter perpendicular to movement
      let perpAngle = approachAngle + PI/2;
      this.vx += cos(perpAngle) * (flutter - 0.5) * 2;
      this.vy += sin(perpAngle) * (flutter - 0.5) * 2;
      
      // Damping
      this.vx *= 0.92;
      this.vy *= 0.92;
      
      this.x += this.vx;
      this.y += this.vy;
      
      // Check if arrived
      if (dist < 5) {
        this.arrived = true;
        this.arrivalTime = frameCount;
        this.x = this.target.x;
        this.y = this.target.y;
      }
      
      // Fast wing beats while flying
      this.wingPhase += this.wingSpeed;
    } else {
      // Gentle settling wobble
      let wobbleTime = (frameCount - this.arrivalTime) * 0.02;
      let wobbleAmount = max(0, 3 - wobbleTime * 0.5); // Decreases over time
      
      this.x = this.target.x + sin(frameCount * 0.03 + this.wobbleOffset) * wobbleAmount;
      this.y = this.target.y + cos(frameCount * 0.025 + this.wobbleOffset) * wobbleAmount;
      
      // Slow wing beats when settled
      this.wingPhase += this.wingSpeed * 0.3;
    }
  }
  
  draw() {
    // Don't draw if still waiting
    if (frameCount < this.delay) return;
    
    push();
    translate(this.x, this.y);
    
    // Face toward center when settled, toward movement when flying
    let angle;
    if (this.arrived) {
      angle = atan2(centerY - this.y, centerX - this.x) + PI/2;
    } else {
      angle = atan2(this.vy, this.vx) + PI/2;
    }
    rotate(angle);
    
    let s = this.size;
    
    // Wing flap
    let wingFlap = (sin(this.wingPhase) + 1) / 2;
    wingFlap = pow(wingFlap, 0.6);
    
    this.drawMonarch(s, wingFlap);
    
    pop();
  }
  
  drawMonarch(s, wingFlap) {
    let wingWidth = s * 1.1 * (0.3 + wingFlap * 0.7);
    let wingHeight = s * 0.85;
    
    noStroke();
    
    // Left wing
    push();
    scale(-1, 1);
    this.drawWing(wingWidth, wingHeight);
    pop();
    
    // Right wing
    this.drawWing(wingWidth, wingHeight);
    
    // Body
    fill(0, 0, 15);
    ellipse(0, 0, s * 0.1, s * 0.5);
    
    // Head
    ellipse(0, -s * 0.3, s * 0.08, s * 0.08);
    
    // Antennae
    stroke(0, 0, 15);
    strokeWeight(1);
    let aLen = s * 0.2;
    line(-s * 0.03, -s * 0.32, -s * 0.08, -s * 0.32 - aLen);
    line(s * 0.03, -s * 0.32, s * 0.08, -s * 0.32 - aLen);
    noStroke();
  }
  
  drawWing(w, h) {
    // Forewing (upper)
    fill(this.baseHue, this.saturation, this.brightness);
    beginShape();
    vertex(0, -h * 0.1);
    bezierVertex(w * 0.4, -h * 0.5, w * 0.95, -h * 0.5, w * 0.9, -h * 0.2);
    bezierVertex(w * 0.95, h * 0.05, w * 0.7, h * 0.15, 0, h * 0.1);
    endShape(CLOSE);
    
    // Hindwing (lower)
    fill(this.baseHue + 5, this.saturation - 5, this.brightness * 0.95);
    beginShape();
    vertex(0, h * 0.05);
    bezierVertex(w * 0.4, h * 0.1, w * 0.7, h * 0.35, w * 0.5, h * 0.55);
    bezierVertex(w * 0.25, h * 0.65, 0, h * 0.45, 0, h * 0.25);
    endShape(CLOSE);
    
    // Black wing borders
    stroke(0, 0, 5);
    strokeWeight(max(1, w * 0.06));
    noFill();
    
    // Forewing border
    beginShape();
    vertex(w * 0.1, -h * 0.05);
    bezierVertex(w * 0.4, -h * 0.5, w * 0.95, -h * 0.5, w * 0.9, -h * 0.2);
    bezierVertex(w * 0.95, h * 0.05, w * 0.7, h * 0.15, w * 0.1, h * 0.1);
    endShape();
    
    // Veins
    strokeWeight(max(0.5, w * 0.025));
    line(0, 0, w * 0.7, -h * 0.25);
    line(0, 0, w * 0.6, h * 0.3);
    line(0, -h * 0.05, w * 0.5, -h * 0.4);
    
    // White spots
    noStroke();
    fill(0, 0, 100, 90);
    let spotSize = w * 0.07;
    
    // Forewing edge spots
    ellipse(w * 0.75, -h * 0.38, spotSize, spotSize);
    ellipse(w * 0.88, -h * 0.25, spotSize * 0.8, spotSize * 0.8);
    ellipse(w * 0.85, -h * 0.08, spotSize * 0.7, spotSize * 0.7);
    
    // Hindwing spots
    ellipse(w * 0.55, h * 0.4, spotSize * 0.8, spotSize * 0.8);
    ellipse(w * 0.38, h * 0.5, spotSize * 0.6, spotSize * 0.6);
  }
}

function windowResized() {
  // Keep fixed size
}
