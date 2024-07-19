document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("new-game-button").addEventListener("click", startNewGame);
    document.getElementById("close-popup").addEventListener("click", closePopup);
    document.getElementById("back-button").addEventListener("click", goBack);

    startNewGame();  // Start a new game when the page loads
});

function createGrid() {
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");
            gridItem.setAttribute("id", `grid-${i}-${j}`);
            gridContainer.appendChild(gridItem);
        }
    }
}

function createKeyboard() {
    const keys = "abcdefghijklmnopqrstuvwxyz".split("");
    const keyboardContainer = document.querySelector(".keyboard-container");
    keyboardContainer.innerHTML = "";
    keys.forEach(key => {
        const keyElement = document.createElement("button");
        keyElement.classList.add("key");
        keyElement.textContent = key;
        keyElement.addEventListener("click", () => handleKeyPress(key));
        keyboardContainer.appendChild(keyElement);
    });

    const backspaceKey = document.createElement("button");
    backspaceKey.classList.add("key");
    backspaceKey.textContent = "⌫";
    backspaceKey.addEventListener("click", handleBackspace);
    keyboardContainer.appendChild(backspaceKey);
}

function handleKeyPress(key) {
    if (currentGuess.length < 5) {
        currentGuess += key;
        updateGrid();
    }

    if (currentGuess.length === 5) {
        makeGuess(currentGuess);
    }
}

function handleBackspace() {
    if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateGrid();
    }
}

function updateGrid() {
    for (let i = 0; i < 5; i++) {
        const gridItem = document.getElementById(`grid-${attempts}-${i}`);
        gridItem.textContent = currentGuess[i] || "";
    }
}

function updateGridClasses(response) {
    response.forEach((res, index) => {
        const gridItem = document.getElementById(`grid-${attempts}-${index}`);
        gridItem.classList.add(res);
    });
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    popupMessage.textContent = message;
    popup.style.display = "flex";
}

function closePopup() {
    const popup = document.getElementById("popup");
    popup.style.display = "none";
}

function startNewGame() {
    console.log("Starting a new game...");
    fetch('start_game.php')
        .then(response => {
            console.log("Response received:", response);
            return response.json();
        })
        .then(data => {
            console.log(data.message);
            currentGuess = "";
            attempts = 0;
            createGrid();
            createKeyboard();
            updateLeaderboard(data.leaderboard);
        })
        .catch(error => console.error('Error:', error));
}

function makeGuess(guess) {
    fetch('make_guess.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `guess=${guess}`
    })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
            } else {
                updateGridClasses(data.response);
                showPopup(data.message);
                if (data.game_state) {
                    attempts++;
                    currentGuess = "";
                }
                updateLeaderboard(data.leaderboard);
            }
        })
        .catch(error => console.error('Error:', error));
}

function goBack() {
    if (currentGuess.length > 0 && currentGuess.length < 5) {
        handleBackspace();
    }
}

function updateLeaderboard(leaderboard) {
    const leaderboardContainer = document.getElementById("leaderboard");
    leaderboardContainer.innerHTML = "<h2>Leaderboard</h2>";
    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Attempts</th><th>Guessed Correctly</th></tr>";
    leaderboard.forEach(entry => {
        const row = document.createElement("tr");
        const attemptsCell = document.createElement("td");
        attemptsCell.textContent = entry.attempts;
        const guessedCell = document.createElement("td");
        guessedCell.textContent = entry.guessed ? "Yes" : "No";
        row.appendChild(attemptsCell);
        row.appendChild(guessedCell);
        table.appendChild(row);
    });
    leaderboardContainer.appendChild(table);
}
