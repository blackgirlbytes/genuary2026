// Genuary Day 4: Lowres
// "Starry Night, Deconstructed" - Half pixelated sky, half crisp details

let stars = [];
let time = 0;

function setup() {
  createCanvas(800, 800);
  
  // Generate stars
  for (let i = 0; i < 80; i++) {
    stars.push({
      x: random(width),
      y: random(height * 0.65),
      size: random(2, 6),
      twinkleSpeed: random(0.02, 0.08),
      twinkleOffset: random(TWO_PI),
      brightness: random(200, 255)
    });
  }
  
  noSmooth();
}

function draw() {
  time = frameCount * 0.01;
  background(20, 25, 50);
  
  // Draw progressive resolution sky - pixel by pixel with varying size
  drawProgressiveSky();
  
  // Draw crisp landscape on top
  drawLandscape();
  
  // Draw crisp, glowing stars that pierce through
  drawStars();
  
  // Draw the iconic crescent moon - crisp and glowing
  drawMoon();
}

function drawProgressiveSky() {
  let skyHeight = height * 0.75;
  
  // Draw sky with gradually changing pixel sizes
  // Top: big pixels (50px), Bottom: small pixels (4px)
  let maxPixelSize = 50;
  let minPixelSize = 3;
  
  noStroke();
  
  // We'll draw rows of pixels, each row having a pixel size based on y position
  let y = 0;
  while (y < skyHeight) {
    // Calculate pixel size based on y position (top = big, bottom = small)
    // Use easing for smoother transition
    let t = y / skyHeight;
    let eased = t * t; // Quadratic easing - starts slow, speeds up
    let pixelSize = lerp(maxPixelSize, minPixelSize, eased);
    pixelSize = max(pixelSize, minPixelSize);
    
    // Draw a row of pixels at this size
    for (let x = 0; x < width; x += pixelSize) {
      // Get color for this pixel center
      let nx = (x + pixelSize/2) / width;
      let ny = (y + pixelSize/2) / skyHeight;
      
      let c = getSkyColor(nx, ny);
      fill(c);
      rect(x, y, pixelSize + 1, pixelSize + 1); // +1 to avoid gaps
    }
    
    y += pixelSize;
  }
}

function getSkyColor(nx, ny) {
  // Big dramatic swirls like Van Gogh
  let swirl1 = getSwirl(nx, ny, 0.25, 0.3, time, 8);
  let swirl2 = getSwirl(nx, ny, 0.55, 0.25, time * 0.8, 10);
  let swirl3 = getSwirl(nx, ny, 0.8, 0.2, time * 1.2, 6);
  
  // Wave pattern across the sky
  let wave = sin(nx * 12 + ny * 4 + time) * 0.3;
  
  let swirlValue = (swirl1 + swirl2 * 1.2 + swirl3 * 0.8) / 2.5 + wave * 0.3;
  swirlValue = constrain(swirlValue, 0, 1);
  
  // Color palette inspired by Starry Night
  let deepBlue = color(15, 20, 60);
  let midBlue = color(40, 70, 130);
  let brightBlue = color(70, 120, 180);
  let cyan = color(100, 160, 200);
  let yellow = color(220, 200, 100);
  
  let c;
  if (swirlValue < 0.25) {
    c = lerpColor(deepBlue, midBlue, map(swirlValue, 0, 0.25, 0, 1));
  } else if (swirlValue < 0.5) {
    c = lerpColor(midBlue, brightBlue, map(swirlValue, 0.25, 0.5, 0, 1));
  } else if (swirlValue < 0.75) {
    c = lerpColor(brightBlue, cyan, map(swirlValue, 0.5, 0.75, 0, 1));
  } else {
    c = lerpColor(cyan, yellow, map(swirlValue, 0.75, 1, 0, 0.6));
  }
  
  return c;
}

function getSwirl(x, y, cx, cy, t, intensity) {
  let dx = x - cx;
  let dy = y - cy;
  let dist = sqrt(dx * dx + dy * dy);
  let angle = atan2(dy, dx);
  
  let swirl = sin(angle * 2.5 + dist * intensity - t * 2.5) * 0.5 + 0.5;
  swirl *= exp(-dist * 3);
  
  return swirl;
}

