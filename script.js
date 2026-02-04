function generateComputerMove() {
    const moves = ["rock", "paper", "scissors"]
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
                        name: `game-${i+1}`,
                        data: {
                            playerMove: "pending",
                            computerMove: generateComputerMove(),
                            gameSetId: groupId
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

let gameIdArray = [];

await generateGames(gameIdArray);
const query = gameIdArray.map(id => `id=${id}`).join("&");

const response = await fetch(`https://api.restful-api.dev/objects?${query}`);
const data = await response.json();
console.log(data);