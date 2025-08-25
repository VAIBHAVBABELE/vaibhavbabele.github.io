const puzzleContainer = document.getElementById("puzzle");
const statusEl = document.getElementById("status");
const shuffleBtn = document.getElementById("shuffleBtn");

let tiles = [];

function init() {
  tiles = [1,2,3,4,5,6,7,8,null];
  render();
}

function render() {
  puzzleContainer.innerHTML = "";
  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.classList.add("tile");

    if (tile) {
      div.textContent = tile;
      div.addEventListener("click", () => moveTile(index));
    } else {
      div.classList.add("empty");
    }
    puzzleContainer.appendChild(div);
  });
  checkWin();
}

function moveTile(index) {
  const emptyIndex = tiles.indexOf(null);
  const validMoves = [emptyIndex - 1, emptyIndex + 1, emptyIndex - 3, emptyIndex + 3];
  if (validMoves.includes(index)) {
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    render();
  }
}

function shuffle() {
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  render();
}

function checkWin() {
  const win = [1,2,3,4,5,6,7,8,null];
  if (JSON.stringify(tiles) === JSON.stringify(win)) {
    statusEl.textContent = "🎉 You solved it!";
  } else {
    statusEl.textContent = "";
  }
}

shuffleBtn.addEventListener("click", shuffle);
init();


