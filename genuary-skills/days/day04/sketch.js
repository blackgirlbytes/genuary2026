// Genuary 2026 - Day 04
// Prompt: Lowres
// "Glitch Between Worlds" - A side-scrolling scene split between 8-bit retro and modern HD

const WIDTH = 800;
const HEIGHT = 600;

// Pixel size for retro side
const PIXEL_SIZE = 8;

// Game elements
let player;
let platforms = [];
let clouds = [];
let coins = [];
let particles = [];
let trees = [];

// Glitch boundary
let boundaryX;
let boundaryWave = 0;

// NES-inspired palette for retro side
const retroPalette = {
  sky: [92, 148, 252],      // NES sky blue
  ground: [0, 168, 0],       // NES grass green
  dirt: [188, 124, 68],      // NES brown
  player: [252, 152, 56],    // NES orange
  cloud: [252, 252, 252],    // White
  coin: [252, 188, 60],      // Gold
  tree: [0, 120, 0],         // Dark green
  trunk: [136, 84, 24],      // Brown
};

// Modern palette - richer gradients
const modernPalette = {
  skyTop: [135, 206, 250],
  skyBottom: [255, 182, 193],
  ground: [34, 139, 34],
  groundHighlight: [50, 205, 50],
  player: [255, 107, 107],
  playerGlow: [255, 182, 193],
  cloud: [255, 255, 255],
  coin: [255, 215, 0],
  coinGlow: [255, 255, 150],
};

function setup() {
  let canvas = createCanvas(WIDTH, HEIGHT);
  canvas.parent('sketch-container');
  
  boundaryX = WIDTH / 2;
  
  // Create player
  player = {
    x: WIDTH * 0.3,
    y: HEIGHT - 150,
    w: 32,
    h: 48,
    vy: 0,
    frame: 0,
    runCycle: 0,
  };
  
  // Create platforms
  platforms = [
    { x: 0, y: HEIGHT - 80, w: WIDTH, h: 80 }, // Ground
    { x: 150, y: HEIGHT - 180, w: 120, h: 24 },
    { x: 350, y: HEIGHT - 250, w: 100, h: 24 },
    { x: 550, y: HEIGHT - 200, w: 130, h: 24 },
    { x: 680, y: HEIGHT - 300, w: 100, h: 24 },
  ];
  
  // Create clouds
  clouds = [];
  for (let i = 0; i < 6; i++) {
    clouds.push({
      x: random(WIDTH),
      y: random(50, 180),
      size: random(60, 120),
      speed: random(0.2, 0.5),
    });
  }
  
  // Create coins
  coins = [];
  for (let i = 0; i < 8; i++) {
    coins.push({
      x: random(100, WIDTH - 100),
      y: random(150, HEIGHT - 200),
      size: 24,
      rotation: random(TWO_PI),
      bobOffset: random(TWO_PI),
    });
  }
  
  // Create trees
  trees = [];
  for (let i = 0; i < 5; i++) {
    trees.push({
      x: random(50, WIDTH - 50),
      y: HEIGHT - 80,
      height: random(80, 150),
    });
  }
}

function draw() {
  // Animate boundary wave
  boundaryWave = sin(frameCount * 0.03) * 30;
  
  // Draw everything twice - once for each side
  drawScene();
  
  // Draw glitch boundary
  drawGlitchBoundary();
  
  // Update game elements
  updatePlayer();
  updateClouds();
  updateCoins();
  
  // Add occasional glitch particles
  if (frameCount % 5 === 0) {
    addGlitchParticle();
  }
  updateParticles();
}

function drawScene() {
  // === RETRO SIDE (left) ===
  push();
  // Clip to left side
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(0, 0, boundaryX + boundaryWave, HEIGHT);
  drawingContext.clip();
  
  drawRetroSky();
  drawRetroClouds();
  drawRetroTrees();
  drawRetroPlatforms();
  drawRetroCoins();
  drawRetroPlayer();
  
  // Scanlines for retro feel
  drawScanlines();
  
  drawingContext.restore();
  pop();
  
  // === MODERN SIDE (right) ===
  push();
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(boundaryX + boundaryWave, 0, WIDTH - boundaryX - boundaryWave, HEIGHT);
  drawingContext.clip();
  
  drawModernSky();
  drawModernClouds();
  drawModernTrees();
  drawModernPlatforms();
  drawModernCoins();
  drawModernPlayer();
  
  drawingContext.restore();
  pop();
}

// ========== RETRO DRAWING FUNCTIONS ==========

