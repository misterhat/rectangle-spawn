const Bitfield = require('bitfield').default;
const ndarray = require('ndarray');
const rcolor = require('rcolor');

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 600;

document.body.appendChild(canvas);

// minimum width and height should divide evenly into the width (no remainders)
const minimumWidth = canvas.width / 8; // 75
const minimumHeight = canvas.height / 8; // 75

const maximumWidth = minimumWidth * 3;
const maximumHeight = minimumHeight * 2;

// use an even number here
const gap = 8;

let remainingArea = canvas.width * canvas.height;

const filled = ndarray(new Bitfield(canvas.width * canvas.height), [
    canvas.width,
    canvas.height
]);

function findEmptyPosition() {
    for (let x = 0; x < canvas.width; x += 1) {
        for (let y = 0; y < canvas.height; y += 1) {
            if (!filled.get(x, y)) {
                return { x, y };
            }
        }
    }
}

function getRemainingWidth(x, y) {
    let width = 0;

    while (x < canvas.width && !filled.get(x, y)) {
        width += 1;
        x += 1;
    }

    return width;
}

function getRemainingHeight(x, y) {
    let height = 0;

    while (y < canvas.height && !filled.get(x, y)) {
        height += 1;
        y += 1;
    }

    return height;
}

function getWidth(remainingWidth) {
    const width = Math.min(
        (Math.floor(Math.random() * (remainingWidth / minimumWidth - 1)) + 1) *
            minimumWidth,
        maximumWidth
    );

    return width;
}

function getHeight(remainingHeight) {
    const height = Math.min(
        (Math.floor(Math.random() * (remainingHeight / minimumHeight - 1)) +
            1) *
            minimumHeight,
        maximumHeight
    );

    return height;
}

function plotRectangle(x, y, width, height) {
    for (let i = x; i < x + width; i += 1) {
        for (let j = y; j < y + height; j += 1) {
            filled.set(i, j, true);
        }
    }

    ctx.fillStyle = rcolor();

    ctx.fillRect(x + gap / 2, y + gap / 2, width - gap / 2, height - gap / 2);
}

while (remainingArea > 0) {
    const { x, y } = findEmptyPosition();
    const remainingWidth = getRemainingWidth(x, y);
    const remainingHeight = getRemainingHeight(x, y);
    const width = getWidth(remainingWidth);
    const height = getHeight(remainingHeight);

    remainingArea -= width * height;

    plotRectangle(x, y, width, height);
}
