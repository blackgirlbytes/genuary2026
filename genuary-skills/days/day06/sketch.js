// Day 06: Lights on/off - "The Koi's Secret"
// A gorgeous koi fish that breathes between flesh and skeleton

let lightPhase = 0; // 0 = lights on (flesh), 1 = lights off (skeleton)
let transitionSpeed = 0.008; // Slow, dreamy transition
let fishX, fishY;
let time = 0;
let bubbles = [];
let particles = [];

// Fish colors
const koiOrange = [15, 85, 95]; // HSB: warm orange
const koiWhite = [40, 10, 98];
const koiGold = [35, 80, 100];
const skeletonBlue = [195, 90, 100]; // Electric cyan
const skeletonGlow = [200, 70, 80];

function setup() {
  let canvas = createCanvas(800, 600);
  canvas.parent('sketch-container');
  colorMode(HSB, 360, 100, 100, 100);
  fishX = width / 2;
  fishY = height / 2;
  
  // Initialize bubbles
  for (let i = 0; i < 15; i++) {
    bubbles.push({
      x: random(width),
      y: random(height),
      size: random(3, 12),
      speed: random(0.3, 1),
      wobble: random(TWO_PI)
    });
  }
  
  // Initialize particles (for x-ray mode)
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: random(width),
      y: random(height),
      size: random(1, 4),
      speed: random(0.1, 0.4),
      angle: random(TWO_PI)
    });
  }
}

function draw() {
  time += 0.02;
  
  // Automatic light cycling - smooth sine wave
  lightPhase = (sin(time * 0.3) + 1) / 2; // Oscillates 0 to 1
  
  // Background transitions between warm water and deep dark
  let bgHue = lerp(200, 220, lightPhase);
  let bgSat = lerp(30, 80, lightPhase);
  let bgBri = lerp(85, 12, lightPhase);
  background(bgHue, bgSat, bgBri);
  
  // Draw water caustics (light mode) or stars (dark mode)
  drawEnvironment();
  
  // Fish swimming motion
  let swimX = fishX + sin(time * 0.8) * 30;
  let swimY = fishY + cos(time * 0.5) * 15;
  let fishAngle = sin(time * 0.8) * 0.15; // Gentle rotation
  
  push();
  translate(swimX, swimY);
  rotate(fishAngle);
  
  // Draw the koi - blend between flesh and skeleton based on lightPhase
  drawKoi(lightPhase);
  
  pop();
  
  // Draw bubbles (light mode) or particles (dark mode)
  drawFloatingElements();
}

function drawEnvironment() {
  // Light mode: water caustics
  if (lightPhase < 0.7) {
    let causticAlpha = map(lightPhase, 0, 0.7, 20, 0);
    noStroke();
    for (let i = 0; i < 8; i++) {
      let cx = width/2 + sin(time * 0.3 + i) * 200;
      let cy = height/2 + cos(time * 0.4 + i * 0.7) * 150;
      fill(180, 20, 100, causticAlpha);
      ellipse(cx, cy, 150 + sin(time + i) * 30, 100 + cos(time + i) * 20);
    }
  }
  
  // Dark mode: subtle stars/plankton
  if (lightPhase > 0.3) {
    let starAlpha = map(lightPhase, 0.3, 1, 0, 60);
    noStroke();
    for (let i = 0; i < 50; i++) {
      let sx = (i * 137.5 + time * 5) % width;
      let sy = (i * 89.3 + sin(time + i) * 10) % height;
      let twinkle = sin(time * 2 + i) * 0.5 + 0.5;
      fill(200, 50, 100, starAlpha * twinkle);
      ellipse(sx, sy, 2 + twinkle * 2);
    }
  }
}

function drawKoi(phase) {
  // The fish body uses bezier curves for that beautiful koi shape
  
  // === FLESH LAYER (fades out as phase increases) ===
  let fleshAlpha = map(phase, 0, 0.6, 100, 0);
  fleshAlpha = constrain(fleshAlpha, 0, 100);
  
  if (fleshAlpha > 0) {
    drawKoiFlesh(fleshAlpha);
  }
  
  // === SKELETON LAYER (fades in as phase increases) ===
  let skeletonAlpha = map(phase, 0.3, 1, 0, 100);
  skeletonAlpha = constrain(skeletonAlpha, 0, 100);
  
  if (skeletonAlpha > 0) {
    drawKoiSkeleton(skeletonAlpha);
  }
}

