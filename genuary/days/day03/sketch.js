// Genuary Day 3: Fibonacci Forever
// "Fibonacci Breathing Box" - A meditative breathing exercise on Fibonacci time

let fibonacci = [1, 1, 2, 3, 5, 8];
let fibIndex = 0;
let isInhaling = true;
let breathProgress = 0;
let currentBreathDuration = 1;
let beatDuration = 1000; // 1 second per beat

let shapeSize = 0;
let targetSize = 0;
let rings = [];
let particles = [];

let breathText = "";
let textOpacity = 0;

function setup() {
  createCanvas(800, 800);
  noStroke();
  
  currentBreathDuration = fibonacci[fibIndex];
  targetSize = isInhaling ? 300 : 150;
  shapeSize = 150;
  breathText = "inhale";
  
  // Initialize particles
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(2, 6),
      speed: random(0.2, 0.8),
      angle: random(TWO_PI),
      opacity: random(50, 150)
    });
  }
}

function draw() {
  // Background shifts based on breath cycle progress
  let cycleProgress = fibIndex / fibonacci.length;
  let bgColor = lerpColor(
    color(25, 30, 45),
    color(15, 15, 30),
    cycleProgress
  );
  background(bgColor);
  
  // Update breath
  updateBreath();
  
  // Draw particles
  drawParticles();
  
  // Draw rings
  drawRings();
  
  // Draw main breathing shape
  drawBreathingShape();
  
  // Draw breath text
  drawBreathText();
  
  // Draw Fibonacci counter
  drawFibCounter();
}

function updateBreath() {
  let breathDurationMs = currentBreathDuration * beatDuration;
  breathProgress += deltaTime / breathDurationMs;
  
  // Ease the shape size
  let easeAmount = 0.05;
  shapeSize = lerp(shapeSize, targetSize, easeAmount);
  
  // Check if breath phase complete
  if (breathProgress >= 1) {
    breathProgress = 0;
    
    // Move to next Fibonacci number for EVERY breath (inhale or exhale)
    fibIndex = (fibIndex + 1) % fibonacci.length;
    isInhaling = !isInhaling;
    
    currentBreathDuration = fibonacci[fibIndex];
    
    // Size grows with Fibonacci progression
    targetSize = isInhaling ? map(currentBreathDuration, 1, 8, 200, 450) : map(currentBreathDuration, 1, 8, 180, 120);
    breathText = isInhaling ? "inhale" : "exhale";
    textOpacity = 255;
    
    // Add a ring on breath change
    rings.push({
      size: shapeSize,
      opacity: 200,
      hue: isInhaling ? 20 : 200
    });
  }
}

function drawBreathingShape() {
  push();
  translate(width / 2, height / 2);
  
  // Glow effect
  for (let i = 5; i > 0; i--) {
    let glowSize = shapeSize + i * 20;
    let glowOpacity = map(i, 5, 0, 10, 50);
    
    // Warm color when inhaling, cool when exhaling
    if (isInhaling) {
      fill(255, 180, 130, glowOpacity);
    } else {
      fill(130, 180, 255, glowOpacity);
    }
    
    drawSoftSquare(0, 0, glowSize, glowSize * 0.4);
  }
  
  // Main shape - gradient from center
  let innerColor = isInhaling ? color(255, 200, 160) : color(160, 200, 255);
  let outerColor = isInhaling ? color(255, 130, 100) : color(100, 150, 255);
  
  // Draw layered soft squares for gradient effect
  let layers = 10;
  for (let i = layers; i > 0; i--) {
    let t = i / layers;
    let layerSize = shapeSize * t;
    let c = lerpColor(innerColor, outerColor, t);
    fill(c);
    drawSoftSquare(0, 0, layerSize, layerSize * 0.4);
  }
  
  pop();
}

function drawSoftSquare(x, y, size, radius) {
  rectMode(CENTER);
  rect(x, y, size, size, radius);
}

function drawRings() {
  push();
  translate(width / 2, height / 2);
  noFill();
  
  for (let i = rings.length - 1; i >= 0; i--) {
    let ring = rings[i];
    
    // Expand and fade
    ring.size += 2;
    ring.opacity -= 2;
    
    if (ring.opacity <= 0) {
      rings.splice(i, 1);
      continue;
    }
    
    // Color based on breath type
    if (ring.hue < 100) {
      stroke(255, 180, 130, ring.opacity);
    } else {
      stroke(130, 180, 255, ring.opacity);
    }
    strokeWeight(2);
    
    drawSoftSquare(0, 0, ring.size, ring.size * 0.3);
  }
  
  pop();
}

function drawParticles() {
  // Particles drift based on breath
  let driftDirection = isInhaling ? -1 : 1;
  let driftStrength = map(shapeSize, 150, 400, 0.5, 2);
  
  for (let p of particles) {
    // Drift toward/away from center based on breath
    let toCenter = atan2(height/2 - p.y, width/2 - p.x);
    p.x += cos(toCenter) * driftDirection * driftStrength * 0.5;
    p.y += sin(toCenter) * driftDirection * driftStrength * 0.5;
    
    // Gentle wandering
    p.angle += random(-0.1, 0.1);
    p.x += cos(p.angle) * p.speed * 0.3;
    p.y += sin(p.angle) * p.speed * 0.3;
    
    // Wrap around
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    // Draw particle
    let distToCenter = dist(p.x, p.y, width/2, height/2);
    let particleOpacity = map(distToCenter, 0, 400, 20, p.opacity);
    
    if (isInhaling) {
      fill(255, 200, 170, particleOpacity);
    } else {
      fill(170, 200, 255, particleOpacity);
    }
    
    ellipse(p.x, p.y, p.size);
  }
}

function drawBreathText() {
  // Fade text
  textOpacity = lerp(textOpacity, 0, 0.01);
  
  push();
  textAlign(CENTER, CENTER);
  textSize(32);
  textFont('Georgia');
  
  // Soft shadow
  fill(0, 0, 0, textOpacity * 0.3);
  text(breathText + "...", width/2 + 2, height/2 + 180 + 2);
  
  // Main text
  if (isInhaling) {
    fill(255, 200, 170, textOpacity);
  } else {
    fill(170, 200, 255, textOpacity);
  }
  text(breathText + "...", width/2, height/2 + 180);
  
  pop();
}

function drawFibCounter() {
  push();
  textAlign(CENTER, CENTER);
  textSize(18);
  textFont('Georgia');
  fill(255, 255, 255, 100);
  
  // Show current breath duration
  let countText = currentBreathDuration + (currentBreathDuration === 1 ? " beat" : " beats");
  text(countText, width/2, height/2 + 220);
  
  // Show Fibonacci sequence at bottom
  textSize(14);
  fill(255, 255, 255, 60);
  let seqText = fibonacci.map((n, i) => i === fibIndex ? "[" + n + "]" : n).join("  ");
  text(seqText, width/2, height - 40);
  
  pop();
}
