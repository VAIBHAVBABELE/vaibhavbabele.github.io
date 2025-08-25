const sudokuContainer = document.getElementById("sudoku");
const statusEl = document.getElementById("status");
const newGameBtn = document.getElementById("newGameBtn");

// Very basic fixed Sudoku puzzle
const puzzle = [
[5,3,null,null,7,null,null,null,null],
  [6,null,null,1,9,5,null,null,null],
  [null,9,8,null,null,null,null,6,null],
  [8,null,null,null,6,null,null,null,3],
  [4,null,null,8,null,3,null,null,1],
  [7,null,null,null,2,null,null,null,6],
  [null,6,null,null,null,null,2,8,null],
  [null,null,null,4,1,9,null,null,5],
  [null,null,null,null,8,null,null,7,9]
];

const solution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

function renderBoard() {
  sudokuContainer.innerHTML = "";
  statusEl.textContent = "";
  puzzle.forEach((row, r) => {
    row.forEach((val, c) => {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (val) {
        cell.textContent = val;
        cell.style.background = "#b2bec3"; // fixed cells gray
      } else {
        const input = document.createElement("input");
        input.setAttribute("maxlength", "1");
        input.setAttribute("data-row", r);
        input.setAttribute("data-col", c);
        input.oninput = () => checkWin();
        cell.appendChild(input);
      }

      sudokuContainer.appendChild(cell);
    });
  });
}

function checkWin() {
  let correct = true;
  sudokuContainer.querySelectorAll("input").forEach(input => {
    const r = parseInt(input.dataset.row);
    const c = parseInt(input.dataset.col);
    if (input.value === "" || Number(input.value) !== solution[r][c]) {
      correct = false;
    }
  });

  if (correct) {
    statusEl.textContent = "🎉 Sudoku Solved!";
    statusEl.style.color = "#4cd137"; // Green color for success
  } else {
    statusEl.textContent = "Keep trying!";
    statusEl.style.color = "#e84118"; // Red color for incomplete
  }
}

newGameBtn.addEventListener("click", renderBoard);
renderBoard();


