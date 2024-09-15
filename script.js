let board;
const boardWidth = 360;
const boardHeight = 640;
let context;

// bird

const birdWidth = 34;
const birdHeight = 24;
const birdX = boardWidth / 8;
const birdY = boardHeight / 2;
let birdImg;

const bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height: birdHeight,
}

// pipes

let pipeArray = [];
const pipeWidth = 64;
const pipeHeight = 512;
const pipeX = boardWidth
const pipeY = 0;
let topPipeImg;
let bottomPipeImg;

// game physics

const velocityX = -2; // moving speed
let velocityY = 0; // bird jump speed
const gravity = 0.4;

// game state
let gameOver = false;
let score = 0;

window.onload = () => {
    // draw board
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    // image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = () => {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";
    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";
        
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // 1.5s
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

const update = () => {
    requestAnimationFrame(update);

    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    // bird movement
    velocityY += gravity;
    bird.y = Math.max(bird.y + velocityY, 0); // apply gravity + limit to top of canvas

    if (bird.y > boardHeight || bird.y === 0) {
        gameOver = true;
    }

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    // pipes
    for (let i = 0; i < pipeArray.length; i++) {
        const pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // 0.5 x 2 pipes = +1 score
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    // clear pipes 
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift();
    }

    // update score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 170, 45);

    if (gameOver) {
        context.fillText("GAME OVER", 45, 300)
    }
}

const placePipes = () => {

    if (gameOver) {
        return;
    }

    const randomPipeY = pipeY - pipeHeight / 4 - Math.random()*(pipeHeight/2);
    const openingSpace = board.height / 4;

    const topPipe = {
        img: topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false,
    }

    pipeArray.push(topPipe);

    const bottomPipe = {
        img: bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false,
    }

    pipeArray.push(bottomPipe);
}

const moveBird = e => {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type == "click") {
        
        e.preventDefault();
        // jump
        velocityY = -6;

        // reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

const detectCollision = (a, b) => {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}
