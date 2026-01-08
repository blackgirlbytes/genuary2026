// Day 07: Boolean Algebra - "The Gate Keeper"
// A whimsical guardian who evaluates boolean logic (AND/OR/XOR)

let gateKeeper;
let gate;
let travelerA, travelerB;
let currentMode = 0;
let modes = ['AND', 'OR', 'XOR'];
let modeColors;
let phase = 'approaching'; // approaching, evaluating, result, reset
let phaseTimer = 0;
let gateOpen = false;
let resultMessage = '';

// Soft storybook palette
let bgColor, groundColor, skyGradientTop, skyGradientBottom;

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('sketch-container');
  
  // Storybook colors
  bgColor = color(255, 248, 240);
  groundColor = color(180, 200, 160);
  skyGradientTop = color(200, 220, 255);
  skyGradientBottom = color(255, 240, 220);
  
  modeColors = {
    'AND': color(180, 100, 140),   // Dusty rose - stern
    'OR': color(100, 160, 120),    // Sage green - welcoming  
    'XOR': color(140, 120, 180)    // Lavender - mysterious
  };
  
  // Initialize characters
  gateKeeper = new GateKeeper(width/2, height * 0.55);
  gate = new Gate(width/2, height * 0.4);
  
  resetTravelers();
  
  frameRate(60);
}

function resetTravelers() {
  // Random presence for each traveler
  let aPresent = random() > 0.3;
  let bPresent = random() > 0.3;
  
  travelerA = new Traveler(-50, height * 0.65, 'A', color(230, 150, 100), aPresent);
  travelerB = new Traveler(width + 50, height * 0.65, 'B', color(100, 150, 230), bPresent);
}

function draw() {
  drawBackground();
  
  // Update phase
  phaseTimer++;
  
  if (phase === 'approaching') {
    // Travelers move toward gate
    if (travelerA.present) travelerA.moveToward(width * 0.35, 0.02);
    if (travelerB.present) travelerB.moveToward(width * 0.65, 0.02);
    
    // Check if arrived
    let aArrived = !travelerA.present || abs(travelerA.x - width * 0.35) < 5;
    let bArrived = !travelerB.present || abs(travelerB.x - width * 0.65) < 5;
    
    if (aArrived && bArrived && phaseTimer > 60) {
      phase = 'evaluating';
      phaseTimer = 0;
    }
  } 
  else if (phase === 'evaluating') {
    // Gate keeper thinks...
    gateKeeper.thinking = true;
    
    if (phaseTimer > 90) {
      // Evaluate boolean logic
      let result = evaluateLogic(travelerA.present, travelerB.present, modes[currentMode]);
      gateOpen = result;
      gateKeeper.happy = result;
      gateKeeper.thinking = false;
      
      // Set result message
      resultMessage = getResultMessage(travelerA.present, travelerB.present, modes[currentMode], result);
      
      phase = 'result';
      phaseTimer = 0;
    }
  }
  else if (phase === 'result') {
    // Show result - gate opens or travelers bounce
    if (gateOpen) {
      gate.open = true;
      if (travelerA.present) travelerA.moveToward(width * 0.5, 0.03);
      if (travelerB.present) travelerB.moveToward(width * 0.5, 0.03);
      
      // Travelers pass through and exit
      if (phaseTimer > 120) {
        if (travelerA.present) travelerA.moveToward(width * 0.5, 0.05);
        if (travelerB.present) travelerB.moveToward(width * 0.5, 0.05);
        travelerA.y -= 1.5;
        travelerB.y -= 1.5;
      }
    } else {
      // Bounce back
      if (travelerA.present) travelerA.moveToward(width * 0.15, 0.03);
      if (travelerB.present) travelerB.moveToward(width * 0.85, 0.03);
    }
    
    if (phaseTimer > 240) {
      phase = 'reset';
      phaseTimer = 0;
    }
  }
  else if (phase === 'reset') {
    gate.open = false;
    gateKeeper.happy = false;
    
    if (phaseTimer > 60) {
      // Next mode
      currentMode = (currentMode + 1) % modes.length;
      resetTravelers();
      phase = 'approaching';
      phaseTimer = 0;
      resultMessage = '';
    }
  }
  
  // Draw scene (back to front)
  drawGround();
  gate.display();
  
  // Draw travelers behind or in front based on position
  if (travelerA.y > height * 0.5) {
    travelerA.display();
    travelerB.display();
  }
  
  gateKeeper.display();
  
  if (travelerA.y <= height * 0.5) {
    travelerA.display();
    travelerB.display();
  }
  
  // UI
  drawModeIndicator();
  drawResultMessage();
}

