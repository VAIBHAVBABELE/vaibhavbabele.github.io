// Prevent Google from using its cookies/auto-detect
var gtCookie = document.cookie
  .split(";")
  .filter((c) => c.includes("googtrans"));
if (gtCookie.length) {
  document.cookie =
    "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function googleTranslateElementInit() {
  console.log("googleTranslateElementInit called");
  try {
    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi",
        autoDisplay: false,
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      },
      "google_translate_element"
    );
    console.log("Google Translate element created successfully");
  } catch (error) {
    console.error("Error creating Google Translate element:", error);
  }
}

function waitForGoogleTranslate(callback, maxAttempts = 30) {
  let attempts = 0;
  console.log("Waiting for Google Translate dropdown...");

  const checkInterval = setInterval(() => {
    const select = document.querySelector(".goog-te-combo");
    attempts++;
    console.log(`Attempt ${attempts}: Looking for .goog-te-combo`);

    if (select) {
      clearInterval(checkInterval);
      console.log("Google Translate dropdown found!");
      callback(select);
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval);
      console.error(
        "Google Translate failed to load after",
        maxAttempts,
        "attempts"
      );
      // Try alternative selectors
      const altSelect =
        document.querySelector("select.goog-te-combo") ||
        document.querySelector("[name='google_translate_element']") ||
        document.querySelector(".goog-te-gadget select");
      if (altSelect) {
        console.log("Found alternative Google Translate selector");
        callback(altSelect);
      } else {
        console.error("No Google Translate dropdown found at all");
      }
    }
  }, 500);
}

function initializeLanguageToggle() {
  console.log("Initializing language toggle...");

  waitForGoogleTranslate((select) => {
    console.log(
      "Google Translate loaded successfully, select element:",
      select
    );

    const langToggle = document.getElementById("lang-toggle");
    if (!langToggle) {
      console.error("Language toggle button not found");
      return;
    }

    console.log("Language toggle button found:", langToggle);

    // Get current language from localStorage or default to English
    let currentLang = localStorage.getItem("lang") || "en";
    console.log("Current language from storage:", currentLang);

    // Set initial language
    select.value = currentLang;
    select.dispatchEvent(new Event("change"));
    langToggle.textContent = currentLang === "en" ? "हिंदी" : "English";

    console.log("Initial language set, button text:", langToggle.textContent);

    // Remove any existing click handlers
    langToggle.onclick = null;

    // Add click handler for language toggle
    langToggle.addEventListener("click", function (e) {
      e.preventDefault();
      console.log("Language toggle clicked! Current lang:", currentLang);

      // Toggle language
      currentLang = currentLang === "en" ? "hi" : "en";
      console.log("Switching to language:", currentLang);

      // Update Google Translate
      console.log("Setting dropdown value to:", currentLang);
      select.value = currentLang;
      select.dispatchEvent(new Event("change"));

      // Update button text
      langToggle.textContent = currentLang === "en" ? "हिंदी" : "English";
      console.log("Button text updated to:", langToggle.textContent);

      // Save to localStorage
      localStorage.setItem("lang", currentLang);
      console.log("Language saved to localStorage:", currentLang);

      // Force page translation
      setTimeout(() => {
        console.log("Forcing translation after timeout");
        if (window.google && window.google.translate) {
          console.log("Google Translate API available");
        } else {
          console.error("Google Translate API not available");
        }
      }, 100);
    });

    console.log("Language toggle initialized successfully");
  });
}

// Load Google Translate script only once
function loadGoogleTranslateScript() {
  if (document.querySelector('script[src*="translate.google.com"]')) {
    console.log("Google Translate script already loaded");
    return;
  }

  console.log("Loading Google Translate script...");
  const translateScript = document.createElement("script");
  // Use https instead of // for localhost compatibility
  translateScript.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  translateScript.onload = function () {
    console.log("Google Translate script loaded successfully");
  };
  translateScript.onerror = function () {
    console.error(
      "Failed to load Google Translate script - possible network issue"
    );
  };
  document.head.appendChild(translateScript);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing translation...");

  // Check if we have internet connection
  if (navigator.onLine) {
    console.log("Internet connection detected");
    loadGoogleTranslateScript();

    // Give more time for the script to load before initializing
    setTimeout(() => {
      console.log("Starting language toggle initialization...");
      initializeLanguageToggle();
    }, 2000);
  } else {
    console.error("No internet connection detected");
  }
});

// Fallback initialization
window.addEventListener("load", function () {
  console.log("Window load event triggered");
  // Check if translation is already working
  setTimeout(() => {
    const langToggle = document.getElementById("lang-toggle");
    if (langToggle && !langToggle.onclick) {
      console.log("Fallback initialization triggered");
      initializeLanguageToggle();
    }
  }, 3000);
});
