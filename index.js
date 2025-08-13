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


window.onload = function() {
    const isDark = localStorage.getItem('mode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);

    const path = window.location.pathname;

    // Check if path contains any of the special subfolders inside /pages
    const isDeepPage = ['/summary', '/assistant', '/pr-contribution', '/certificate'].some(subpath => 
        path.includes('/pages' + subpath)
    );

    let imgPathPrefix = '';
    if (isDeepPage) {
        imgPathPrefix = '../../images/';
    } else if (path.includes('/pages')|| path.includes('/games')) {
        imgPathPrefix = '../images/';
    } else {
        imgPathPrefix = 'images/';
    }

    if(document.body.classList.contains("dark-mode")){
        mode.src = imgPathPrefix + "sun.png";
        console.log("Dark mode is enabled");
    } else {
        mode.src = imgPathPrefix + "moon.png";
        console.log("Dark mode is disabled");
    }
}

mode.onclick = function() {
    const wasDarkmode = localStorage.getItem('mode') === 'true';
    const newMode = !wasDarkmode;
    localStorage.setItem('mode', newMode);
    document.body.classList.toggle("dark-mode", newMode);

    const path = window.location.pathname;
    const isDeepPage = ['/summary', '/assistant', '/pr-contribution', '/certificate'].some(subpath => 
        path.includes('/pages' + subpath)
    );

    let imgPathPrefix = '';
    if (isDeepPage) {
        imgPathPrefix = '../../images/';
    } else if (path.includes('/pages') || path.includes('/games')) {
        imgPathPrefix = '../images/';
    } else {
        imgPathPrefix = 'images/';
    }

    if(document.body.classList.contains("dark-mode")){
        mode.src = imgPathPrefix + "sun.png";
    } else {
        mode.src = imgPathPrefix + "moon.png";
    }
}






document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Rights Reserved`;
  }
});
