// Day 5: Write Genuary
// Prompt: Write "Genuary". Avoid using a font.
// Concept: Fireflies slowly escape a mason jar and naturally spell GENUARY

let fireflies = [];
let letterPoints = [];
const word = "GENUARY";

// Letter definitions - hand-crafted pixel letters
const letterData = {
  G: [
    [1,0],[2,0],[3,0],
    [0,1],
    [0,2],
    [0,3],[2,3],[3,3],
    [0,4],[3,4],
    [0,5],[3,5],
    [1,6],[2,6],[3,6]
  ],
  E: [
    [0,0],[1,0],[2,0],[3,0],
    [0,1],
    [0,2],
    [0,3],[1,3],[2,3],
    [0,4],
    [0,5],
    [0,6],[1,6],[2,6],[3,6]
  ],
  N: [
    [0,0],[3,0],
    [0,1],[1,1],[3,1],
    [0,2],[1,2],[3,2],
    [0,3],[2,3],[3,3],
    [0,4],[2,4],[3,4],
    [0,5],[3,5],
    [0,6],[3,6]
  ],
  U: [
    [0,0],[3,0],
    [0,1],[3,1],
    [0,2],[3,2],
    [0,3],[3,3],
    [0,4],[3,4],
    [0,5],[3,5],
    [1,6],[2,6]
  ],
  A: [
    [1,0],[2,0],
    [0,1],[3,1],
    [0,2],[3,2],
    [0,3],[1,3],[2,3],[3,3],
    [0,4],[3,4],
    [0,5],[3,5],
    [0,6],[3,6]
  ],
  R: [
    [0,0],[1,0],[2,0],
    [0,1],[3,1],
    [0,2],[3,2],
    [0,3],[1,3],[2,3],
    [0,4],[2,4],
    [0,5],[3,5],
    [0,6],[3,6]
  ],
  Y: [
    [0,0],[4,0],
    [0,1],[4,1],
    [1,2],[3,2],
    [2,3],
    [2,4],
    [2,5],
    [2,6]
  ]
};

const letterWidths = { G: 4, E: 4, N: 4, U: 4, A: 4, R: 4, Y: 5 };

// Jar position and size
const jarX = 400;
const jarY = 580;
const jarWidth = 90;
const jarHeight = 120;

function setup() {
  createCanvas(800, 800);
  
  // Calculate letter positions in the sky
  const scale = 12;
  const letterGap = 2;
  
  let totalGridWidth = 0;
  for (let i = 0; i < word.length; i++) {
    totalGridWidth += letterWidths[word[i]];
    if (i < word.length - 1) totalGridWidth += letterGap;
  }
  
  const totalPixelWidth = totalGridWidth * scale;
  const startX = (width - totalPixelWidth) / 2;
  const startY = 150;
  
  let xOffset = 0;
  let fireflyIndex = 0;
  
  for (let i = 0; i < word.length; i++) {
    const letter = word[i];
    const points = letterData[letter];
    
    for (let p of points) {
      const x = startX + (xOffset + p[0]) * scale;
      const y = startY + p[1] * scale;
      letterPoints.push({ x, y, letterIndex: i });
      
      // Stagger release: each firefly leaves a bit after the previous
      // Faster release - quick burst of fireflies escaping for satisfying reveal
      const releaseDelay = 30 + fireflyIndex * 12 + random(0, 8);
      fireflies.push(new Firefly(x, y, fireflyIndex, releaseDelay));
      fireflyIndex++;
    }
    
    xOffset += letterWidths[letter] + letterGap;
  }
}

function draw() {
  drawBackground();
  drawScene();
  drawMasonJar();
  
  // Draw fireflies in jar first (behind glass)
  for (let f of fireflies) {
    if (f.state === 'inJar') {
      f.update();
      f.draw();
    }
  }
  
  // Draw jar glass overlay
  drawJarGlass();
  
  // Draw escaped fireflies (in front of everything)
  for (let f of fireflies) {
    if (f.state !== 'inJar') {
      f.update();
      f.draw();
    }
  }
}

