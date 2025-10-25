
// ===== Navbar & Scroll Handling =====
const element = document.getElementById('scroll-hide');
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

// ===== Back Button Function =====
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = '/';
    }
}

// ===== Enhanced Dark Mode Toggle =====
let darkModeInitialized = false;

function initDarkMode() {
    // Prevent multiple initializations
    if (darkModeInitialized) return;
    
    const mode = document.getElementById("mode");
    
    if (!mode) {
        console.error('Mode element not found!');
        return;
    }
    
    // Ensure theme is applied (in case immediate script didn't run)
    const isDark = localStorage.getItem('mode') === 'true';
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.body.classList.toggle('dark-mode', isDark);
    
    updateModeIcon(mode);
    
    // Remove any existing event listeners
    mode.onclick = null;
    
    // Add click event listener with smooth transitions
    mode.addEventListener('click', function () {
        toggleThemeWithAnimation(mode);
    });
    
    // Add keyboard support for accessibility
    mode.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleThemeWithAnimation(mode);
        }
    });
    
    darkModeInitialized = true;
    console.log('Dark mode toggle initialized successfully');
}

// Enhanced theme toggle with smooth animations
function toggleThemeWithAnimation(mode) {
    const wasDarkmode = localStorage.getItem('mode') === 'true';
    const newMode = !wasDarkmode;
    
    // Add transition overlay
    const overlay = createTransitionOverlay();
    document.body.appendChild(overlay);
    
    // Disable transitions temporarily to prevent flicker
    document.body.classList.add('theme-switching');
    
    // Show overlay
    setTimeout(() => {
        overlay.classList.add('active');
    }, 10);
    
    // Apply theme change
    setTimeout(() => {
        localStorage.setItem('mode', newMode);
        document.documentElement.classList.toggle("dark-mode", newMode);
        document.body.classList.toggle("dark-mode", newMode);
        
        // Update icon with animation
        updateModeIconWithAnimation(mode);
        
        // Add content animation class
        document.body.classList.add('theme-content');
        
        // Remove switching class to re-enable transitions
        document.body.classList.remove('theme-switching');
        
        // Hide overlay
        setTimeout(() => {
            overlay.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(overlay);
                document.body.classList.remove('theme-content');
            }, 300);
        }, 200);
        
        console.log('Theme toggled to:', newMode ? 'dark' : 'light');
    }, 150);
}

// Create transition overlay for smooth theme switching
function createTransitionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay';
    overlay.style.background = document.body.classList.contains('dark-mode') ? 
        'var(--bg-color)' : 'var(--bg-color)';
    return overlay;
}

// Update mode icon with smooth animation
function updateModeIconWithAnimation(mode) {
    if (!mode) return;
    
    // Add animation class
    mode.classList.add('mode-icon-transition');
    
    // Update icon source
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

    mode.src = document.body.classList.contains("dark-mode") ? 
        imgPathPrefix + "sun.png" : imgPathPrefix + "moon.png";
    
    // Remove animation class after animation completes
    setTimeout(() => {
        mode.classList.remove('mode-icon-transition');
    }, 500);
}

function updateModeIcon(mode) {
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

// Test function for debugging (can be called from browser console)
function testThemeToggle() {
    const mode = document.getElementById("mode");
    console.log('Mode element:', mode);
    console.log('Current dark mode state:', document.body.classList.contains('dark-mode'));
    console.log('LocalStorage mode:', localStorage.getItem('mode'));
    
    if (mode) {
        mode.click();
    } else {
        console.error('Mode element not found!');
    }
}

// System preference detection
function getSystemThemePreference() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

// Initialize theme based on system preference if no saved preference
function initializeThemePreference() {
    const savedMode = localStorage.getItem('mode');
    
    if (savedMode === null) {
        // No saved preference, use system preference
        const systemPrefersDark = getSystemThemePreference() === 'dark';
        localStorage.setItem('mode', systemPrefersDark);
        console.log('Initialized theme based on system preference:', systemPrefersDark ? 'dark' : 'light');
        
        // Apply the theme
        document.documentElement.classList.toggle('dark-mode', systemPrefersDark);
        document.body.classList.toggle('dark-mode', systemPrefersDark);
    }
}

// Initialize dark mode when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme preference first
    initializeThemePreference();
    
    // Initialize dark mode
    initDarkMode();
});

// Also try on window load as backup
window.addEventListener('load', function() {
    if (!darkModeInitialized) {
        initDarkMode();
    }
});

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
    // Prevent Google Translate popup and banner
    if (typeof google !== 'undefined' && google.translate) {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false, // Prevent automatic banner display
            multilanguagePage: false // Prevent automatic language detection
        }, 'google_translate_element');
        
        // Hide any Google Translate elements that might appear
        setTimeout(() => {
            const elements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-gadget, .goog-te-combo, .goog-te-ftab');
            elements.forEach(el => {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.style.opacity = '0';
                el.style.height = '0';
                el.style.width = '0';
            });
        }, 100);
    }
}

// Dynamically load Google Translate script once with performance optimizations
if (!document.querySelector('script[src*="translate.google.com"]')) {
    const translateScript = document.createElement('script');
    translateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    translateScript.async = true; // Load asynchronously to prevent blocking
    translateScript.defer = true; // Defer execution
    translateScript.onload = function() {
        // Additional cleanup after script loads
        setTimeout(() => {
            const elements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-gadget, .goog-te-combo, .goog-te-ftab, .goog-te-menu2');
            elements.forEach(el => {
                el.remove(); // Completely remove elements instead of just hiding
            });
        }, 200);
    };
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

// Run language toggle initialization
document.addEventListener("DOMContentLoaded", function() {
    setTimeout(initLanguageToggle, 200);
});


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

// ===== Daily Motivation Quote =====
document.addEventListener("DOMContentLoaded", function () {
  const quotes = [
  "Believe in yourself and all that you are!",
  "Small steps every day lead to big results.",
  "Your hard work will pay off.",
  "Every day is a new beginning.",
  "Consistency is the key to success.",
  "Trust your dreams and keep going.",
  "Learn from failure and never give up.",
  "Think positive, life will get easier.",
  "Give your best and don’t stress.",
  "Focus on your goals and ignore distractions.",
  "Try something new, growth comes from change.",
  "Remember your goals daily.",
  "Smile often, it boosts your energy.",
  "Value your time.",
  "Patience brings the best results.",
  "Step out of your comfort zone.",
  "Believe in yourself.",
  "Never stop learning.",
  "Celebrate small wins.",
  "Surround yourself with positive people.",
  "Reduce stress, keep your mindset strong.",
  "Every day is an opportunity.",
  "Hard work and smart work both matter.",
  "Enjoy life, don’t just work.",
  "Accept your mistakes.",
  "Focus on solutions, not problems.",
  "Self-discipline is important.",
  "Upgrade your skills regularly.",
  "Dream big, start small.",
  "Keep pushing forward, every step counts."
  ];

  const today = new Date();
  const index = (today.getDate() -1)% quotes.length;
  const quoteElement = document.getElementById("quote-text");
  

  if (quoteElement) {
    const text = quotes[index];
    quoteElement.innerText = "";
    quoteElement.classList.add("show");
     let i = 0;
    function typeEffect() {
      if (i < text.length) {
        quoteElement.innerText += text.charAt(i);
        i++;
        setTimeout(typeEffect, 80);
      }
    }
    
    typeEffect(); 
  }
});