const colors = [[31, 33, 61], [64, 74, 140], [104, 109, 183], [111, 115, 168], [176, 182, 242]];
let multiplier = 15;
const DOWN = 0, BR = 0;
const RIGHT = 1, TR = 1;
const UP = 2, TL = 2;
const LEFT = 3, BL = 3;

const controls = {
  view: {x: 0, y: 0, zoom: 1},
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

// sets up canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  
}

/**
 * draw - main loop from p5 library.
 */
function draw() {
  let boxes = [];
  
  // ZOOM AND TRANSLATION
  translate(controls.view.x, controls.view.y);
  console.log(controls.view.zoom);
  if (controls.view.zoom > -0.05) {
    scale(controls.view.zoom)
  } else {
    scale(1);
  }
  

  background(247, 247, 242);
  stroke(208, 209, 221);
  strokeWeight(2);
  

  // starting coordinates for first square
  let x = 875;
  let y = 450;
  let dir;

  for (let i = 0; i < 100; i++) {
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

/*
 *
 * EVENT HANDLERS & CONTROLS CLASS
 * Written by Amir Saboury: https://codepen.io/amir-s/pen/jzqZdG?editors=0010
 *
 */

window.mousePressed = e => Controls.move(controls).mousePressed(e)
window.mouseDragged = e => Controls.move(controls).mouseDragged(e);
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

function mouseWheel(event) {
  Controls.zoom(controls).worldZoom(event)
}


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

  static zoom(controls) {
    // function calcPos(x, y, zoom) {
    //   const newX = width - (width * zoom - x);
    //   const newY = height - (height * zoom - y);
    //   return {x: newX, y: newY}
    // }

    function worldZoom(e) {
      const {x, y, deltaY} = e;
      const direction = deltaY < 0 ? -1 : 1;
      const factor = 0.05;
      
      const zoom = direction * factor;
    
      const wx = (x-controls.view.x)/(width*controls.view.zoom);
      const wy = (y-controls.view.y)/(height*controls.view.zoom);
      
      controls.view.x -= wx*width*zoom;
      controls.view.y -= wy*height*zoom;
      controls.view.zoom += zoom;
      
      
    }

    return {worldZoom}
  }
}
