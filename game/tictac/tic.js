let boxes = document.querySelectorAll(".box");
let reset = document.querySelector(".reset");
let chBtn = document.querySelector(".chBtn");
let msgCont = document.getElementById("msg")




let first="X";
let turn="X";

let drawCount=0;
let countX=0;
let countO=0;

chBtn.addEventListener("click",()=>{
    if (first==="X"){
        first="O";
        turn="O";
        alert(`NOW PLAYER 1: ${first}`);
    }else{
        first="X";
        turn="X";
        alert(`NOW PLAYER 1: ${first}`);
    }
});





reset.addEventListener("click",()=>{
    boxes.forEach((box)=>{
        box.innerText="";
        box.disabled=false;
        chBtn.disabled=false;
        msgCont.innerText="Play Game";
        msgCont.style.backgroundColor="rgb(32, 32, 76)";
        if(document.body.classList.contains("dark-mode")){
            msgCont.style.backgroundColor="rgb(174, 174, 241)";
        }
        first=turn;
        drawCount=0;
        
    });

});

const winPattern =[
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

boxes.forEach((box)=>{
    box.addEventListener("click",()=>{
        chBtn.disabled=true;
        if (first==="X"){
            box.innerText ="X";
            first="O";
        }else{
            box.innerText ="0";
            first="X";
        }
        box.disabled = true;
        drawCount++;

        checkWinner();
        
    });
    
});

const drawGame=()=>{
    msgCont.innerText="Game is Draw!";
    msgCont.style.backgroundColor="rgb(174, 174, 241)";
}

const showWinner=(winner)=>{
    if (winner==="X"){
        countX++;
        
        msgCont.innerText=`Congratulation ${winner} is winner.\nX wins :${countX} times, O wins: ${countO} times.`;
        msgCont.style.backgroundColor="green";
        
    }else {
        countO++;
        msgCont.innerText=`Congratulation ${winner} is winner.\nO wins:${countO} times, X wins: ${countX} times.`;
        msgCont.style.backgroundColor="red";
        
    }
}

const boxDisable =()=>{
    for(let box of boxes){
        box.disabled=true;
    }

}



const checkWinner =()=>{
    for(pattern of winPattern){
        let pos1=boxes[pattern[0]].innerText;
        let pos2=boxes[pattern[1]].innerText;
        let pos3=boxes[pattern[2]].innerText;

        if (pos1!="" && pos2!="" && pos3!="" ){
            if(pos1===pos2 && pos2===pos3){
                boxDisable();
                showWinner(pos1);
                return;
                
            }
            
        }
        
        
    }
    if (drawCount === 9) {
        drawGame();
    }
}



