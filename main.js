const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const ARROW_UP = 38;
const W_BUTTON = 87;

const ARROW_DOWN = 40;
const S_BUTTON = 83;

const ARROW_LEFT = 37;
const A_BUTTON = 65;

const ARROW_RIGHT = 39;
const D_BUTTON = 68;

const MAX_SPEED = 20;

const TILE_OFFSET = 5;
const TILE_COUNT = 20;
const TILE_SIZE = canvas.width / TILE_COUNT - TILE_OFFSET;

const COLLISION_OFFSET = 4;

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const snakeParts = [];

const gameState = {
  speed: 7,
  snakeHeadX: 10,
  snakeHeadY: 10,
  tailLength: 2,
  applePosX: 5,
  applePosY: 5,
  xVelocity: 0,
  yVelocity: 0,
  score: 0,
};

// copy of start state
const initialState = { ...gameState };

// game loop
const drawGame = () => {
  changeSnakePosition();

  let isGameover = isGameOver();
  if (isGameover) {
    gameOverDraw();
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();
  document.body.addEventListener("keydown", keyDownListener);

  setTimeout(drawGame, 1000 / gameState.speed);
};

const isGameOver = () => {
  let gameOver = false;

  // Don't end game on start collision
  if (gameState.xVelocity === 0 && gameState.yVelocity === 0) {
    return false;
  }

  // check wall collision
  if (gameState.snakeHeadX < 0 || gameState.snakeHeadX > TILE_COUNT + COLLISION_OFFSET) {
    gameOver = true;
  } else if (
    gameState.snakeHeadY < 0 ||
    gameState.snakeHeadY > TILE_COUNT + COLLISION_OFFSET
  ) {
    gameOver = true;
  }

  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    if (part.x === gameState.snakeHeadX && part.y === gameState.snakeHeadY) {
      gameOver = true;
      break;
    }
  }

  return gameOver;
};

const gameOverDraw = () => {
  // Show gameover msg
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px Tahoma";
  ctx.fillText(`GAME OVER`, canvas.width / 2 - 135, canvas.height / 2);

  // Show restart button
  document.querySelector(".replay-button").classList.toggle("hide");
};

const restartGame = () => {
  for (const prop in gameState) {
    gameState[prop] = initialState[prop];
  }
  snakeParts.length = 0;

  // Hide restart button
  document.querySelector(".replay-button").classList.toggle("hide");

  drawGame();
};

const speedIncrease = () => {
  if (gameState.score > 0 && gameState.score < MAX_SPEED) {
    return (gameState.speed += 1);
  }
  return gameState.speed;
};

const drawScore = () => {
  let scoreElem = document.querySelector(".score");
  scoreElem.textContent = gameState.score;
  ctx.fillStyle = "#fff";
  ctx.font = "10px consolas";
  ctx.fillText(`Score  ${gameState.score}`, canvas.width - 50, 10);
};

const clearScreen = () => {
  // background
  ctx.fillStyle = "#3f3f3f";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

const changeSnakePosition = () => {
  gameState.snakeHeadX += gameState.xVelocity;
  gameState.snakeHeadY += gameState.yVelocity;
};

const checkAppleCollision = () => {
  if (
    gameState.applePosX === gameState.snakeHeadX &&
    gameState.applePosY === gameState.snakeHeadY
  ) {
    gameState.applePosX = Math.floor(Math.random() * TILE_COUNT);
    gameState.applePosY = Math.floor(Math.random() * TILE_COUNT);
    gameState.tailLength++;
    gameState.score++;
    gameState.speed = speedIncrease();
  }
};

const drawApple = () => {
  ctx.fillStyle = "#f00";
  ctx.fillRect(
    gameState.applePosX * TILE_COUNT,
    gameState.applePosY * TILE_COUNT,
    TILE_SIZE,
    TILE_SIZE
  );
};

const drawSnake = () => {
  // snake tail
  ctx.fillStyle = "#fff";
  for (let i = 0; i < snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(
      part.x * TILE_COUNT,
      part.y * TILE_COUNT,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  snakeParts.push(new SnakePart(gameState.snakeHeadX, gameState.snakeHeadY)); // put an item at the end of the list next to the head
  if (snakeParts.length > gameState.tailLength) {
    snakeParts.shift(); // remove the furthers item from the snake parts if have more than our tail size
  }

  // snake head
  ctx.fillStyle = "#fff";
  ctx.fillRect(
    gameState.snakeHeadX * TILE_COUNT,
    gameState.snakeHeadY * TILE_COUNT,
    TILE_SIZE,
    TILE_SIZE
  );
};

const keyDownListener = (e) => {
  // up
  if (e.keyCode === ARROW_UP || e.keyCode === W_BUTTON) {
    if (gameState.yVelocity === 1) return;
    gameState.xVelocity = 0;
    gameState.yVelocity = -1;
  }

  // down
  if (e.keyCode === ARROW_DOWN || e.keyCode === S_BUTTON) {
    if (gameState.yVelocity === -1) return;
    gameState.xVelocity = 0;
    gameState.yVelocity = 1;
  }

  // left
  if (e.keyCode === ARROW_LEFT || e.keyCode === A_BUTTON) {
    if (gameState.xVelocity === 1) return;
    gameState.xVelocity = -1;
    gameState.yVelocity = 0;
  }

  // right
  if (e.keyCode === ARROW_RIGHT || e.keyCode === D_BUTTON) {
    if (gameState.xVelocity === -1) return;
    gameState.xVelocity = 1;
    gameState.yVelocity = 0;
  }
};


drawGame();