function drawRetroSky() {
  background(retroPalette.sky);
}

function pixelRect(x, y, w, h, col) {
  fill(col);
  noStroke();
  // Snap to pixel grid
  let px = floor(x / PIXEL_SIZE) * PIXEL_SIZE;
  let py = floor(y / PIXEL_SIZE) * PIXEL_SIZE;
  let pw = ceil(w / PIXEL_SIZE) * PIXEL_SIZE;
  let ph = ceil(h / PIXEL_SIZE) * PIXEL_SIZE;
  rect(px, py, pw, ph);
}

function drawRetroClouds() {
  for (let cloud of clouds) {
    drawRetroCloud(cloud.x, cloud.y, cloud.size);
  }
}

function drawRetroCloud(x, y, size) {
  fill(retroPalette.cloud);
  noStroke();
  let ps = PIXEL_SIZE;
  let s = floor(size / ps) * ps;
  
  // Blocky cloud shape
  rect(floor((x - s/4) / ps) * ps, floor(y / ps) * ps, s/2, ps * 2);
  rect(floor((x - s/2) / ps) * ps, floor((y + ps) / ps) * ps, s, ps * 2);
  rect(floor((x - s/3) / ps) * ps, floor((y + ps*3) / ps) * ps, s/1.5, ps);
}

function drawRetroTrees() {
  for (let tree of trees) {
    drawRetroTree(tree.x, tree.y, tree.height);
  }
}

function drawRetroTree(x, y, h) {
  let ps = PIXEL_SIZE;
  // Trunk
  fill(retroPalette.trunk);
  noStroke();
  let trunkW = ps * 2;
  let trunkH = h * 0.4;
  rect(floor((x - trunkW/2) / ps) * ps, floor((y - trunkH) / ps) * ps, trunkW, trunkH);
  
  // Foliage - blocky triangle
  fill(retroPalette.tree);
  let levels = 3;
  for (let i = 0; i < levels; i++) {
    let levelY = y - trunkH - (i * h * 0.2);
    let levelW = (levels - i) * ps * 3;
    rect(floor((x - levelW/2) / ps) * ps, floor(levelY / ps) * ps, levelW, ps * 3);
  }
}

function drawRetroPlatforms() {
  for (let plat of platforms) {
    // Grass top
    fill(retroPalette.ground);
    noStroke();
    let ps = PIXEL_SIZE;
    rect(floor(plat.x / ps) * ps, floor(plat.y / ps) * ps, 
         ceil(plat.w / ps) * ps, ps * 2);
    
    // Dirt below
    fill(retroPalette.dirt);
    rect(floor(plat.x / ps) * ps, floor((plat.y + ps * 2) / ps) * ps, 
         ceil(plat.w / ps) * ps, ceil((plat.h - ps * 2) / ps) * ps);
  }
}

function drawRetroCoins() {
  for (let coin of coins) {
    let bob = sin(frameCount * 0.1 + coin.bobOffset) * 4;
    fill(retroPalette.coin);
    noStroke();
    let ps = PIXEL_SIZE;
    let cx = floor(coin.x / ps) * ps;
    let cy = floor((coin.y + bob) / ps) * ps;
    // Simple square coin
    rect(cx - ps, cy - ps, ps * 2, ps * 2);
    // Shine pixel
    fill(255);
    rect(cx - ps, cy - ps, ps, ps);
  }
}

function drawRetroPlayer() {
  let ps = PIXEL_SIZE;
  let px = floor(player.x / ps) * ps;
  let py = floor(player.y / ps) * ps;
  
  // Running animation
  player.runCycle += 0.15;
  let legOffset = sin(player.runCycle) * ps;
  
  // Body
  fill(retroPalette.player);
  noStroke();
  rect(px, py, ps * 3, ps * 4);
  
  // Head
  fill(252, 200, 160); // Skin tone
  rect(px, py - ps * 2, ps * 3, ps * 2);
  
  // Eyes
  fill(0);
  rect(px + ps * 2, py - ps * 1.5, ps * 0.5, ps * 0.5);
  
  // Legs
  fill(70, 70, 200); // Blue pants
  rect(px, py + ps * 4, ps, ps * 2 + legOffset);
  rect(px + ps * 2, py + ps * 4, ps, ps * 2 - legOffset);
}

function drawScanlines() {
  stroke(0, 30);
  for (let y = 0; y < HEIGHT; y += 4) {
    line(0, y, boundaryX + boundaryWave, y);
  }
}

// ========== MODERN DRAWING FUNCTIONS ==========

