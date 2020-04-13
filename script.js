const grid = document.querySelector('.grid')
const width = 10;
const height = 20;
let currentPosition = 4;
let squares = [...document.querySelectorAll('.grid div')]
const start = document.querySelector('button')
let score = document.querySelector('.score span')
let speedSpan = document.querySelector('span.speed')
let timeInterval;
let points = 0;
let speed = 1000;
let speedIndicator = 1;

//The Tetrominoes
const lTetromino = [
    [1, width + 1, height + 1, 2],
    [width, width + 1, width + 2, height + 2],
    [1, width + 1, height + 1, height],
    [width, height, height + 1, height + 2]
]

const zTetromino = [
    [0, width, width + 1, height + 1],
    [width + 1, width + 2, height, height + 1],
    [0, width, width + 1, height + 1],
    [width + 1, width + 2, height, height + 1]
]

const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, height + 1],
    [width, width + 1, width + 2, height + 1],
    [1, width, width + 1, height + 1]
]

const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1]
]

const iTetromino = [
    [1, width + 1, height + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, height + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3]
]

const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

function control(e) {
    switch (e.which) {
        case 38:
            rotate()
            break;
        case 39:
            goRight()
            break;
        case 37:
            goLeft()
            break;
        case 40:
            moveDown()
            break;

        default:
            return
            break;
    }
}
// random tetris
let random = Math.floor(Math.random() * 5);
let currentRoation = 0;
let current = theTetrominoes[random][currentRoation];

//move tetris down
function draw() {
    current.forEach(index => squares[currentPosition + index].classList.add('block'))
}

function undraw() {
    current.forEach(index => squares[currentPosition + index].classList.remove('block'))
}

function moveDown() {
    undraw()
    currentPosition = currentPosition + width;
    draw()
    freeze()
}

function goRight() {
    undraw()
    const rightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if (!rightEdge) currentPosition++;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) currentPosition--;
    draw()
}

function goLeft() {
    undraw()
    const leftEdge = current.some(index => (currentPosition + index) % width === 0)
    if (!leftEdge) currentPosition--;
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) currentPosition++;
    draw()
}



function rotate() {
    undraw()
    currentRoation++
    if (current.some(index => (currentPosition + index) % width === width - 1)) currentPosition -= 1
    if (current.some(index => (currentPosition + index) % width === 0)) currentPosition += 1
    if (currentRoation === current.length) currentRoation = 0;
    current = theTetrominoes[random][currentRoation]
    draw()
}

function freeze() {
    if (current.some(index => squares[currentPosition + index].classList.contains('block3') ||
            squares[currentPosition + index].classList.contains('block2'))) {
        undraw()
        currentPosition -= width
        current.forEach(index => squares[currentPosition + index].classList.add('block2'))

        nextrandom = Math.floor(Math.random() * 4);
        random = nextrandom
        current = theTetrominoes[random][currentRoation]
        currentPosition = 4;
        addScore()
        gameover()
        draw()

    }
}

function gameover() {
    if (current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
        clearInterval(timeInterval);
        current.forEach(index => squares[currentPosition + index].classList.add('block2'))
        alert('game is over')
    }
}

function addScore() {
    for (let i = 0; i < 199; i += width) {
        let row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
        if (row.every(index => squares[index].classList.contains('block2'))) {
            points += 10
            score.textContent = points
            row.forEach(index => squares[index].classList.remove('block2') ||
                squares[index].classList.remove('block'))
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell))
            if ((points > 30 && points < 50) || (points > 90 && points < 110)) {
                clearInterval(timeInterval)
                speed = speed * 0.8
                speedIndicator++
                speedSpan.textContent = speedIndicator
                timeInterval = setInterval(moveDown, speed)
            }

        }
    }
}


//events
document.addEventListener('keydown', control);
start.addEventListener('click', () => {
    if (timeInterval) {
        points = 0;
        clearInterval(timeInterval);
        squares.forEach(sq => sq.classList.remove('block2') || sq.classList.remove('block'))
        start.textContent = "Start new game"
        timeInterval = null;
    } else {
        start.textContent = "Reset"
        speedSpan.textContent = speedIndicator
        draw();
        timeInterval = setInterval(moveDown, speed)
    }
})