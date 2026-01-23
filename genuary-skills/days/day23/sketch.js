// Day 23: Transparency - Jellyfish Ballet
// Bioluminescent jellyfish drift through twilight waters
// Their translucent bodies overlap to create new colors

let jellyfish = [];
let particles = [];
let numJellyfish = 7;
let numParticles = 150;

function setup() {
  let canvas = createCanvas(800, 800);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create jellyfish at different depths
  for (let i = 0; i < numJellyfish; i++) {
    jellyfish.push(new Jellyfish(
      random(100, width - 100),
      random(100, height - 100),
      random(0.3, 1) // depth factor
    ));
  }
  
  // Create ambient particles
  for (let i = 0; i < numParticles; i++) {
    particles.push(new Particle());
  }
}

function draw() {
  // Deep ocean gradient background
  drawOceanBackground();
  
  // Sort jellyfish by depth (far to near)
  jellyfish.sort((a, b) => a.depth - b.depth);
  
  // Draw particles behind jellyfish
  for (let p of particles) {
    p.update();
    p.display();
  }
  
  // Draw jellyfish with transparency magic
  for (let jf of jellyfish) {
    jf.update();
    jf.display();
  }
  
  // Very subtle vignette for depth
  drawVignette();
}

function drawOceanBackground() {
  // Create a deep ocean gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    // From deep blue-black at top to slightly lighter deep blue at bottom
    let h = lerp(210, 220, inter);
    let s = lerp(80, 70, inter);
    let b = lerp(8, 15, inter);
    stroke(h, s, b);
    line(0, y, width, y);
  }
}

function drawCaustics() {
  // Soft, dancing caustic light patterns like sunlight through water
  push();
  blendMode(ADD);
  noStroke();
  
  // Multiple layers of soft caustic blobs
  for (let i = 0; i < 12; i++) {
    // Each caustic blob moves slowly with noise
    let noiseScale = 0.003;
    let timeScale = 0.008;
    
    let nx = noise(i * 100, frameCount * timeScale) * width;
    let ny = noise(i * 100 + 500, frameCount * timeScale) * height * 0.7; // More towards top
    
    // Size varies with noise too
    let size = noise(i * 100 + 1000, frameCount * timeScale * 0.5) * 200 + 100;
    
    // Very subtle, soft glow
    let alpha = 2 + sin(frameCount * 0.02 + i) * 1;
    
    // Draw soft radial gradient blob
    for (let r = size; r > 0; r -= 20) {
      let a = map(r, 0, size, alpha, 0);
      fill(195, 30, 70, a);
      ellipse(nx, ny, r, r * 0.6);
    }
  }
  
  blendMode(BLEND);
  pop();
}

function drawVignette() {
  // Very subtle dark vignette around edges for depth
  push();
  noStroke();
  
  // Only darken the very corners/edges
  let maxDist = dist(0, 0, width/2, height/2);
  
  for (let r = maxDist; r > maxDist * 0.7; r -= 15) {
    let alpha = map(r, maxDist * 0.7, maxDist, 0, 15); // Much more subtle
    fill(220, 90, 5, alpha);
    ellipse(width/2, height/2, r * 2, r * 2);
  }
  
  pop();
}

class Jellyfish {
  constructor(x, y, depth) {
    this.x = x;
    this.y = y;
    this.depth = depth; // 0.3 = far, 1 = close
    
    // Size based on depth (perspective)
    this.baseSize = map(depth, 0.3, 1, 40, 100);
    
    // Each jellyfish has a unique hue
    // Ethereal colors: pinks, lavenders, warm ambers, soft cyans
    let hueOptions = [320, 280, 35, 185, 350, 260, 45]; // pink, lavender, amber, cyan, rose, purple, gold
    this.hue = hueOptions[floor(random(hueOptions.length))];
    
    // Movement
    this.vx = random(-0.3, 0.3) * depth;
    this.vy = random(-0.5, -0.1) * depth; // Drift upward
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    
    // Pulsing
    this.pulsePhase = random(TWO_PI);
    this.pulseSpeed = random(0.02, 0.04);
    
    // Tentacles
    this.numTentacles = floor(random(5, 9));
    this.tentacleSegments = floor(random(12, 20));
  }
  
