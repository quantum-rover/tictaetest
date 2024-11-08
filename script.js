const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('reset-button');
const gameContainer = document.getElementById('game-container');
let isXTurn = true;
let board = ['', '', '', '', '', '', '', '', ''];
let playerX = "Player X";
let playerO = "Player O";
let score = { [playerX]: 0, [playerO]: 0 };

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

    if (board[cellIndex] !== '') return; // Prevent overwriting moves

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
        isXTurn = !isXTurn; // Switch turns
    }
}

function checkWin(currentClass) {
    return winningCombinations.find(combination => {
        if (combination.every(index => board[index] === currentClass)) {
            return combination;
        }
        return false;
    });
}

function highlightWinningCombination(currentClass) {
    const winningCombination = checkWin(currentClass);
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
