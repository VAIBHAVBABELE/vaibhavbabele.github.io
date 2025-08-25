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

const languageSelect = document.getElementById('language');
const questionText = document.getElementById('question-text');
const optionButtons = document.querySelectorAll('.option-btn');
const scoreText = document.getElementById('score');
const nextBtn = document.getElementById('next-btn');

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


