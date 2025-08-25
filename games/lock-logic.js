const levels = [
  { clues: ["Dial 1 + Dial 2 = 7","Dial 2 × Dial 3 = 12","Dial 1 < Dial 3"],
    check: ([d1,d2,d3]) => d1 + d2 === 7 && d2 * d3 === 12 && d1 < d3 },
  { clues: ["Dial 1 × 2 = Dial 3","Dial 2 + Dial 3 = 9","Dial 1 ≠ Dial 2"],
    check: ([d1,d2,d3]) => d1*2===d3 && d2+d3===9 && d1!==d2 },
  { clues: ["Dial 1 + Dial 2 + Dial 3 = 15","Dial 3 - Dial 1 = 5","Dial 2 is even"],
    check: ([d1,d2,d3]) => d1+d2+d3===15 && d3-d1===5 && d2%2===0 }
];

let currentLevel = 0;
const dials = [document.getElementById('dial1'), document.getElementById('dial2'), document.getElementById('dial3')];
let values = [0,0,0];

const cluesDiv = document.getElementById('clues');
const resultDiv = document.getElementById('result');
const resetBtn = document.getElementById('resetBtn');
const checkBtn = document.getElementById('checkBtn');

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

// Dial click increments value
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


