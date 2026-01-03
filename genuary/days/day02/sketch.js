// Genuary Day 2: Twelve Principles of Animation
// "The Sleepy G" - A G that slowly rises from the bottom

let g; // Our sleepy protagonist
let particles = []; // Z's that become sparkles

function setup() {
  createCanvas(800, 800);
  
  g = {
    // Position - starts at the bottom
    x: width / 2,
    y: height + 100, // Below screen
    targetY: height / 2, // Where it will rise to
    
    // Base dimensions
    size: 100,
    
    // Squash & stretch
    scaleX: 1.3, // Starts squashed wide (sleepy/heavy)
    scaleY: 0.7,
    targetScaleX: 1,
    targetScaleY: 1,
    
    // Gentle rotation wobble
    rotation: 0,
    wobbleAmount: 0.03,
    
    // State
    state: 'sleeping', // sleeping -> waking -> rising -> awake
    stateTimer: 0,
    
    // Rise progress (0 to 1)
    riseProgress: 0,
    
    // Eye blink for personality
    eyeOpen: 0,
    blinkTimer: 0,
  };
  
  // Create initial Z particles
  for (let i = 0; i < 5; i++) {
    createZParticle();
  }
}

function draw() {
  // Soft gradient background - dawn colors
  drawBackground();
  
  // Update the G
  updateG();
  
  // Update and draw particles (Z's / sparkles)
  updateParticles();
  
  // Draw shadow
  drawShadow();
  
  // Draw the G
  push();
  translate(g.x, g.y);
  rotate(g.rotation);
  scale(g.scaleX, g.scaleY);
  drawG();
  pop();
}

function drawBackground() {
  // Gradient from deep blue (bottom) to warm peach (top)
  for (let y = 0; y < height; y++) {
    let t = y / height;
    let c = lerpColor(
      color(255, 245, 235), // Warm cream at top
      color(235, 225, 245), // Soft lavender at bottom
      t
    );
    stroke(c);
    line(0, y, width, y);
  }
}

function updateG() {
  g.stateTimer++;
  
  switch(g.state) {
    case 'sleeping':
      // Gentle breathing squash/stretch
      let breathe = sin(frameCount * 0.05) * 0.05;
      g.scaleX = 1.3 + breathe;
      g.scaleY = 0.7 - breathe * 0.5;
      g.y = height - 50; // Resting at bottom
      
      // Spawn Z's occasionally
      if (frameCount % 40 === 0) {
        createZParticle();
      }
      
      // After 2 seconds, start waking
      if (g.stateTimer > 120) {
        g.state = 'waking';
        g.stateTimer = 0;
      }
      break;
      
    case 'waking':
      // Anticipation! Squash down more before rising
      let anticipation = easeInOutQuad(min(g.stateTimer / 30, 1));
      g.scaleX = lerp(1.3, 1.5, anticipation);
      g.scaleY = lerp(0.7, 0.5, anticipation);
      
      // Eye starts to open
      g.eyeOpen = lerp(0, 0.3, anticipation);
      
      // After anticipation, start rising
      if (g.stateTimer > 45) {
        g.state = 'rising';
        g.stateTimer = 0;
        g.riseProgress = 0;
      }
      break;
      
    case 'rising':
      // SLOW IN / SLOW OUT - the main principle!
      // Use easeInOutCubic for that beautiful slow start, fast middle, slow end
      g.riseProgress = min(g.riseProgress + 0.004, 1); // Very slow rise
      
      let easedProgress = easeInOutCubic(g.riseProgress);
      
      // Rise from bottom to center
      let startY = height - 50;
      let endY = height / 2;
      g.y = lerp(startY, endY, easedProgress);
      
      // Squash & stretch based on velocity (derivative of easing)
      // Fast in middle = more stretch, slow at ends = more normal
      let velocity = getEaseVelocity(g.riseProgress);
      g.targetScaleY = 1 + velocity * 0.4; // Stretch when moving fast
      g.targetScaleX = 1 - velocity * 0.2; // Narrow when stretched
      
      // Smooth the squash/stretch
      g.scaleX = lerp(g.scaleX, g.targetScaleX, 0.1);
      g.scaleY = lerp(g.scaleY, g.targetScaleY, 0.1);
      
      // Eye opens more as we rise
      g.eyeOpen = lerp(0.3, 1, easedProgress);
      
      // Gentle wobble (arc principle - organic movement)
      g.rotation = sin(frameCount * 0.08) * g.wobbleAmount * (1 - easedProgress * 0.5);
      
      // Transition Z's to sparkles as we rise
      // (handled in particle update)
      
      if (g.riseProgress >= 1) {
        g.state = 'awake';
        g.stateTimer = 0;
      }
      break;
      
    case 'awake':
      // Settle into gentle floating
      g.scaleX = lerp(g.scaleX, 1, 0.05);
      g.scaleY = lerp(g.scaleY, 1, 0.05);
      
      // Gentle float
      g.y = height / 2 + sin(frameCount * 0.03) * 8;
      g.rotation = sin(frameCount * 0.05) * 0.02;
      
      // Occasional blink
      g.blinkTimer++;
      if (g.blinkTimer > 180 && g.blinkTimer < 190) {
        g.eyeOpen = lerp(1, 0.1, (g.blinkTimer - 180) / 5);
      } else if (g.blinkTimer >= 190 && g.blinkTimer < 200) {
        g.eyeOpen = lerp(0.1, 1, (g.blinkTimer - 190) / 10);
      } else if (g.blinkTimer > 200) {
        g.eyeOpen = 1;
        if (random() < 0.01) g.blinkTimer = 175;
      }
      
      // Spawn sparkles occasionally
      if (frameCount % 60 === 0) {
        createSparkle();
      }
      
      // Loop after a while
      if (g.stateTimer > 300) {
        resetG();
      }
      break;
  }
}

