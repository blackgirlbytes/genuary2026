// Genuary 2026 - Day 05
// Prompt: Write Genuary
// Write "Genuary". Avoid using a font.
// ETCH A SKETCH EDITION 🎨

const WIDTH = 800;
const HEIGHT = 700;

// Etch A Sketch dimensions
const FRAME_PADDING = 30;
const SCREEN_MARGIN = 60;
const KNOB_SIZE = 70;
const CORNER_RADIUS = 20;

// Drawing state
let pathPoints = [];
let currentPointIndex = 0;
let drawSpeed = 3; // points per frame
let isDrawing = true;
let shakeAmount = 0;
let isShaking = false;

// Screen bounds (will be calculated in setup)
let screenX, screenY, screenW, screenH;

// The iconic Etch A Sketch red
const ETCH_RED = [207, 16, 32];
const SCREEN_SILVER = [192, 192, 186];
const LINE_COLOR = [60, 60, 60];

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-container');
  
  // Calculate screen area
  screenX = FRAME_PADDING + SCREEN_MARGIN;
  screenY = FRAME_PADDING + SCREEN_MARGIN;
  screenW = WIDTH - (FRAME_PADDING + SCREEN_MARGIN) * 2;
  screenH = HEIGHT - FRAME_PADDING * 2 - SCREEN_MARGIN - KNOB_SIZE - 60;
  
  // Generate the path for GENUARY
  generateGenuaryPath();
  
  currentPointIndex = 0;
  isDrawing = true;
  shakeAmount = 0;
  isShaking = false;
}

