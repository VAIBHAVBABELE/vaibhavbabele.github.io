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
    mode.src = !wasDarkmode ? "images/sun.png" : "images/moon.png";
}

window.onload=function(){
    const isDark = localStorage.getItem('mode') === 'true';
    document.body.classList.toggle("dark-mode", isDark);
    document.getElementById("mode").src = isDark ? "images/sun.png" : "images/moon.png";

};


document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Rights Reserved`;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const fadeElements = document.querySelectorAll(".fade-section");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  }, {
    threshold: 0.15,
  });

  fadeElements.forEach(el => observer.observe(el));
});

