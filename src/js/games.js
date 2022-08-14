const playerContent = document.querySelector(".player-content");
const computerContent = document.querySelector(".computer-content");
const descriptionContent = document.querySelector(".description-content");

const resetGameButton = document.querySelector(".reset-game");

let gameChoices = ["rock", "paper", "scissor"];
let gameResults = ["PLAYER 1 WIN", "DRAW", "COMP WIN"];

class Player {
  // Add to object itself
  constructor(shapeName) {
    this.shapeName = shapeName;
  }

  // Add to prototype __proto__: Player.prototype

  selectShape(shape) {
    this.shapeName = shape;
    console.log(this.shapeName, "USER");
  }

  // Encapsulation --> You can't access outside the class even subclass that inherit from parent
  #reset() {
    // Algorithm reset game
    // You should change the UI
    if (
      (this.shapeName === null && ComputerGame.shapeNameComputer === null) ||
      (this.shapeName === undefined &&
        ComputerGame.shapeNameComputer === undefined)
    ) {
      return;
    }
    const selectPlayer = playerContent?.querySelector(
      `img[alt=${this.shapeName}]`
    ).parentNode;
    selectPlayer.style.backgroundColor = "transparent";
    selectPlayer.style.borderRadius = "0px";

    const autoSelectCom = computerContent?.querySelector(
      `img[alt=${ComputerGame?.shapeNameComputer}]`
    ).parentNode;
    autoSelectCom.style.backgroundColor = "transparent";
    autoSelectCom.style.borderRadius = "0px";

    const gamePredictionDesc =
      descriptionContent?.querySelector(".game-prediction");
    gamePredictionDesc.classList.toggle("game-result");
    gamePredictionDesc.children[0].textContent = "VS";

    // You should reset the data of player
    this.shapeName = null;
    // You should reset the data of computer
    ComputerGame.shapeNameComputer = null;

    // You should add hover
    addHover();

    // You should add functionality to play the game
    playGame();
  }

  resetGame() {
    this.#reset();
  }
}

const PlayerGame = new Player();

class Computer extends Player {
  // Add to object itself
  constructor(shapeName, shapeNameComputer, number) {
    super(shapeName);
    this.shapeNameComputer = shapeNameComputer;
    this.number = number;
  }

  // Add to prototype __proto__: Computer.prototype

  // Polymorphism
  selectShape(number) {
    this.number = number;
    if (this.number >= 1 && this.number <= 10) {
      this.shapeNameComputer = gameChoices[0];
    } else if (this.number >= 10 && this.number <= 20) {
      this.shapeNameComputer = gameChoices[1];
    } else {
      this.shapeNameComputer = gameChoices[2];
    }
  }
}

const ComputerGame = new Computer();

// Generate Computer Random Number
function generateNumber() {
  let randomNumber = Math.ceil(Math.random() * 30);
  ComputerGame.selectShape(randomNumber);
}

// Compare Player and Computer
function comparePlayerCom(shapeNamePlayer, shapeNameCom) {
  let gameResult;

  if (
    (shapeNamePlayer === gameChoices[0] && shapeNameCom === gameChoices[2]) ||
    (shapeNamePlayer === gameChoices[1] && shapeNameCom === gameChoices[0]) ||
    (shapeNamePlayer === gameChoices[2] && shapeNameCom === gameChoices[1])
  ) {
    gameResult = gameResults[0];
  } else if (shapeNamePlayer === shapeNameCom) {
    gameResult = gameResults[1];
  } else {
    gameResult = gameResults[2];
  }

  return gameResult;
}

// Change UI After Compare Player And Computer
function changeUIAfterCompare(gameResult, shapeNamePlayer, shapeNameCom) {
  const selectPlayer = playerContent.querySelector(
    `img[alt=${shapeNamePlayer}]`
  ).parentNode;
  selectPlayer.style.backgroundColor = "#C4C4C4";
  selectPlayer.style.borderRadius = "3px";

  const autoSelectCom = computerContent.querySelector(
    `img[alt=${shapeNameCom}]`
  ).parentNode;
  autoSelectCom.style.backgroundColor = "#C4C4C4";
  autoSelectCom.style.borderRadius = "3px";

  // Game Result Description
  const gamePredictionDesc =
    descriptionContent.querySelector(".game-prediction");

  gamePredictionDesc.classList.toggle("game-result");
  gamePredictionDesc.children[0].textContent = gameResult;

  console.log(gameResult);
}

// Disable Handler After Playing the game
function disableHandler(targetShape) {
  playerContent.removeEventListener("click", playGameHandler);
  playerContent.removeEventListener("mouseover", hoverShapeHandler);
  document
    .querySelector(`img[alt=${targetShape}`)
    .classList.remove("shape-hover");
}

// Hover Shape Handler
function hoverShapeHandler(e) {
  if (e.target.classList.contains("shape")) {
    document
      .querySelector(`img[alt=${e.target.alt}`)
      .classList.add("shape-hover");
  }
}

// Add Hover
function addHover() {
  playerContent.addEventListener("mouseover", hoverShapeHandler);
}

addHover();

// Play Game Handler
function playGameHandler(e) {
  if (e.target.classList.contains("shape")) {
    PlayerGame.selectShape(e.target.alt);
    generateNumber();
    let gameResult = comparePlayerCom(
      e.target.alt,
      ComputerGame.shapeNameComputer
    );

    changeUIAfterCompare(
      gameResult,
      e.target.alt,
      ComputerGame.shapeNameComputer
    );
    disableHandler(e.target.alt);
  }
}

// Play Game
function playGame() {
  playerContent.addEventListener("click", playGameHandler);
}

playGame();

function resetGameHandler() {
  PlayerGame.resetGame();
}

// Reset Game
function resetGame() {
  resetGameButton.addEventListener("click", resetGameHandler);
}

resetGame();
