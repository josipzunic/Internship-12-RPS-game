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

    rock.style.display = "block";
    paper.style.display = "block";
    scissors.style.display = "block";
}

function hideGame() {
    gameplayDisplay.style.display = "none";
    versus.style.display = "none";
    computerMove.style.display = "none";
}

function resetComputerImage() {
    const compImg = computerMove.querySelector("img");
    compImg.src = "/assets/images/6fd.jpg";
}

function hideWinner() {
    winnerContainer.style.display = "none";
    winnerContainerSpan.innerHTML = "WINNER: ";
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
const newGameButton = document.querySelectorAll(".begin-game button")[0];
const loader = document.querySelector(".loader");
const gameplayDisplay = document.querySelector(".rock-paper-scissors-buttons");
const versus = document.querySelector(".versus");
const computerMove = document.querySelector(".computer-move");
const [rock, paper, scissors] = document.querySelectorAll(
    ".rock-paper-scissors-buttons img",
);
const winnerContainer = document.querySelector(".winner-container");
const winnerContainerSpan = document.querySelector(".winner-container span");
const nextGameButton = document.querySelector(".winner-container button");
const game = document.querySelector(".rock-paper-scissors-game");
const reviewButton = document.querySelectorAll(".begin-game button")[1];
const returnFromReviewButton = document.querySelector(
    ".review-container button",
);
const reviewContainer = document.querySelector(".review-container");
const reviewList = document.querySelector(".review-list");
let gameIdArray = [];
let gameNumber = 1;
const movesArray = [
    { el: rock, value: "rock" },
    { el: paper, value: "paper" },
    { el: scissors, value: "scissors" },
];

const savedGameIds = localStorage.getItem("lastGameIds");
if (savedGameIds) {
    gameIdArray = JSON.parse(savedGameIds);
}

const moveAndImageSrc = {
    rock: "/assets/images/rockrock.png",
    paper: "/assets/images/Toilet-Paper.png",
    scissors: "/assets/images/scissorsscissors.png",
};

newGameButton.addEventListener("click", async () => {
    gameIdArray = [];
    localStorage.removeItem("lastGameIds");
    hideNewGameDisplay();
    showLoader();
    await generateGames(gameIdArray);
    localStorage.setItem("lastGameIds", JSON.stringify(gameIdArray));
    hideLoader();
    displayGameDisplay();
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
    movesArray.forEach(({ el }) => {
        el.style.pointerEvents = "none";
        el.style.opacity = "0.5";
    });

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

        winnerContainer.style.display = "flex";
        winnerContainerSpan.innerHTML += " " + winner;
    });
});

nextGameButton.addEventListener("click", () => {
    if (gameNumber > 5) {
        gameNumber = 1;
        hideGameDisplay();
        displayNewGameDisplay();
        hideGame();
        resetComputerImage();
        hideWinner();
        return;
    }

    hideWinner();
    ["rock", "paper", "scissors"].forEach((move) => {
        const moveEl = gameplayDisplay.querySelector(`.${move}`);
        if (moveEl) moveEl.style.display = "block";
    });

    movesArray.forEach(({ el }) => {
        el.style.pointerEvents = "auto";
        el.style.opacity = "1";
    });

    resetComputerImage();
});

reviewButton.addEventListener("click", async () => {
    if (!gameIdArray.length) {
        alert("No games to display");
        return;
    }

    reviewList.innerHTML = "";

    reviewContainer.style.display = "flex";

    hideGameDisplay();
    hideNewGameDisplay();

    try {
        const query = gameIdArray.map((id) => `id=${id}`).join("&");

        const response = await fetch(
            `https://api.restful-api.dev/objects?${query}`,
        );
        const data = await response.json();

        let winner,
            playerWinCount = 0,
            computerWinCount = 0;

        data.forEach((game, index) => {
            winner = determineWinner(
                game.data.computerMove,
                game.data.playerMove,
            );
            if (winner === "player") playerWinCount++;
            else if (winner === "computer") computerWinCount++;

            const reviewText = `ROUND #${index + 1} -> player: ${game.data.playerMove} - computer: ${game.data.computerMove} - winner: ${winner}`;

            const reviewItem = document.createElement("div");
            reviewItem.innerText = reviewText;

            reviewItem.style.border = "5px solid #192bc2";
            reviewItem.style.fontSize = "2rem";
            reviewItem.style.width = "600px";

            reviewList.appendChild(reviewItem);
        });

        if (playerWinCount > computerWinCount) winner = "player";
        else if (playerWinCount < computerWinCount) winner = "computer";
        else winner = "no one";

        const finalScore = `Winner is ${winner}: ${playerWinCount}:${computerWinCount}`;
        const reviewItem = document.createElement("div");
        reviewItem.innerText = finalScore;

        reviewItem.style.border = "5px solid #192bc2";
        reviewItem.style.fontSize = "2rem";
        reviewItem.style.width = "600px";

        reviewList.appendChild(reviewItem);
        returnFromReviewButton.style.display = "block";
    } catch (error) {
        throw new Error("something went wrong", error);
    }
});

returnFromReviewButton.addEventListener("click", () => {
    reviewContainer.style.display = "none";
    returnFromReviewButton.style.display = "none";

    displayNewGameDisplay();
});