  update() {
    // Gentle drifting with noise
    this.x += this.vx + (noise(this.noiseOffsetX + frameCount * 0.005) - 0.5) * 2 * this.depth;
    this.y += this.vy + (noise(this.noiseOffsetY + frameCount * 0.005) - 0.5) * 1 * this.depth;
    
    // Wrap around edges with padding
    if (this.x < -this.baseSize * 2) this.x = width + this.baseSize;
    if (this.x > width + this.baseSize * 2) this.x = -this.baseSize;
    if (this.y < -this.baseSize * 3) this.y = height + this.baseSize;
    if (this.y > height + this.baseSize * 2) this.y = -this.baseSize * 2;
    
    // Update pulse
    this.pulsePhase += this.pulseSpeed;
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Pulse factor affects size and opacity
    let pulse = sin(this.pulsePhase);
    let pulseSize = 1 + pulse * 0.15;
    let pulseAlpha = map(pulse, -1, 1, 0.7, 1);
    
    // Base alpha affected by depth (farther = more faded, but still visible)
    let depthAlpha = map(this.depth, 0.3, 1, 0.6, 1.0);
    let finalAlpha = depthAlpha * pulseAlpha;
    
    // Draw glow first (behind everything)
    this.drawGlow(pulseSize, finalAlpha);
    
    // Draw tentacles
    this.drawTentacles(pulseSize, finalAlpha);
    
    // Draw bell (multiple layers for transparency effect)
    this.drawBell(pulseSize, finalAlpha);
    
    // Draw inner organs
    this.drawInnerOrgans(pulseSize, finalAlpha);
    
    pop();
  }
  
  drawGlow(pulseSize, alpha) {
    // Soft bioluminescent glow - more prominent
    noStroke();
    let glowSize = this.baseSize * pulseSize * 3;
    for (let i = 6; i > 0; i--) {
      let size = glowSize * (i / 6);
      let a = alpha * 12 * (1 - i/6);
      fill(this.hue, 60, 90, a);
      ellipse(0, 0, size, size * 0.7);
    }
  }
  
  drawBell(pulseSize, alpha) {
    let size = this.baseSize * pulseSize;
    
    // Multiple translucent layers create depth
    noStroke();
    
    // Outer bell - most transparent
    fill(this.hue, 40, 95, alpha * 25);
    this.drawBellShape(size * 1.1, size * 0.8);
    
    // Middle bell
    fill(this.hue, 50, 90, alpha * 35);
    this.drawBellShape(size, size * 0.7);
    
    // Inner bell - slightly more opaque
    fill(this.hue, 60, 85, alpha * 45);
    this.drawBellShape(size * 0.85, size * 0.6);
    
    // Bell rim - the edge where it pulses
    stroke(this.hue, 70, 95, alpha * 60);
    strokeWeight(2 * this.depth);
    noFill();
    this.drawBellShape(size, size * 0.7);
    
    // Highlight on top
    noStroke();
    fill(this.hue, 20, 100, alpha * 35);
    ellipse(0, -size * 0.2, size * 0.4, size * 0.2);
  }
  
