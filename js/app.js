const colors = [[31, 33, 61], [64, 74, 140], [104, 109, 183], [111, 115, 168], [176, 182, 242]];
const multiplier = 15;

const DOWN = 0, BR = 0;
const RIGHT = 1, TR = 1;
const UP = 2, TL = 2;
const LEFT = 3, BL = 3;
let boxes = [];

// sets up canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  angleMode(DEGREES);
}

/**
 * draw - main loop from p5 library.
 */
function draw() {
  background(247, 247, 242);
  stroke(208, 209, 221);
  strokeWeight(2);
  

  // starting coordinates for first square
  let x = 875;
  let y = 450;
  let dir;

  for (let i = 0; i < 15; i++) {
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
    else if(dir === RIGHT) {
      x += len;
      y -= boxes[i - 1].len;
    }
    else if(dir === UP) {
      y -= len + boxes[i - 1].len;
      x -= boxes[i - 1].len;
    }
    else if (dir === LEFT) {
      x -= len + boxes[i - 1].len;
    }
  }

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
}

/**
 * fillIndex - equivalent of p5.js fill(), uses RGB values from colors array.
 *
 * @param  {int} i - index of color.
 * @returns {void}
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