function drawModernSky() {
  // Gradient sky
  for (let y = 0; y < HEIGHT; y++) {
    let inter = map(y, 0, HEIGHT, 0, 1);
    let c = lerpColor(
      color(modernPalette.skyTop),
      color(modernPalette.skyBottom),
      inter
    );
    stroke(c);
    line(0, y, WIDTH, y);
  }
}

function drawModernClouds() {
  for (let cloud of clouds) {
    drawModernCloud(cloud.x, cloud.y, cloud.size);
  }
}

function drawModernCloud(x, y, size) {
  noStroke();
  // Soft, fluffy cloud with multiple ellipses
  fill(255, 255, 255, 200);
  ellipse(x, y, size * 0.8, size * 0.5);
  ellipse(x - size * 0.3, y + size * 0.1, size * 0.6, size * 0.4);
  ellipse(x + size * 0.3, y + size * 0.05, size * 0.7, size * 0.45);
  ellipse(x - size * 0.1, y - size * 0.15, size * 0.5, size * 0.35);
  
  // Highlight
  fill(255, 255, 255, 100);
  ellipse(x - size * 0.1, y - size * 0.1, size * 0.4, size * 0.25);
}

function drawModernTrees() {
  for (let tree of trees) {
    drawModernTree(tree.x, tree.y, tree.height);
  }
}

function drawModernTree(x, y, h) {
  // Trunk with gradient
  let trunkW = 16;
  let trunkH = h * 0.4;
  
  noStroke();
  for (let i = 0; i < trunkW; i++) {
    let inter = map(i, 0, trunkW, 0, 1);
    fill(lerpColor(color(101, 67, 33), color(139, 90, 43), inter));
    rect(x - trunkW/2 + i, y - trunkH, 1, trunkH);
  }
  
  // Foliage - soft layered circles
  let foliageY = y - trunkH;
  fill(34, 139, 34, 200);
  ellipse(x, foliageY - h * 0.3, h * 0.6, h * 0.5);
  fill(50, 205, 50, 180);
  ellipse(x - h * 0.15, foliageY - h * 0.2, h * 0.4, h * 0.35);
  ellipse(x + h * 0.15, foliageY - h * 0.25, h * 0.45, h * 0.4);
  fill(144, 238, 144, 150);
  ellipse(x, foliageY - h * 0.4, h * 0.3, h * 0.25);
}

function drawModernPlatforms() {
  for (let plat of platforms) {
    // Ground with gradient
    noStroke();
    for (let y = 0; y < plat.h; y++) {
      let inter = map(y, 0, plat.h, 0, 1);
      if (y < 15) {
        // Grass layer
        fill(lerpColor(color(124, 252, 0), color(34, 139, 34), inter * 3));
      } else {
        // Dirt layer
        fill(lerpColor(color(139, 90, 43), color(101, 67, 33), inter));
      }
      rect(plat.x, plat.y + y, plat.w, 1);
    }
    
    // Grass blades on top
    stroke(50, 205, 50);
    strokeWeight(2);
    for (let gx = plat.x; gx < plat.x + plat.w; gx += 8) {
      let gh = random(5, 12);
      let sway = sin(frameCount * 0.05 + gx * 0.1) * 3;
      line(gx, plat.y, gx + sway, plat.y - gh);
    }
  }
}

function drawModernCoins() {
  for (let coin of coins) {
    let bob = sin(frameCount * 0.1 + coin.bobOffset) * 6;
    let shimmer = map(sin(frameCount * 0.15 + coin.bobOffset), -1, 1, 0.7, 1);
    
    // Glow
    noStroke();
    fill(255, 215, 0, 50);
    ellipse(coin.x, coin.y + bob, coin.size * 2, coin.size * 2);
    
    // Coin body
    fill(255, 215 * shimmer, 0);
    ellipse(coin.x, coin.y + bob, coin.size, coin.size);
    
    // Shine
    fill(255, 255, 200, 200);
    ellipse(coin.x - coin.size * 0.2, coin.y + bob - coin.size * 0.2, coin.size * 0.3, coin.size * 0.3);
    
    // Sparkles
    if (frameCount % 20 < 10) {
      stroke(255, 255, 200);
      strokeWeight(2);
      let sparkleX = coin.x + cos(frameCount * 0.2) * coin.size;
      let sparkleY = coin.y + bob + sin(frameCount * 0.2) * coin.size * 0.5;
      point(sparkleX, sparkleY);
    }
  }
}

