const gameContainer = document.querySelector('.game');
const player = document.querySelector('.player');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('game-over');
const startButton = document.getElementById('start-game');
const rulesButton = document.getElementById('rules-btn');
const rulesSection = document.getElementById('rules');
const backButton = document.getElementById('back-btn');
const restartButton = document.getElementById('restart-game');

let score = 0;
let enemies = [];
let bullets = [];
let gameRunning = false;
let enemySpawnInterval;

// for dark and light theme
const mode=document.getElementById("mode");
mode.onclick=function(){
  document.body.classList.toggle("dark-mode");
  if(document.body.classList.contains("dark-mode")){
      mode.src="../../images/sun.png";
  }else{
      mode.src="../../images/moon.png ";
  }
}

// Menu navigation
startButton.addEventListener('click', () => {
  document.querySelector('.menu').classList.add('hidden');
  gameContainer.classList.remove('hidden');
  gameRunning = true;
  startGame();
});

rulesButton.addEventListener('click', () => {
  rulesSection.classList.remove('hidden');
  rulesButton.style.display = 'none';
  backButton.style.display = 'inline-block';
});

backButton.addEventListener('click', () => {
  rulesSection.classList.add('hidden');
  backButton.style.display = 'none';
  rulesButton.style.display = 'inline-block';
});

restartButton.addEventListener('click', () => {
  resetGame();
  startGame();
});

// Player movement using keyboard
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') movePlayer(-1);
  if (e.key === 'ArrowRight') movePlayer(1);
  if (e.key === ' ') shootBullet(); // Space key to shoot bullets
});

// Touch-based controls: Tap to fire or move left/right
gameContainer.addEventListener('click', (e) => {
  if (!gameRunning) return;

  const playerRect = player.getBoundingClientRect();
  const tapX = e.clientX;

  if (tapX >= playerRect.left && tapX <= playerRect.right) {
    // Tap on the spaceship -> Shoot bullet
    shootBullet();
  } else if (tapX < playerRect.left) {
    // Tap left of the spaceship -> Move left
    movePlayer(-1);
  } else if (tapX > playerRect.right) {
    // Tap right of the spaceship -> Move right
    movePlayer(1);
  }
});

// Function to move the player
function movePlayer(direction) {
  const playerLeft = parseInt(getComputedStyle(player).left);
  if (direction === -1 && playerLeft > 0) {
    player.style.left = playerLeft - 15 + 'px';
  } else if (direction === 1 && playerLeft < window.innerWidth - 50) {
    player.style.left = playerLeft + 15 + 'px';
  }
}

// Function to shoot bullets
function shootBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  const playerLeft = parseInt(getComputedStyle(player).left);
  bullet.style.left = playerLeft + 20 + 'px'; // Center bullet
  bullet.style.top = window.innerHeight - 160 + 'px'; // Just above the player
  gameContainer.appendChild(bullet);
  bullets.push(bullet);
}

// Function to spawn enemies (asteroids)
function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = Math.random() * (window.innerWidth - 100) + 'px'; // Random horizontal position
  enemy.style.top = '0px'; // Start at the top
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

// Function to move enemies
function moveEnemies() {
  enemies.forEach((enemy, index) => {
    let top = parseInt(getComputedStyle(enemy).top);
    if (top > window.innerHeight) {
      enemy.remove();
      enemies.splice(index, 1); // Remove enemies that leave the screen
    } else {
      enemy.style.top = top + 5 + 'px';
    }

    // Check collision with the player (spaceship)
    checkCollisionWithPlayer(enemy, index);
  });
}

// Function to move bullets
function moveBullets() {
  bullets.forEach((bullet, index) => {
    let top = parseInt(getComputedStyle(bullet).top);
    if (top < 0) {
      bullet.remove();
      bullets.splice(index, 1); // Remove bullets that leave the screen
    } else {
      bullet.style.top = top - 10 + 'px';
    }

    // Check collision with enemies
    checkCollisionWithEnemy(bullet, index);
  });
}

// Function to check collision between bullets and enemies
function checkCollisionWithEnemy(bullet, bulletIndex) {
  const bulletRect = bullet.getBoundingClientRect();

  enemies.forEach((enemy, enemyIndex) => {
    const enemyRect = enemy.getBoundingClientRect();

    if (
      bulletRect.left < enemyRect.right &&
      bulletRect.right > enemyRect.left &&
      bulletRect.top < enemyRect.bottom &&
      bulletRect.bottom > enemyRect.top
    ) {
      // Collision detected
      enemy.remove();
      bullet.remove();
      enemies.splice(enemyIndex, 1);
      bullets.splice(bulletIndex, 1);

      // Update score
      score += 5;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  });
}

// Function to check collision between enemies and the player
function checkCollisionWithPlayer(enemy, enemyIndex) {
  const enemyRect = enemy.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  if (
    enemyRect.left < playerRect.right &&
    enemyRect.right > playerRect.left &&
    enemyRect.top < playerRect.bottom &&
    enemyRect.bottom > playerRect.top
  ) {
    // Collision with the player (end game)
    endGame();
  }
}

// Function to start the game
function startGame() {
  gameRunning = true;
  score = 0;
  scoreDisplay.textContent = 'Score: 0';
  gameOverText.classList.add('hidden');
  enemySpawnInterval = setInterval(spawnEnemy, 1000); // Spawn enemies every second
  requestAnimationFrame(gameLoop); // Start the game loop
}

// Function to reset the game
function resetGame() {
  bullets.forEach((bullet) => bullet.remove());
  enemies.forEach((enemy) => enemy.remove());
  bullets = [];
  enemies = [];
  clearInterval(enemySpawnInterval);
  gameOverText.classList.add('hidden');
}

// Function to end the game
function endGame() {
  gameRunning = false;
  clearInterval(enemySpawnInterval);
  gameOverText.classList.remove('hidden');
}

// Main game loop
function gameLoop() {
  if (!gameRunning) return;
  moveEnemies();
  moveBullets();
  requestAnimationFrame(gameLoop);
}
