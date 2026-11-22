const gridBox = document.querySelector(".grid-box");
let scoreDiv = document.querySelector(".score-card");
let startBtn = document.querySelector("#nav-btn");

const gameOverDialog = document.querySelector("#game-over-dialog");
const finalScore = document.querySelector("#final-score");
const finalBestScore = document.querySelector("#final-best-score");
const playAgainBtn = document.querySelector("#play-again-btn");

const pauseBtn = document.querySelector("#pause-btn");

let intervalId = null;
let isPlaying = false;
let isPaused = false;

const colms = 20,
  rows = 20;
let cellArr = [];

let direction = "right";

let snakee = [
  { x: 0, y: 0 },
  { x: 1, y: 0 },
  { x: 2, y: 0 },
];

let snakeFood = { x: 10, y: 10 };

let score = 0;

let bestScoreVar = Number(localStorage.getItem("bestscore")) || 0;
scoreDiv.children[2].children[1].textContent = bestScoreVar;

// make the grid of cells like 20*20 grid cell
for (let i = 0; i < colms * rows; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cellArr.push(cell);
  gridBox.appendChild(cell);
}

// check the direction of snake and also update it //
document.addEventListener("keydown", (eventObj) => {
  if (!isPlaying) {
    return;
  }

  switch (eventObj.key) {
    case "ArrowUp":
      if (direction != "down") {
        direction = "up";
      }
      break;

    case "ArrowDown":
      if (direction != "up") {
        direction = "down";
      }
      break;

    case "ArrowRight":
      if (direction != "left") {
        direction = "right";
      }
      break;

    case "ArrowLeft":
      if (direction != "right") {
        direction = "left";
      }
      break;
  }
  console.log(direction);
});

// locate the food
locateFood();

// locate the snake
moveSnake();

// start the game
startBtn.addEventListener("click", startGame);

// play again the game
playAgainBtn.addEventListener("click", () => {
  gameOverDialog.close();
  startGame();
});

// pause button
pauseBtn.addEventListener("click", togglepause);

// ************************ functions ****************** //

function startGame() {
  if (isPlaying) return;

  isPlaying = true;
  startBtn.style.display = "none";
  pauseBtn.style.display = "block";
  pauseBtn.textContent = "pause";

  clearInterval(intervalId);

  intervalId = setInterval(() => {
    gameLoop();
  }, 200);
}

function showGameOver() {
  finalScore.textContent = score;
  finalBestScore.textContent = bestScoreVar;

  gameOverDialog.showModal();
}

// helper function to convert x, y into index
function convertXYintoIndex(x, y) {
  return y * colms + x;
}

// update the snake position according to direction
function updateSnake() {
  let head = snakee[snakee.length - 1]; // head -> {x, y}
  let newHead = { x: 0, y: 0 };

  switch (direction) {
    case "up":
      newHead.x = head.x;
      newHead.y = head.y - 1;
      break;

    case "down":
      newHead.x = head.x;
      newHead.y = head.y + 1;
      break;

    case "right":
      newHead.x = head.x + 1;
      newHead.y = head.y;
      break;

    case "left":
      newHead.x = head.x - 1;
      newHead.y = head.y;
      break;
  }

  let hitCondition =
    newHead.x < 0 ||
    newHead.x > colms - 1 ||
    newHead.y < 0 ||
    newHead.y > rows - 1 ||
    snakee.some(
      (element) => element.x === newHead.x && element.y === newHead.y,
    );

  console.log(hitCondition);

  if (hitCondition) {
    clearInterval(intervalId);
    isPlaying = false;

    bestScore();
    showGameOver();
    reset();
    return;
  }

  snakee.push(newHead);

  if (!(newHead.x === snakeFood.x && newHead.y === snakeFood.y)) {
    snakee.shift();
  } else {
    cellArr.forEach((element) => {
      element.classList.remove("food");
    });
    locateFood();
    scoreCounting();
  }
}

function addClassToDiv() {
  let iterator = 0;
  snakee.forEach((element) => {
    let indexOfCells = 0;
    indexOfCells = convertXYintoIndex(element.x, element.y);

    if (iterator === snakee.length - 1) {
      cellArr[indexOfCells].classList.add("snakehead");

      if (direction === "right") {
        cellArr[indexOfCells].classList.add("head-right");
      } else if (direction === "left") {
        cellArr[indexOfCells].classList.add("head-left");
      } else if (direction === "up") {
        cellArr[indexOfCells].classList.add("head-up");
      } else if (direction === "down") {
        cellArr[indexOfCells].classList.add("head-down");
      }
    }

    cellArr[indexOfCells].classList.add("snakebody");

    iterator++;
  });
}

function removeClassToDiv() {
  cellArr.forEach((element) => {
    element.classList.remove("snakebody");
    element.classList.remove("snakehead");
    element.classList.remove("head-right");
    element.classList.remove("head-left");
    element.classList.remove("head-down");
    element.classList.remove("head-up");
  });
}

function moveSnake() {
  removeClassToDiv();
  addClassToDiv();
}

function gameLoop() {
  updateSnake();
  moveSnake();
}

// food of snake
function locateFood() {
  let randomX = Math.floor(Math.random() * colms);
  let randomY = Math.floor(Math.random() * rows);
  while (
    snakee.some((element) => element.x === randomX && element.y === randomY)
  ) {
    randomX = Math.floor(Math.random() * colms);
    randomY = Math.floor(Math.random() * rows);
  }
  snakeFood.x = randomX;
  snakeFood.y = randomY;
  let indexOfCells = 0;
  indexOfCells = convertXYintoIndex(snakeFood.x, snakeFood.y);
  cellArr[indexOfCells].classList.add("food");
}

function scoreCounting() {
  score++;
  scoreDiv.children[1].children[1].textContent = score;
}

function reset() {
  direction = "right";
  isPaused = false;

  snakee = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  snakeFood = { x: 10, y: 10 };
  score = 0;

  // Clear old classes to remove visual glitch
  cellArr.forEach((cell) => {
    cell.classList.remove(
      "food",
      "snakebody",
      "snaketail",
      "snakehead",
      "head-right",
      "head-left",
      "head-up",
      "head-down",
    );
  });

  pauseBtn.style.display = "none";
  startBtn.style.display = "block";
  pauseBtn.textContent = "Pause";

  // Update score display
  scoreDiv.children[1].children[1].textContent = score;

  // Draw fresh game state
  locateFood();
  moveSnake();
}

function bestScore() {
  if (score > bestScoreVar) {
    bestScoreVar = score;
    localStorage.setItem("bestscore", bestScoreVar);

    scoreDiv.children[2].children[1].textContent = bestScoreVar;
  }
}

function togglepause() {
  if (!isPlaying) return;

  if (!isPaused) {
    clearInterval(intervalId);
    isPaused = true;
    pauseBtn.textContent = "Resume";
  } else {
    isPaused = false;
    pauseBtn.textContent = "pause";
    intervalId = setInterval(gameLoop, 200);
  }
}