function drawG() {
  let s = g.size;
  
  // Main G color - coral that warms up as it wakes
  let sleepyColor = color(180, 140, 160); // Muted purple-pink when sleepy
  let awakeColor = color(255, 120, 100); // Vibrant coral when awake
  let wakeAmount = g.state === 'sleeping' ? 0 : 
                   g.state === 'waking' ? 0.3 :
                   g.state === 'rising' ? g.riseProgress :
                   1;
  let mainColor = lerpColor(sleepyColor, awakeColor, wakeAmount);
  let darkColor = lerpColor(color(140, 100, 120), color(200, 80, 70), wakeAmount);
  
  push();
  noStroke();
  
  // === MAIN G BODY ===
  fill(mainColor);
  
  // Outer circle
  ellipse(0, 0, s * 2, s * 2);
  
  // Inner cutout
  fill(lerpColor(color(235, 225, 245), color(255, 245, 235), g.y / height));
  ellipse(0, 0, s * 1.1, s * 1.1);
  
  // Opening cutout (makes it a C shape)
  push();
  beginShape();
  vertex(0, 0);
  vertex(s * 1.2, -s * 0.8);
  vertex(s * 1.2, -s * 0.15);
  vertex(s * 0.4, -s * 0.15);
  endShape(CLOSE);
  pop();
  
  // Crossbar (makes it a G)
  fill(darkColor);
  push();
  translate(s * 0.2, 0);
  rectMode(CENTER);
  rect(0, 0, s * 0.85, s * 0.32, 6);
  pop();
  
  // === FACE - gives it personality! ===
  // Eye
  let eyeX = -s * 0.2;
  let eyeY = -s * 0.15;
  let eyeSize = s * 0.25;
  
  // Eye white
  fill(255);
  ellipse(eyeX, eyeY, eyeSize, eyeSize * g.eyeOpen);
  
  // Pupil (only if eye is open enough)
  if (g.eyeOpen > 0.3) {
    fill(40);
    let pupilSize = eyeSize * 0.5 * g.eyeOpen;
    ellipse(eyeX, eyeY, pupilSize, pupilSize);
    
    // Eye shine
    fill(255);
    ellipse(eyeX - pupilSize * 0.2, eyeY - pupilSize * 0.2, pupilSize * 0.3, pupilSize * 0.3);
  }
  
  // Sleepy lines when sleeping/waking
  if (g.state === 'sleeping' || g.state === 'waking') {
    stroke(darkColor);
    strokeWeight(2);
    noFill();
    // Closed eye lines
    let closeAmount = 1 - g.eyeOpen;
    if (closeAmount > 0.5) {
      line(eyeX - eyeSize * 0.4, eyeY, eyeX + eyeSize * 0.4, eyeY);
    }
  }
  
  // Rosy cheek
  noStroke();
  fill(255, 150, 150, 100 + wakeAmount * 50);
  ellipse(-s * 0.5, s * 0.1, s * 0.3, s * 0.2);
  
  pop();
}

