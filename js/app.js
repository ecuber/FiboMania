const colors = [[31, 33, 61], [64, 74, 140], [104, 109, 183], [111, 115, 168], [176, 182, 242]];
const DOWN = 0, BR = 0;
const RIGHT = 1, TR = 1;
const UP = 2, TL = 2;
const LEFT = 3, BL = 3;
const multiplier = 15;

let canvas, strokeWt;
let zoomIndex = 0;
let controls = {
  view: {x: 0, y: 0, zoom: 1},
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

// sets up canvas
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  // switches from radians to degrees
  angleMode(DEGREES);
}

/**
 * main loop from p5 library.
 */
function draw() {
  
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom);

  zoom = controls.view.zoom;
  strokeWt = zoom < 1 ? 1 / zoom * 2 : 2;

  background(247, 247, 242);
  stroke(208, 209, 221);
  strokeWeight(strokeWt);

  drawGrid();
}

/**
 * Draws the grid of Fibonacci squares.
 */
function drawGrid() {
  let boxes = [];

  // starting coordinates for first square
  let x = 875;
  let y = 450;
  let dir;
  for (let i = 0; i < 30; i++) {
    // determines side length in pixels by multiplying the fibonacci value by the constant.
    let len = fibonacci(i) * multiplier;
    // records this square's attributes in the boxes array.
    boxes.push({
      len: len,
      dir: i % 4,
      x: x,
      y: y
    });
    // creates and renders square
    fillIndex(i % colors.length);
    rect(x, y, len, len);
    dir = i % 4;
    if (dir === DOWN) {
      y += len;
    }
    else if (dir === RIGHT) {
      x += len;
      y -= boxes[i - 1].len;
    }
    else if (dir === UP) {
      y -= len + boxes[i - 1].len;
      x -= boxes[i - 1].len;
    }
    else if (dir === LEFT) {
      x -= len + boxes[i - 1].len;
    }
  }
  drawSpiral(boxes);
}

/**
 * Draws fibonacci spiral based on data from existing grid.
 * 
 * @param {array} boxes - Array of objects containing data on previously generated squares
 */
function drawSpiral(boxes) {
  noFill();
  let box, bX, bY, range, len;
  for (let i = 0; i < boxes.length; i++) {
    box = boxes[i];
    bX = box.x;
    bY = box.y;
    len = box.len;
    if (box.dir === BR) {
      bX += box.len;
      bY += box.len;
      range = [180, 270];
    }
    else if (box.dir === TR) {
      bX += len;
      range = [90, 180];
    }
    else if (box.dir === TL) {
      range = [0, 90];
    }
    else if (box.dir === BL) {
      bY += len;
      range = [270, 0];
    }
    arc(bX, bY, 2 * len, 2 * len, range[0], range[1]);
  }
  fillIndex(0);
}

/**
 * fillIndex - equivalent of p5.js fill(), uses RGB values from colors array.
 *
 * @param  {int} i - index of color.
 * @returns {null}
 */
function fillIndex(i) {
  const color = colors[i];
  fill(color[0], color[1], color[2]);
}

/**
 * fibonacci - finds integer at the given position in the Fibonacci sequence.
 *
 * @param  {int} index - index of desired integer. 
 * @returns {int} desired Fibonacci sequence integer.
 */
function fibonacci(index) {
    let currentNum = 1;
    let prevNum = 0;
    let arr = [];
    for (let i = 0; i <= index; i++) {
        if (i === 0) {
            arr.push(1);
        } else {
            arr.push(currentNum);
            prevNum = currentNum - prevNum;
            currentNum += prevNum;
        }
    }
    return arr[index];
}

/**
 * Takes a screenshot of the current visible canvas and creates a dialogue to download it.
 */
function screenshot() {
  saveCanvas(canvas, "fibonacci", "jpg");
}

/**
 * Resets all translations and dilations of the canvas smoothly ;)
 */
async function resetCanvas() {
  zoomIndex = 0;
  enableButtons();
  controls.viewPos = { prevX: null,  prevY: null,  isDragging: false };
  let xPrev = controls.view.x;
  let yPrev = controls.view.y;
  let zPrev = 1 - controls.view.zoom;
  let zDir = zPrev > 1 ? -1 : 1;

  for (let i = 0; i < 20000; i++) {
    setTimeout(() => {
      controls.view.x += -1 * xPrev / 20000;
      controls.view.y += -1 * yPrev / 20000;
      controls.view.zoom += zDir * zPrev / 20000;
    }, 10);
  }
}

/**
 * Zooms out by 15% until zoom level reaches 40%.
 */
function zoomOut() {
  if (zoomIndex > -19) {
    zoomIndex--;
    enableButtons();

    const zoom = 0.05;
    const wx = (width / 2)/(width*controls.view.zoom);
    const wy = (height / 2)/(height*controls.view.zoom);

    for(let i = 0; i < 20000; i++) {
      setTimeout(() => {
        controls.view.zoom -= zoom / 20000;
        controls.view.x += wx*width*zoom/20000;
        controls.view.y += wy*height*zoom/20000;
       }, 10);
    }

  } else {
    displayErrorDiv();
    document.getElementById("decr").classList.add("disabled");
  } 
}

/**
 * Zooms in 15% until zoom level reaches 700%.
 */
function zoomIn() {
  if (zoomIndex < 42) {
    zoomIndex++;
    enableButtons();

    const zoom = 0.10;
    const wx = (width / 2)/(width*controls.view.zoom);
    const wy = (height / 2)/(height*controls.view.zoom);
    let mult;

      for(let i = 0; i < 15000; i++) {
        setTimeout(() => {
          controls.view.zoom += zoom / 15000;
          controls.view.x -= wx*width*zoom/15000;
          controls.view.y -= wy*height*zoom/15000; 
        }, 10);
      }
  } else {
    displayErrorDiv();
    document.getElementById("incr").classList.add("disabled");
  }
}

function displayErrorDiv() {
  document.getElementById("error").classList.add("visible");
  setTimeout(() => {
    document.getElementById("error").classList.remove("visible");
  }, 6000);
}

/**
 * Re-enables all buttons that may have been disabled (zoom in/out) due to reaching a zoom constraint.
 */
function enableButtons() {
  document.getElementById("decr").classList.remove("disabled");
  document.getElementById("incr").classList.remove("disabled");
}


/*
 * Controls class written by Amir Saboury: https://codepen.io/amir-s/pen/jzqZdG?editors=0010
 */
window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e) {
      const {prevX, prevY, isDragging} = controls.viewPos;
      if(!isDragging) return;

      const pos = {x: e.clientX, y: e.clientY};
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;

      if(prevX || prevY) {
        controls.view.x += dx;
        controls.view.y += dy;
        controls.viewPos.prevX = pos.x, controls.viewPos.prevY = pos.y
      }
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
 
    return {
      mousePressed, 
      mouseDragged, 
      mouseReleased
    }
  }

}
