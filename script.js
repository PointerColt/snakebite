const gridBox = document.querySelector(".grid-box");
let scoreDiv = document.querySelector(".score-card");

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

let bestScoreVar = Number(localStorage.getItem("bestScore")) || 0;
scoreDiv.children[2].children[1].textContent =
  localStorage.getItem("bestscore");

// make the grid of cells like 20*20 grid cell
for (let i = 0; i < colms * rows; i++) {
  let cell = document.createElement("div");
  cell.classList.add("cell");
  cellArr.push(cell);
  gridBox.appendChild(cell);
}

// check the direction of snake and also update it //
document.addEventListener("keydown", (eventObj) => {
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

// food
locateFood();

// Crawl the snake
addClassToDiv();
const intervalId = setInterval(gameLoop, 200);

// ************************ functions ****************** //
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
    bestScore();
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
  snakee.forEach((element) => {
    let indexOfCells = 0;
    indexOfCells = convertXYintoIndex(element.x, element.y);
    cellArr[indexOfCells].classList.add("snakebody");
  });
}

function removeClassToDiv() {
  cellArr.forEach((element) => {
    element.classList.remove("snakebody");
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
  snakee = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];
  snakeFood = { x: 10, y: 10 };
  score = 0;
}

function bestScore() {
  if (score > bestScoreVar) {
    bestScoreVar = score;
    localStorage.setItem("bestscore", bestScoreVar);
  }
}