function generateGenuaryPath() {
  pathPoints = [];
  
  // Letter dimensions for the screen - make letters bigger and more centered
  let letterW = screenW / 9;
  let letterH = screenH * 0.4;
  let startX = screenX + screenW * 0.07;
  let startY = screenY + screenH * 0.32;
  
  // Draw a line from current position to target with subtle wobble
  // This creates the authentic Etch A Sketch look
  function etchLine(toX, toY, letterPoints) {
    if (letterPoints.length === 0) {
      letterPoints.push({x: toX, y: toY});
      return;
    }
    
    let last = letterPoints[letterPoints.length - 1];
    let dx = toX - last.x;
    let dy = toY - last.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 0.1) return; // Skip tiny moves
    
    let steps = Math.max(Math.floor(dist / 3), 2);
    
    for (let i = 1; i <= steps; i++) {
      let t = i / steps;
      // Very subtle wobble - just enough to look hand-drawn
      let wobble = Math.sin(i * 0.8 + letterPoints.length * 0.1) * 0.4;
      let perpX = -dy / dist * wobble;
      let perpY = dx / dist * wobble;
      
      letterPoints.push({
        x: last.x + dx * t + perpX,
        y: last.y + dy * t + perpY
      });
    }
  }
  
  // Scale and position
  let w = letterW * 0.7;   // letter width
  let h = letterH;          // letter height
  let gap = letterW * 1.1;  // space between letters
  let x = startX;
  let y = startY;
  
  // ============================================
  // GENUARY - each letter drawn SEPARATELY
  // with gaps between them for readability!
  // ============================================
  
  // --- G ---
  let gPoints = [];
  gPoints.push({x: x + w, y: y});           // Start top right
  etchLine(x, y, gPoints);                   // Top bar left
  etchLine(x, y + h, gPoints);               // Down left side
  etchLine(x + w, y + h, gPoints);           // Bottom bar right
  etchLine(x + w, y + h * 0.5, gPoints);     // Up to middle
  etchLine(x + w * 0.5, y + h * 0.5, gPoints); // Crossbar left
  pathPoints.push({letter: 'G', points: gPoints});
  
  // --- E ---
  x += gap;
  let ePoints = [];
  ePoints.push({x: x + w, y: y});           // Start top right
  etchLine(x, y, ePoints);                   // Top bar left
  etchLine(x, y + h, ePoints);               // Down left side
  etchLine(x + w, y + h, ePoints);           // Bottom bar right
  // Middle bar (lift and draw)
  let eMidPoints = [];
  eMidPoints.push({x: x, y: y + h * 0.5});
  etchLine(x + w * 0.7, y + h * 0.5, eMidPoints);
  pathPoints.push({letter: 'E', points: ePoints});
  pathPoints.push({letter: 'E-mid', points: eMidPoints});
  
  // --- N ---
  x += gap;
  let nPoints = [];
  nPoints.push({x: x, y: y + h});           // Start bottom left
  etchLine(x, y, nPoints);                   // Up left side
  etchLine(x + w, y + h, nPoints);           // Diagonal down-right
  etchLine(x + w, y, nPoints);               // Up right side
  pathPoints.push({letter: 'N', points: nPoints});
  
  // --- U ---
  x += gap;
  let uPoints = [];
  uPoints.push({x: x, y: y});               // Start top left
  etchLine(x, y + h, uPoints);               // Down left side
  etchLine(x + w, y + h, uPoints);           // Across bottom
  etchLine(x + w, y, uPoints);               // Up right side
  pathPoints.push({letter: 'U', points: uPoints});
  
  // --- A ---
  x += gap;
  let aPoints = [];
  aPoints.push({x: x, y: y + h});           // Start bottom left
  etchLine(x + w * 0.5, y, aPoints);         // Up to peak
  etchLine(x + w, y + h, aPoints);           // Down to bottom right
  pathPoints.push({letter: 'A', points: aPoints});
  // A crossbar
  let aCrossPoints = [];
  aCrossPoints.push({x: x + w * 0.22, y: y + h * 0.55});
  etchLine(x + w * 0.78, y + h * 0.55, aCrossPoints);
  pathPoints.push({letter: 'A-cross', points: aCrossPoints});
  
  // --- R ---
  x += gap;
  let rPoints = [];
  rPoints.push({x: x, y: y + h});           // Start bottom left
  etchLine(x, y, rPoints);                   // Up left side
  etchLine(x + w, y, rPoints);               // Top bar right
  etchLine(x + w, y + h * 0.45, rPoints);    // Down to bowl
  etchLine(x, y + h * 0.45, rPoints);        // Bowl back left
  etchLine(x + w, y + h, rPoints);           // Diagonal leg
  pathPoints.push({letter: 'R', points: rPoints});
  
  // --- Y ---
  x += gap;
  let yPoints = [];
  yPoints.push({x: x, y: y});               // Start top left
  etchLine(x + w * 0.5, y + h * 0.5, yPoints); // Diagonal to center
  etchLine(x + w * 0.5, y + h, yPoints);     // Down stem
  pathPoints.push({letter: 'Y', points: yPoints});
  // Y right arm
  let yArmPoints = [];
  yArmPoints.push({x: x + w, y: y});
  etchLine(x + w * 0.5, y + h * 0.5, yArmPoints);
  pathPoints.push({letter: 'Y-arm', points: yArmPoints});
}

function draw() {
  // Apply shake effect
  push();
  if (isShaking) {
    translate(random(-shakeAmount, shakeAmount), random(-shakeAmount, shakeAmount));
    shakeAmount *= 0.95;
    if (shakeAmount < 0.5) {
      isShaking = false;
      shakeAmount = 0;
    }
  }
  
  // Draw the Etch A Sketch frame
  drawFrame();
  
  // Draw the screen
  drawScreen();
  
  // Draw the current path progress
  drawPath();
  
  // Draw the knobs (with rotation based on drawing)
  drawKnobs();
  
  // Draw the logo
  drawLogo();
  
  pop();
  
  // Count total points
  let totalPoints = 0;
  for (let letterObj of pathPoints) {
    totalPoints += letterObj.points.length;
  }
  
  // Advance drawing
  if (isDrawing && currentPointIndex < totalPoints) {
    currentPointIndex += drawSpeed;
    if (currentPointIndex >= totalPoints) {
      currentPointIndex = totalPoints;
      isDrawing = false;
      // Trigger shake after a delay
      setTimeout(() => {
        isShaking = true;
        shakeAmount = 15;
      }, 2000);
    }
  }
}

