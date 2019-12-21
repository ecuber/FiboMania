const left = 0;
const up = 1;
const right = 2;
const down = 3;

function generateFiboArr(len) {
    let currentNum = 1;
    let prevNum = 0;
    let arr = [];
    for (let i = 0; i < len; i++) {
        if (i === 0) {
            arr.push(1);
        } else {
            arr.push(currentNum);
            prevNum = currentNum - prevNum;
            currentNum += prevNum;
        }
    }
    return arr;
}

console.log(generateFiboArr(1000));