function drawKoiFlesh(alpha) {
  // Main body
  noStroke();
  
  // Body gradient - multiple overlapping ellipses
  let bodyLength = 200;
  let bodyHeight = 70;
  
  // Shadow underneath
  fill(20, 60, 40, alpha * 0.3);
  ellipse(5, 8, bodyLength * 0.9, bodyHeight * 0.8);
  
  // Main body - white base
  fill(koiWhite[0], koiWhite[1], koiWhite[2], alpha);
  ellipse(0, 0, bodyLength, bodyHeight);
  
  // Orange patches (koi pattern)
  fill(koiOrange[0], koiOrange[1], koiOrange[2], alpha);
  
  // Head patch
  push();
  translate(-60, -5);
  rotate(-0.2);
  ellipse(0, 0, 60, 45);
  pop();
  
  // Middle patches
  push();
  translate(10, 8);
  rotate(0.3);
  ellipse(0, 0, 70, 35);
  pop();
  
  push();
  translate(-20, -12);
  rotate(-0.1);
  ellipse(0, 0, 45, 30);
  pop();
  
  // Tail patch
  push();
  translate(70, 0);
  ellipse(0, 0, 40, 25);
  pop();
  
  // Gold accents
  fill(koiGold[0], koiGold[1], koiGold[2], alpha * 0.7);
  ellipse(-40, 5, 25, 20);
  ellipse(30, -8, 20, 15);
  
  // Scales texture
  drawScales(alpha);
  
  // Fins
  drawFins(alpha, false);
  
  // Eye
  fill(0, 0, 10, alpha);
  ellipse(-70, -5, 12, 12);
  fill(0, 0, 100, alpha);
  ellipse(-72, -7, 4, 4);
  
  // Subtle shine on body
  fill(0, 0, 100, alpha * 0.3);
  ellipse(-20, -20, 80, 15);
}

function drawScales(alpha) {
  // Delicate scale pattern
  noFill();
  stroke(0, 0, 100, alpha * 0.2);
  strokeWeight(0.5);
  
  for (let row = -2; row <= 2; row++) {
    for (let col = -4; col <= 4; col++) {
      let sx = col * 20 + (row % 2) * 10;
      let sy = row * 12;
      let scaleSize = 15 - abs(row) * 2;
      
      // Only draw if inside body bounds
      if (sx > -90 && sx < 80 && abs(sy) < 25) {
        arc(sx, sy, scaleSize, scaleSize * 0.7, PI * 0.2, PI * 0.8);
      }
    }
  }
  noStroke();
}

function drawFins(alpha, isSkeleton) {
  let finColor = isSkeleton ? 
    [skeletonBlue[0], skeletonBlue[1], skeletonBlue[2], alpha * 0.6] :
    [koiOrange[0], 40, 95, alpha * 0.7];
  
  // Dorsal fin (top)
  fill(finColor[0], finColor[1], finColor[2], finColor[3]);
  beginShape();
  vertex(-10, -35);
  bezierVertex(-30, -70, 20, -75, 40, -35);
  vertex(30, -35);
  bezierVertex(10, -50, -20, -45, -10, -35);
  endShape(CLOSE);
  
  // Tail fin - flowing
  let tailWave = sin(time * 3) * 10;
  beginShape();
  vertex(85, 0);
  bezierVertex(110, -20 + tailWave, 140, -35 + tailWave, 150, -25 + tailWave);
  bezierVertex(130, 0, 130, 0, 150, 25 - tailWave);
  bezierVertex(140, 35 - tailWave, 110, 20 - tailWave, 85, 0);
  endShape(CLOSE);
  
  // Pectoral fins (sides)
  push();
  translate(-30, 25);
  rotate(0.4 + sin(time * 2) * 0.1);
  beginShape();
  vertex(0, 0);
  bezierVertex(-20, 20, -10, 45, 15, 40);
  bezierVertex(10, 25, 5, 10, 0, 0);
  endShape(CLOSE);
  pop();
  
  // Pelvic fin
  push();
  translate(20, 28);
  rotate(0.3);
  ellipse(0, 10, 25, 35);
  pop();
  
  // Anal fin
  push();
  translate(50, 30);
  rotate(0.2);
  beginShape();
  vertex(0, 0);
  bezierVertex(10, 15, 25, 20, 30, 10);
  bezierVertex(20, 5, 10, 0, 0, 0);
  endShape(CLOSE);
  pop();
}

