// Color Recall logic (runs only if its elements exist)
(function(){
  const startBtn = document.getElementById("startBtn");
  const levelText = document.getElementById("level");
  const buttons = document.querySelectorAll(".color-btn");
  if(!startBtn || !levelText || buttons.length === 0) return;

  const colors = ["red", "green", "blue", "yellow"];
  let gamePattern = [];
  let userPattern = [];
  let level = 0;

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
      setTimeout(() => { flashColor(color); }, i * 600);
    });
  }

  function flashColor(color) {
    const btn = document.getElementById(color);
    if(!btn) return;
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
})();

// Guess The Output logic
(function(){
  const languageSelect = document.getElementById('language');
  const questionText = document.getElementById('question-text');
  const optionButtons = document.querySelectorAll('.option-btn');
  const scoreText = document.getElementById('score');
  const nextBtn = document.getElementById('next-btn');
  if(!languageSelect || !questionText || optionButtons.length === 0 || !scoreText || !nextBtn) return;

  const questions = {
    cpp: [
      { q: "int a = 5; cout << a + 2;", options: ["5", "7", "52", "Error"], answer: 1 },
      { q: "int arr[3] = {1,2,3}; cout << arr[1];", options: ["1","2","3","Error"], answer: 1 },
      { q: "for(int i=0;i<2;i++) cout<<i;", options: ["0 1","1 2","0 1 2","Error"], answer: 0 },
      { q: "int x=10; x++; cout<<x;", options: ["10","11","12","Error"], answer: 1 },
      { q: "cout<< (5==5);", options: ["0","1","5","Error"], answer: 1 }
    ],
    java: [
      { q: "int a = 5; System.out.println(a+2);", options: ["5","7","52","Error"], answer: 1 },
      { q: "int[] arr = {1,2,3}; System.out.println(arr[1]);", options: ["1","2","3","Error"], answer: 1 },
      { q: "for(int i=0;i<2;i++) System.out.print(i);", options: ["0 1","1 2","0 1 2","Error"], answer: 0 },
      { q: "int x=10; x++; System.out.println(x);", options: ["10","11","12","Error"], answer: 1 },
      { q: "System.out.println(5==5);", options: ["true","false","5","Error"], answer: 0 }
    ],
    python: [
      { q: "a = 5\nprint(a+2)", options: ["5","7","52","Error"], answer: 1 },
      { q: "arr = [1,2,3]\nprint(arr[1])", options: ["1","2","3","Error"], answer: 1 },
      { q: "for i in range(2): print(i,end=' ')", options: ["0 1","1 2","0 1 2","Error"], answer: 0 },
      { q: "x=10\nx+=1\nprint(x)", options: ["10","11","12","Error"], answer: 1 },
      { q: "print(5==5)", options: ["True","False","5","Error"], answer: 0 }
    ]
  };

  let currentLanguage = 'cpp';
  let currentIndex = 0;
  let score = 0;

  languageSelect.addEventListener('change', () => {
    currentLanguage = languageSelect.value;
    currentIndex = 0;
    score = 0;
    scoreText.textContent = "Score: " + score;
    loadQuestion();
  });

  optionButtons.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const correctAnswer = questions[currentLanguage][currentIndex].answer;
      if (idx === correctAnswer) score++;
      currentIndex++;
      if(currentIndex < questions[currentLanguage].length){
        loadQuestion();
      } else {
        questionText.textContent = `Game Over! Final Score: ${score}/${questions[currentLanguage].length}`;
        optionButtons.forEach(b=>b.style.display='none');
      }
      scoreText.textContent = "Score: " + score;
    });
  });

  nextBtn.addEventListener('click', () => {
    if(currentIndex < questions[currentLanguage].length){
      loadQuestion();
    }
  });

  function loadQuestion() {
    const q = questions[currentLanguage][currentIndex];
    questionText.textContent = q.q;
    optionButtons.forEach((btn, idx) => {
      btn.textContent = q.options[idx];
      btn.style.display = 'block';
    });
  }
})();



