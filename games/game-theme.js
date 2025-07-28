// Separate theme handler for games directory
const element = document.getElementById("scroll-hide")
const mode = document.getElementById("mode")
const load = document.getElementById("onload")

function checkWindowSize() {
  if (window.innerWidth < 1000) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 10) {
        element.style.display = "none"
      }
    })
  }
  if (window.innerWidth > 1000) {
    element.style.display = "flex"
  }
}

window.addEventListener("load", checkWindowSize)
window.addEventListener("resize", checkWindowSize)

document.getElementById("click").addEventListener("click", () => {
  element.style.display = "block"
})

// Fixed theme function with correct paths for games directory
function theme() {
  const wasDarkmode = localStorage.getItem("mode") === "true"
  localStorage.setItem("mode", !wasDarkmode)
  document.body.classList.toggle("dark-mode", !wasDarkmode)
  // Fixed paths for subdirectory
  mode.src = !wasDarkmode ? "../images/sun.png" : "../images/moon.png"
}

// Add click event listener for theme toggle
mode.addEventListener("click", theme)

window.onload = () => {
  const isDark = localStorage.getItem("mode") === "true"
  document.body.classList.toggle("dark-mode", isDark)
  // Fixed path for subdirectory
  document.getElementById("mode").src = isDark ? "../images/sun.png" : "../images/moon.png"
}

document.addEventListener("DOMContentLoaded", () => {
  const year = new Date().getFullYear()
  const copyright = document.getElementById("copyright")
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Rights Reserved`
  }
})