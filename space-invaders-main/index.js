import EnemyController from "./EnemyController.js";
import Player from "./Player.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth * 0.97;
  canvas.height = window.innerHeight * 0.97;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const background = new Image();
background.src = "images/space.png";

let playerBulletController;
let enemyBulletController;
let enemyController;
let player;

let isGameOver = false;
let didWin = false;

const resetButton = document.getElementById("resetButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const startButton = document.getElementById("startButton");

let gameLoopInterval;

function initializeGame() {
  playerBulletController = new BulletController(canvas, 10, "red", true);
  enemyBulletController = new BulletController(canvas, 4, "white", false);
  enemyController = new EnemyController(
    canvas,
    enemyBulletController,
    playerBulletController
  );
  player = new Player(canvas, 3, playerBulletController);

  isGameOver = false;
  didWin = false;
  resetButton.style.display = "none"; // Hide the reset button
  startButton.style.display = "none"; // Hide the start button

  player.startShooting(); // Start automatic shooting

  // Countdown before starting the game
  let count = 3; // Countdown from 3
  const countdownInterval = setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.fillText(count, canvas.width / 2 - 20, canvas.height / 2);
    count--;
    if (count < 0) {
      clearInterval(countdownInterval);
      startGameLoop();
    }
  }, 1000);
}

function startGameLoop() {
  gameLoopInterval = setInterval(game, 1000 / 60);
}

function endGameLoop() {
  clearInterval(gameLoopInterval);
}

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if (!isGameOver) {
    enemyController.draw(ctx);
    player.draw(ctx);
    playerBulletController.draw(ctx);
    enemyBulletController.draw(ctx);
  }
}

function displayGameOver() {
  if (isGameOver) {
    let text = didWin ? "You Win" : "Game Over";
    let textOffset = didWin ? 3.5 : 5;

    ctx.fillStyle = "white";
    ctx.font = "50px Arial";
    ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);

    // Show the reset button when the game is over
    resetButton.style.display = "block";
  }
}

function checkGameOver() {
  if (isGameOver) {
    return;
  }

  if (enemyBulletController.collideWith(player)) {
    isGameOver = true;
    endGameLoop(); // Stop the game loop when game ends
  }

  if (enemyController.collideWith(player)) {
    isGameOver = true;
    endGameLoop(); // Stop the game loop when game ends
  }

  if (enemyController.enemyRows.length === 0) {
    didWin = true;
    isGameOver = true;
    endGameLoop(); // Stop the game loop when game ends
  }
}

resetButton.addEventListener("click", () => {
  initializeGame();
});

startButton.addEventListener("click", () => {
  initializeGame(); // Start the game with the countdown
});

// Handle touch events for mobile controls
function handleControlStart(button, action) {
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    action(true);
  });

  button.addEventListener("touchend", (event) => {
    event.preventDefault();
    action(false);
  });

  button.addEventListener("mousedown", (event) => {
    event.preventDefault();
    action(true);
  });

  button.addEventListener("mouseup", (event) => {
    event.preventDefault();
    action(false);
  });

  button.addEventListener("mouseleave", (event) => {
    event.preventDefault();
    action(false);
  });
}

handleControlStart(leftButton, (isPressed) => {
  player.leftPressed = isPressed;
});

handleControlStart(rightButton, (isPressed) => {
  player.rightPressed = isPressed;
});
