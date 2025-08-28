// navbar.js - Collapsible Sidebar Navigation Script

class CollapsibleNavbar {
    constructor() {
        this.sidebar = null;
        this.toggleBtn = null;
        this.body = document.body;
        this.overlay = null;
        this.isExpanded = false;
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
        this.bindEvents();
        this.handleResize();
    }

    init() {
        // Create overlay for mobile
        this.createOverlay();
        
        // Get sidebar elements
        this.sidebar = document.querySelector('.sidebar');
        this.toggleBtn = document.querySelector('.toggle-btn');
        
        if (!this.sidebar || !this.toggleBtn) {
            console.error('Sidebar elements not found');
            return;
        }

        // Set initial state
        this.updateActiveNavLink();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'overlay';
        this.overlay.style.display = 'none';
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Toggle button click
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        }

        // Overlay click (mobile)
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Navigation link clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-link')) {
                this.handleNavClick(e);
            }
        });

        // Dropdown toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.dropdown-toggle')) {
                this.handleDropdownToggle(e);
            }
        });

        // Window resize
        window.addEventListener('resize', () => this.handleResize());

        // Escape key to close sidebar on mobile
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile && this.isExpanded) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        if (this.isExpanded) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('expanded');
        this.isExpanded = true;

        if (this.isMobile) {
            this.overlay.style.display = 'block';
            this.body.style.overflow = 'hidden';
        } else {
            this.body.classList.add('sidebar-expanded');
        }
    }

    closeSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('expanded');
        this.isExpanded = false;

        if (this.isMobile) {
            this.overlay.style.display = 'none';
            this.body.style.overflow = '';
        } else {
            this.body.classList.remove('sidebar-expanded');
        }
    }

    handleNavClick(e) {
        const navLink = e.target.closest('.nav-link');
        if (!navLink) return;

        // Don't handle dropdown toggles here
        if (navLink.classList.contains('dropdown-toggle')) return;

        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        navLink.classList.add('active');

        // Close sidebar on mobile after navigation
        if (this.isMobile && !navLink.classList.contains('dropdown-toggle')) {
            setTimeout(() => this.closeSidebar(), 300);
        }
    }

    handleDropdownToggle(e) {
        e.preventDefault();
        const toggle = e.target.closest('.dropdown-toggle');
        const dropdown = toggle.nextElementSibling;
        
        if (dropdown && dropdown.classList.contains('nav-dropdown')) {
            toggle.classList.toggle('active');
            dropdown.classList.toggle('active');
        }
    }

    updateActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (currentPath.endsWith(href) || (href === 'index.html' && currentPath === '/'))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    handleResize() {
        const newIsMobile = window.innerWidth <= 768;
        
        if (newIsMobile !== this.isMobile) {
            this.isMobile = newIsMobile;
            
            if (!this.isMobile) {
                // Desktop mode
                this.overlay.style.display = 'none';
                this.body.style.overflow = '';
                if (this.isExpanded) {
                    this.body.classList.add('sidebar-expanded');
                }
            } else {
                // Mobile mode
                this.body.classList.remove('sidebar-expanded');
                if (this.isExpanded) {
                    this.overlay.style.display = 'block';
                    this.body.style.overflow = 'hidden';
                }
            }
        }
    }

    // Public method to programmatically set active nav item
    setActiveNav(href) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const targetLink = document.querySelector(`.nav-link[href="${href}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }
}

// Mode toggle functionality (keeping your existing logic)
function updateModeIcon() {
    const mode = document.getElementById("sidebar-mode");
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

function initModeToggle() {
    const modeToggle = document.querySelector('.mode-toggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', function() {
            const wasDarkmode = localStorage.getItem('mode') === 'true';
            const newMode = !wasDarkmode;
            localStorage.setItem('mode', newMode);
            document.body.classList.toggle("dark-mode", newMode);
            updateModeIcon();
        });
    }
}

// Language toggle functionality (keeping your existing logic)
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

function initLanguageToggle() {
    const langToggle = document.getElementById("sidebar-lang-toggle");
    if (!langToggle) return;

    function waitForTranslate(callback) {
        const interval = setInterval(() => {
            const select = document.querySelector(".goog-te-combo");
            if (select) {
                clearInterval(interval);
                callback(select);
            }
        }, 500);
    }

    waitForTranslate((select) => {
        const savedLang = localStorage.getItem("lang") || "en";
        select.value = savedLang;
        select.dispatchEvent(new Event("change"));
        langToggle.innerText = savedLang === "en" ? "हिंदी" : "English";

        langToggle.addEventListener("click", function () {
            const newLang = select.value === "en" ? "hi" : "en";
            select.value = newLang;
            select.dispatchEvent(new Event("change"));
            langToggle.innerText = newLang === "en" ? "हिंदी" : "English";
            localStorage.setItem("lang", newLang);
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    const isDark = localStorage.getItem('mode') === 'true';
    document.body.classList.toggle('dark-mode', isDark);
    
    // Initialize navbar
    window.navbarInstance = new CollapsibleNavbar();
    
    // Initialize mode toggle
    initModeToggle();
    updateModeIcon();
    
    // Initialize language toggle
    initLanguageToggle();
});

// Load Google Translate script if not already loaded
if (!document.querySelector('script[src*="translate.google.com"]')) {
    const translateScript = document.createElement('script');
    translateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(translateScript);
}

// Hide Google Translate elements
const style = document.createElement('style');
style.textContent = `
    .goog-te-banner-frame.skiptranslate,
    .goog-te-gadget-icon,
    .goog-te-menu-value span,
    #google_translate_element {
        display: none !important;
    }
    body {
        top: 0px !important;
    }
`;
document.head.appendChild(style);

// Export for use in other scripts
window.NavbarUtils = {
    setActiveNav: function(href) {
        if (window.navbarInstance) {
            window.navbarInstance.setActiveNav(href);
        }
    },
    openSidebar: function() {
        if (window.navbarInstance) {
            window.navbarInstance.openSidebar();
        }
    },
    closeSidebar: function() {
        if (window.navbarInstance) {
            window.navbarInstance.closeSidebar();
        }
    }
};