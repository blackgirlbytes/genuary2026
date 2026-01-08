// Day 6: Lights on/off - "The Night Shift" v2
// A cozy late-night diner scene that reveals cosmic secrets in the dark

let lightsOn = true;
let transition = 1; // 1 = lights on, 0 = lights off
let transitionSpeed = 0.025;

// Particle systems
let steamParticles = [];
let magicParticles = [];
let galaxyStars = [];

// Animation
let time = 0;
let catPurr = 0;

// Colors
let warmLight, coolNight;

function setup() {
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Initialize steam particles
  for (let i = 0; i < 25; i++) {
    steamParticles.push(createSteamParticle());
  }
  
  // Initialize magic particles
  for (let i = 0; i < 40; i++) {
    magicParticles.push(createMagicParticle());
  }
  
  // Initialize galaxy stars
  for (let i = 0; i < 100; i++) {
    galaxyStars.push({
      angle: random(TWO_PI),
      radius: random(3, 35),
      size: random(0.5, 2.5),
      speed: random(0.008, 0.025),
      layer: floor(random(3)),
      twinkle: random(1000),
      hue: random([200, 280, 320, 45]) // blues, purples, pinks, gold
    });
  }
}

function createSteamParticle() {
  return {
    x: random(-15, 15),
    y: random(-10, 30),
    vx: 0,
    vy: random(-0.4, -0.8),
    size: random(8, 20),
    life: random(100),
    maxLife: 100,
    wobbleOffset: random(1000)
  };
}

function createMagicParticle() {
  return {
    x: random(-20, 20),
    y: random(-5, 40),
    vx: random(-0.3, 0.3),
    vy: random(-0.5, -1.2),
    size: random(3, 8),
    life: random(150),
    maxLife: 150,
    hue: random([180, 200, 280, 320]), // cyans, blues, purples, magentas
    trail: []
  };
}

function draw() {
  time = frameCount * 0.01;
  catPurr = sin(frameCount * 0.05) * 2;
  
  // Smooth transition
  if (lightsOn && transition < 1) {
    transition = min(1, transition + transitionSpeed);
  } else if (!lightsOn && transition > 0) {
    transition = max(0, transition - transitionSpeed);
  }
  
  drawBackground();
  drawWindow();
  drawCounter();
  drawCoffeeCup();
  drawCat();
  drawAmbientLight();
  drawInstructions();
}

function drawBackground() {
  // Gradient from warm cream to deep night
  let topHue = lerp(230, 40, transition);
  let topSat = lerp(50, 20, transition);
  let topBri = lerp(8, 85, transition);
  
  let botHue = lerp(240, 35, transition);
  let botSat = lerp(40, 25, transition);
  let botBri = lerp(15, 75, transition);
  
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height * 0.65, 0, 1);
    let h = lerp(topHue, botHue, inter);
    let s = lerp(topSat, botSat, inter);
    let b = lerp(topBri, botBri, inter);
    stroke(h, s, b);
    line(0, y, width, y);
  }
}

function drawWindow() {
  push();
  translate(600, 180);
  
  // Window frame
  let frameBri = lerp(20, 45, transition);
  fill(30, 30, frameBri);
  noStroke();
  rect(-90, -100, 180, 200, 5);
  
  // Window glass - shows outside
  let glassBri = lerp(12, 70, transition);
  fill(220, lerp(60, 20, transition), glassBri);
  rect(-80, -90, 160, 180, 3);
  
  // City skyline (day) or starry sky (night)
  if (transition < 0.8) {
    // Stars appear
    let starAlpha = map(transition, 0.8, 0, 0, 100);
    for (let i = 0; i < 20; i++) {
      let sx = -70 + (i * 37) % 140;
      let sy = -80 + (i * 23) % 100;
      let twinkle = sin(frameCount * 0.1 + i) * 0.3 + 0.7;
      fill(45, 20, 100, starAlpha * twinkle);
      let starSize = (i % 3) + 1;
      ellipse(sx, sy, starSize, starSize);
    }
    
    // Moon
    fill(45, 15, 95, starAlpha);
    ellipse(40, -50, 30, 30);
    fill(220, 60, 12, starAlpha * 0.7);
    ellipse(48, -55, 22, 22);
  }
  
  // City buildings silhouette
  fill(lerp(250, 30, transition), lerp(30, 20, transition), lerp(15, 40, transition));
  noStroke();
  // Building shapes
  rect(-75, 40, 25, 50);
  rect(-45, 20, 20, 70);
  rect(-20, 50, 30, 40);
  rect(15, 10, 25, 80);
  rect(45, 35, 30, 55);
  
  // Window lights in buildings (brighter at night!)
  let windowGlow = lerp(90, 30, transition);
  fill(40, 70, windowGlow, lerp(90, 40, transition));
  // Scattered windows
  rect(-70, 50, 4, 4); rect(-62, 55, 4, 4); rect(-66, 65, 4, 4);
  rect(-40, 30, 4, 5); rect(-40, 45, 4, 5); rect(-32, 38, 4, 5);
  rect(-10, 58, 5, 4); rect(0, 65, 5, 4);
  rect(22, 20, 4, 5); rect(30, 35, 4, 5); rect(22, 50, 4, 5); rect(30, 65, 4, 5);
  rect(52, 45, 5, 4); rect(62, 55, 5, 4); rect(52, 70, 5, 4);
  
  // Window frame details
  stroke(30, 20, frameBri - 10);
  strokeWeight(3);
  noFill();
  rect(-80, -90, 160, 180, 3);
  line(-80, 0, 80, 0); // horizontal divider
  line(0, -90, 0, 90); // vertical divider
  
  pop();
}

