const element = document.getElementById('scroll-hide');
const mode =document.getElementById("mode");
const load=document.getElementById("onload");
function checkWindowSize() {
    if (window.innerWidth < 1000) {
            window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                element.style.display = 'none';
            }
        });
    }
    if (window.innerWidth > 1000) {
        element.style.display = 'flex';
    }

}
    
    // Check the window size when the page loads
    window.addEventListener('load', checkWindowSize);
    
    // Check the window size when the window is resized
    window.addEventListener('resize', checkWindowSize);

document.getElementById('click').addEventListener('click', function() {
    element.style.display = 'block';
    // You can call any function here
});


mode.onclick=function(){
    const wasDarkmode = localStorage.getItem('mode') === 'true';
    localStorage.setItem('mode', !wasDarkmode);
    document.body.classList.toggle("dark-mode",!wasDarkmode);
    if(document.body.classList.contains("dark-mode")){
        mode.src="images/sun.png";
    }else{
        mode.src="images/moon.png";
    }
}

load.onload=function(){
    document.body.classList.toggle('dark-mode', localStorage.getItem('mode') === 'true');
    // Set correct icon on page load
    if(document.body.classList.contains("dark-mode")){
        mode.src="images/sun.png";
    }else{
        mode.src="images/moon.png";
    }
}


document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Rights Reserved`;
  }
});
