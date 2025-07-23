const element = document.getElementById("scroll-hide");
const mode = document.getElementById("mode");

// Dark Mode Setup
window.addEventListener("load", () => {
  document.body.classList.toggle(
    "dark-mode",
    localStorage.getItem("mode") === "true"
  );
  checkWindowSize();
});

mode.onclick = function () {
  const wasDarkmode = localStorage.getItem("mode") === "true";
  localStorage.setItem("mode", !wasDarkmode);
  document.body.classList.toggle("dark-mode", !wasDarkmode);
  if (document.body.classList.contains("dark-mode")) {
    mode.src = "images/sun.png";
  } else {
    mode.src = "images/moon.png";
  }
};

// Responsive Scroll Hide Logic
function checkWindowSize() {
  if (window.innerWidth < 1000) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        element.style.display = "none";
      }
    });
  }
  if (window.innerWidth > 1000) {
    element.style.display = "flex";
  }
}

window.addEventListener("resize", checkWindowSize);

document.getElementById("click").addEventListener("click", function () {
  element.style.display = "block";
});

// Footer Year Auto-Update
document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Right Reserved`;
  }
});