// Lock Logic
(function(){
  const dials = [document.getElementById('dial1'), document.getElementById('dial2'), document.getElementById('dial3')];
  const checkBtn = document.getElementById('checkBtn');
  const resetBtn = document.getElementById('resetBtn');
  const cluesDiv = document.getElementById('clues');
  const resultDiv = document.getElementById('result');
  if(dials.some(d => !d) || !checkBtn || !resetBtn || !cluesDiv || !resultDiv) return;

  const levels = [
    { clues: ["Dial 1 + Dial 2 = 7","Dial 2 × Dial 3 = 12","Dial 1 < Dial 3"],
      check: ([d1,d2,d3]) => d1 + d2 === 7 && d2 * d3 === 12 && d1 < d3 },
    { clues: ["Dial 1 × 2 = Dial 3","Dial 2 + Dial 3 = 9","Dial 1 ≠ Dial 2"],
      check: ([d1,d2,d3]) => d1*2===d3 && d2+d3===9 && d1!==d2 },
    { clues: ["Dial 1 + Dial 2 + Dial 3 = 15","Dial 3 - Dial 1 = 5","Dial 2 is even"],
      check: ([d1,d2,d3]) => d1+d2+d3===15 && d3-d1===5 && d2%2===0 }
  ];

  let currentLevel = 0;
  let values = [0,0,0];

  function showClues() {
    cluesDiv.innerHTML = "Clues:<ul>" + levels[currentLevel].clues.map(c => `<li>${c}</li>`).join('') + "</ul>";
  }

  function checkLock() {
    if(levels[currentLevel].check(values)) {
      resultDiv.innerHTML = "<span class='success'>Unlocked! 🎉</span>";
      setTimeout(() => {
        if(currentLevel < levels.length-1) {
          currentLevel++;
          values = [0,0,0];
          dials.forEach((d,i)=>d.textContent=values[i]);
          showClues();
          resultDiv.textContent = "Next Level ➡️";
        } else {
          resultDiv.innerHTML = "<span class='success'>You cracked all the locks! 🏆</span>";
        }
      }, 500);
    } else {
      resultDiv.textContent = "Locked 🔒";
    }
  }

  dials.forEach((dial,index)=>{
    dial.addEventListener("click", ()=>{
      values[index] = (values[index]+1)%10;
      dial.textContent = values[index];
    });
  });

  checkBtn.addEventListener("click", checkLock);

  resetBtn.addEventListener("click", ()=>{
    currentLevel = 0;
    values = [0,0,0];
    dials.forEach((d,i)=>d.textContent=values[i]);
    showClues();
    resultDiv.textContent = "Locked 🔒";
  });

  showClues();
})();

// Sliding Tile
(function(){
  const puzzleContainer = document.getElementById("puzzle");
  const statusEl = document.getElementById("status");
  const shuffleBtn = document.getElementById("shuffleBtn");
  if(!puzzleContainer || !statusEl || !shuffleBtn) return;

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
})();

// Sudoku
(function(){
  const sudokuContainer = document.getElementById("sudoku");
  const statusEl = document.getElementById("status");
  const newGameBtn = document.getElementById("newGameBtn");
  if(!sudokuContainer || !statusEl || !newGameBtn) return;

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
          cell.style.background = "#b2bec3";
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
      statusEl.style.color = "#4cd137";
    } else {
      statusEl.textContent = "Keep trying!";
      statusEl.style.color = "#e84118";
    }
  }

  newGameBtn.addEventListener("click", renderBoard);
  renderBoard();
})();


// gamess.js

