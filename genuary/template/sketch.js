// Genuary 2026 - Day {{DAY}}
// Prompt: {{TITLE}}
// {{DESCRIPTION}}

/*
 * 🎨 CREATIVE CODING CANVAS
 * 
 * This is your blank canvas. Delete everything below and start fresh!
 * 
 * INSPIRATION (don't copy - invent!):
 * - Particles that swarm like fireflies
 * - Shapes that breathe and pulse
 * - Colors that shift like oil on water
 * - Lines that dance like wind
 * - Fractals that grow like crystals
 * - Noise fields that flow like smoke
 * 
 * TECHNIQUES TO EXPLORE:
 * - colorMode(HSB, 360, 100, 100) for beautiful palettes
 * - noise() for organic movement
 * - lerp() and map() for smooth transitions
 * - push()/pop() with translate()/rotate() for patterns
 * - Arrays of objects for particle systems
 * 
 * MAKE IT EXTRAORDINARY. MAKE IT YOURS.
 */

const WIDTH = 800;
const HEIGHT = 800;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
  // DELETE THIS AND CREATE SOMETHING AMAZING
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("✨ Your art goes here ✨", width/2, height/2);
  noLoop();
}

function draw() {
  // Your animation code here
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('day{{DAY_PADDED}}', 'png');
  }
}
