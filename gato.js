const STATUS_DISPLAY = document.querySelector('.game-notification'),
  SCORE_X = document.querySelector('.score-x'),
  SCORE_O = document.querySelector('.score-o'),
  GAME_STATE = ["", "", "", "", "", "", "", "", ""],
  WINNINGS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ],
  WIN_MESSAGE = () => `El jugador ${currentPlayer} ha ganado!`,
  DRAW_MESSAGE = () => `El juego ha terminado en empate!`,
  CURRENT_PLAYER_TURN = () => `Turno del jugador ${currentPlayer}`

let gameActive = true,
  currentPlayer = "X",
  scoreX = 0,
  scoreO = 0;

function main() {

  if (localStorage.getItem('scoreX')) {
    scoreX = parseInt(localStorage.getItem('scoreX'));
  }
  if (localStorage.getItem('scoreO')) {
    scoreO = parseInt(localStorage.getItem('scoreO'));
  }

  SCORE_X.textContent = scoreX;
  SCORE_O.textContent = scoreO;
  
  handleStatusDisplay(CURRENT_PLAYER_TURN());
  listeners();
}

function listeners() {
  document.querySelector('.game-container').addEventListener('click', handleCellClick);
  document.querySelector('.game-restart').addEventListener('click', handleRestartGame);
}

function handleStatusDisplay(message) {
  STATUS_DISPLAY.innerHTML = message;
}

function handleRestartGame() {
  gameActive = true;
  currentPlayer = "X";
  restartGameState();
  handleStatusDisplay(CURRENT_PLAYER_TURN());
  document.querySelectorAll('.game-cell').forEach(cell => cell.innerHTML = "");
}

function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  if (clickedCell.classList.contains('game-cell')) {
    const clickedCellIndex = Array.from(clickedCell.parentNode.children).indexOf(clickedCell);
    if (GAME_STATE[clickedCellIndex] !== '' || !gameActive || currentPlayer === "O") {
      return false;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
  }
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
  GAME_STATE[clickedCellIndex] = currentPlayer;
  clickedCell.innerHTML = currentPlayer;
}

function handleResultValidation() {
  let roundWon = false;
  for (let i = 0; i < WINNINGS.length; i++) {
    const winCondition = WINNINGS[i];
    let position1 = GAME_STATE[winCondition[0]],
      position2 = GAME_STATE[winCondition[1]],
      position3 = GAME_STATE[winCondition[2]];

    if (position1 === '' || position2 === '' || position3 === '') {
      continue; 
    }
    if (position1 === position2 && position2 === position3) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    handleStatusDisplay(WIN_MESSAGE());
    gameActive = false;
    updateScore();
    return;
  }

  let roundDraw = !GAME_STATE.includes("");
  if (roundDraw) {
    handleStatusDisplay(DRAW_MESSAGE());
    gameActive = false;
    return;
  }

  handlePlayerChange();
}

function updateScore() {
  if (currentPlayer === "X") {
    scoreX++;
    SCORE_X.textContent = scoreX;
    localStorage.setItem('scoreX', scoreX);
  } else {
    scoreO++;
    SCORE_O.textContent = scoreO;
    localStorage.setItem('scoreO', scoreO);
  }

  if (scoreX >= 100 || scoreO >= 100) {
    handleGameEnd();
  }
}

function handleGameEnd() {
  handleStatusDisplay('Juego terminado!');
  gameActive = false;
}

function handlePlayerChange() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  handleStatusDisplay(CURRENT_PLAYER_TURN());

  if (currentPlayer === "O" && gameActive) {
    setTimeout(() => {
      handleAIPlay();
      handleResultValidation();
    }, 500);
  }
}

function handleAIPlay() {
  let emptyCells = GAME_STATE.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
  if (emptyCells.length > 0) {
    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = document.querySelectorAll('.game-cell')[randomIndex];
    handleCellPlayed(cell, randomIndex);
  }
}

function restartGameState() {
  let i = GAME_STATE.length;
  while (i--) {
    GAME_STATE[i] = '';
  }
}

main();