function drawFrame() {
  // === OUTER DROP SHADOW (soft, realistic) ===
  noStroke();
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
  drawingContext.shadowBlur = 25;
  drawingContext.shadowOffsetX = 8;
  drawingContext.shadowOffsetY = 12;
  fill(ETCH_RED);
  rect(0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
  drawingContext.shadowColor = 'transparent';
  
  // === MAIN BODY with realistic plastic gradient ===
  // Create vertical gradient for 3D curved plastic look
  let ctx = drawingContext;
  let gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  gradient.addColorStop(0, 'rgb(235, 45, 55)');      // Lighter top (light hitting)
  gradient.addColorStop(0.15, 'rgb(215, 25, 38)');   // Transition
  gradient.addColorStop(0.5, 'rgb(207, 16, 32)');    // True red middle
  gradient.addColorStop(0.85, 'rgb(175, 12, 25)');   // Darker bottom
  gradient.addColorStop(1, 'rgb(145, 8, 18)');       // Darkest edge
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(0, 0, WIDTH, HEIGHT, CORNER_RADIUS);
  ctx.fill();
  
  // === EDGE BEVEL - top/left highlight ===
  // Top edge shine
  let topGrad = ctx.createLinearGradient(0, 0, 0, 20);
  topGrad.addColorStop(0, 'rgba(255, 150, 150, 0.6)');
  topGrad.addColorStop(0.5, 'rgba(255, 100, 100, 0.3)');
  topGrad.addColorStop(1, 'rgba(255, 80, 80, 0)');
  ctx.fillStyle = topGrad;
  ctx.beginPath();
  ctx.roundRect(5, 3, WIDTH - 10, 25, [CORNER_RADIUS - 3, CORNER_RADIUS - 3, 0, 0]);
  ctx.fill();
  
  // Left edge highlight
  let leftGrad = ctx.createLinearGradient(0, 0, 18, 0);
  leftGrad.addColorStop(0, 'rgba(255, 130, 130, 0.4)');
  leftGrad.addColorStop(0.5, 'rgba(255, 100, 100, 0.15)');
  leftGrad.addColorStop(1, 'rgba(255, 80, 80, 0)');
  ctx.fillStyle = leftGrad;
  ctx.fillRect(3, 25, 20, HEIGHT - 130);
  
  // === EDGE BEVEL - bottom/right shadow ===
  // Bottom edge shadow
  let bottomGrad = ctx.createLinearGradient(0, HEIGHT - 30, 0, HEIGHT);
  bottomGrad.addColorStop(0, 'rgba(80, 5, 10, 0)');
  bottomGrad.addColorStop(0.5, 'rgba(60, 3, 8, 0.3)');
  bottomGrad.addColorStop(1, 'rgba(40, 2, 5, 0.5)');
  ctx.fillStyle = bottomGrad;
  ctx.beginPath();
  ctx.roundRect(5, HEIGHT - 35, WIDTH - 10, 32, [0, 0, CORNER_RADIUS - 3, CORNER_RADIUS - 3]);
  ctx.fill();
  
  // Right edge shadow
  let rightGrad = ctx.createLinearGradient(WIDTH - 20, 0, WIDTH, 0);
  rightGrad.addColorStop(0, 'rgba(100, 5, 12, 0)');
  rightGrad.addColorStop(0.5, 'rgba(80, 4, 10, 0.2)');
  rightGrad.addColorStop(1, 'rgba(60, 3, 8, 0.4)');
  ctx.fillStyle = rightGrad;
  ctx.fillRect(WIDTH - 22, 25, 20, HEIGHT - 130);
  
  // === RAISED BEZEL around screen ===
  // Outer raised ridge (catches light on top-left)
  noFill();
  strokeWeight(4);
  stroke(230, 40, 50); // Lighter red - raised edge catching light
  beginShape();
  vertex(screenX - 22, screenY + screenH + 22);
  vertex(screenX - 22, screenY - 22);
  vertex(screenX + screenW + 22, screenY - 22);
  endShape();
  
  stroke(140, 8, 18); // Darker red - shadow side
  beginShape();
  vertex(screenX + screenW + 22, screenY - 22);
  vertex(screenX + screenW + 22, screenY + screenH + 22);
  vertex(screenX - 22, screenY + screenH + 22);
  endShape();
  
  // Inner groove shadow
  strokeWeight(2);
  stroke(100, 5, 12);
  beginShape();
  vertex(screenX - 15, screenY + screenH + 15);
  vertex(screenX - 15, screenY - 15);
  vertex(screenX + screenW + 15, screenY - 15);
  endShape();
  
  stroke(190, 20, 30);
  beginShape();
  vertex(screenX + screenW + 15, screenY - 15);
  vertex(screenX + screenW + 15, screenY + screenH + 15);
  vertex(screenX - 15, screenY + screenH + 15);
  endShape();
  
  noStroke();
  
  // === SUBTLE PLASTIC TEXTURE (fine grain) ===
  // Seed random for consistent texture
  randomSeed(42);
  for (let i = 0; i < 300; i++) {
    let px = random(15, WIDTH - 15);
    let py = random(15, HEIGHT - 100);
    // Avoid the screen area
    if (px > screenX - 25 && px < screenX + screenW + 25 && 
        py > screenY - 25 && py < screenY + screenH + 25) continue;
    // Mix of highlights and shadows for texture
    if (random() > 0.5) {
      fill(255, 255, 255, random(3, 12));
    } else {
      fill(0, 0, 0, random(3, 10));
    }
    ellipse(px, py, random(0.5, 2), random(0.5, 2));
  }
  randomSeed(frameCount); // Reset random
  
  // === CORNER SCREWS (subtle detail) ===
  drawCornerScrew(45, 55);
  drawCornerScrew(WIDTH - 45, 55);
  drawCornerScrew(45, HEIGHT - 85);
  drawCornerScrew(WIDTH - 45, HEIGHT - 85);
}

function drawCornerScrew(x, y) {
  push();
  translate(x, y);
  
  // Recessed hole
  fill(140, 10, 18);
  ellipse(0, 0, 14, 14);
  
  // Screw head
  fill(80, 80, 85);
  ellipse(0, 0, 10, 10);
  
  // Phillips head cross
  stroke(50, 50, 55);
  strokeWeight(1.5);
  line(-3, 0, 3, 0);
  line(0, -3, 0, 3);
  
  // Highlight
  noStroke();
  fill(120, 120, 125, 150);
  ellipse(-1, -1, 3, 3);
  
  pop();
}

function drawScreen() {
  let ctx = drawingContext;
  
  // === DEEP RECESSED BEZEL with realistic depth ===
  // Outer shadow (dark pit)
  fill(15, 15, 18);
  rect(screenX - 12, screenY - 12, screenW + 24, screenH + 24, 4);
  
  // Metallic bezel frame with gradient
  let bezelGrad = ctx.createLinearGradient(screenX - 10, screenY - 10, screenX + screenW + 10, screenY + screenH + 10);
  bezelGrad.addColorStop(0, 'rgb(90, 90, 95)');
  bezelGrad.addColorStop(0.3, 'rgb(60, 60, 65)');
  bezelGrad.addColorStop(0.7, 'rgb(45, 45, 50)');
  bezelGrad.addColorStop(1, 'rgb(35, 35, 40)');
  ctx.fillStyle = bezelGrad;
  ctx.beginPath();
  ctx.roundRect(screenX - 10, screenY - 10, screenW + 20, screenH + 20, 3);
  ctx.fill();
  
  // Inner bevel highlight (top-left edge of bezel)
  stroke(100, 100, 105);
  strokeWeight(1);
  noFill();
  line(screenX - 9, screenY + screenH + 8, screenX - 9, screenY - 9);
  line(screenX - 9, screenY - 9, screenX + screenW + 8, screenY - 9);
  
  // Inner bevel shadow (bottom-right edge)
  stroke(25, 25, 28);
  line(screenX + screenW + 9, screenY - 8, screenX + screenW + 9, screenY + screenH + 9);
  line(screenX + screenW + 9, screenY + screenH + 9, screenX - 8, screenY + screenH + 9);
  
  // Glass edge shadow (where glass meets bezel)
  fill(20, 20, 22);
  rect(screenX - 3, screenY - 3, screenW + 6, screenH + 6, 2);
  
  // === SCREEN SURFACE - aluminum powder coating ===
  // Base with subtle gradient (slightly darker at edges)
  let screenGrad = ctx.createRadialGradient(
    screenX + screenW/2, screenY + screenH/2, 0,
    screenX + screenW/2, screenY + screenH/2, screenW * 0.7
  );
  screenGrad.addColorStop(0, 'rgb(198, 198, 192)');
  screenGrad.addColorStop(0.7, 'rgb(192, 192, 186)');
  screenGrad.addColorStop(1, 'rgb(180, 180, 175)');
  ctx.fillStyle = screenGrad;
  ctx.fillRect(screenX, screenY, screenW, screenH);
  
  // Fine aluminum powder texture (static noise)
  randomSeed(123);
  for (let i = 0; i < 2000; i++) {
    let px = random(screenX, screenX + screenW);
    let py = random(screenY, screenY + screenH);
    let brightness = random(-15, 15);
    if (brightness > 0) {
      fill(255, 255, 255, brightness * 2);
    } else {
      fill(0, 0, 0, -brightness * 1.5);
    }
    noStroke();
    rect(px, py, 1, 1);
  }
  randomSeed(frameCount);
  
  // === GLASS COVER EFFECT ===
  noStroke();
  
  // Top reflection band (window light)
  let reflectGrad = ctx.createLinearGradient(screenX, screenY, screenX, screenY + 60);
  reflectGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
  reflectGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  reflectGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = reflectGrad;
  ctx.fillRect(screenX, screenY, screenW, 60);
  
  // Corner highlight (specular)
  fill(255, 255, 255, 20);
  beginShape();
  vertex(screenX, screenY);
  vertex(screenX + 120, screenY);
  vertex(screenX, screenY + 80);
  endShape(CLOSE);
  
  // Subtle edge darkening (vignette)
  let vignetteGrad = ctx.createRadialGradient(
    screenX + screenW/2, screenY + screenH/2, screenW * 0.3,
    screenX + screenW/2, screenY + screenH/2, screenW * 0.8
  );
  vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = vignetteGrad;
  ctx.fillRect(screenX, screenY, screenW, screenH);
  
  // Inner shadow at very edge (glass thickness)
  stroke(0, 0, 0, 40);
  strokeWeight(2);
  noFill();
  rect(screenX + 1, screenY + 1, screenW - 2, screenH - 2);
  noStroke();
}

function drawPath() {
  if (pathPoints.length === 0) return;
  
  stroke(LINE_COLOR);
  strokeWeight(2.5);
  noFill();
  
  // Apply fade if shaking (erasing effect)
  if (isShaking) {
    stroke(LINE_COLOR[0], LINE_COLOR[1], LINE_COLOR[2], map(shakeAmount, 0, 15, 255, 100));
  }
  
  // Count total points for animation
  let totalPoints = 0;
  for (let letterObj of pathPoints) {
    totalPoints += letterObj.points.length;
  }
  
  // Calculate how many points to draw based on animation progress
  let pointsToDraw = floor(map(currentPointIndex, 0, totalPoints, 0, totalPoints));
  let pointsDrawn = 0;
  let lastDrawnPoint = null;
  
  // Draw each letter separately (with gaps between!)
  for (let letterObj of pathPoints) {
    let letterPoints = letterObj.points;
    
    // How many points of this letter to draw?
    let letterPointsToDraw = min(letterPoints.length, pointsToDraw - pointsDrawn);
    
    if (letterPointsToDraw > 0) {
      beginShape();
      for (let i = 0; i < letterPointsToDraw; i++) {
        vertex(letterPoints[i].x, letterPoints[i].y);
        lastDrawnPoint = letterPoints[i];
      }
      endShape();
      
      pointsDrawn += letterPointsToDraw;
    }
    
    if (pointsDrawn >= pointsToDraw) break;
  }
  
  // Draw stylus position (current drawing point)
  if (isDrawing && lastDrawnPoint && currentPointIndex < totalPoints) {
    fill(LINE_COLOR);
    noStroke();
    ellipse(lastDrawnPoint.x, lastDrawnPoint.y, 6, 6);
  }
}

function drawKnobs() {
  let knobY = HEIGHT - FRAME_PADDING - KNOB_SIZE / 2 - 15;
  let leftKnobX = FRAME_PADDING + KNOB_SIZE / 2 + 40;
  let rightKnobX = WIDTH - FRAME_PADDING - KNOB_SIZE / 2 - 40;
  
  // Calculate rotation based on drawing progress
  let rotation = 0;
  if (currentPointIndex > 0 && pathPoints.length > 0) {
    rotation = (currentPointIndex / pathPoints.length) * TWO_PI * 5;
  }
  
  // Left knob (horizontal control)
  drawKnob(leftKnobX, knobY, rotation, "LEFT");
  
  // Right knob (vertical control)
  drawKnob(rightKnobX, knobY, rotation * 0.7, "RIGHT");
}

function drawKnob(x, y, rotation, label) {
  push();
  translate(x, y);
  let ctx = drawingContext;
  let knobR = KNOB_SIZE / 2;
  
  // === RECESSED CIRCULAR HOUSING ===
  // Deep shadow pit
  noStroke();
  fill(40, 2, 5);
  ellipse(0, 3, KNOB_SIZE + 32, KNOB_SIZE + 32);
  
  // Recessed ring with gradient (darker in center)
  let recessGrad = ctx.createRadialGradient(0, 0, KNOB_SIZE/2 + 2, 0, 0, KNOB_SIZE/2 + 16);
  recessGrad.addColorStop(0, 'rgb(35, 2, 4)');
  recessGrad.addColorStop(0.5, 'rgb(80, 5, 10)');
  recessGrad.addColorStop(1, 'rgb(140, 10, 18)');
  ctx.fillStyle = recessGrad;
  ctx.beginPath();
  ctx.arc(0, 0, KNOB_SIZE/2 + 14, 0, TWO_PI);
  ctx.fill();
  
  // Inner lip highlight (top edge of recess catches light)
  stroke(180, 15, 25);
  strokeWeight(2);
  noFill();
  arc(0, 0, KNOB_SIZE + 24, KNOB_SIZE + 24, PI + 0.3, TWO_PI - 0.3);
  
  // Inner lip shadow (bottom edge)
  stroke(50, 3, 6);
  arc(0, 0, KNOB_SIZE + 24, KNOB_SIZE + 24, 0.3, PI - 0.3);
  
  noStroke();
  
  // === KNOB DROP SHADOW ===
  ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = 8;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 4;
  fill(245, 243, 238);
  ellipse(0, 0, KNOB_SIZE, KNOB_SIZE);
  ctx.shadowColor = 'transparent';
  
  // === KNOB BODY - realistic white plastic with dome ===
  // Base gradient (3D dome effect)
  let knobGrad = ctx.createRadialGradient(-8, -8, 0, 0, 0, knobR);
  knobGrad.addColorStop(0, 'rgb(255, 255, 252)');    // Bright highlight center-top
  knobGrad.addColorStop(0.3, 'rgb(250, 248, 244)');  // Off-white
  knobGrad.addColorStop(0.7, 'rgb(235, 233, 228)');  // Slightly darker
  knobGrad.addColorStop(1, 'rgb(210, 208, 202)');    // Edge shadow
  ctx.fillStyle = knobGrad;
  ctx.beginPath();
  ctx.arc(0, 0, knobR, 0, TWO_PI);
  ctx.fill();
  
  // === KNURLED GRIP EDGE (the ridges) ===
  push();
  rotate(rotation);
  
  let numRidges = 48;  // More ridges for realism
  let ridgeInner = knobR - 6;
  let ridgeOuter = knobR - 0.5;
  
  for (let i = 0; i < numRidges; i++) {
    let angle = (TWO_PI / numRidges) * i;
    
    // Calculate lighting based on angle (light from top-left)
    let lightAngle = -PI/4; // Light coming from top-left
    let angleDiff = abs(angle - lightAngle);
    if (angleDiff > PI) angleDiff = TWO_PI - angleDiff;
    let lightness = map(angleDiff, 0, PI, 255, 160);
    
    // Ridge highlight side
    stroke(lightness, lightness, lightness - 5);
    strokeWeight(2);
    let x1 = cos(angle) * ridgeInner;
    let y1 = sin(angle) * ridgeInner;
    let x2 = cos(angle) * ridgeOuter;
    let y2 = sin(angle) * ridgeOuter;
    line(x1, y1, x2, y2);
    
    // Ridge shadow side (offset slightly)
    let shadowAngle = angle + PI/numRidges * 0.5;
    stroke(lightness - 50, lightness - 50, lightness - 55);
    strokeWeight(1);
    x1 = cos(shadowAngle) * ridgeInner;
    y1 = sin(shadowAngle) * ridgeInner;
    x2 = cos(shadowAngle) * ridgeOuter;
    y2 = sin(shadowAngle) * ridgeOuter;
    line(x1, y1, x2, y2);
  }
  
  // Outer edge definition
  noFill();
  stroke(180, 178, 172);
  strokeWeight(1);
  ellipse(0, 0, KNOB_SIZE - 1, KNOB_SIZE - 1);
  
  // Inner edge of knurled area
  stroke(200, 198, 192);
  ellipse(0, 0, KNOB_SIZE - 12, KNOB_SIZE - 12);
  
  pop();
  noStroke();
  
  // === FLAT CENTER AREA ===
  // Slightly recessed center disc
  let centerGrad = ctx.createRadialGradient(-2, -2, 0, 0, 0, 12);
  centerGrad.addColorStop(0, 'rgb(245, 243, 238)');
  centerGrad.addColorStop(0.5, 'rgb(230, 228, 222)');
  centerGrad.addColorStop(1, 'rgb(215, 213, 208)');
  ctx.fillStyle = centerGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, TWO_PI);
  ctx.fill();
  
  // Center dimple shadow
  stroke(190, 188, 182);
  strokeWeight(1);
  noFill();
  arc(0, 0, 20, 20, PI * 0.7, PI * 1.8);
  
  // Center dimple highlight
  stroke(255, 255, 252);
  arc(0, 0, 20, 20, -PI * 0.3, PI * 0.5);
  
  noStroke();
  
  // === SPECULAR HIGHLIGHTS (plastic shine) ===
  // Main highlight blob
  fill(255, 255, 255, 80);
  ellipse(-knobR * 0.28, -knobR * 0.28, knobR * 0.7, knobR * 0.5);
  
  // Sharp specular point
  fill(255, 255, 255, 150);
  ellipse(-knobR * 0.32, -knobR * 0.32, 6, 4);
  
  // Secondary highlight (rim)
  fill(255, 255, 255, 30);
  arc(0, 0, KNOB_SIZE - 4, KNOB_SIZE - 4, PI + 0.5, PI + 1.5);
  
  // === SUBTLE EDGE SHADOW (bottom-right) ===
  fill(0, 0, 0, 15);
  arc(0, 0, KNOB_SIZE - 2, KNOB_SIZE - 2, -0.3, PI * 0.6);
  
  pop();
}

