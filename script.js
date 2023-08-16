// Check if window.crypto.getRandomValues() is available
const useWindowCrypto = window.crypto && window.crypto.getRandomValues;

function getRandomInt(min, max) {
  let randomInt;
  if (useWindowCrypto) {
    // Generate a cryptographically secure random integer between min and max
    let randomBytes = new Uint32Array(1);
    do {
      window.crypto.getRandomValues(randomBytes);
      randomInt = (randomBytes[0] % (max - min + 1)) + min;
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

const history = [];
const statistics = {};

function showRandomHand() {
  let hand = getRandomHand();

  // Update history and statistics
  history.push(hand);
  if (statistics[hand]) {
    statistics[hand]++;
  } else {
    statistics[hand] = 1;
  }

  // Update HTML
  const div = document.getElementById("history");
  const h1 = document.getElementById("hand");
  updateStatistics();
  div.innerHTML += `${h1.innerHTML} `;
  h1.innerHTML = `${history.length} ${hand}`;
}

function updateStatistics() {
  const percentages = {
    "✊": 0,
    "✌️": 0,
    "✋": 0,
  };
  const expectedPercentage = 100 / 3;
  for (let hand in percentages) {
    const count = statistics[hand] || 0;
    const percentage = (percentages[hand] = (count / history.length) * 100);
    const difference = percentage - expectedPercentage;
    printStatistics(hand, count, percentage, difference);
  }

  const standardDeviation = getStandardDeviation(Object.values(percentages));
  const span = document.getElementById("standard-deviation");
  span.innerHTML = `STD: ${round(standardDeviation, 2)}%`;
}

function printStatistics(hand, count, percentage, difference) {
  const spanIds = {
    "✊": "statistics-rock",
    "✌️": "statistics-scissors",
    "✋": "statistics-paper",
  };
  const prettyDifference = (function () {
    const rounded = round(difference, 1);
    if (rounded === 0) {
      return "±0%";
    }
    const sign = rounded > 0 ? "+" : "";
    const color = rounded > 0 ? "red" : "green";
    return `<span style="color: ${color};">${sign}${rounded}%</span>`;
  })();

  const decription = [`${round(percentage, 1)}%`, prettyDifference].join(", ");

  const span = document.getElementById(spanIds[hand]);
  span.innerHTML = `${hand} ${count} (${decription})`;
}

function round(number, precision) {
  const times = Math.pow(10, precision || 0);
  return Math.round((number + Number.EPSILON) * times) / times;
}

function getStandardDeviation(values) {
  let mean = values.reduce((a, b) => a + b, 0) / values.length;
  let variance =
    values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

window.onload = function () {
  showRandomHand();
};