function drawCounter() {
  push();
  
  // Counter top surface with wood grain
  let counterHue = 25;
  let counterSat = lerp(35, 45, transition);
  let counterBri = lerp(18, 42, transition);
  
  // Main counter surface
  fill(counterHue, counterSat, counterBri);
  noStroke();
  rect(0, 520, width, 80);
  
  // Wood grain texture
  for (let i = 0; i < 12; i++) {
    stroke(counterHue, counterSat + 5, counterBri - 5, 25);
    strokeWeight(1);
    beginShape();
    for (let x = 0; x <= width; x += 15) {
      let y = 528 + i * 6 + noise(x * 0.008, i * 0.3) * 4;
      curveVertex(x, y);
    }
    endShape();
  }
  
  // Counter edge highlight
  stroke(counterHue, counterSat - 15, counterBri + 20, 50 * transition);
  strokeWeight(2);
  line(0, 520, width, 520);
  
  // Counter front panel
  fill(counterHue, counterSat, counterBri - 12);
  noStroke();
  rect(0, 600, width, 200);
  
  // Subtle panel shadow
  fill(0, 0, 0, 15);
  rect(0, 600, width, 8);
  
  pop();
}

function drawCoffeeCup() {
  push();
  translate(550, 485);
  
  // Cup shadow
  fill(0, 0, 0, 12);
  noStroke();
  ellipse(5, 55, 100, 18);
  
  // Cup body - nice ceramic
  let cupBri = lerp(30, 88, transition);
  let cupColor = color(35, 12, cupBri);
  
  // Cup body shape
  fill(cupColor);
  beginShape();
  vertex(-40, -5);
  bezierVertex(-44, 20, -46, 40, -42, 52);
  vertex(42, 52);
  bezierVertex(46, 40, 44, 20, 40, -5);
  endShape(CLOSE);
  
  // Cup rim (ellipse at top)
  fill(35, 8, cupBri + 5);
  ellipse(0, -5, 80, 18);
  
  // Inner rim shadow
  fill(25, 20, cupBri - 20, 50);
  ellipse(0, -3, 70, 12);
  
  // COFFEE SURFACE / GALAXY PORTAL
  drawCoffeeContents();
  
  // Cup handle
  noFill();
  stroke(35, 12, cupBri);
  strokeWeight(9);
  arc(48, 22, 32, 42, -HALF_PI + 0.3, HALF_PI - 0.3);
  strokeWeight(6);
  stroke(35, 8, cupBri + 8);
  arc(48, 22, 32, 42, -HALF_PI + 0.5, HALF_PI - 0.5);
  
  // Steam or Magic particles
  drawCupParticles();
  
  pop();
}