function drawLogo() {
  // Classic Etch A Sketch logo - hyper-realistic raised plastic lettering
  let logoY = FRAME_PADDING + 32;
  let logoX = WIDTH / 2;
  
  push();
  translate(logoX, logoY);
  
  // === HYPER-REALISTIC RAISED PLASTIC TEXT ===
  // The real Etch A Sketch has raised white/cream plastic letters
  
  // Deep drop shadow (soft, below the letters)
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
  drawingContext.shadowBlur = 4;
  drawingContext.shadowOffsetX = 3;
  drawingContext.shadowOffsetY = 3;
  drawLogoText(0, 0, color(250, 235, 210));
  drawingContext.shadowColor = 'transparent';
  
  // Dark edge (bottom-right of raised letters)
  drawLogoText(1.5, 1.5, color(180, 140, 100));
  drawLogoText(1, 1, color(200, 170, 130));
  
  // Main letter face (cream/off-white plastic)
  drawLogoText(0, 0, color(255, 245, 225));
  
  // Top-left highlight edge (light catching raised edge)
  drawLogoText(-0.5, -0.5, color(255, 252, 245));
  
  // Bright specular on top edge
  drawLogoText(-0.8, -0.8, color(255, 255, 255, 100));
  
  pop();
}

function drawLogoText(offsetX, offsetY, col) {
  push();
  translate(offsetX, offsetY);
  
  stroke(col);
  strokeWeight(2.8);
  strokeCap(ROUND);
  strokeJoin(ROUND);
  noFill();
  
  let h = 20;      // letter height
  let w = 13;      // letter width
  let sp = 4;      // space between letters
  let wordGap = 16; // space between words
  
  // Calculate total width for centering
  let totalW = (4 * w + 3 * sp) + wordGap + w + wordGap + (6 * w + 5 * sp);
  let x = -totalW / 2;
  let y = 0;
  
  // === ETCH ===
  // E - with slight italic lean
  line(x + 2, y - h/2, x, y + h/2);           // vertical (slight lean)
  line(x + 2, y - h/2, x + w, y - h/2);       // top
  line(x + 1, y, x + w * 0.7, y);             // middle
  line(x, y + h/2, x + w, y + h/2);           // bottom
  x += w + sp;
  
  // t
  line(x + w/2 + 1, y - h/2, x + w/2 - 1, y + h/2); // vertical
  line(x, y - h/3, x + w, y - h/3);                  // cross
  x += w + sp;
  
  // c
  beginShape();
  vertex(x + w, y - h/2 + 3);
  vertex(x + w * 0.3, y - h/2);
  vertex(x, y);
  vertex(x + w * 0.3, y + h/2);
  vertex(x + w, y + h/2 - 3);
  endShape();
  x += w + sp;
  
  // h
  line(x + 2, y - h/2, x, y + h/2);           // left vertical
  line(x + 1, y, x + w - 1, y);               // middle bar
  line(x + w, y, x + w - 2, y + h/2);         // right vertical
  x += w + wordGap;
  
  // === A (larger, centered) ===
  let aW = w * 1.2;
  line(x, y + h/2, x + aW/2, y - h/2);        // left diagonal
  line(x + aW/2, y - h/2, x + aW, y + h/2);   // right diagonal
  line(x + aW * 0.2, y + h/6, x + aW * 0.8, y + h/6); // crossbar
  x += aW + wordGap;
  
  // === SKETCH ===
  // S
  beginShape();
  vertex(x + w, y - h/2 + 2);
  vertex(x + w * 0.3, y - h/2);
  vertex(x, y - h/4);
  vertex(x + w, y + h/4);
  vertex(x + w, y + h/2 - 2);
  vertex(x + w * 0.3, y + h/2);
  vertex(x, y + h/2 - 2);
  endShape();
  x += w + sp;
  
  // k
  line(x + 2, y - h/2, x, y + h/2);           // vertical
  line(x + w, y - h/2, x + 1, y);             // top diagonal
  line(x + 1, y, x + w, y + h/2);             // bottom diagonal
  x += w + sp;
  
  // e
  beginShape();
  vertex(x + w, y - 2);
  vertex(x, y);
  vertex(x + 2, y - h/2 + 2);
  vertex(x + w, y - h/2);
  endShape();
  beginShape();
  vertex(x, y);
  vertex(x, y + h/2);
  vertex(x + w, y + h/2 - 2);
  endShape();
  x += w + sp;
  
  // t
  line(x + w/2 + 1, y - h/2, x + w/2 - 1, y + h/2);
  line(x, y - h/3, x + w, y - h/3);
  x += w + sp;
  
  // c
  beginShape();
  vertex(x + w, y - h/2 + 3);
  vertex(x + w * 0.3, y - h/2);
  vertex(x, y);
  vertex(x + w * 0.3, y + h/2);
  vertex(x + w, y + h/2 - 3);
  endShape();
  x += w + sp;
  
  // h
  line(x + 2, y - h/2, x, y + h/2);
  line(x + 1, y, x + w - 1, y);
  line(x + w, y, x + w - 2, y + h/2);
  
  pop();
  
  // Registered trademark symbol
  push();
  translate(totalW/2 + 12, -8);
  stroke(col);
  strokeWeight(1);
  noFill();
  ellipse(0, 0, 10, 10);
  strokeWeight(1);
  // R inside
  line(-2.5, -3, -2.5, 3);
  line(-2.5, -3, 1.5, -3);
  line(1.5, -3, 1.5, 0);
  line(-2.5, 0, 1.5, 0);
  line(-2.5, 0, 2.5, 3);
  pop();
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day05', 'png');
  }
  if (key === ' ') {
    // Shake to erase!
    isShaking = true;
    shakeAmount = 20;
  }
  if (key === 'r' || key === 'R') {
    setup();
  }
}

function mousePressed() {
  // Click to shake!
  if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT) {
    isShaking = true;
    shakeAmount = 15;
  }
}
