let blackjackGame = {
  you: { scoreSpan: "#your-blackjack-result", div: "#your-box", score: 0 },
  dealer: {
    scoreSpan: "#dealer-blackjack-result",
    div: "#dealer-box",
    score: 0,
  },
  cards: [2, 3, 4, 5, 6, 7, 8, 9, 10, "K", "J", "Q", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    K: 10,
    J: 10,
    Q: 10,
    A: [1, 11],
  },
  wins: 0,
  losses: 0,
  draws: 0,
  isStand: false,
  turnsOver: false,
};

const YOU = blackjackGame.you;
const DEALER = blackjackGame.dealer;

const hitSound = new Audio("sound/swish.mp3");
const winSound = new Audio("sound/cash.mp3");
const lossSound = new Audio("sound/aww.mp3");

document
  .getElementById("blackjack-hit-button")
  .addEventListener("click", blackjackHit);

document
  .getElementById("blackjack-stand-button")
  .addEventListener("click", blackjackStand);

document
  .getElementById("blackjack-deal-button")
  .addEventListener("click", blackjackDeal);

function blackjackHit() {
  if (!blackjackGame.isStand) {
    play(YOU);
  }
}

async function blackjackStand() {
  blackjackGame.isStand = true;
  while (DEALER.score < 16) {
    play(DEALER);

    await sleep(1000);
  }

  blackjackGame.turnsOver = true;
  showResult();
}

function play(activePlayer) {
  let card = getCard();
  showCard(card, activePlayer);
  updateScore(card, activePlayer);
}

function showCard(card, activePlayer) {
  if (activePlayer.score > 21) {
    return;
  }

  let cardImage = document.createElement("img");
  cardImage.src = `images/${card}.png`;
  document.querySelector(activePlayer.div).appendChild(cardImage);
  hitSound.play();
}

function blackjackDeal() {
  if (blackjackGame["turnsOver"]) {
    blackjackGame.isStand = false;

    let yourImages = document.querySelector(YOU.div).querySelectorAll("img");
    let dealerImages = document
      .querySelector(DEALER.div)
      .querySelectorAll("img");

    [...yourImages, ...dealerImages].forEach((img) => {
      img.remove();
    });

    YOU.score = 0;
    DEALER.score = 0;

    document.querySelector(YOU.scoreSpan).innerText = 0;
    document.querySelector(YOU.scoreSpan).style.color = "white";

    document.querySelector(DEALER.scoreSpan).innerText = 0;
    document.querySelector(DEALER.scoreSpan).style.color = "white";

    document.querySelector("#blackjack-result").textContent = "Let's play";
    document.querySelector("#blackjack-result").style.color = "black";

    blackjackGame.turnsOver = true;
  }
}

function getCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjackGame.cards[randomIndex];
}

function updateScore(card, activePlayer) {
  if (card == "A") {
    if (activePlayer.score + blackjackGame.cardsMap[card][1] <= 21) {
      activePlayer.score += blackjackGame.cardsMap[card][1];
    } else {
      activePlayer.score += blackjackGame.cardsMap[card][0];
    }
  } else {
    activePlayer.score += blackjackGame.cardsMap[card];
  }

  if (activePlayer.score > 21) {
    document.querySelector(activePlayer.scoreSpan).textContent = "BUST!";
    document.querySelector(activePlayer.scoreSpan).style.color = "red";
  } else {
    document.querySelector(activePlayer.scoreSpan).innerText =
      activePlayer.score;
  }
}

function computeWinner() {
  let winner;

  if (YOU.score <= 21) {
    if (YOU.score > DEALER.score || DEALER.score > 21) {
      winner = YOU;
    } else if (YOU.score < DEALER.score) {
      winner = DEALER;
    }
  } else if (DEALER.score < 21) {
    winner = DEALER;
  }

  return winner;
}

function showResult() {
  if (blackjackGame.turnsOver) {
    winner = computeWinner();

    let message, messageColor;

    if (winner === YOU) {
      message = "You won!";
      messageColor = "green";
      blackjackGame.wins++;
      winSound.play();
    } else if (winner === DEALER) {
      message = "You lost!";
      messageColor = "red";
      blackjackGame.losses++;
      lossSound.play();
    } else {
      blackjackGame.draws++;
      message = "You drew!";
      messageColor = "black";
    }

    document.querySelector("#blackjack-result").textContent = message;
    document.querySelector("#blackjack-result").style.color = messageColor;

    document.getElementById("wins").textContent = blackjackGame.wins;
    document.getElementById("losses").textContent = blackjackGame.losses;
    document.getElementById("draws").textContent = blackjackGame.draws;
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// challenge 6

const URL = "https://randomuser.me/api/?results=10";
var usersDiv = document.querySelector("#users");

fetch(URL)
  .then((resp) => resp.json())
  .then(({ results }) => {
    results.forEach(({ picture: { medium: userPhoto }, name: { first } }) => {
      userDiv = document.createElement("div");
      img = document.createElement("img");
      text = document.createElement("p");
      img.src = userPhoto;
      text.textContent = first;
      userDiv.appendChild(img);
      userDiv.appendChild(text);

      usersDiv.appendChild(userDiv);
    });
  });
