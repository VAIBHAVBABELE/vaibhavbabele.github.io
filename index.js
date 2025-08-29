
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
    const navLinks = document.querySelectorAll("nav ul li a"); // menu links
    if (clickBtn) {
        clickBtn.addEventListener('click', function () {
            if (element) element.style.display = 'block';
        });
    }

     if (!clickBtn) return;

    // Close nav when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            clickBtn.checked = false; // uncheck hamburger = menu closes
        });
    });
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

function initLanguageToggle() {
  const langToggle = document.getElementById("lang-toggle");
  if (!langToggle) return;

  waitForTranslate((select) => {
    // Helper to apply a language and keep the button text in sync
    const applyLang = (lang) => {
      if (select.value !== lang) {
        select.value = lang;
        select.dispatchEvent(new Event("change"));
      } else {
        // Re-fire change in case GT reset internally
        select.dispatchEvent(new Event("change"));
      }
      langToggle.innerText = lang === "en" ? "हिंदी" : "English";
    };

    // Restore saved language after a short delay so GT finishes initializing
    const savedLang = localStorage.getItem("lang") || "en";
    setTimeout(() => applyLang(savedLang), 500);

    // Guard to avoid attaching the click handler multiple times
    if (!langToggle.dataset.bound) {
      langToggle.addEventListener("click", () => {
        const newLang = select.value === "en" ? "hi" : "en";
        localStorage.setItem("lang", newLang);
        applyLang(newLang);
      });
      langToggle.dataset.bound = "true";
    }
  });
}

// Run on every page load
document.addEventListener("DOMContentLoaded", initLanguageToggle);
document.addEventListener("navbarLoaded", initLanguageToggle);


document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll("nav ul li a");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100; // adjust offset for header
      const sectionHeight = section.clientHeight;

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
});
