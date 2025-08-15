// ===== Navbar & Scroll Handling =====
const element = document.getElementById('scroll-hide');
const mode = document.getElementById("mode");
const load = document.getElementById("onload");

function checkWindowSize() {
    if (!element) return;

    if (window.innerWidth < 1000) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                element.style.display = 'none';
            }
        });
    } else {
        element.style.display = 'flex';
    }
}

window.addEventListener('load', checkWindowSize);
window.addEventListener('resize', checkWindowSize);

/* ===== Mobile Menu Toggle ===== */
function initNavbarEvents() {
    const clickBtn = document.getElementById('click');
    if (clickBtn) {
        clickBtn.addEventListener('click', function () {
            if (element) element.style.display = 'block';
        });
    }
}

// Trigger when navbar dynamically loaded
document.addEventListener("navbarLoaded", initNavbarEvents);
document.addEventListener("DOMContentLoaded", initNavbarEvents);

// ===== Dark Mode Toggle =====
window.onload = function () {
    const isDark = localStorage.getItem('mode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);

    updateModeIcon();
}

function updateModeIcon() {
    if (!mode) return;

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

    mode.src = document.body.classList.contains("dark-mode") ? imgPathPrefix + "sun.png" : imgPathPrefix + "moon.png";
}

if (mode) {
    mode.onclick = function () {
        const wasDarkmode = localStorage.getItem('mode') === 'true';
        const newMode = !wasDarkmode;
        localStorage.setItem('mode', newMode);
        document.body.classList.toggle("dark-mode", newMode);
        updateModeIcon();
    }
}

// ===== Copyright Year =====
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

// ===== Google Translate Toggle =====
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// Dynamically load Google Translate script once
if (!document.querySelector('script[src*="translate.google.com"]')) {
    const translateScript = document.createElement('script');
    translateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(translateScript);
}

function waitForTranslate(callback) {
    const interval = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
            clearInterval(interval);
            callback(select);
        }
    }, 500);
}

function initLanguageToggle() {
    const langToggle = document.getElementById("lang-toggle");
    if (!langToggle) return;

    waitForTranslate((select) => {
        // Apply saved language immediately
        const savedLang = localStorage.getItem("lang") || "en";
        select.value = savedLang;
        select.dispatchEvent(new Event("change"));
        langToggle.innerText = savedLang === "en" ? "हिंदी" : "English";

        // Toggle click
        langToggle.addEventListener("click", function () {
            const newLang = select.value === "en" ? "hi" : "en";
            select.value = newLang;
            select.dispatchEvent(new Event("change"));
            langToggle.innerText = newLang === "en" ? "हिंदी" : "English";
            localStorage.setItem("lang", newLang);
        });
    });
}

// Run on every page load
document.addEventListener("DOMContentLoaded", initLanguageToggle);
document.addEventListener("navbarLoaded", initLanguageToggle);

