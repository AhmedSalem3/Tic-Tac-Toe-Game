let startPage = document.querySelector(".start");
let startGamebtn = document.querySelector(".start-game");
let holder = document.querySelector(".game-blocks");
let gameBlocks = document.querySelectorAll(".block");
let turnSpan = document.querySelector(".turn span");

getStatsFromLocal();

let vsCPU = true;

startGamebtn.addEventListener("click", checkPlayersCount);

// setting weather to play vs CPU or against a player
function checkPlayersCount() {
  let radioBtns = Array.from(
    document.querySelectorAll('input[name="players-count"]')
  );
  let optionChose = radioBtns.find((radio) => radio.checked).value;
  console.log(optionChose);
  if (optionChose == 2) {
    vsCPU = false;
  }
  startPage.remove();
}

let turns = ["X", "O"];

let nextTurn = turns[Math.floor(Math.random() * turns.length)];
toggleTurns();

function toggleTurns() {
  turnSpan.innerHTML = nextTurn;
  nextTurn == turns[0] ? (nextTurn = turns[1]) : (nextTurn = turns[0]);
}
function blockAction() {
  this.classList.add("filled");
  this.querySelector(".back").innerHTML = nextTurn;
  //setting cpu settings
  if (vsCPU) {
    gameBlocks.forEach((block) => block.classList.add("no-clickes"));
    setTimeout(() => {
      playCPU();
      gameBlocks.forEach((block) => block.classList.remove("no-clickes"));
    }, 500);
  }

  if (!vsCPU) {
    checkForWin();
  }
}

function playCPU() {
  let notFilled = document.querySelectorAll(".block:not(.filled) .back");
  if (notFilled.length == 0) return;

  let randomBlock = notFilled[Math.floor(Math.random() * notFilled.length)];

  toggleTurns();
  randomBlock.parentElement.classList.add("filled");
  randomBlock.innerHTML = nextTurn;

  checkForWin();
}

// will create functions for each possible win that return true or false
function checkForWin() {
  let backFaces = Array.from(document.querySelectorAll(".back"));
  let winner;

  if (
    checkColumns(backFaces) ||
    checkRows(backFaces) ||
    checkSlashes(backFaces)
  ) {
    setTimeout(() => endGame(winner), 200);
  } else {
    checkForDraw();
  }

  function checkColumns(backFaces) {
    let columns = [0, 3, 6];

    for (let i = 0; i < 3; i++) {
      let column =
        backFaces[columns[0]].innerHTML +
        backFaces[columns[0] + 1].innerHTML +
        backFaces[columns[0] + 2].innerHTML;

      if (column == "XXX" || column == "OOO") {
        winner = column[0];
        return true;
      }

      columns.shift();
    }
    return false;
  }
  function checkRows(backFaces) {
    for (let i = 0; i < 3; i++) {
      // every row is more than the other by 3
      let row =
        backFaces[i].innerHTML +
        backFaces[i + 3].innerHTML +
        backFaces[i + 6].innerHTML;

      if (row == "XXX" || row == "OOO") {
        winner = row[0];
        return true;
      }
    }
    return false;
  }
  function checkSlashes(backFaces) {
    let leftSummed =
      backFaces[0].innerHTML + backFaces[4].innerHTML + backFaces[8].innerHTML;
    let rightSummed =
      backFaces[2].innerHTML + backFaces[4].innerHTML + backFaces[6].innerHTML;

    if (leftSummed == "XXX" || leftSummed == "OOO") {
      winner = leftSummed[0];
      return true;
    }
    if (rightSummed == "XXX" || rightSummed == "OOO") {
      winner = rightSummed[0];
      return true;
    }

    return false;
  }
}

function endGame(winner) {
  let endgamePopup = document.querySelector(".end");
  let winnerSpan = document.querySelector(".end span");
  endgamePopup.classList.add("show");
  winnerSpan.innerHTML = winner;

  // making the game start again
  setTimeout(() => {
    let allBacks = Array.from(document.querySelectorAll(".block .back"));

    endgamePopup.classList.remove("show");
    allBacks.forEach((e) => {
      e.innerHTML = "";
      e.parentElement.classList.remove("filled");
    });
  }, 2000);

  updateStats(winner);
}

function updateStats(winner) {
  document.querySelector(`.${winner}-stats span`).innerHTML++;
  updateLocal(winner);
}

function checkForDraw() {
  let filledBlocks = Array.from(document.querySelectorAll(".filled .back"));

  if (filledBlocks.length == 9) {
    setTimeout(() => {
      filledBlocks.forEach((e) => {
        e.innerHTML = "";
        e.parentElement.classList.remove("filled");
        document.querySelector(".ties span").innerHTML++;
        updateLocal("tie");
      });
    }, 150);
  }
}

function updateLocal(element) {
  if (localStorage.getItem(element)) {
    let inLocal = localStorage.getItem(element);
    console.log(inLocal);
    localStorage.setItem(element, ++inLocal);
  } else {
    localStorage.setItem(element, 1);
  }
}

function getStatsFromLocal() {
  if (localStorage.getItem("X")) {
    document.querySelector(".X-stats span").innerHTML =
      localStorage.getItem("X");
  }
  if (localStorage.getItem("O")) {
    document.querySelector(".O-stats").innerHTML = localStorage.getItem("O");
  }
  if (localStorage.getItem("ties")) {
    document.querySelector(".ties span").innerHTML =
      localStorage.getItem("ties");
  }
}

gameBlocks.forEach((block) => {
  block.addEventListener("click", toggleTurns);
  block.addEventListener("click", blockAction);
});