function drawCoffeeContents() {
  // Coffee surface ellipse bounds
  let coffeeWidth = 66;
  let coffeeHeight = 11;
  
  // Day: Regular coffee
  if (transition > 0.3) {
    let coffeeAlpha = map(transition, 0.3, 1, 0, 100);
    
    // Coffee base
    fill(20, 65, 18, coffeeAlpha);
    ellipse(0, -2, coffeeWidth, coffeeHeight);
    
    // Coffee highlight/reflection
    fill(30, 50, 28, coffeeAlpha * 0.5);
    ellipse(-10, -3, 25, 5);
  }
  
  // Night: GALAXY PORTAL
  if (transition < 0.7) {
    let galaxyAlpha = map(transition, 0.7, 0, 0, 100);
    
    // Clip to coffee surface (we'll fake it with layered ellipses)
    
    // Deep space base
    fill(260, 70, 8, galaxyAlpha);
    ellipse(0, -2, coffeeWidth, coffeeHeight);
    
    // Nebula clouds - swirling
    let nebulaAngle = time * 0.5;
    for (let i = 0; i < 3; i++) {
      let angle = nebulaAngle + i * TWO_PI / 3;
      let nx = cos(angle) * 12;
      let ny = sin(angle) * 2;
      
      // Purple nebula
      fill(280, 60, 40, galaxyAlpha * 0.4);
      ellipse(nx, ny - 2, 25, 6);
      
      // Cyan nebula
      fill(200, 70, 45, galaxyAlpha * 0.3);
      ellipse(-nx * 0.8, -ny - 2, 20, 5);
    }
    
    // Spiral galaxy arms
    stroke(45, 30, 80, galaxyAlpha * 0.6);
    strokeWeight(1);
    noFill();
    for (let arm = 0; arm < 2; arm++) {
      beginShape();
      for (let t = 0; t < TWO_PI; t += 0.2) {
        let spiralAngle = t + time * 0.8 + arm * PI;
        let r = 3 + t * 4;
        let sx = cos(spiralAngle) * r * 0.4;
        let sy = sin(spiralAngle) * r * 0.08;
        if (abs(sx) < 30 && abs(sy) < 5) {
          curveVertex(sx, sy - 2);
        }
      }
      endShape();
    }
    
    // Galaxy stars
    noStroke();
    for (let star of galaxyStars) {
      star.angle += star.speed;
      
      let sx = cos(star.angle) * star.radius * 0.45;
      let sy = sin(star.angle) * star.radius * 0.09;
      
      // Only draw within coffee bounds
      if (abs(sx) < 30 && abs(sy) < 4.5) {
        let twinkle = sin(frameCount * 0.15 + star.twinkle) * 0.3 + 0.7;
        let depth = map(star.layer, 0, 2, 0.5, 1);
        
        // Star glow
        fill(star.hue, 50, 90, galaxyAlpha * 0.3 * twinkle);
        ellipse(sx, sy - 2, star.size * 2.5, star.size * 0.6);
        
        // Star core
        fill(star.hue, 20, 100, galaxyAlpha * twinkle * depth);
        ellipse(sx, sy - 2, star.size, star.size * 0.3);
      }
    }
    
    // Central bright core
    for (let i = 3; i > 0; i--) {
      fill(45, 40, 90, galaxyAlpha * 0.2 * i);
      ellipse(0, -2, 8 * i, 2 * i);
    }
    fill(45, 20, 100, galaxyAlpha * 0.9);
    ellipse(0, -2, 4, 1.5);
  }
}

function drawCupParticles() {
  // Steam (lights on)
  if (transition > 0.2) {
    let steamAlpha = map(transition, 0.2, 1, 0, 1);
    
    for (let p of steamParticles) {
      // Update
      p.y += p.vy;
      p.x += sin(time * 2 + p.wobbleOffset) * 0.3;
      p.life -= 0.8;
      
      if (p.life <= 0) {
        Object.assign(p, createSteamParticle());
        p.y = random(-5, 10);
      }
      
      // Draw steam wisp
      let lifeRatio = p.life / p.maxLife;
      let alpha = lifeRatio * 35 * steamAlpha;
      
      fill(30, 5, 95, alpha);
      noStroke();
      
      // Wispy shape
      let wobble = sin(time * 3 + p.wobbleOffset) * 3;
      ellipse(p.x + wobble, p.y - 15, p.size * lifeRatio, p.size * 1.5 * lifeRatio);
    }
  }
  
  // Magic particles (lights off)
  if (transition < 0.8) {
    let magicAlpha = map(transition, 0.8, 0, 0, 1);
    
    for (let p of magicParticles) {
      // Store trail
      p.trail.push({x: p.x, y: p.y});
      if (p.trail.length > 8) p.trail.shift();
      
      // Update
      p.y += p.vy;
      p.x += p.vx + sin(time * 3 + p.x * 0.1) * 0.2;
      p.life -= 1;
      
      if (p.life <= 0) {
        Object.assign(p, createMagicParticle());
        p.y = random(0, 20);
      }
      
      let lifeRatio = p.life / p.maxLife;
      
      // Draw trail
      for (let i = 0; i < p.trail.length; i++) {
        let t = p.trail[i];
        let trailAlpha = (i / p.trail.length) * 30 * magicAlpha * lifeRatio;
        fill(p.hue, 70, 80, trailAlpha);
        noStroke();
        let trailSize = p.size * (i / p.trail.length) * 0.5;
        ellipse(t.x, t.y - 15, trailSize, trailSize);
      }
      
      // Outer glow
      fill(p.hue, 60, 90, 20 * magicAlpha * lifeRatio);
      ellipse(p.x, p.y - 15, p.size * 3, p.size * 3);
      
      // Inner glow
      fill(p.hue, 40, 100, 60 * magicAlpha * lifeRatio);
      ellipse(p.x, p.y - 15, p.size, p.size);
      
      // Bright core
      fill(p.hue, 15, 100, 80 * magicAlpha * lifeRatio);
      ellipse(p.x, p.y - 15, p.size * 0.4, p.size * 0.4);
    }
  }
}

