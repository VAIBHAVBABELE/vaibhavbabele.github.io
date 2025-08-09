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

// Focus Mode Toggle Functionality
const toggleBtn = document.getElementById("focusToggle");

// Toast notification function
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.innerText = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#333'};
        color: white;
        padding: 12px 16px;
        border-radius: 8px;
        z-index: 9999;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 2 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 2000);
}

// Update button appearance
function updateButtonAppearance(isFocusMode) {
    if (isFocusMode) {
        toggleBtn.textContent = "🔊 Normal Mode";
        toggleBtn.style.backgroundColor = "#999";
        toggleBtn.style.color = "#fff";
        showToast("Focus Mode enabled - Distractions removed", 'success');
    } else {
        toggleBtn.textContent = "🧘 Focus Mode";
        toggleBtn.style.backgroundColor = "#333";
        toggleBtn.style.color = "#fff";
        showToast("Normal mode restored", 'info');
    }
}

toggleBtn.addEventListener("click", () => {
    const isFocusMode = document.body.classList.toggle("focus-mode");
    
    if (isFocusMode) {
        localStorage.setItem("focus-mode", "enabled");
        // Update page title to show focus mode is active
        const originalTitle = document.title;
        if (!originalTitle.includes("(Focus Mode)")) {
            document.title = originalTitle + " (Focus Mode)";
        }
    } else {
        localStorage.setItem("focus-mode", "disabled");
        // Restore original page title
        document.title = document.title.replace(" (Focus Mode)", "");
    }
    
    updateButtonAppearance(isFocusMode);
});

// Retain user preference on page load
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("focus-mode");
    if (saved === "enabled") {
        document.body.classList.add("focus-mode");
        // Update page title to show focus mode is active
        const originalTitle = document.title;
        if (!originalTitle.includes("(Focus Mode)")) {
            document.title = originalTitle + " (Focus Mode)";
        }
        updateButtonAppearance(true);
    }
});

// Keyboard shortcut: Ctrl+F to toggle focus mode
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        toggleBtn.click();
    }
});
