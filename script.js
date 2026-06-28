const welcomeScreen = document.querySelector(".welcome-screen");
const gameScreen = document.querySelector(".game-screen");

const pvpBtn = document.getElementById("pvp-btn");
const aiBtn = document.getElementById("ai-btn");

const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");

const startBtn = document.getElementById("start-btn");

const playersDisplay = document.getElementById("players-display");
const turnDisplay = document.getElementById("turn-display");
const resultMessage = document.getElementById("result-message");

const resetBtn = document.getElementById("reset-btn");
const newGameBtn = document.getElementById("new-game-btn");

const cells = document.querySelectorAll(".cell");

let gameMode = "";
let player1Name = "";
let player2Name = "";

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let gameOver = false;

const winningCombinations = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

/* MODE SELECTION */

pvpBtn.addEventListener("click", () => {

    gameMode = "pvp";

    player2Input.style.display = "block";
    player2Input.placeholder = "Enter Player 2 Name";

    pvpBtn.classList.add("active");
    aiBtn.classList.remove("active");
});

aiBtn.addEventListener("click", () => {

    gameMode = "ai";

    player2Input.style.display = "none";

    aiBtn.classList.add("active");
    pvpBtn.classList.remove("active");
});

/* START GAME */

startBtn.addEventListener("click", () => {

    player1Name = player1Input.value.trim();

    if(player1Name === ""){
        alert("Please enter Player 1 name");
        return;
    }

    if(gameMode === ""){
        alert("Please select a game mode");
        return;
    }

    if(gameMode === "pvp"){

        player2Name = player2Input.value.trim();

        if(player2Name === ""){
            alert("Please enter Player 2 name");
            return;
        }

        playersDisplay.textContent =
        `${player1Name} (X) vs ${player2Name} (O)`;
    }

    else{

        player2Name = "AI Opponent";

        playersDisplay.textContent =
        `${player1Name} (X) vs AI Opponent (O)`;
    }

    turnDisplay.textContent =
    `Current Turn: ${player1Name}`;

    welcomeScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
});

/* WINNER CHECK */

function checkWinner(){

    for(let combination of winningCombinations){

        const [a,b,c] = combination;

        if(
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ){
            return board[a];
        }
    }

    return null;
}

/* DRAW CHECK */

function checkDraw(){

    return board.every(cell => cell !== "");
}

/* AI MOVE */

function aiMove(){

    if(gameOver) return;

    let emptyCells = [];

    board.forEach((cell,index)=>{
        if(cell === ""){
            emptyCells.push(index);
        }
    });

    if(emptyCells.length === 0) return;

    const randomIndex =
    emptyCells[Math.floor(Math.random() * emptyCells.length)];

    board[randomIndex] = "O";

    cells[randomIndex].textContent = "O";
    cells[randomIndex].classList.add("o");

    const winner = checkWinner();

    if(winner){

        resultMessage.textContent =
        `${player2Name} Wins! 🏆`;

        gameOver = true;
        return;
    }

    if(checkDraw()){

        resultMessage.textContent =
        "It's a Draw! 🤝";

        gameOver = true;
        return;
    }

    currentPlayer = "X";

    turnDisplay.textContent =
    `Current Turn: ${player1Name}`;
}

/* CELL CLICK */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        if(gameOver) return;

        const index = cell.dataset.index;

        if(board[index] !== ""){
            return;
        }

        board[index] = currentPlayer;

        cell.textContent = currentPlayer;

        if(currentPlayer === "X"){
            cell.classList.add("x");
        }
        else{
            cell.classList.add("o");
        }

        const winner = checkWinner();

        if(winner){

            if(winner === "X"){
                resultMessage.textContent =
                `${player1Name} Wins! 🏆`;
            }
            else{
                resultMessage.textContent =
                `${player2Name} Wins! 🏆`;
            }

            gameOver = true;
            return;
        }

        if(checkDraw()){

            resultMessage.textContent =
            "It's a Draw! 🤝";

            gameOver = true;
            return;
        }

        if(gameMode === "ai"){

            currentPlayer = "O";

            turnDisplay.textContent =
            `Current Turn: ${player2Name}`;

            setTimeout(aiMove,500);

            return;
        }

        if(currentPlayer === "X"){

            currentPlayer = "O";

            turnDisplay.textContent =
            `Current Turn: ${player2Name}`;
        }

        else{

            currentPlayer = "X";

            turnDisplay.textContent =
            `Current Turn: ${player1Name}`;
        }

    });

});

/* RESET GAME */

function resetBoard(){

    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameOver = false;

    resultMessage.textContent = "";

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove("x");
        cell.classList.remove("o");
    });

    turnDisplay.textContent =
    `Current Turn: ${player1Name}`;
}

resetBtn.addEventListener("click", resetBoard);

/* NEW GAME */

newGameBtn.addEventListener("click", () => {

    resetBoard();

    gameScreen.classList.add("hidden");
    welcomeScreen.classList.remove("hidden");

    player1Input.value = "";
    player2Input.value = "";

    gameMode = "";

    pvpBtn.classList.remove("active");
    aiBtn.classList.remove("active");

    player2Input.style.display = "block";
});