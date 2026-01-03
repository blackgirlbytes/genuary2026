// Genuary 2026 - Day 02
// Prompt: Twelve Principles of Animation
// A sentient staircase that walks itself - demonstrating all 12 principles!

const WIDTH = 800;
const HEIGHT = 800;

// Color palette - warm sandstone and deep shadows
const COLORS = {
  stepTop: '#e07a5f',      // Terracotta
  stepFront: '#bc6c4f',    // Darker terracotta
  stepSide: '#3d405b',     // Deep shadow purple
  background: '#f4f1de',   // Warm cream
  dust: '#f2cc8f',         // Golden dust
  eye: '#1a1a2e',          // Dark eye
  eyeWhite: '#fefefe'      // Eye white
};

let steps = [];
const NUM_STEPS = 6;
const STEP_WIDTH = 80;
const STEP_HEIGHT = 30;
const STEP_DEPTH = 50;

// Animation state
let walkCycle = 0;
let globalX = 0;
let dustParticles = [];

// Eye state
let eyeBlink = 0;
let eyeBlinkTimer = 0;
let eyeLookX = 0;
let eyeLookY = 0;

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-container');
  
  // Initialize steps
  for (let i = 0; i < NUM_STEPS; i++) {
    steps.push({
      index: i,
      baseX: 0,
      baseY: 0,
      offsetX: 0,
      offsetY: 0,
      squash: 1,       // Vertical squash/stretch
      stretch: 1,      // Horizontal stretch
      rotation: 0,
      phase: i * 0.15, // Staggered timing for follow-through
      isLifted: false,
      landingDust: 0
    });
  }
  
  globalX = width * 0.3;
}

function draw() {
  background(COLORS.background);
  
  // Update walk cycle
  walkCycle += 0.02;
  
  // Move the whole staircase slowly across
  globalX += 0.3;
  if (globalX > width * 0.8) {
    globalX = width * 0.2;
  }
  
  // Update eye behavior
  updateEye();
  
  // Update dust particles
  updateDust();
  
  // Calculate staircase base position
  let baseX = globalX;
  let baseY = height * 0.65;
  
  // Update each step with animation principles
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    let t = walkCycle + step.phase;
    
    // PRINCIPLE 6: SLOW IN/SLOW OUT - using eased sine waves
    let walkPhase = sin(t * 2) * 0.5 + 0.5; // 0 to 1, eased
    walkPhase = easeInOutCubic(walkPhase);
    
    // PRINCIPLE 3: STAGING - steps move in a wave pattern
    // PRINCIPLE 9: TIMING - different steps have different timing
    let liftAmount = sin(t * 2 + i * 0.8) * 0.5 + 0.5;
    liftAmount = pow(liftAmount, 2); // More time on ground
    
    // PRINCIPLE 2: ANTICIPATION - crouch before lift
    let anticipation = 0;
    let nextLift = sin((t + 0.3) * 2 + i * 0.8) * 0.5 + 0.5;
    if (nextLift > 0.7 && liftAmount < 0.3) {
      anticipation = (nextLift - 0.7) * 15; // Crouch down
    }
    
    // PRINCIPLE 7: ARC - steps follow curved paths
    step.offsetX = sin(t * 2 + i * 0.5) * 15;
    step.offsetY = -liftAmount * 40 + anticipation;
    
    // PRINCIPLE 1: SQUASH & STRETCH
    if (liftAmount > 0.5) {
      // In the air - stretch vertically
      step.squash = 1 + liftAmount * 0.3;
      step.stretch = 1 - liftAmount * 0.15;
    } else {
      // On ground - squash on impact
      let impact = 1 - liftAmount * 2;
      step.squash = 1 - impact * 0.25;
      step.stretch = 1 + impact * 0.15;
    }
    
    // PRINCIPLE 5: FOLLOW THROUGH - rotation lags behind movement
    let targetRotation = step.offsetX * 0.01;
    step.rotation = lerp(step.rotation, targetRotation, 0.1);
    
    // PRINCIPLE 8: SECONDARY ACTION - dust on landing
    let wasLifted = step.isLifted;
    step.isLifted = liftAmount > 0.3;
    if (wasLifted && !step.isLifted) {
      // Just landed - spawn dust!
      spawnDust(baseX + step.offsetX + i * 25, baseY - i * STEP_HEIGHT + step.offsetY + STEP_HEIGHT);
      step.landingDust = 1;
    }
    step.landingDust *= 0.9;
    
    // Calculate final position
    step.baseX = baseX + i * 25; // Isometric offset
    step.baseY = baseY - i * STEP_HEIGHT;
  }
  
  // Draw dust particles behind stairs
  drawDust();
  
  // Draw steps from back to front (painter's algorithm)
  for (let i = steps.length - 1; i >= 0; i--) {
    drawStep(steps[i]);
  }
  
  // Draw the eye on the top step
  drawEye(steps[steps.length - 1]);
  
  // Draw some ambient dust
  drawAmbientDust();
}

