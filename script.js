function generateComputerMove() {
    const moves = ["rock", "paper", "scissors"];
    return moves[Math.floor(Math.random() * moves.length)];
}

async function generateGames(gameIdArray) {
    const numberOfGames = 5;
    const groupId = "groupId-" + Date.now().toString();

    for (let i = 0; i < numberOfGames; i++) {
        try {
            const response = await fetch(
                "https://api.restful-api.dev/objects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: `game-${i + 1}`,
                        data: {
                            playerMove: "pending",
                            computerMove: generateComputerMove(),
                            gameSetId: groupId,
                            playerMoveImg: "pending",
                        },
                    }),
                },
            );

            const data = await response.json();
            gameIdArray.push(data.id);
        } catch {
            throw new Error("something went wrong");
        }
    }
}

function displayGameDisplay() {
    gameDisplay.style.display = "flex";
    gameDisplay.style.justifyContent = "center";
    gameDisplay.style.alignItems = "center";
}

function hideGameDisplay() {
    gameDisplay.style.display = "none";
}

function hideNewGameDisplay() {
    beginGameDisplay.style.display = "none";
}

function showLoader() {
    loader.style.display = "block";
}

function hideLoader() {
    loader.style.display = "none";
}

function displayNewGameDisplay() {
    beginGameDisplay.style.display = "flex";
}

function playGame() {
    gameplayDisplay.style.display = "flex";
    versus.style.display = "block";
    computerMove.style.display = "flex";
}

async function getRequest(gameId) {
    try {
        const response = await fetch(
            `https://api.restful-api.dev/objects/${gameId}`,
        );
        const data = await response.json();

        const img = document.querySelector(".computer-move img");
        img.src = moveAndImageSrc[data.data.computerMove];
        return [data.data.computerMove, data.data.playerMove];
    } catch {
        throw new Error("something went wrong");
    }
}

async function putRequest(gameId, playerMove, imageSrc) {
    try {
        const response = await fetch(
            `https://api.restful-api.dev/objects/${gameId}`,
        );
        const data = await response.json();
        const computerMove = data.data.computerMove;
        const gameSetId = data.data.gameSetId;

        const res = await fetch(
            `https://api.restful-api.dev/objects/${gameId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: {
                        playerMove: playerMove,
                        computerMove,
                        gameSetId,
                        playerMoveImg: imageSrc,
                    },
                }),
            },
        );
    } catch {
        throw new Error("something went wrong");
    }
}

function determineWinner(computer, player) {
    const winningCombinations = {
        rock: "scissors",
        paper: "rock",
        scissors: "paper",
    };

    if (player === computer) return "tie";
    if (winningCombinations[player] === computer) return "player";
    return "computer";
}

const gameDisplayButtons = document.querySelectorAll(".game-display button");
const beginGameDisplay = document.querySelector(".begin-game");
const returnButton = gameDisplayButtons[0];
const startGameButton = gameDisplayButtons[1];
const gameDisplay = document.querySelector(".game-display");
const newGameButton = document.querySelector(".begin-game button");
const loader = document.querySelector(".loader");
const gameplayDisplay = document.querySelector(".rock-paper-scissors-buttons");
const versus = document.querySelector(".versus");
const computerMove = document.querySelector(".computer-move");
const [rock, paper, scissors] = document.querySelectorAll(
    ".rock-paper-scissors-buttons img",
);
const winnerContainer = document.querySelector(".winner");
const winnerContainerSpan = document.querySelector(".winner span");
let gameIdArray = [];
let gameNumber = 1;
const movesArray = [
    { el: rock, value: "rock" },
    { el: paper, value: "paper" },
    { el: scissors, value: "scissors" },
];

const moveAndImageSrc = {
    rock: "/assets/images/fist.png",
    paper: "/assets/images/hand-paper.png",
    scissors: "/assets/images/scissors.png",
};

newGameButton.addEventListener("click", async () => {
    gameIdArray = [];
    hideNewGameDisplay();
    showLoader();
    await generateGames(gameIdArray);
    hideLoader();
    displayGameDisplay();

    const query = gameIdArray.map((id) => `id=${id}`).join("&");

    const response = await fetch(
        `https://api.restful-api.dev/objects?${query}`,
    );
    const data = await response.json();
    console.log(data);
});

returnButton.addEventListener("click", () => {
    gameNumber = 1;
    hideGameDisplay();
    displayNewGameDisplay();
});

startGameButton.addEventListener("click", () => {
    gameNumber = 1;
    hideGameDisplay();
    playGame();
});

movesArray.forEach(({ el, value }) => {
    el.addEventListener("click", async () => {
        ["rock", "paper", "scissors"]
            .filter((move) => move !== value)
            .forEach((move) => {
                const moveEl = gameplayDisplay.querySelector(`.${move}`);
                moveEl.style.display = "none";
            });

        const gameId = gameIdArray[gameNumber - 1];
        await putRequest(gameId, value, moveAndImageSrc[value]);

        gameNumber++;

        const [computerChoice, playerChoice] = await getRequest(gameId);
        const winner = determineWinner(computerChoice, playerChoice);
        winnerContainerSpan.innerHTML = winner;
        winnerContainer.style.display = "block";
    });
});
