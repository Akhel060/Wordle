const words = [
    "aback", "abase", "abate", "abbey", "abhor",
    "batch", "bathe", "baker", "beach", "beard",
    "cabin", "cable", "cacti", "caddy", "cadet",
    "dance", "dated", "dairy", "daily", "daisy",
    "eager", "eagle", "early", "earth", "easel",
    "fable", "facet", "faded", "fails", "fairy",
    "gable", "gains", "gamer", "gamma", "gamut",
    "habit", "hairy", "halve", "happy", "harry",
    "icily", "icing", "ideal", "idiom", "idiot",
    "jaded", "jails", "jambs", "japan", "jaunt",
    "kebab", "ketch", "keeps", "kelly", "kicks",
    "label", "labor", "laced", "laces", "lacks",
    "macro", "madam", "magic", "magna", "maids",
    "naive", "naked", "named", "names", "nanny",
    "oaken", "oasis", "oaths", "obese", "obeys",
    "packs", "paddy", "pages", "pains", "paint",
    "quake", "quasi", "quays", "queen", "query",
    "rabid", "raced", "racer", "races", "racks",
    "sable", "sacks", "sadly", "safer", "sages",
    "table", "taken", "taker", "tales", "talks",
    "unfit", "unify", "union", "units", "unity"
];
let word = words[Math.floor(Math.random() * words.length)];
let currentGuess = "";
let attempts = 0;
const maxAttempts = 6;

document.addEventListener("DOMContentLoaded", () => {
    createGrid();
    createKeyboard();
    document.getElementById("new-game-button").addEventListener("click", startNewGame);
    document.getElementById("close-popup").addEventListener("click", closePopup);
    document.getElementById("back-button").addEventListener("click", goBack);
});

function createGrid() {
    const gridContainer = document.querySelector(".grid-container");
    gridContainer.innerHTML = "";
    for (let i = 0; i < maxAttempts; i++) {
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
        checkGuess();
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

function checkGuess() {
    if (currentGuess === word) {
        updateGridClasses("correct");
        showPopup("You guessed the word!");
    } else {
        let remainingWord = word;
        currentGuess.split("").forEach((letter, index) => {
            const gridItem = document.getElementById(`grid-${attempts}-${index}`);
            if (word[index] === letter) {
                gridItem.classList.add("correct");
                remainingWord = remainingWord.replace(letter, "");
            } else if (word.includes(letter)) {
                gridItem.classList.add("present");
            } else {
                gridItem.classList.add("absent");
            }
        });
        if (attempts < maxAttempts - 1) {
            attempts++;
            currentGuess = "";
        } else {
            showPopup("Game over! The word was " + word);
        }
    }
}

function updateGridClasses(className) {
    for (let i = 0; i < 5; i++) {
        const gridItem = document.getElementById(`grid-${attempts}-${i}`);
        gridItem.classList.add(className);
    }
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
    startNewGame();
}

function startNewGame() {
    word = words[Math.floor(Math.random() * words.length)];
    currentGuess = "";
    attempts = 0;
    createGrid();
    createKeyboard();
}

function goBack() {
    if (currentGuess.length > 0 && currentGuess.length < 5) {
        handleBackspace();
    }
}