function drawLandscape() {
  // Rolling hills - smooth and crisp
  noStroke();
  
  // Distant hills (darker)
  fill(20, 35, 25);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height * 0.7 + sin(x * 0.008 + 1) * 40 + sin(x * 0.02) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Middle hills
  fill(15, 45, 30);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height * 0.78 + sin(x * 0.01 + 2) * 35 + sin(x * 0.025) * 15;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Foreground hill
  fill(10, 55, 35);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 10) {
    let y = height * 0.85 + sin(x * 0.012) * 25 + sin(x * 0.03 + 1) * 10;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Iconic cypress tree (like in Starry Night) - smooth and detailed
  drawCypressTree(150, height * 0.85, 60, 280);
  drawCypressTree(100, height * 0.88, 35, 180);
  
  // Small village houses
  drawVillage();
}

function drawCypressTree(x, baseY, w, h) {
  // Dark, flame-like cypress tree
  fill(10, 30, 20);
  noStroke();
  
  beginShape();
  // Base
  vertex(x - w * 0.3, baseY);
  
  // Left side with wavy edges
  for (let i = 0; i <= 20; i++) {
    let t = i / 20;
    let ty = baseY - h * t;
    let wave = sin(t * 15 + time * 2) * (w * 0.15 * (1 - t));
    let tx = x - w * 0.4 * (1 - t * 0.9) + wave;
    vertex(tx, ty);
  }
  
  // Tip
  vertex(x, baseY - h);
  
  // Right side with wavy edges
  for (let i = 20; i >= 0; i--) {
    let t = i / 20;
    let ty = baseY - h * t;
    let wave = sin(t * 15 + time * 2 + PI) * (w * 0.15 * (1 - t));
    let tx = x + w * 0.4 * (1 - t * 0.9) + wave;
    vertex(tx, ty);
  }
  
  vertex(x + w * 0.3, baseY);
  endShape(CLOSE);
}

function drawVillage() {
  // Small houses in the distance
  let housePositions = [
    {x: 350, y: height * 0.76, w: 30, h: 25},
    {x: 400, y: height * 0.74, w: 25, h: 20},
    {x: 450, y: height * 0.75, w: 35, h: 28},
    {x: 520, y: height * 0.73, w: 28, h: 22},
    {x: 580, y: height * 0.76, w: 32, h: 26},
    {x: 650, y: height * 0.74, w: 25, h: 20},
  ];
  
  for (let house of housePositions) {
    // House body
    fill(60, 50, 45);
    rect(house.x, house.y, house.w, house.h);
    
    // Roof
    fill(80, 40, 30);
    triangle(
      house.x - 5, house.y,
      house.x + house.w / 2, house.y - house.h * 0.6,
      house.x + house.w + 5, house.y
    );
    
    // Window with warm glow
    fill(255, 220, 100, 200);
    let winSize = house.w * 0.25;
    rect(house.x + house.w * 0.3, house.y + house.h * 0.3, winSize, winSize);
  }
  
  // Church steeple
  fill(50, 45, 40);
  rect(480, height * 0.68, 20, 50);
  triangle(475, height * 0.68, 490, height * 0.58, 505, height * 0.68);
}

function drawStars() {
  for (let star of stars) {
    // Twinkle effect
    let twinkle = sin(frameCount * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
    let alpha = star.brightness * twinkle;
    
    // Outer glow
    noStroke();
    for (let i = 3; i > 0; i--) {
      fill(255, 250, 200, alpha * 0.2 / i);
      ellipse(star.x, star.y, star.size * i * 2, star.size * i * 2);
    }
    
    // Crisp star center
    fill(255, 255, 240, alpha);
    ellipse(star.x, star.y, star.size, star.size);
    
    // Star points (4-pointed)
    stroke(255, 255, 240, alpha * 0.8);
    strokeWeight(1);
    let pointLen = star.size * 1.5;
    line(star.x - pointLen, star.y, star.x + pointLen, star.y);
    line(star.x, star.y - pointLen, star.x, star.y + pointLen);
  }
}

function drawMoon() {
  let moonX = 650;
  let moonY = 120;
  let moonSize = 60;
  
  // Outer glow layers
  noStroke();
  for (let i = 5; i > 0; i--) {
    let glowAlpha = map(i, 5, 1, 20, 60);
    fill(255, 240, 150, glowAlpha);
    ellipse(moonX, moonY, moonSize + i * 25, moonSize + i * 25);
  }
  
  // Moon body - crescent
  fill(255, 250, 200);
  ellipse(moonX, moonY, moonSize, moonSize);
  
  // Cut out for crescent effect
  fill(50, 80, 140); // Match sky color
  ellipse(moonX + 15, moonY - 5, moonSize * 0.8, moonSize * 0.8);
  
  // Bright edge
  noFill();
  stroke(255, 255, 220, 200);
  strokeWeight(2);
  arc(moonX, moonY, moonSize, moonSize, PI * 0.6, PI * 1.4);
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day04_starry_night_lowres', 'png');
  }
}
