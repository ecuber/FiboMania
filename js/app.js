const colors = [[128, 149, 142], [35, 151, 150], [148, 126, 176], [163, 165, 195], [169, 210, 213], [196, 214, 176]];
const multiplier = 25;
sideLengths = [];

// sets up canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
}

const phi = ((1 + Math.sqrt(5)) / 2);
// main loop
function draw() {
  background(247, 247, 242);

  let x = 600;
  let y = 300;
  for (let i = 0; i < 12; i++) {
    let len = fibonacci(i) * multiplier;
    sideLengths.push(len);
    fillIndex(i % 5);
    rect(x, y, len, len);

    // down
    if (i % 4 === 0) {
      y += len;
    // right
    } else if(i % 4 === 1) {
      x += len;
      y -= sideLengths[i - 1];
    // up
    } else if(i % 4 === 2) {
      y -= len + sideLengths[i - 1];
      x -= sideLengths[i - 1];
    // left
    } else if (i % 4 === 3) {
      x -= len + sideLengths[i - 1];
    }
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