function drawShadow() {
  // Shadow gets smaller and lighter as G rises
  let shadowY = height - 30;
  let distFromGround = shadowY - g.y;
  let shadowScale = map(distFromGround, 0, 400, 1.2, 0.3);
  shadowScale = constrain(shadowScale, 0.3, 1.2);
  
  let shadowAlpha = map(distFromGround, 0, 400, 80, 10);
  shadowAlpha = constrain(shadowAlpha, 10, 80);
  
  noStroke();
  fill(100, 80, 120, shadowAlpha);
  
  push();
  translate(g.x, shadowY);
  ellipse(0, 0, g.size * 2 * shadowScale * g.scaleX, 20 * shadowScale);
  pop();
}

// === PARTICLES (Z's and Sparkles) ===

function createZParticle() {
  particles.push({
    x: g.x + random(-30, 30),
    y: g.y - g.size - random(20, 50),
    vx: random(-0.3, 0.3),
    vy: random(-0.5, -1),
    size: random(15, 25),
    rotation: random(-0.2, 0.2),
    rotationVel: random(-0.02, 0.02),
    alpha: 200,
    type: 'z',
    age: 0
  });
}

function createSparkle() {
  let angle = random(TWO_PI);
  let dist = g.size * 1.5;
  particles.push({
    x: g.x + cos(angle) * dist,
    y: g.y + sin(angle) * dist,
    vx: cos(angle) * random(0.5, 1.5),
    vy: sin(angle) * random(0.5, 1.5),
    size: random(8, 15),
    rotation: 0,
    rotationVel: random(-0.1, 0.1),
    alpha: 255,
    type: 'sparkle',
    age: 0
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    
    // Move
    p.x += p.vx;
    p.y += p.vy;
    p.rotation += p.rotationVel;
    p.age++;
    
    // Fade out
    p.alpha -= p.type === 'z' ? 1.5 : 3;
    
    // Transform Z's to sparkles when G is rising/awake
    if (p.type === 'z' && (g.state === 'rising' || g.state === 'awake')) {
      p.type = 'sparkle';
      p.vy = -abs(p.vy) * 1.5; // Float up faster
    }
    
    // Draw
    push();
    translate(p.x, p.y);
    rotate(p.rotation);
    
    if (p.type === 'z') {
      // Draw Z
      fill(180, 160, 200, p.alpha);
      noStroke();
      textSize(p.size);
      textAlign(CENTER, CENTER);
      textStyle(BOLD);
      text('z', 0, 0);
    } else {
      // Draw sparkle ✨
      drawSparkle(0, 0, p.size, p.alpha);
    }
    
    pop();
    
    // Remove dead particles
    if (p.alpha <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawSparkle(x, y, size, alpha) {
  push();
  translate(x, y);
  noStroke();
  
  // Golden sparkle
  fill(255, 220, 100, alpha);
  
  // 4-pointed star
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = (i / 8) * TWO_PI - PI / 2;
    let r = i % 2 === 0 ? size : size * 0.3;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);
  
  // Center glow
  fill(255, 255, 200, alpha * 0.5);
  ellipse(0, 0, size * 0.4, size * 0.4);
  
  pop();
}

function resetG() {
  g.y = height + 100;
  g.scaleX = 1.3;
  g.scaleY = 0.7;
  g.rotation = 0;
  g.state = 'sleeping';
  g.stateTimer = 0;
  g.riseProgress = 0;
  g.eyeOpen = 0;
  g.blinkTimer = 0;
  particles = [];
}

// === EASING FUNCTIONS ===

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2;
}

// Get the "velocity" of the easing (how fast it's changing)
function getEaseVelocity(t) {
  // Approximate derivative of easeInOutCubic
  if (t < 0.5) {
    return 12 * t * t; // Derivative of 4t³
  } else {
    return 12 * (1 - t) * (1 - t); // Symmetric
  }
}
