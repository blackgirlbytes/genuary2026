// Capture script - adds frame capture capability
let captureFrames = false;
let frameNum = 0;
let maxFrames = 480; // ~8 seconds at 60fps

function keyPressed() {
  if (key === 'c' || key === 'C') {
    captureFrames = true;
    frameNum = 0;
    console.log('Starting capture...');
  }
  if (key === 'p' || key === 'P') {
    saveCanvas('day07-gatekeeper', 'png');
    console.log('PNG saved!');
  }
}

// Call this at end of draw() to capture frames
function captureFrame() {
  if (captureFrames && frameNum < maxFrames) {
    saveCanvas('frame-' + nf(frameNum, 4), 'png');
    frameNum++;
    if (frameNum >= maxFrames) {
      captureFrames = false;
      console.log('Capture complete! ' + maxFrames + ' frames saved.');
    }
  }
}