const questions = [
  { q: "What does HTML stand for?", o: ["HyperText Markup Language", "Hyper Transfer Markup Language", "HighText Machine Language"], a: 0, tip: "HTML is a markup language, not a programming language." },
  { q: "Which language is used for styling web pages?", o: ["HTML", "JQuery", "CSS"], a: 2, tip: "CSS = Cascading Style Sheets." },
  { q: "Inside which HTML element do we put JavaScript?", o: ["<script>", "<js>", "<javascript>"], a: 0, tip: "Always use <script> tags for JavaScript." },
  { q: "Which data structure uses FIFO?", o: ["Stack", "Queue", "Graph"], a: 1, tip: "FIFO stands for First In First Out." },
  { q: "What does 'const' mean in JavaScript?", o: ["A fixed loop", "An immutable variable", "A variable that can change"], a: 1, tip: "‘const’ creates a constant reference to a value." },
  { q: "Which company developed JavaScript?", o: ["Netscape", "Microsoft", "Google"], a: 0, tip: "Netscape created JavaScript in 1995." },
  { q: "What is the correct syntax for referring to an external script called 'xxx.js'?", o: ["<script src='xxx.js'>", "<script href='xxx.js'>", "<script ref='xxx.js'>"], a: 0, tip: "Use src attribute for external scripts." },
  { q: "Which HTML attribute is used to define inline styles?", o: ["style", "class", "font"], a: 0, tip: "The 'style' attribute is used for inline CSS." },
  { q: "Which property is used to change the background color in CSS?", o: ["color", "background-color", "bgcolor"], a: 1, tip: "Use 'background-color' for backgrounds." },
  { q: "How do you write 'Hello World' in an alert box in JavaScript?", o: ["msg('Hello World');", "alert('Hello World');", "alertBox('Hello World');"], a: 1, tip: "Use alert() for pop-up messages." },
  { q: "Which symbol is used for comments in JavaScript?", o: ["//", "<!-- -->", "#"], a: 0, tip: "Use // for single-line comments in JS." },
  { q: "Which tag is used to define a table row in HTML?", o: ["<tr>", "<td>", "<th>"], a: 0, tip: "<tr> stands for table row." },
  { q: "How do you select an element with id 'demo' in CSS?", o: [".demo", "#demo", "demo"], a: 1, tip: "Use # for id selectors in CSS." },
  { q: "Which method is used to add a new element at the end of an array in JavaScript?", o: ["push()", "pop()", "shift()"], a: 0, tip: "push() adds to the end of an array." },
  { q: "Which HTML tag is used to display a picture on a webpage?", o: ["<img>", "<picture>", "<image>"], a: 0, tip: "<img> is used for images in HTML." }
];

let current = 0, score = 0, timerId, timeLeft = 15;

function startTimer() {
  clearInterval(timerId);
  timeLeft = 15;
  document.getElementById("timer").textContent = timeLeft;

  timerId = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      checkAnswer(-1);
    }
  }, 1000);
}

function loadQuestion() {
  const q = questions[current];
  document.getElementById("question").textContent = `Q${current + 1}. ${q.q}`;
  const opts = document.getElementById("options");
  opts.innerHTML = "";

  q.o.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => checkAnswer(i);
    opts.appendChild(btn);
  });

  document.getElementById("bar").style.width = `${(current / questions.length) * 100}%`;
  startTimer();
}

function checkAnswer(i) {
  clearInterval(timerId);
  const correct = i === questions[current].a;
  if (i === -1) {
    document.getElementById("result").textContent = "⏰ Time’s Up!";
  } else if (correct) {
    score++;
    document.getElementById("result").textContent = "✅ Correct!";
  } else {
    document.getElementById("result").textContent = "❌ Wrong!";
  }
  document.getElementById("score").textContent = `Score: ${score}`;
  document.getElementById("quote").textContent = `"${questions[current].tip}"`;

  current++;
  if (current < questions.length) {
    setTimeout(() => {
      document.getElementById("result").textContent = "";
      document.getElementById("quote").textContent = "";
      loadQuestion();
    }, 1500);
  } else {
    endQuiz();
  }
}

function endQuiz() {
  document.getElementById("question").textContent = `🎉 Quiz Over!`;
  document.getElementById("options").innerHTML = "";
  document.getElementById("result").textContent = `Your final score is ${score}/${questions.length}`;
  document.getElementById("bar").style.width = `100%`;
  document.getElementById("restart").style.display = "inline-block";
  document.getElementById("timer").textContent = "0";
}

function restartQuiz() {
  current = 0;
  score = 0;
  document.getElementById("score").textContent = `Score: 0`;
  document.getElementById("restart").style.display = "none";
  document.getElementById("result").textContent = "";
  document.getElementById("quote").textContent = "";
  loadQuestion();
}

window.onload = loadQuestion;