  drawBellShape(w, h) {
    // Dome shape for jellyfish bell
    beginShape();
    for (let a = 0; a <= PI; a += 0.1) {
      let x = cos(a - HALF_PI) * w * 0.5;
      let y = sin(a - HALF_PI) * h * 0.5 - h * 0.1;
      // Add slight wobble
      let wobble = sin(a * 4 + frameCount * 0.05) * 2 * this.depth;
      vertex(x + wobble, y);
    }
    // Bottom edge curves inward
    for (let a = PI; a >= 0; a -= 0.1) {
      let x = cos(a - HALF_PI) * w * 0.4;
      let y = sin(a - HALF_PI) * h * 0.3 + h * 0.2;
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  drawInnerOrgans(pulseSize, alpha) {
    let size = this.baseSize * pulseSize;
    
    // Central organs (gonads) - the glowing core
    noStroke();
    
    // Four-leaf clover pattern typical of jellyfish
    let organSize = size * 0.15;
    let organDist = size * 0.15;
    
    for (let i = 0; i < 4; i++) {
      let angle = i * HALF_PI + frameCount * 0.01;
      let ox = cos(angle) * organDist;
      let oy = sin(angle) * organDist * 0.5 - size * 0.1;
      
      // Glowing organ
      fill((this.hue + 30) % 360, 80, 95, alpha * 35);
      ellipse(ox, oy, organSize, organSize * 0.8);
      
      // Brighter center
      fill((this.hue + 30) % 360, 60, 100, alpha * 50);
      ellipse(ox, oy, organSize * 0.5, organSize * 0.4);
    }
    
    // Central mouth/manubrium
    fill(this.hue, 50, 90, alpha * 30);
    ellipse(0, size * 0.1, size * 0.1, size * 0.25);
  }
  
  drawTentacles(pulseSize, alpha) {
    let size = this.baseSize * pulseSize;
    
    for (let t = 0; t < this.numTentacles; t++) {
      let startAngle = map(t, 0, this.numTentacles, -HALF_PI - 0.5, -HALF_PI + 0.5);
      let startX = cos(startAngle + HALF_PI) * size * 0.35;
      let startY = size * 0.35;
      
      // Each tentacle is a flowing curve
      noFill();
      
      // Draw multiple strands per tentacle for transparency layering
      for (let strand = 0; strand < 3; strand++) {
        let strandOffset = (strand - 1) * 3;
        
        beginShape();
        for (let s = 0; s < this.tentacleSegments; s++) {
          let progress = s / this.tentacleSegments;
          
          // Tentacle waves
          let wave = sin(progress * PI * 3 + frameCount * 0.05 + t) * 20 * progress;
          let drift = sin(frameCount * 0.02 + t * 0.5 + s * 0.1) * 10 * progress;
          
          let tx = startX + strandOffset + wave + drift;
          let ty = startY + progress * size * 2;
          
          // Fade out along length
          let segmentAlpha = alpha * (1 - progress * 0.7) * 25;
          stroke(this.hue, 50 + strand * 10, 90, segmentAlpha);
          strokeWeight((1 - progress * 0.5) * 3 * this.depth);
          
          curveVertex(tx, ty);
        }
        endShape();
      }
      
      // Add glowing dots along tentacles
      for (let s = 0; s < this.tentacleSegments; s += 3) {
        let progress = s / this.tentacleSegments;
        let wave = sin(progress * PI * 3 + frameCount * 0.05 + t) * 20 * progress;
        let drift = sin(frameCount * 0.02 + t * 0.5 + s * 0.1) * 10 * progress;
        
        let tx = startX + wave + drift;
        let ty = startY + progress * size * 2;
        
        // Pulsing glow dots
        let dotPulse = sin(frameCount * 0.1 + t + s) * 0.5 + 0.5;
        let dotAlpha = alpha * (1 - progress * 0.5) * 40 * dotPulse;
        
        noStroke();
        fill((this.hue + 20) % 360, 60, 100, dotAlpha);
        ellipse(tx, ty, 4 * this.depth, 4 * this.depth);
      }
    }
  }
}

class Particle {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 4);
    this.alpha = random(10, 40);
    this.speed = random(0.1, 0.5);
    this.wobbleOffset = random(1000);
    this.hue = random([200, 210, 220, 180, 190]); // Ocean blues and teals
  }
  
  update() {
    // Gentle upward drift
    this.y -= this.speed;
    this.x += sin(frameCount * 0.02 + this.wobbleOffset) * 0.3;
    
    // Reset when off screen
    if (this.y < -10) {
      this.y = height + 10;
      this.x = random(width);
    }
  }
  
  display() {
    noStroke();
    // Glowing particle
    fill(this.hue, 50, 90, this.alpha * 0.5);
    ellipse(this.x, this.y, this.size * 2, this.size * 2);
    fill(this.hue, 30, 100, this.alpha);
    ellipse(this.x, this.y, this.size, this.size);
  }
}

// Handle window resize
function windowResized() {
  // Keep canvas at 800x800
}
