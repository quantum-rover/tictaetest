// Select elements
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('reset-button');
const gameContainer = document.getElementById('game-container');
const gameModeContainer = document.getElementById('game-mode');
const playerVsPlayerButton = document.getElementById('player-vs-player');
const playerVsComputerButton = document.getElementById('player-vs-computer');
let isXTurn = true;
let board = ['', '', '', '', '', '', '', '', ''];
let playerX, playerO, score;
let playingAgainstComputer = false;

playerVsPlayerButton.addEventListener('click', () => {
    playerX = prompt("Enter Player X's name:", "") || "Player X";
    playerO = prompt("Enter Player O's name:", "") || "Player O";
    score = { [playerX]: 0, [playerO]: 0 };
    playingAgainstComputer = false;
    startGame();
});

playerVsComputerButton.addEventListener('click', () => {
    playerX = prompt("Enter Player's name:", "") || "Player";
    playerO = "Computer";
    score = { [playerX]: 0, [playerO]: 0 };
    playingAgainstComputer = true;
    startGame();
});

function startGame() {
    gameModeContainer.style.display = 'none';
    gameContainer.style.display = 'grid';
    resetButton.style.display = 'block';
    updateScoreDisplay();
    resetBoard();
}

const resultDisplay = document.getElementById('result-display');
const scoreDisplay = document.getElementById('score-display');
updateScoreDisplay();

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleClick(e) {
    const cell = e.target;
    const currentClass = isXTurn ? 'X' : 'O';
    const currentPlayer = isXTurn ? playerX : playerO;
    const cellIndex = Array.from(cells).indexOf(cell);

    if (board[cellIndex] !== '') return;

    board[cellIndex] = currentClass;
    cell.textContent = currentClass;
    cell.classList.add(currentClass === 'X' ? 'x-move' : 'o-move');
    cells.forEach(cell => cell.classList.remove('highlight'));
    cell.classList.add('highlight');

    if (checkWin(currentClass)) {
        highlightWinningCombination(currentClass);
        displayResult(`${currentPlayer} (${currentClass}) wins!`);
        score[currentPlayer] += 1;
        updateScoreDisplay();
        disableBoard();
    } else if (board.every(cell => cell !== '')) {
        displayResult("It's a draw!");
        disableBoard();
    } else {
        isXTurn = !isXTurn;
        if (playingAgainstComputer && !isXTurn) {
            setTimeout(computerMove, 500);
        }
    }
}

function computerMove() {
    const emptyCells = board.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    if (emptyCells.length === 0) return;

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell = cells[randomIndex];

    board[randomIndex] = 'O';
    cell.textContent = 'O';
    cell.classList.add('o-move');

    if (checkWin('O')) {
        highlightWinningCombination('O');
        displayResult(`Computer (O) wins!`);
        score['Computer'] += 1;
        updateScoreDisplay();
        disableBoard();
    } else if (board.every(cell => cell !== '')) {
        displayResult("It's a draw!");
        disableBoard();
    } else {
        isXTurn = true;
    }
}

function checkWin(currentClass) {
    return winningCombinations.some(combination => {
        return combination.every(index => board[index] === currentClass);
    });
}

function highlightWinningCombination(currentClass) {
    const winningCombination = winningCombinations.find(combination => {
        return combination.every(index => board[index] === currentClass);
    });
    if (winningCombination) {
        winningCombination.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }
}

function displayResult(message) {
    resultDisplay.textContent = message;
    resultDisplay.classList.add('show-result');
    setTimeout(() => {
        alert(message);
    }, 100);
}

function updateScoreDisplay() {
    scoreDisplay.innerHTML = `Score: ${playerX} (X) - ${score[playerX]} | ${playerO} (O) - ${score[playerO]}`;
}

function disableBoard() {
    cells.forEach(cell => cell.removeEventListener('click', handleClick));
}

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('highlight', 'winning-cell', 'x-move', 'o-move');
    });
    resultDisplay.textContent = '';
    isXTurn = true;
    cells.forEach(cell => cell.addEventListener('click', handleClick));
}

cells.forEach(cell => cell.addEventListener('click', handleClick));
resetButton.addEventListener('click', resetBoard);
