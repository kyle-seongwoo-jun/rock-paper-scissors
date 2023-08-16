// Check if window.crypto.getRandomValues() is available
const useWindowCrypto = window.crypto && window.crypto.getRandomValues;

function getRandomInt(min, max) {
    let randomInt;
    if (useWindowCrypto) {
        // Generate a cryptographically secure random integer between min and max
        let randomBytes = new Uint32Array(1);
        do {
            window.crypto.getRandomValues(randomBytes);
            randomInt = randomBytes[0] % (max - min + 1) + min;
        } while (randomInt > max);
    } else {
        // Fallback to Math.random() if window.crypto.getRandomValues() is not available
        randomInt = Math.floor(Math.random() * (max - min + 1) + min);
    }
    return randomInt;
}

function getRandomHand() {
    let hand = getRandomInt(1, 3);
    switch (hand) {
        case 1:
            return "✊";
        case 2:
            return "✌️";
        case 3:
            return "✋";
    }
}

let trial = 0;
function showRandomHand() {
    let hand = getRandomHand();
    document.getElementById("hand").innerHTML = `${++trial} ${hand}`;
}

window.onload = function() {
    showRandomHand();
}