function drawBackground() {
  // Night sky gradient
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(color(8, 12, 30), color(3, 5, 12), inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  // Moon
  noStroke();
  fill(255, 250, 240, 15);
  ellipse(680, 90, 90, 90);
  fill(255, 250, 240, 30);
  ellipse(680, 90, 60, 60);
  fill(255, 252, 245, 180);
  ellipse(680, 90, 40, 40);
  
  // Stars
  randomSeed(42);
  noStroke();
  for (let i = 0; i < 150; i++) {
    let x = random(width);
    let y = random(height * 0.8);
    let size = random(0.5, 1.8);
    let baseBright = random(80, 180);
    let twinkle = baseBright + sin(frameCount * 0.015 + i * 0.5) * 25;
    fill(255, 255, 250, twinkle);
    ellipse(x, y, size, size);
  }
  randomSeed(frameCount);
}

function drawScene() {
  // Ground - gentle hill
  noStroke();
  fill(8, 18, 12);
  beginShape();
  vertex(0, height);
  vertex(0, height - 80);
  bezierVertex(200, height - 100, 400, height - 90, 500, height - 85);
  bezierVertex(600, height - 80, 700, height - 95, 800, height - 75);
  vertex(800, height);
  endShape(CLOSE);
  
  // Grass blades
  randomSeed(99);
  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let baseY = height - 75 - sin(x * 0.01) * 15;
    let h = random(5, 18);
    let sway = sin(frameCount * 0.01 + x * 0.03) * 1.2;
    stroke(15, 35, 22, 150);
    strokeWeight(0.8);
    line(x, baseY, x + sway, baseY - h);
  }
  randomSeed(frameCount);
  
  // Distant trees - silhouettes
  fill(4, 10, 8);
  noStroke();
  drawTree(50, height - 90, 50, 180);
  drawTree(120, height - 85, 40, 140);
  drawTree(700, height - 80, 55, 190);
  drawTree(760, height - 85, 35, 130);
}

function drawTree(x, baseY, w, h) {
  triangle(x - w/2, baseY, x, baseY - h * 0.65, x + w/2, baseY);
  triangle(x - w/2 * 0.75, baseY - h * 0.3, x, baseY - h, x + w/2 * 0.75, baseY - h * 0.3);
}

function drawMasonJar() {
  push();
  translate(jarX, jarY);
  
  // Jar shadow
  fill(0, 0, 0, 25);
  noStroke();
  ellipse(0, jarHeight/2 + 8, jarWidth + 25, 18);
  
  // Jar body outline
  noFill();
  stroke(60, 100, 130, 35);
  strokeWeight(2);
  
  // Main body
  beginShape();
  vertex(-jarWidth/2 + 10, -jarHeight/2 + 15);
  bezierVertex(
    -jarWidth/2 - 3, -jarHeight/2 + 35,
    -jarWidth/2 - 3, jarHeight/2 - 25,
    -jarWidth/2 + 10, jarHeight/2
  );
  vertex(jarWidth/2 - 10, jarHeight/2);
  bezierVertex(
    jarWidth/2 + 3, jarHeight/2 - 25,
    jarWidth/2 + 3, -jarHeight/2 + 35,
    jarWidth/2 - 10, -jarHeight/2 + 15
  );
  endShape();
  
  // Neck
  stroke(60, 100, 130, 45);
  line(-jarWidth/2 + 10, -jarHeight/2 + 15, -jarWidth/2 + 20, -jarHeight/2 + 5);
  line(jarWidth/2 - 10, -jarHeight/2 + 15, jarWidth/2 - 20, -jarHeight/2 + 5);
  
  // Opening (no lid - open jar)
  stroke(80, 120, 150, 60);
  strokeWeight(2);
  arc(0, -jarHeight/2 + 5, jarWidth - 40, 10, PI, TWO_PI);
  
  pop();
}

function drawJarGlass() {
  push();
  translate(jarX, jarY);
  
  // Glass highlight
  noFill();
  stroke(255, 255, 255, 18);
  strokeWeight(4);
  beginShape();
  vertex(-jarWidth/2 + 15, -jarHeight/2 + 30);
  bezierVertex(
    -jarWidth/2 + 5, -jarHeight/2 + 60,
    -jarWidth/2 + 7, jarHeight/2 - 40,
    -jarWidth/2 + 15, jarHeight/2 - 10
  );
  endShape();
  
  // Small bright spot
  fill(255, 255, 255, 30);
  noStroke();
  ellipse(-jarWidth/2 + 20, -jarHeight/2 + 35, 6, 10);
  
  pop();
}

class Firefly {
  constructor(targetX, targetY, index, releaseFrame) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.index = index;
    this.releaseFrame = releaseFrame;
    
    // Start inside the jar - clustered near bottom
    this.x = jarX + random(-jarWidth/2 + 18, jarWidth/2 - 18);
    this.y = jarY + random(0, jarHeight/2 - 15);
    
    this.jarHomeX = this.x;
    this.jarHomeY = this.y;
    
    // Velocity - very gentle
    this.vx = 0;
    this.vy = 0;
    