function drawBackground() {
  // Gradient sky
  for (let y = 0; y < height * 0.6; y++) {
    let inter = map(y, 0, height * 0.6, 0, 1);
    let c = lerpColor(skyGradientTop, skyGradientBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function drawGround() {
  // Rolling hills
  noStroke();
  
  // Back hill
  fill(140, 170, 130);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 20) {
    let y = height * 0.55 + sin(x * 0.01) * 30 + cos(x * 0.02) * 20;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Front ground
  fill(groundColor);
  beginShape();
  vertex(0, height);
  for (let x = 0; x <= width; x += 20) {
    let y = height * 0.65 + sin(x * 0.015 + 1) * 15;
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Path to gate
  fill(210, 190, 160);
  beginShape();
  vertex(width * 0.4, height);
  vertex(width * 0.45, height * 0.65);
  vertex(width * 0.55, height * 0.65);
  vertex(width * 0.6, height);
  endShape(CLOSE);
}

function evaluateLogic(a, b, mode) {
  switch(mode) {
    case 'AND': return a && b;
    case 'OR': return a || b;
    case 'XOR': return (a || b) && !(a && b);
    default: return false;
  }
}

function getResultMessage(a, b, mode, result) {
  let aStr = a ? '1' : '0';
  let bStr = b ? '1' : '0';
  let rStr = result ? '✓ PASS' : '✗ DENIED';
  return `${aStr} ${mode} ${bStr} = ${rStr}`;
}

function drawModeIndicator() {
  let mode = modes[currentMode];
  let modeColor = modeColors[mode];
  
  // Mode badge
  push();
  fill(modeColor);
  noStroke();
  rectMode(CENTER);
  rect(width/2, 40, 120, 40, 20);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(20);
  textStyle(BOLD);
  text(mode, width/2, 40);
  pop();
  
  // Mode description
  push();
  fill(80);
  textAlign(CENTER, CENTER);
  textSize(12);
  textStyle(NORMAL);
  let desc = '';
  switch(mode) {
    case 'AND': desc = '"I need BOTH of you"'; break;
    case 'OR': desc = '"Anyone is welcome!"'; break;
    case 'XOR': desc = '"Exactly one, please"'; break;
  }
  text(desc, width/2, 70);
  pop();
}

function drawResultMessage() {
  if (resultMessage === '') return;
  
  push();
  fill(50, 50, 50, 200);
  noStroke();
  rectMode(CENTER);
  rect(width/2, height - 50, 200, 36, 18);
  
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(16);
  textStyle(BOLD);
  text(resultMessage, width/2, height - 50);
  pop();
}

// ============ GATE KEEPER CLASS ============
class GateKeeper {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 70;
    this.thinking = false;
    this.happy = false;
    this.bobOffset = random(1000);
  }
  
  display() {
    push();
    translate(this.x, this.y);
    
    // Gentle bob
    let bob = sin(frameCount * 0.05 + this.bobOffset) * 3;
    translate(0, bob);
    
    // Shadow
    fill(0, 0, 0, 30);
    noStroke();
    ellipse(0, this.size * 0.5, this.size * 1.2, this.size * 0.3);
    
    // Body - cute dress
    fill(90, 80, 120); // Purple dress
    ellipse(0, this.size * 0.2, this.size * 0.9, this.size * 0.7);
    
    // Dress details - little collar
    fill(255, 200, 220); // Pink collar
    ellipse(0, -this.size * 0.1, this.size * 0.35, this.size * 0.15);
    
    // Head - warm brown skin tone
    fill(139, 90, 65); // Beautiful brown skin
    ellipse(0, -this.size * 0.18, this.size * 0.6, this.size * 0.55);
    
    // Hair - cute afro puffs!
    fill(30, 25, 20); // Dark hair
    // Left puff
    ellipse(-this.size * 0.32, -this.size * 0.35, this.size * 0.4, this.size * 0.4);
    // Right puff
    ellipse(this.size * 0.32, -this.size * 0.35, this.size * 0.4, this.size * 0.4);
    // Top of head hair
    arc(0, -this.size * 0.25, this.size * 0.55, this.size * 0.45, PI, TWO_PI);
    
    // Cute hair accessories - little bows/beads
    fill(255, 150, 200); // Pink bows
    ellipse(-this.size * 0.32, -this.size * 0.5, 10, 8);
    ellipse(this.size * 0.32, -this.size * 0.5, 10, 8);
    
    // Face again (to layer over hair edge)
    fill(139, 90, 65);
    ellipse(0, -this.size * 0.15, this.size * 0.52, this.size * 0.48);
    
    // Eyes
    let eyeY = -this.size * 0.15;
    let eyeSpacing = this.size * 0.12;
    
    // Eye whites
    fill(255);
    ellipse(-eyeSpacing, eyeY, 16, 14);
    ellipse(eyeSpacing, eyeY, 16, 14);
    
    // Pupils - big sparkly eyes
    fill(45, 30, 25); // Dark brown eyes
    let pupilOffsetX = 0;
    let pupilOffsetY = 0;
    
    if (this.thinking) {
      // Eyes look up when thinking
      pupilOffsetY = -3;
      pupilOffsetX = sin(frameCount * 0.2) * 2;
    }
    
    ellipse(-eyeSpacing + pupilOffsetX, eyeY + pupilOffsetY, 8, 8);
    ellipse(eyeSpacing + pupilOffsetX, eyeY + pupilOffsetY, 8, 8);
    
    // Eye sparkles (cute anime style)
    fill(255);
    ellipse(-eyeSpacing + pupilOffsetX - 2, eyeY + pupilOffsetY - 2, 3, 3);
    ellipse(eyeSpacing + pupilOffsetX - 2, eyeY + pupilOffsetY - 2, 3, 3);
    
    // Eyebrows
    stroke(50, 35, 30);
    strokeWeight(2.5);
    noFill();
    
    if (this.thinking) {
      // Raised eyebrows - curious thinking
      arc(-eyeSpacing, eyeY - 10, 14, 8, PI, TWO_PI);
      arc(eyeSpacing, eyeY - 10, 14, 8, PI, TWO_PI);
    } else if (this.happy) {
      // Happy arched brows
      arc(-eyeSpacing, eyeY - 9, 12, 6, PI, TWO_PI);
      arc(eyeSpacing, eyeY - 9, 12, 6, PI, TWO_PI);
    } else {
      // Neutral but cute
      arc(-eyeSpacing, eyeY - 9, 12, 5, PI + 0.3, TWO_PI - 0.3);
      arc(eyeSpacing, eyeY - 9, 12, 5, PI + 0.3, TWO_PI - 0.3);
    }
    
    // Cute nose
    noStroke();
    fill(120, 75, 55);
    ellipse(0, eyeY + 8, 6, 4);
    
    // Mouth
    noStroke();
    if (this.happy) {
      // Big happy smile
      fill(90, 50, 50);
      arc(0, this.size * 0.02, 22, 16, 0, PI, CHORD);
      // Teeth showing in smile
      fill(255);
      arc(0, this.size * 0.02, 18, 10, 0, PI, CHORD);
    } else if (this.thinking) {
      // Little 'hmm' mouth - shifted to side
      fill(90, 50, 50);
      ellipse(3, this.size * 0.03, 8, 10);
    } else {
      // Cute neutral smile
      stroke(90, 50, 50);
      strokeWeight(2.5);
      noFill();
      arc(0, this.size * 0.0, 14, 8, 0.2, PI - 0.2);
    }
    
    // Blush cheeks
    fill(180, 100, 90, 80);
    noStroke();
    ellipse(-eyeSpacing - 6, eyeY + 10, 10, 6);
    ellipse(eyeSpacing + 6, eyeY + 10, 10, 6);
    
    // Staff
    push();
    translate(this.size * 0.5, 0);
    rotate(0.1);
    
    // Staff pole - golden
    fill(180, 140, 80);
    noStroke();
    rect(-4, -this.size * 0.6, 8, this.size * 1.1, 4);
    
    // Staff orb
    let orbColor = modeColors[modes[currentMode]];
    fill(orbColor);
    ellipse(0, -this.size * 0.7, 24, 24);
    
    // Orb glow
    if (this.thinking || this.happy) {
      fill(red(orbColor), green(orbColor), blue(orbColor), 100);
      ellipse(0, -this.size * 0.7, 35, 35);
    }
    
    // Orb shine
    fill(255, 255, 255, 150);
    ellipse(-4, -this.size * 0.75, 6, 6);
    
    pop();
    
    // Thinking sparkles
    if (this.thinking) {
      fill(255, 220, 100);
      noStroke();
      for (let i = 0; i < 3; i++) {
        let angle = frameCount * 0.1 + i * TWO_PI / 3;
        let sx = cos(angle) * 40;
        let sy = -this.size * 0.5 + sin(angle * 2) * 15;
        let sparkleSize = 4 + sin(frameCount * 0.3 + i) * 2;
        drawSparkle(sx, sy, sparkleSize);
      }
    }
    
    pop();
  }
}

function drawSparkle(x, y, size) {
  push();
  translate(x, y);
  fill(255, 230, 150);
  noStroke();
  beginShape();
  for (let i = 0; i < 8; i++) {
    let angle = i * PI / 4;
    let r = i % 2 === 0 ? size : size * 0.4;
    vertex(cos(angle) * r, sin(angle) * r);
  }
  endShape(CLOSE);
  pop();
}

// ============ GATE CLASS ============
class Gate {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.open = false;
    this.openAmount = 0;
  }
  
  display() {
    // Smooth open/close
    let targetOpen = this.open ? 1 : 0;
    this.openAmount = lerp(this.openAmount, targetOpen, 0.08);
    
    push();
    translate(this.x, this.y);
    
    // Gate posts
    fill(80, 70, 90);
    noStroke();
    
    // Left post
    rect(-95, -60, 20, 130, 3);
    // Right post  
    rect(75, -60, 20, 130, 3);
    
    // Post tops (spheres)
    fill(200, 180, 100);
    ellipse(-85, -65, 25, 25);
    ellipse(85, -65, 25, 25);
    
    // Arch
    fill(80, 70, 90);
    arc(0, -50, 170, 80, PI, TWO_PI, CHORD);
    
    // Inner arch (lighter)
    fill(100, 90, 110);
    arc(0, -50, 140, 60, PI, TWO_PI, CHORD);
    
    // Gate doors
    let doorOpenX = this.openAmount * 50;
    
    // Left door
    push();
    translate(-40 - doorOpenX, 0);
    this.drawDoor(-1);
    pop();
    
    // Right door
    push();
    translate(40 + doorOpenX, 0);
    this.drawDoor(1);
    pop();
    
    // Decorative arch details
    stroke(200, 180, 100);
    strokeWeight(3);
    noFill();
    arc(0, -50, 155, 70, PI, TWO_PI);
    
    pop();
  }
  
  drawDoor(side) {
    // Door panel
    fill(60, 50, 70);
    stroke(80, 70, 90);
    strokeWeight(2);
    rect(-25, -45, 50, 110, 2);
    
    // Door bars
    stroke(90, 80, 100);
    strokeWeight(4);
    for (let i = 0; i < 3; i++) {
      let bx = -15 + i * 15;
      line(bx, -40, bx, 60);
    }
    
    // Horizontal bars
    line(-23, -20, 23, -20);
    line(-23, 20, 23, 20);
    
    // Door handle
    if (side === 1) {
      fill(200, 180, 100);
      noStroke();
      ellipse(-18, 10, 12, 12);
    } else {
      fill(200, 180, 100);
      noStroke();
      ellipse(18, 10, 12, 12);
    }
  }
}

// ============ TRAVELER CLASS ============
class Traveler {
  constructor(x, y, label, col, present) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.color = col;
    this.present = present;
    this.size = 35;
    this.bobOffset = random(1000);
  }
  
  moveToward(targetX, speed) {
    this.x = lerp(this.x, targetX, speed);
  }
  
  display() {
    if (!this.present) return;
    
    push();
    translate(this.x, this.y);
    
    // Bob animation
    let bob = sin(frameCount * 0.08 + this.bobOffset) * 4;
    translate(0, bob);
    
    // Shadow
    fill(0, 0, 0, 25);
    noStroke();
    ellipse(0, this.size * 0.4, this.size * 0.9, this.size * 0.25);
    
    // Body - cute blob shape
    fill(this.color);
    ellipse(0, 0, this.size, this.size * 0.9);
    
    // Lighter belly
    fill(red(this.color) + 40, green(this.color) + 40, blue(this.color) + 40);
    ellipse(0, this.size * 0.1, this.size * 0.5, this.size * 0.4);
    
    // Eyes
    fill(255);
    ellipse(-6, -5, 12, 11);
    ellipse(6, -5, 12, 11);
    
    // Pupils
    fill(30);
    ellipse(-5, -4, 5, 5);
    ellipse(7, -4, 5, 5);
    
    // Eye shine
    fill(255);
    ellipse(-6, -6, 3, 3);
    ellipse(6, -6, 3, 3);
    
    // Cute blush
    fill(255, 180, 180, 100);
    ellipse(-12, 2, 8, 5);
    ellipse(12, 2, 8, 5);
    
    // Small smile
    noFill();
    stroke(red(this.color) - 50, green(this.color) - 50, blue(this.color) - 50);
    strokeWeight(2);
    arc(0, 3, 12, 8, 0.2, PI - 0.2);
    
    // Label badge
    fill(255);
    noStroke();
    ellipse(0, -this.size * 0.55, 18, 18);
    
    fill(red(this.color) - 30, green(this.color) - 30, blue(this.color) - 30);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(this.label, 0, -this.size * 0.55);
    
    pop();
  }
}
