// ===== Navbar & Scroll Handling =====

const nav = document.querySelector("nav");
function checkWindowSize() {
  if (window.innerWidth < 1000) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        nav.style.transform = "translateY(-100%)";
        nav.style.transition = "transform 0.3s ease";
      } else {
        nav.style.transform = "translateY(0)";
      }
    });
  } else {
    nav.style.transform = "translateY(0)";
  }
}
window.addEventListener("load", checkWindowSize);
window.addEventListener("resize", checkWindowSize);

const element = document.getElementById("scroll-hide");
const mode = document.getElementById("mode");
const load = document.getElementById("onload");

function checkWindowSize() {
  if (!element) return;

  if (window.innerWidth < 1000) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 10) {
        element.style.display = "none";
      }
    });
  } else {
    element.style.display = "flex";
  }
}

window.addEventListener("load", checkWindowSize);
window.addEventListener("resize", checkWindowSize);

/// Mobile Menu Toggle
function initNavbarEvents() {
  const clickBtn = document.getElementById("click");
  if (clickBtn) {
    clickBtn.addEventListener("click", function () {
      nav.querySelector("ul").style.display = clickBtn.checked
        ? "block"
        : "none";
    });
  }
}

// Trigger when navbar dynamically loaded
document.addEventListener("navbarLoaded", initNavbarEvents);
document.addEventListener("DOMContentLoaded", initNavbarEvents);

// ===== Dark Mode Toggle =====
window.onload = function () {
  const isDark = localStorage.getItem("mode") === "true";
  document.body.classList.toggle("dark-mode", isDark);

  updateModeIcon();
};

function updateModeIcon() {
  if (!mode) return;
  const basePath =
    window.location.pathname.includes("/pages") ||
    window.location.pathname.includes("/games")
      ? "../images/"
      : "images/";
  mode.src = document.body.classList.contains("dark-mode")
    ? `${basePath}sun.png`
    : `${basePath}moon.png`;
}

if (mode) {
  mode.onclick = function () {
    const wasDarkmode = localStorage.getItem("mode") === "true";
    const newMode = !wasDarkmode;
    localStorage.setItem("mode", newMode);
    document.body.classList.toggle("dark-mode", newMode);
    updateModeIcon();
  };
}

// ===== Copyright Year =====
document.addEventListener("DOMContentLoaded", function () {
  const year = new Date().getFullYear();
  const copyright = document.getElementById("copyright");
  if (copyright) {
    copyright.textContent = `© ${year} nitramitra | All Rights Reserved`;
  }
});

// ===== Google Translate Integration =====
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "en",
      includedLanguages: "en,hi",
      autoDisplay: false,
    },
    "google_translate_element"
  );
}

function waitForTranslate(callback) {
  const maxAttempts = 20; // Prevent infinite polling
  let attempts = 0;
  const interval = setInterval(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select || attempts >= maxAttempts) {
      clearInterval(interval);
      if (select) callback(select);
      else console.error("Google Translate select not found");
    }
    attempts++;
  }, 200);
}

function initLanguageToggle() {
  const langToggle = document.getElementById("lang-toggle");
  if (!langToggle) return;

  waitForTranslate((select) => {
    const savedLang = localStorage.getItem("lang") || "en";
    select.value = savedLang;
    select.dispatchEvent(new Event("change"));
    langToggle.textContent = savedLang === "en" ? "हिंदी" : "English";
    langToggle.setAttribute(
      "aria-label",
      savedLang === "en" ? "Switch to Hindi" : "Switch to English"
    );

    langToggle.addEventListener("click", () => {
      const newLang = select.value === "en" ? "hi" : "en";
      select.value = newLang;
      select.dispatchEvent(new Event("change"));
      langToggle.textContent = newLang === "en" ? "हिंदी" : "English";
      langToggle.setAttribute(
        "aria-label",
        newLang === "en" ? "Switch to Hindi" : "Switch to English"
      );
      localStorage.setItem("lang", newLang);
    });
  });
}

document.addEventListener("DOMContentLoaded", initLanguageToggle);
document.addEventListener("navbarLoaded", initLanguageToggle);


const yearInput = document.getElementById("passingYear");
const currentYear = new Date().getFullYear();

// Set min & max dynamically
yearInput.min = currentYear - 4;
yearInput.max = currentYear + 4;