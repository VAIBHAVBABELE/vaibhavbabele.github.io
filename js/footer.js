// Modern Footer JavaScript
class ModernFooter {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.init();
    }

    init() {
        this.renderFooter();
        this.bindEvents();
        this.updateCopyright();
    }

    renderFooter() {
        const footerHTML = `
           <footer class="modern-footer">
            <div class="footer-container">
                <div class="footer-content">
                    <!-- About Section -->
                    <div class="footer-hero">
                        <h3><i class="fas fa-graduation-cap"></i>Nitra Mitra</h3>
                        <p class="footer-description">Your ultimate platform for academic resources, campus updates, and community connection
                            at NITRA Technical Campus. Empowering students with comprehensive educational tools.
                        </p>
                        <div class="contact-info">
                            <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                            <span>Sanjay Nagar, Ghaziabad, India</span>
                        </div>
                        <div class="contact-info">
                            <i class="fas fa-envelope" aria-hidden="true"></i>
                            <span><a href="mailto:nitramitra@gmail.com">nitramitra@gmail.com</a></span>
                        </div>
                    </div>


                    <div class="footer-shortcuts">

                        <!-- Quick Links Section -->
                        <div class="quick-links">
                            <h3 class="footer-heading"><i class="fas fa-link"></i> Quick Links</h3>
                            <ul class="footer-links-list">
                                <li><a href="../index.html"><i class="fas fa-home"></i> Home</a></li>
                                <li><a href="../pages/resources.html"><i class="fas fa-book"></i> Resources</a>
                                </li>
                                <li><a href="../pages/gallery.html"><i class="fas fa-images"></i> Gallery</a></li>
                                <li><a href="../pages/cgpa-calculator.html"><i class="fas fa-calculator"></i> CGPA
                                        Calculator</a></li>
                                <li><a href="../games/games.html"><i class="fas fa-gamepad"></i> Games</a></li>
                                
                            </ul>
                        </div>

                        <!-- Academic Tools Section -->
                        <div class="academic-tools">
                            <h3 class="footer-heading"><i class="fas fa-tools"></i> Academic Tools</h3>
                            <ul class="footer-links-list">
                                <li><a href="../pages/assistant/assistant.html"><i class="fas fa-robot"></i>
                                        Student
                                        Assistant</a></li>
                                <li><a href="../pages/summary/summary.html"><i class="fas fa-file-alt"></i> AI
                                        Summary
                                        Tool</a></li>
                                <li><a href="../pages/syllabus/syllabus.html"><i class="fas fa-clipboard-list"></i>
                                        Syllabus</a></li>
                                <li><a href="../pages/ats-score-checker/ats-score-checker.html"><i
                                            class="fas fa-check-circle"></i> ATS Score Checker</a></li>
                                <li><a href="../pages/placement-updates.html"><i class="fas fa-briefcase"></i>
                                        Placement Updates</a></li>
                            </ul>
                        </div>
                    </div>
                    <!-- Connect Section -->
                    <div class="footer-connect">
                        <h3 class="footer-heading"><i class="fas fa-users"></i> Connect with Us</h3>
                        <p class="footer-description">Stay connected with our community and never miss important updates!</p>
                        <div class="social-media-grid">
                            <a href="https://youtube.com/@my.vlog_spot" target="_blank" class="social-link"
                                title="YouTube" aria-label="YouTube">
                                <i class="fab fa-youtube"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/vaibhavbabele" target="_blank" class="social-link"
                                title="LinkedIn" aria-label="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.instagram.com/my_vlog.spot/" target="_blank" class="social-link"
                                title="Instagram" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" title="Twitter" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://wa.me/919999999999" target="_blank" class="social-link"
                                title="WhatsApp" aria-label="WhatsApp">
                                <i class="fab fa-whatsapp"></i>
                            </a>
                        </div>
                        
                    </div>
                </div>

                <!-- Footer Bottom -->
                <div class="footer-bottom">
                    <div class="footer-bottom-content">
                        <div class="copyright-text">
                            <span id="footer-copyright">
                                &copy; <span id="current-year"></span> Nitra Mitra. All Rights Reserved.
                            </span>
                        </div>
                        <div class="footer-bottom-links">
                            <a href="../pages/privacy.html">Privacy Policy</a>
                            <a href="../pages/terms.html">Terms & Conditions</a>
                            <a href="../pages/contact.html">Contact</a>
                            <a href="../pages/pr-contribution/pr-contributors.html">Contributors</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

        `;

        // Remove existing footer if any
        const existingFooter = document.querySelector('.modern-footer');
        if (existingFooter) {
            existingFooter.remove();
        }

        // Append new footer to body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    bindEvents() {
        // Newsletter subscription
        const subscribeBtn = document.getElementById('newsletter-subscribe');
        const emailInput = document.getElementById('newsletter-email');

        if (subscribeBtn && emailInput) {
            subscribeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNewsletterSubscription(emailInput);
            });

            emailInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNewsletterSubscription(emailInput);
                }
            });
        }

        // Smooth scroll for anchor links
        const footerLinks = document.querySelectorAll('.footer-links-list a[href^="#"]');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Fix relative links based on current path
        this.fixRelativeLinks();
    }

    handleNewsletterSubscription(emailInput) {
        const email = emailInput.value.trim();

        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            return;
        }

        // Simulate subscription process
        const btn = document.getElementById('newsletter-subscribe');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        btn.disabled = true;

        setTimeout(() => {
            this.showNotification('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `footer-notification footer-notification-${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--accent-color)' : type === 'error' ? '#dc3545' : 'var(--main-color)'};
            color: var(--white-4345);
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.querySelector('#footer-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'footer-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => notification.remove());
        }
    }

    updateCopyright() {
        const copyrightElement = document.getElementById('footer-copyright');
        if (copyrightElement) {
            copyrightElement.innerHTML = `&copy; ${this.currentYear} Nitra Mitra. All Rights Reserved.`;
        }
    }

    fixRelativeLinks() {
        const currentPath = window.location.pathname;
        const footerLinks = document.querySelectorAll('.footer-links-list a, .footer-bottom-links a');

        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('../')) {
                // Adjust based on current directory depth
                const depth = (currentPath.match(/\//g) || []).length - 1;
                if (depth > 1) {
                    // We're in a subdirectory, links should work as is
                    return;
                } else if (depth === 1 && !currentPath.includes('pages')) {
                    // We're in root, adjust links
                    const newHref = href.replace('../', '');
                    link.setAttribute('href', newHref);
                }
            }
        });
    }

    // Method to customize footer for specific pages
    customizeForPage(pageType) {
        const footer = document.querySelector('.modern-footer');
        if (!footer) return;

        switch (pageType) {
            case 'home':
                // Home page specific customizations
                break;
            case 'resources':
                // Resources page specific customizations
                break;
            case 'games':
                // Games page specific customizations
                break;
            default:
                break;
        }
    }
}

// Initialize footer when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    const footer = new ModernFooter();

    // Optional: Auto-detect page type and customize footer
    const path = window.location.pathname;
    if (path.includes('resorces')) {
        footer.customizeForPage('resources');
    } else if (path.includes('games')) {
        footer.customizeForPage('games');
    } else if (path === '/' || path.includes('index')) {
        footer.customizeForPage('home');
    }
});

// Export for potential use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernFooter;
}