function drawModernPlayer() {
  push();
  translate(player.x + player.w/2, player.y + player.h/2);
  
  // Running animation
  player.runCycle += 0.15;
  let legSwing = sin(player.runCycle) * 0.4;
  let armSwing = sin(player.runCycle + PI) * 0.3;
  let bounce = abs(sin(player.runCycle)) * 3;
  
  translate(0, -bounce);
  
  // Glow effect
  noStroke();
  fill(255, 107, 107, 30);
  ellipse(0, 0, player.w * 2.5, player.h * 1.5);
  
  // Legs
  push();
  fill(70, 100, 200);
  // Back leg
  push();
  rotate(legSwing);
  roundedRect(-6, 10, 10, 28, 4);
  pop();
  // Front leg
  push();
  rotate(-legSwing);
  roundedRect(2, 10, 10, 28, 4);
  pop();
  pop();
  
  // Body
  fill(255, 107, 107);
  roundedRect(-12, -15, 24, 30, 6);
  
  // Body highlight
  fill(255, 150, 150, 150);
  roundedRect(-10, -13, 10, 15, 4);
  
  // Arms
  fill(252, 200, 160);
  push();
  rotate(armSwing);
  roundedRect(-18, -10, 8, 20, 3);
  pop();
  push();
  rotate(-armSwing);
  roundedRect(10, -10, 8, 20, 3);
  pop();
  
  // Head
  fill(252, 210, 180);
  ellipse(0, -28, 26, 28);
  
  // Hair
  fill(60, 40, 30);
  arc(0, -32, 26, 20, PI, TWO_PI);
  
  // Eyes
  fill(255);
  ellipse(4, -30, 10, 10);
  fill(60, 40, 30);
  ellipse(5, -29, 5, 5);
  fill(255);
  ellipse(6, -30, 2, 2);
  
  // Smile
  noFill();
  stroke(200, 100, 100);
  strokeWeight(2);
  arc(2, -24, 10, 8, 0.2, PI - 0.2);
  
  pop();
}

function roundedRect(x, y, w, h, r) {
  rect(x, y, w, h, r);
}

// ========== GLITCH BOUNDARY ==========

function drawGlitchBoundary() {
  let bx = boundaryX + boundaryWave;
  
  // RGB split effect
  stroke(255, 0, 0, 100);
  strokeWeight(3);
  line(bx - 4, 0, bx - 4, HEIGHT);
  
  stroke(0, 255, 0, 100);
  line(bx, 0, bx, HEIGHT);
  
  stroke(0, 0, 255, 100);
  line(bx + 4, 0, bx + 4, HEIGHT);
  
  // Glitch blocks
  noStroke();
  for (let i = 0; i < 10; i++) {
    let gy = random(HEIGHT);
    let gh = random(5, 20);
    let gw = random(10, 40);
    let gx = bx - gw/2 + random(-20, 20);
    
    // Random glitch color
    if (random() > 0.5) {
      fill(random([
        color(255, 0, 128, 150),
        color(0, 255, 255, 150),
        color(255, 255, 0, 150),
      ]));
      rect(gx, gy, gw, gh);
    }
  }
  
  // Scanline glitches at boundary
  stroke(255, 255, 255, 50);
  strokeWeight(1);
  for (let y = 0; y < HEIGHT; y += random(20, 50)) {
    if (random() > 0.7) {
      let offset = random(-30, 30);
      line(bx + offset - 20, y, bx + offset + 20, y);
    }
  }
  
  // Draw particles
  for (let p of particles) {
    fill(p.col);
    noStroke();
    rect(p.x, p.y, p.size, p.size);
  }
}

function addGlitchParticle() {
  let bx = boundaryX + boundaryWave;
  particles.push({
    x: bx + random(-20, 20),
    y: random(HEIGHT),
    vx: random(-2, 2),
    vy: random(-3, -1),
    size: random(3, 8),
    life: 60,
    col: color(random([255, 0]), random([255, 0]), random([255, 0]), 200),
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

// ========== UPDATES ==========

function updatePlayer() {
  // Gentle bobbing motion
  player.y = HEIGHT - 150 + sin(frameCount * 0.05) * 5;
  
  // Move across screen
  player.x += 1.5;
  if (player.x > WIDTH + 50) {
    player.x = -50;
  }
}

function updateClouds() {
  for (let cloud of clouds) {
    cloud.x -= cloud.speed;
    if (cloud.x < -cloud.size) {
      cloud.x = WIDTH + cloud.size;
      cloud.y = random(50, 180);
    }
  }
}

function updateCoins() {
  // Coins just bob in place (handled in draw)
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day04', 'png');
  }
}