    // Perlin noise offsets for natural movement
    this.noiseOffsetX = random(1000);
    this.noiseOffsetY = random(1000);
    this.noiseSpeed = random(0.003, 0.006);
    
    // Blink properties - fireflies blink slowly
    this.blinkOffset = random(TWO_PI);
    this.blinkSpeed = random(0.02, 0.035);
    this.isLit = true;
    this.nextBlinkChange = random(60, 180);
    this.blinkCounter = 0;
    
    // Trail - very subtle
    this.trail = [];
    this.maxTrail = 8;
    
    // State: 'inJar' -> 'rising' -> 'wandering' -> 'settling'
    this.state = 'inJar';
    
    // Wandering phase timer
    this.wanderTime = 0;
    this.wanderDuration = random(80, 180); // Shorter wander for faster reveal
    
    // Current movement target (for natural curved paths)
    this.waypoint = null;
    this.waypointTimer = 0;
  }
  
  update() {
    const currentFrame = frameCount;
    this.blinkCounter++;
    
    // Check if we're settled (close to target)
    let dx = this.targetX - this.x;
    let dy = this.targetY - this.y;
    let distToTarget = sqrt(dx * dx + dy * dy);
    this.isSettled = (this.state === 'settling' && distToTarget < 8);
    
    // Handle blinking - fireflies blink on and off, BUT stop blinking once settled
    if (this.isSettled) {
      // Once settled, stay fully lit - no more flickering!
      this.isLit = true;
    } else if (this.blinkCounter > this.nextBlinkChange) {
      this.isLit = !this.isLit;
      this.blinkCounter = 0;
      this.nextBlinkChange = this.isLit ? random(90, 200) : random(30, 80);
    }
    
    if (this.state === 'inJar') {
      // Gentle floating inside jar
      let t = currentFrame * 0.008;
      let wobbleX = sin(t + this.index * 0.7) * 5;
      let wobbleY = cos(t * 0.8 + this.index * 0.5) * 3;
      
      this.x = this.jarHomeX + wobbleX;
      this.y = this.jarHomeY + wobbleY;
      
      // Keep inside jar
      this.x = constrain(this.x, jarX - jarWidth/2 + 15, jarX + jarWidth/2 - 15);
      this.y = constrain(this.y, jarY - jarHeight/2 + 20, jarY + jarHeight/2 - 10);
      
      // Time to escape?
      if (currentFrame > this.releaseFrame) {
        this.state = 'rising';
        this.vx = random(-0.2, 0.2);
        this.vy = random(-0.3, -0.5); // Gentle upward drift
      }
    }
    
    else if (this.state === 'rising') {
      // Rise up out of the jar with purpose
      this.vy += -0.02; // Faster upward acceleration
      this.vy = constrain(this.vy, -1.5, 0);
      
      // Slight horizontal drift
      this.vx += (noise(this.noiseOffsetX) - 0.5) * 0.04;
      this.vx *= 0.97;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.noiseOffsetX += this.noiseSpeed;
      
      // Once above the jar, start wandering
      if (this.y < jarY - jarHeight/2 - 30) {
        this.state = 'wandering';
        this.wanderTime = 0;
        this.pickNewWaypoint();
      }
    }
    
    else if (this.state === 'wandering') {
      this.wanderTime++;
      this.waypointTimer++;
      
      // Pick new waypoints periodically for natural curved flight
      if (this.waypointTimer > random(80, 150) || this.waypoint === null) {
        this.pickNewWaypoint();
      }
      
      // Move toward waypoint with very gentle steering
      if (this.waypoint) {
        let dx = this.waypoint.x - this.x;
        let dy = this.waypoint.y - this.y;
        let dist = sqrt(dx * dx + dy * dy);
        
        if (dist > 5) {
          this.vx += (dx / dist) * 0.015;
          this.vy += (dy / dist) * 0.015;
        }
      }
      
      // Add perlin noise for organic movement
      let noiseX = (noise(this.noiseOffsetX) - 0.5) * 0.08;
      let noiseY = (noise(this.noiseOffsetY) - 0.5) * 0.08;
      
      this.vx += noiseX;
      this.vy += noiseY;
      
      // Speed limit and damping
      let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
      let maxSpeed = 0.6;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
      this.vx *= 0.985;
      this.vy *= 0.985;
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.noiseOffsetX += this.noiseSpeed;
      this.noiseOffsetY += this.noiseSpeed;
      
      // Keep on screen
      if (this.x < 50) this.vx += 0.02;
      if (this.x > width - 50) this.vx -= 0.02;
      if (this.y < 50) this.vy += 0.02;
      if (this.y > height - 150) this.vy -= 0.02;
      
      // After wandering enough, start settling toward target
      if (this.wanderTime > this.wanderDuration) {
        this.state = 'settling';
      }
    }
    
    else if (this.state === 'settling') {
      // Purposefully drift toward target - satisfying but not robotic
      let dx = this.targetX - this.x;
      let dy = this.targetY - this.y;
      let dist = sqrt(dx * dx + dy * dy);
      
      // Stronger pull for satisfying convergence
      let pullStrength = 0.012;
      if (dist < 80) pullStrength = 0.025;
      if (dist < 30) pullStrength = 0.04;
      
      this.vx += dx * pullStrength;
      this.vy += dy * pullStrength;
      
      // Reduced organic movement as they settle (more intentional)
      let noiseScale = map(dist, 0, 200, 0.01, 0.03);
      let noiseX = (noise(this.noiseOffsetX) - 0.5) * noiseScale;
      let noiseY = (noise(this.noiseOffsetY) - 0.5) * noiseScale;
      
      this.vx += noiseX;
      this.vy += noiseY;
      
      // Damping
      this.vx *= 0.92;
      this.vy *= 0.92;
      
      // Speed limit - allow faster movement
      let speed = sqrt(this.vx * this.vx + this.vy * this.vy);
      let maxSpeed = 1.2;
      if (speed > maxSpeed) {
        this.vx = (this.vx / speed) * maxSpeed;
        this.vy = (this.vy / speed) * maxSpeed;
      }
      
      this.x += this.vx;
      this.y += this.vy;
      
      this.noiseOffsetX += this.noiseSpeed * 0.7;
      this.noiseOffsetY += this.noiseSpeed * 0.7;
    }
    
    // Update trail
    if (this.state !== 'inJar') {
      this.trail.push({ x: this.x, y: this.y, age: 0 });
      if (this.trail.length > this.maxTrail) {
        this.trail.shift();
      }
      // Age trail points
      for (let t of this.trail) {
        t.age++;
      }
    }
  }
  
  pickNewWaypoint() {
    this.waypointTimer = 0;
    // Pick a random point in the upper portion of the screen
    // Bias slightly toward the target area over time
    let bias = min(this.wanderTime / this.wanderDuration, 0.5);
    
    let randomX = random(100, width - 100);
    let randomY = random(80, height - 200);
    
    this.waypoint = {
      x: lerp(randomX, this.targetX, bias * 0.3),
      y: lerp(randomY, this.targetY, bias * 0.3)
    };
  }
  
  draw() {
    // Firefly glow intensity
    let glowIntensity = this.isLit ? 1 : 0.15;
    
    // Soft pulsing when lit - BUT steady glow when settled
    if (this.isLit && !this.isSettled) {
      let pulse = sin(frameCount * this.blinkSpeed + this.blinkOffset);
      glowIntensity = map(pulse, -1, 1, 0.7, 1);
    } else if (this.isSettled) {
      // Settled fireflies have a steady, full glow
      glowIntensity = 1;
    }
    
    // Dimmer in jar
    if (this.state === 'inJar') {
      glowIntensity *= 0.6;
    }
    
    let alpha = glowIntensity * 255;
    let coreSize = 2.5; // Small core
    let glowSize = 6 + glowIntensity * 4; // Smaller glow
    
    // Draw subtle trail
    if (this.state !== 'inJar' && this.isLit) {
      for (let i = 0; i < this.trail.length; i++) {
        let t = this.trail[i];
        let trailAlpha = map(i, 0, this.trail.length, 0, alpha * 0.08);
        let trailSize = map(i, 0, this.trail.length, 0.5, 2);
        
        fill(140, 230, 80, trailAlpha);
        noStroke();
        ellipse(t.x, t.y, trailSize, trailSize);
      }
    }
    
    noStroke();
    
    // Outer glow - very soft
    fill(130, 220, 70, alpha * 0.06);
    ellipse(this.x, this.y, glowSize * 4, glowSize * 4);
    
    fill(140, 230, 80, alpha * 0.12);
    ellipse(this.x, this.y, glowSize * 2.5, glowSize * 2.5);
    
    // Middle glow
    fill(160, 240, 90, alpha * 0.25);
    ellipse(this.x, this.y, glowSize * 1.5, glowSize * 1.5);
    
    // Inner glow
    fill(180, 250, 120, alpha * 0.5);
    ellipse(this.x, this.y, glowSize * 0.8, glowSize * 0.8);
    
    // Bright core - tiny
    fill(220, 255, 180, alpha);
    ellipse(this.x, this.y, coreSize, coreSize);
  }
}
