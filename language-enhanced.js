/* eslint-disable quotes */
// Enhanced Translation System with Fallback
// This provides both Google Translate integration and a fallback translation system

// Basic Hindi translations for common elements
const basicTranslations = {
  // Navigation and UI
  "Welcome to Nitra Mitra": "नित्रा मित्र में आपका स्वागत है",
  "Your ultimate platform for academic resources":
    "शैक्षणिक संसाधनों के लिए आपका अंतिम मंच",
  Services: "सेवाएं",
  Resources: "संसाधन",
  Games: "खेल",
  Gallery: "गैलरी",
  "Contact Us": "संपर्क करें",
  "About us": "हमारे बारे में",
  "My Services": "मेरी सेवाएं",
  "Feedback Form": "फीडबैक फॉर्म",
  Infrastructure: "अवसंरचना",
  "CGPA/SGPA Calculator": "सीजीपीए/एसजीपीए कैलकुलेटर",
  "Student Assistant": "छात्र सहायक",
  "AI Summary Tool": "एआई सारांश उपकरण",
  Syllabus: "पाठ्यक्रम",

  // Common phrases
  "Get all resources for BTECH Students":
    "बीटेक छात्रों के लिए सभी संसाधन प्राप्त करें",
  "Multiple games plays": "कई खेल खेले जाते हैं",
  "View all events memories here": "यहां सभी कार्यक्रमों की यादें देखें",
  "Calculate your semester SGPA & overall CGPA":
    "अपना सेमेस्टर एसजीपीए और समग्र सीजीपीए की गणना करें",
  "AI-powered chatbot for academic help":
    "शैक्षणिक सहायता के लिए एआई-संचालित चैटबॉट",
  "Smart text & file summarization": "स्मार्ट टेक्स्ट और फ़ाइल सारांश",
  "Access the latest syllabus for your courses":
    "अपने पाठ्यक्रमों के लिए नवीनतम पाठ्यक्रम तक पहुंचें",

  // Buttons and actions
  Open: "खोलें",
  "Play Now": "अभी खेलें",
  "Calculate Now": "अभी गणना करें",
  "Chat Now": "अभी चैट करें",
  "Summarize Now": "अभी सारांश बनाएं",
  "View Syllabus": "पाठ्यक्रम देखें",
  "View Updates": "अपडेट देखें",

  // About section
  "Our Mission": "हमारा मिशन",
  "Who We Are": "हम कौन हैं",
  "Our Commitment": "हमारी प्रतिबद्धता",
};

// Store original content for restoration
let originalContent = new Map();
let isTranslated = false;

function saveOriginalContent() {
  if (originalContent.size === 0) {
    // Save all text content
    const textElements = document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, p, span, a, button, li"
    );
    textElements.forEach((element, index) => {
      if (element.textContent.trim() && !element.querySelector("*")) {
        originalContent.set(`element_${index}`, {
          element: element,
          originalText: element.textContent.trim(),
        });
      }
    });
    console.log("Saved original content for", originalContent.size, "elements");
  }
}

function translateToHindi() {
  console.log("Translating to Hindi using fallback system...");
  saveOriginalContent();

  originalContent.forEach((data) => {
    const { element, originalText } = data;
    const translation = basicTranslations[originalText];
    if (translation) {
      element.textContent = translation;
    }
  });

  isTranslated = true;
  console.log("Translation to Hindi completed");
}

function translateToEnglish() {
  console.log("Restoring English content...");

  originalContent.forEach((data) => {
    const { element, originalText } = data;
    element.textContent = originalText;
  });

  isTranslated = false;
  console.log("Restoration to English completed");
}

// Enhanced Google Translate with fallback
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
    console.log("Will use fallback translation system");
    initializeFallbackTranslation();
  }
}

function initializeFallbackTranslation() {
  console.log("Initializing fallback translation system");

  const langToggle = document.getElementById("lang-toggle");
  if (!langToggle) {
    console.error("Language toggle button not found");
    return;
  }

  // Get current language from localStorage or default to English
  let currentLang = localStorage.getItem("lang") || "en";
  console.log("Current language from storage:", currentLang);

  // Set initial state
  langToggle.textContent = currentLang === "en" ? "हिंदी" : "English";

  if (currentLang === "hi") {
    setTimeout(() => translateToHindi(), 100);
  }

  // Remove any existing click handlers
  langToggle.onclick = null;

  // Add click handler for language toggle
  langToggle.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(
      "Fallback translation - Language toggle clicked! Current lang:",
      currentLang
    );

    // Toggle language
    currentLang = currentLang === "en" ? "hi" : "en";
    console.log("Switching to language:", currentLang);

    // Apply translation
    if (currentLang === "hi") {
      translateToHindi();
    } else {
      translateToEnglish();
    }

    // Update button text
    langToggle.textContent = currentLang === "en" ? "हिंदी" : "English";
    console.log("Button text updated to:", langToggle.textContent);

    // Save to localStorage
    localStorage.setItem("lang", currentLang);
    console.log("Language saved to localStorage:", currentLang);
  });

  console.log("Fallback translation system initialized successfully");
}

function waitForGoogleTranslate(callback, maxAttempts = 20) {
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
      console.error("Google Translate failed to load, using fallback system");
      initializeFallbackTranslation();
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
      console.log(
        "Google Translate - Language toggle clicked! Current lang:",
        currentLang
      );

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
    });

    console.log("Google Translate language toggle initialized successfully");
  });
}

// Load Google Translate script with error handling
function loadGoogleTranslateScript() {
  if (document.querySelector('script[src*="translate.google.com"]')) {
    console.log("Google Translate script already loaded");
    return;
  }

  console.log("Loading Google Translate script...");
  const translateScript = document.createElement("script");
  translateScript.src =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

  translateScript.onload = function () {
    console.log("Google Translate script loaded successfully");
  };

  translateScript.onerror = function () {
    console.error("Failed to load Google Translate script - using fallback");
    setTimeout(initializeFallbackTranslation, 1000);
  };

  document.head.appendChild(translateScript);

  // Timeout fallback in case Google Translate doesn't respond
  setTimeout(() => {
    const select = document.querySelector(".goog-te-combo");
    if (!select) {
      console.log("Google Translate timeout - switching to fallback");
      initializeFallbackTranslation();
    }
  }, 5000);
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing translation...");

  // Check if we have internet connection
  if (navigator.onLine) {
    console.log("Internet connection detected, trying Google Translate");
    loadGoogleTranslateScript();

    // Give time for the script to load before initializing
    setTimeout(() => {
      console.log("Starting language toggle initialization...");
      initializeLanguageToggle();
    }, 2000);
  } else {
    console.log("No internet connection, using fallback translation");
    setTimeout(initializeFallbackTranslation, 1000);
  }
});

// Fallback initialization
window.addEventListener("load", function () {
  console.log("Window load event triggered");
  setTimeout(() => {
    const langToggle = document.getElementById("lang-toggle");
    if (
      langToggle &&
      !langToggle.onclick &&
      !langToggle.getAttribute("data-initialized")
    ) {
      console.log("Final fallback initialization triggered");
      initializeFallbackTranslation();
      langToggle.setAttribute("data-initialized", "true");
    }
  }, 3000);
});
