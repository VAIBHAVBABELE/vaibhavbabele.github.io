const colors = ["red", "green", "blue", "yellow"];
let gamePattern = [];
let userPattern = [];
let level = 0;

const startBtn = document.getElementById("startBtn");
const levelText = document.getElementById("level");
const buttons = document.querySelectorAll(".color-btn");

startBtn.addEventListener("click", () => {
  level = 0;
  gamePattern = [];
  nextSequence();
});

buttons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    const userChosenColor = e.target.id;
    userPattern.push(userChosenColor);
    flashColor(userChosenColor);
    checkAnswer(userPattern.length - 1);
  });
});

function nextSequence() {
  userPattern = [];
  level++;
  levelText.textContent = "Level: " + level;

  const randomColor = colors[Math.floor(Math.random() * 4)];
  gamePattern.push(randomColor);

  gamePattern.forEach((color, i) => {
    setTimeout(() => {
      flashColor(color);
    }, i * 600);
  });
}

function flashColor(color) {
  const btn = document.getElementById(color);
  btn.style.opacity = "1";
  setTimeout(() => { btn.style.opacity = "0.7"; }, 300);
}

function checkAnswer(currentIndex) {
  if (userPattern[currentIndex] === gamePattern[currentIndex]) {
    if (userPattern.length === gamePattern.length) {
      setTimeout(() => { nextSequence(); }, 800);
    }
  } else {
    alert("Game Over! You reached level " + level);
    level = 0;
    gamePattern = [];
    userPattern = [];
  }
}


