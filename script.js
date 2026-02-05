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

const gameDisplayButtons = document.querySelectorAll(".game-display button");
const beginGameDisplay = document.querySelector(".begin-game");
const returnButton = gameDisplayButtons[0];
const startGameButton = gameDisplayButtons[1];
const gameDisplay = document.querySelector(".game-display");
const newGameButton = document.querySelector(".begin-game button");
const loader = document.querySelector(".loader");
let gameIdArray = [];

newGameButton.addEventListener("click", async () => {
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
    hideGameDisplay();
    displayNewGameDisplay();
});
