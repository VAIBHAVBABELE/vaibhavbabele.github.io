const mode=document.getElementById("mode");
const choices=document.querySelectorAll(".choice");
const users=document.getElementById("user");
const pcs=document.getElementById("pc");
const msgCont=document.getElementById("msg");


mode.onclick=function(){
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")){
        mode.src="images/sun.png";
    }else{
        mode.src="images/moon.png ";
    }
}

let user =0;
let pc=0;




const genPcChoice=()=>{
    const options =["stone","paper","scissor"];
    const randIdx = Math.floor(Math.random()*3);
    return options[randIdx];

}
const drawGame=()=>{
    msgCont.innerText="Game is Draw!";
    msgCont.style.backgroundColor="rgb(174, 174, 241)";
    users.style.color="rgb(174, 174, 241)",pcs.style.color="rgb(174, 174, 241)";
}


const playGame =(userChoice)=>{
    const pcChoice=genPcChoice();
    if(userChoice==pcChoice){
        drawGame();    
    }else {
        let userWin=true;
        if (userChoice==="stone"){
            userWin=pcChoice==="paper"?false:true;
        }else if(userChoice==="paper"){
            userWin=pcChoice==="scissor"?false:true;
        }else{
            userWin=pcChoice==="stone"?false:true;
        }
        showWinner(userWin);
    }
    
}

const showWinner=(userWin)=>{
    if (userWin==true){
        user++;
        msgCont.innerText=" You win! ";
        msgCont.style.backgroundColor="green";
        users.innerText=user;
        users.style.color="green";
    }else{
        pc++;
        msgCont.innerText=" Computer win! ";
        msgCont.style.backgroundColor="red";
        pcs.innerText=pc;
        pcs.style.color="red";
    }
}



choices.forEach((choice)=>{
    choice.addEventListener("click",()=>{
        const userChoice=choice.getAttribute("id");
        playGame(userChoice);

    });
});