function drawKoiSkeleton(alpha) {
  // Glowing skeleton effect
  
  // Outer glow
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = `hsla(${skeletonBlue[0]}, ${skeletonBlue[1]}%, ${skeletonBlue[2]}%, ${alpha/100})`;
  
  // Skull
  stroke(skeletonBlue[0], skeletonBlue[1], skeletonBlue[2], alpha);
  strokeWeight(3);
  noFill();
  
  // Skull outline
  beginShape();
  vertex(-90, 0);
  bezierVertex(-95, -15, -85, -25, -70, -20);
  bezierVertex(-55, -15, -50, -5, -50, 0);
  bezierVertex(-50, 5, -55, 15, -70, 20);
  bezierVertex(-85, 25, -95, 15, -90, 0);
  endShape(CLOSE);
  
  // Eye socket
  fill(skeletonBlue[0], 60, 30, alpha * 0.5);
  stroke(skeletonBlue[0], skeletonBlue[1], skeletonBlue[2], alpha);
  ellipse(-72, -3, 18, 16);
  
  // Jaw
  noFill();
  beginShape();
  vertex(-90, 5);
  bezierVertex(-95, 10, -92, 18, -80, 15);
  endShape();
  
  // Spine - beautiful vertebrae
  strokeWeight(2);
  let spineY = sin(time * 2) * 3; // Subtle breathing
  
  for (let i = 0; i < 20; i++) {
    let x = -45 + i * 7;
    let y = sin(i * 0.3 + time) * 3 + spineY;
    let vertebraSize = map(i, 0, 19, 12, 6);
    
    // Vertebra body
    fill(skeletonBlue[0], 70, 90, alpha * 0.8);
    stroke(skeletonBlue[0], skeletonBlue[1], skeletonBlue[2], alpha);
    ellipse(x, y, vertebraSize, vertebraSize * 0.7);
    
    // Spinal processes (the little spikes)
    strokeWeight(1.5);
    line(x, y - vertebraSize/2, x, y - vertebraSize - 3);
    line(x, y + vertebraSize/2, x, y + vertebraSize + 2);
  }
  
  // Ribs
  strokeWeight(1.5);
  noFill();
  for (let i = 0; i < 12; i++) {
    let ribX = -40 + i * 8;
    let ribY = sin(i * 0.3 + time) * 3 + spineY;
    let ribLength = map(i, 0, 11, 20, 12);
    
    // Upper rib
    beginShape();
    vertex(ribX, ribY - 5);
    bezierVertex(ribX - 5, ribY - ribLength, ribX + 5, ribY - ribLength - 5, ribX + 3, ribY - ribLength + 5);
    endShape();
    
    // Lower rib
    beginShape();
    vertex(ribX, ribY + 5);
    bezierVertex(ribX - 5, ribY + ribLength, ribX + 5, ribY + ribLength + 5, ribX + 3, ribY + ribLength - 5);
    endShape();
  }
  
  // Tail bones (caudal fin rays)
  strokeWeight(1);
  for (let i = 0; i < 12; i++) {
    let angle = map(i, 0, 11, -0.6, 0.6);
    let tailWave = sin(time * 3 + i * 0.2) * 5;
    push();
    translate(95, tailWave * 0.3);
    rotate(angle);
    line(0, 0, 50, tailWave);
    pop();
  }
  
  // Fin rays (ghostly)
  stroke(skeletonBlue[0], skeletonBlue[1], skeletonBlue[2], alpha * 0.5);
  strokeWeight(0.8);
  
  // Dorsal fin rays
  for (let i = 0; i < 8; i++) {
    let fx = -10 + i * 6;
    let fy = -35;
    let rayLength = 30 - abs(i - 4) * 4;
    line(fx, fy, fx + i - 4, fy - rayLength);
  }
  
  // Pectoral fin rays
  push();
  translate(-30, 25);
  rotate(0.4 + sin(time * 2) * 0.1);
  for (let i = 0; i < 6; i++) {
    let angle = map(i, 0, 5, -0.3, 0.5);
    push();
    rotate(angle);
    line(0, 0, 0, 35);
    pop();
  }
  pop();
  
  // Beating heart glow (inside ribcage)
  let heartbeat = sin(time * 4) * 0.3 + 0.7;
  let heartX = -10;
  let heartY = sin(time) * 2;
  
  // Heart glow layers
  noStroke();
  for (let i = 3; i > 0; i--) {
    fill(340, 80, 100, alpha * 0.15 * heartbeat);
    ellipse(heartX, heartY, 25 + i * 10, 20 + i * 8);
  }
  fill(340, 90, 100, alpha * 0.8 * heartbeat);
  ellipse(heartX, heartY, 18, 15);
  
  // Swim bladder (glowing organ)
  fill(skeletonBlue[0], 50, 80, alpha * 0.4);
  ellipse(25, -5, 40, 18);
  
  // Reset shadow
  drawingContext.shadowBlur = 0;
}

function drawFloatingElements() {
  // Bubbles (more visible in light mode)
  let bubbleAlpha = map(lightPhase, 0, 1, 40, 10);
  noFill();
  
  for (let b of bubbles) {
    b.y -= b.speed;
    b.x += sin(time + b.wobble) * 0.3;
    
    if (b.y < -20) {
      b.y = height + 20;
      b.x = random(width);
    }
    
    stroke(200, 20, 100, bubbleAlpha);
    strokeWeight(1);
    ellipse(b.x, b.y, b.size);
    
    // Bubble highlight
    noStroke();
    fill(200, 10, 100, bubbleAlpha * 0.5);
    ellipse(b.x - b.size * 0.2, b.y - b.size * 0.2, b.size * 0.3);
  }
  
  // Particles (more visible in dark mode)
  let particleAlpha = map(lightPhase, 0, 1, 5, 50);
  noStroke();
  
  for (let p of particles) {
    p.x += cos(p.angle) * p.speed;
    p.y += sin(p.angle) * p.speed;
    p.angle += 0.01;
    
    // Wrap around
    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;
    
    let twinkle = sin(time * 3 + p.x) * 0.5 + 0.5;
    fill(skeletonBlue[0], 60, 100, particleAlpha * twinkle);
    ellipse(p.x, p.y, p.size * (1 + twinkle * 0.5));
  }
}

// Handle window resize
function windowResized() {
  // Keep canvas size fixed for consistency
}