function drawStep(step) {
  push();
  translate(step.baseX + step.offsetX, step.baseY + step.offsetY);
  rotate(step.rotation);
  
  // Apply squash and stretch
  scale(step.stretch, step.squash);
  
  // PRINCIPLE 10: EXAGGERATION - make the deformation visible
  // PRINCIPLE 11: SOLID DRAWING - maintain volume perception
  
  let w = STEP_WIDTH;
  let h = STEP_HEIGHT;
  let d = STEP_DEPTH;
  
  // Draw isometric step
  // Top face
  fill(COLORS.stepTop);
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(w, 0);
  vertex(w + d * 0.5, -d * 0.3);
  vertex(d * 0.5, -d * 0.3);
  endShape(CLOSE);
  
  // Front face
  fill(COLORS.stepFront);
  beginShape();
  vertex(0, 0);
  vertex(w, 0);
  vertex(w, h);
  vertex(0, h);
  endShape(CLOSE);
  
  // Side face
  fill(COLORS.stepSide);
  beginShape();
  vertex(w, 0);
  vertex(w + d * 0.5, -d * 0.3);
  vertex(w + d * 0.5, h - d * 0.3);
  vertex(w, h);
  endShape(CLOSE);
  
  // Add subtle edge highlights
  stroke(255, 50);
  strokeWeight(1);
  line(0, 0, w, 0);
  line(0, 0, d * 0.5, -d * 0.3);
  
  pop();
}

function drawEye(topStep) {
  push();
  translate(topStep.baseX + topStep.offsetX + STEP_WIDTH * 0.5, 
            topStep.baseY + topStep.offsetY - 15);
  rotate(topStep.rotation);
  
  // PRINCIPLE 12: APPEAL - big expressive eye!
  
  // Eye white
  fill(COLORS.eyeWhite);
  noStroke();
  let eyeHeight = 25 * (1 - eyeBlink);
  ellipse(0, 0, 35, max(eyeHeight, 2));
  
  if (eyeBlink < 0.8) {
    // Pupil - follows a point of interest
    let pupilX = eyeLookX * 5;
    let pupilY = eyeLookY * 3;
    fill(COLORS.eye);
    ellipse(pupilX, pupilY, 15, 15 * (1 - eyeBlink * 0.5));
    
    // Highlight
    fill(255);
    ellipse(pupilX + 3, pupilY - 3, 5, 5);
  }
  
  // Eyelid shadow
  noFill();
  stroke(0, 30);
  strokeWeight(2);
  arc(0, 0, 38, 28, PI, TWO_PI);
  
  pop();
}

function updateEye() {
  // Random blinking
  eyeBlinkTimer--;
  if (eyeBlinkTimer <= 0) {
    if (eyeBlink > 0) {
      eyeBlink -= 0.15;
      if (eyeBlink <= 0) {
        eyeBlink = 0;
        eyeBlinkTimer = random(60, 180); // Time until next blink
      }
    } else if (random() < 0.02) {
      eyeBlink = 1;
      eyeBlinkTimer = 5;
    }
  }
  
  // Eye look direction - curious, looking around
  let lookTarget = noise(frameCount * 0.01) * 2 - 1;
  eyeLookX = lerp(eyeLookX, lookTarget, 0.05);
  eyeLookY = lerp(eyeLookY, sin(frameCount * 0.03) * 0.5, 0.05);
}

function spawnDust(x, y) {
  for (let i = 0; i < 8; i++) {
    dustParticles.push({
      x: x + random(-10, 10),
      y: y,
      vx: random(-2, 2),
      vy: random(-3, -1),
      size: random(4, 12),
      life: 1,
      decay: random(0.02, 0.04)
    });
  }
}

function updateDust() {
  for (let i = dustParticles.length - 1; i >= 0; i--) {
    let p = dustParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.05; // Gravity
    p.vx *= 0.98; // Friction
    p.life -= p.decay;
    
    if (p.life <= 0) {
      dustParticles.splice(i, 1);
    }
  }
}

function drawDust() {
  noStroke();
  for (let p of dustParticles) {
    fill(red(color(COLORS.dust)), 
         green(color(COLORS.dust)), 
         blue(color(COLORS.dust)), 
         p.life * 200);
    ellipse(p.x, p.y, p.size * p.life, p.size * p.life);
  }
}

function drawAmbientDust() {
  // Floating dust motes in the air
  noStroke();
  for (let i = 0; i < 20; i++) {
    let x = (noise(i * 100, frameCount * 0.005) * width * 1.2) - width * 0.1;
    let y = (noise(i * 200, frameCount * 0.003) * height * 0.8) + height * 0.1;
    let size = noise(i * 300) * 4 + 1;
    let alpha = noise(i * 400, frameCount * 0.01) * 100 + 30;
    
    fill(red(color(COLORS.dust)), 
         green(color(COLORS.dust)), 
         blue(color(COLORS.dust)), 
         alpha);
    ellipse(x, y, size, size);
  }
}

function easeInOutCubic(t) {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - pow(-2 * t + 2, 3) / 2;
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day02', 'png');
  }
}