function drawCat() {
  push();
  translate(250, 470 + catPurr);
  
  let furHue = 28;
  let furSat = lerp(20, 35, transition);
  let furBri = lerp(28, 45, transition);
  let darkFur = color(furHue, furSat + 5, furBri - 10);
  let mainFur = color(furHue, furSat, furBri);
  let lightFur = color(furHue, furSat - 10, furBri + 8);
  
  // Shadow under cat
  fill(0, 0, 0, 15);
  noStroke();
  ellipse(0, 52, 150, 20);
  
  // === TAIL (behind body) ===
  fill(mainFur);
  noStroke();
  beginShape();
  curveVertex(-90, 20);
  curveVertex(-75, 35);
  curveVertex(-95, 50);
  curveVertex(-100, 45);
  curveVertex(-85, 25);
  curveVertex(-70, 15);
  endShape(CLOSE);
  
  // Tail tip darker
  fill(darkFur);
  beginShape();
  curveVertex(-88, 38);
  curveVertex(-95, 50);
  curveVertex(-100, 45);
  curveVertex(-92, 35);
  endShape(CLOSE);
  
  // === BODY (loaf shape) ===
  fill(mainFur);
  beginShape();
  // Bottom edge (sitting on counter)
  vertex(-65, 50);
  // Back curve
  bezierVertex(-80, 45, -85, 20, -70, 0);
  // Top of back
  bezierVertex(-50, -15, -10, -18, 20, -10);
  // Neck area (connects to head)
  bezierVertex(35, -5, 45, 5, 50, 15);
  // Chest/front
  bezierVertex(55, 35, 50, 48, 40, 50);
  // Bottom
  vertex(-65, 50);
  endShape(CLOSE);
  
  // Body shading - darker back
  fill(darkFur);
  beginShape();
  vertex(-65, 50);
  bezierVertex(-80, 45, -85, 20, -70, 0);
  bezierVertex(-60, -10, -40, -12, -30, -8);
  bezierVertex(-50, 10, -60, 30, -65, 50);
  endShape(CLOSE);
  
  // Body highlight - chest
  fill(lightFur);
  beginShape();
  vertex(40, 50);
  bezierVertex(50, 45, 52, 35, 48, 25);
  bezierVertex(42, 35, 38, 45, 40, 50);
  endShape(CLOSE);
  
  // === FRONT PAWS (tucked under) ===
  fill(mainFur);
  ellipse(25, 48, 30, 12);
  ellipse(-5, 48, 28, 12);
  
  // Paw details
  fill(lightFur);
  ellipse(30, 49, 10, 6);
  ellipse(0, 49, 10, 6);
  
  // === HEAD (connected to body via neck) ===
  // Neck connection
  fill(mainFur);
  beginShape();
  vertex(35, 0);
  bezierVertex(45, -5, 55, -10, 60, -20);
  bezierVertex(70, -15, 70, 5, 55, 15);
  bezierVertex(50, 10, 42, 5, 35, 0);
  endShape(CLOSE);
  
  // Main head shape
  fill(mainFur);
  ellipse(70, -25, 65, 55);
  
  // Head shading
  fill(darkFur);
  arc(70, -25, 65, 55, PI * 0.6, PI * 1.4);
  
  // Cheeks (fluffy)
  fill(lightFur);
  ellipse(52, -15, 20, 18);
  ellipse(88, -15, 20, 18);
  
  // === EARS (connected to head!) ===
  // Left ear
  fill(mainFur);
  beginShape();
  vertex(45, -45);
  bezierVertex(42, -65, 55, -75, 60, -55);
  bezierVertex(58, -48, 52, -44, 45, -45);
  endShape(CLOSE);
  
  // Left ear inner
  fill(355, 25, lerp(40, 65, transition));
  beginShape();
  vertex(48, -48);
  bezierVertex(47, -62, 55, -68, 57, -55);
  bezierVertex(55, -50, 52, -47, 48, -48);
  endShape(CLOSE);
  
  // Right ear
  fill(mainFur);
  beginShape();
  vertex(90, -48);
  bezierVertex(88, -70, 100, -78, 105, -58);
  bezierVertex(102, -50, 96, -46, 90, -48);
  endShape(CLOSE);
  
  // Right ear inner
  fill(355, 25, lerp(40, 65, transition));
  beginShape();
  vertex(92, -50);
  bezierVertex(91, -65, 99, -70, 102, -57);
  bezierVertex(100, -52, 96, -49, 92, -50);
  endShape(CLOSE);
  
  // === FACE ===
  
  // Eyes
  if (transition > 0.4) {
    // Closed eyes (sleeping) - peaceful curves
    let eyeAlpha = map(transition, 0.4, 0.8, 0, 100);
    stroke(furHue, furSat + 15, furBri - 25, eyeAlpha);
    strokeWeight(2.5);
    noFill();
    // Left eye
    arc(58, -25, 14, 8, 0.2, PI - 0.2);
    // Right eye
    arc(82, -25, 14, 8, 0.2, PI - 0.2);
  }
  
  if (transition < 0.6) {
    // Open glowing eyes!
    let eyeGlow = map(transition, 0.6, 0, 0, 100);
    
    // Eye glow aura
    for (let i = 4; i > 0; i--) {
      fill(50, 70, 85, eyeGlow * 0.12 * i);
      noStroke();
      ellipse(58, -26, 10 + i * 5, 10 + i * 4);
      ellipse(82, -26, 10 + i * 5, 10 + i * 4);
    }
    
    // Eye whites/base
    fill(50, 60, 95, eyeGlow);
    ellipse(58, -26, 14, 13);
    ellipse(82, -26, 14, 13);
    
    // Pupils - vertical slits
    fill(0, 0, 8, eyeGlow);
    ellipse(58, -26, 3, 11);
    ellipse(82, -26, 3, 11);
    
    // Catch lights
    fill(50, 20, 100, eyeGlow);
    ellipse(60, -29, 3, 3);
    ellipse(84, -29, 3, 3);
  }
  
  // Nose
  fill(355, 35, lerp(35, 55, transition));
  noStroke();
  beginShape();
  vertex(70, -15);
  vertex(66, -10);
  vertex(74, -10);
  endShape(CLOSE);
  
  // Mouth lines
  stroke(furHue, furSat + 10, furBri - 20, 60);
  strokeWeight(1.5);
  noFill();
  line(70, -10, 70, -5);
  arc(65, -5, 10, 6, -PI, 0);
  arc(75, -5, 10, 6, -PI, 0);
  
  // Whiskers
  stroke(furHue, 10, furBri + 30, 50);
  strokeWeight(1);
  // Left whiskers
  line(50, -12, 25, -18);
  line(50, -8, 22, -8);
  line(50, -4, 25, 2);
  // Right whiskers
  line(90, -12, 115, -18);
  line(90, -8, 118, -8);
  line(90, -4, 115, 2);
  
  pop();
}

function drawAmbientLight() {
  // Warm ambient glow when lights are on
  if (transition > 0.3) {
    let glowAlpha = map(transition, 0.3, 1, 0, 25);
    
    // Warm overhead light effect
    fill(40, 40, 95, glowAlpha);
    noStroke();
    ellipse(width/2, 100, 400, 200);
    
    // Light on counter
    fill(40, 30, 90, glowAlpha * 0.5);
    ellipse(width/2, 520, 600, 80);
  }
}

function drawInstructions() {
  push();
  let pulse = sin(frameCount * 0.05) * 0.2 + 0.8;
  
  let textBri = lerp(70, 35, transition);
  fill(lerp(200, 30, transition), 20, textBri, 50 * pulse);
  
  textAlign(CENTER);
  textSize(14);
  textFont('Georgia');
  text('click anywhere to flip the switch', width/2, height - 35);
  pop();
}

function mousePressed() {
  lightsOn = !lightsOn;
}

function keyPressed() {
  if (key === ' ') {
    lightsOn = !lightsOn;
  }
}
