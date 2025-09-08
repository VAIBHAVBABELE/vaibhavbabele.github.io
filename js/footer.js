// Modern Footer JavaScript - Fixed & Responsive
class ModernFooter {
    constructor() {
        this.currentYear = new Date().getFullYear();
        this.resizeTimer = null;
        this.init();
    }

    // Compute a base path from current location so footer links resolve correctly
    getBasePath() {
        const currentPath = window.location.pathname;

        if (currentPath.includes('/pages/')) {
            const pathParts = currentPath.split('/');
            const pagesIndex = pathParts.indexOf('pages');
            const depth = pathParts.length - pagesIndex - 2; // -2 for pages and filename

            if (depth > 0) {
                return '../'.repeat(depth + 1);
            } else {
                return '../';
            }
        }

        if (currentPath.includes('/games/')) {
            const pathParts = currentPath.split('/');
            const gamesIndex = pathParts.indexOf('games');
            const depth = pathParts.length - gamesIndex - 2;

            if (depth > 0) {
                return '../'.repeat(depth + 1);
            } else {
                return '../';
            }
        }

        return '';
    }

    init() {
        this.renderFooter();
        this.bindEvents();
        this.updateCopyright();
        this.handleResponsiveChanges();
    }

    renderFooter() {
        const basePath = this.getBasePath();

        const footerHTML = `
           <footer class="modern-footer">
            <div class="footer-container">
                <div class="footer-content">
                    <!-- About/Hero Section -->
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

                    <!-- Shortcuts Container -->
                    <div class="footer-shortcuts">
                        <!-- Quick Links Section -->
                        <div class="quick-links">
                            <h3 class="footer-heading"><i class="fas fa-link"></i> Quick Links</h3>
                            <ul class="footer-links-list">
                                <li><a href="${basePath}index.html"><i class="fas fa-home"></i> Home</a></li>
                                <li><a href="${basePath}pages/resorces.html"><i class="fas fa-book"></i> Resources</a></li>
                                <li><a href="${basePath}pages/gallery.html"><i class="fas fa-images"></i> Gallery</a></li>
                                <li><a href="${basePath}pages/cgpa-calculator.html"><i class="fas fa-calculator"></i> CGPA Calculator</a></li>
                                <li><a href="${basePath}games/gamess.html"><i class="fas fa-gamepad"></i> Games</a></li>
                            </ul>
                        </div>

                        <!-- Academic Tools Section -->
                        <div class="academic-tools">
                            <h3 class="footer-heading"><i class="fas fa-tools"></i> Academic Tools</h3>
                            <ul class="footer-links-list">
                                <li><a href="${basePath}pages/assistant/assistant.html"><i class="fas fa-robot"></i> Student Assistant</a></li>
                                <li><a href="${basePath}pages/summary/summary.html"><i class="fas fa-file-alt"></i> AI Summary Tool</a></li>
                                <li><a href="${basePath}pages/syllabus/syllabus.html"><i class="fas fa-clipboard-list"></i> Syllabus</a></li>
                                <li><a href="${basePath}pages/ats-score-checker/ats-score-checker.html"><i class="fas fa-check-circle"></i> ATS Score Checker</a></li>
                                <li><a href="${basePath}pages/placement-updates.html"><i class="fas fa-briefcase"></i> Placement Updates</a></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Connect Section -->
                    <div class="footer-connect">
                        <h3 class="footer-heading"><i class="fas fa-users"></i> Connect with Us</h3>
                        <p class="footer-description">Stay connected with our community and never miss important updates!</p>
                        <div class="social-media-grid">
                            <a href="https://youtube.com/@my.vlog_spot" target="_blank" rel="noopener" class="social-link"
                                title="YouTube" aria-label="YouTube">
                                <i class="fab fa-youtube"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/vaibhavbabele" target="_blank" rel="noopener" class="social-link"
                                title="LinkedIn" aria-label="LinkedIn">
                                <i class="fab fa-linkedin"></i>
                            </a>
                            <a href="https://www.instagram.com/my_vlog.spot/" target="_blank" rel="noopener" class="social-link"
                                title="Instagram" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                            <a href="#" class="social-link" title="Twitter" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="https://wa.me/919999999999" target="_blank" rel="noopener" class="social-link"
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
                            <a href="${basePath}pages/privacy.html">Privacy Policy</a>
                            <a href="${basePath}pages/terms.html">Terms & Conditions</a>
                            <a href="${basePath}pages/contact.html">Contact</a>
                            <a href="${basePath}pages/pr-contribution/pr-contributors.html">Contributors</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        `;

    // Remove existing modern footer if any
        const existingFooter = document.querySelector('.modern-footer');
        if (existingFooter) existingFooter.remove();

        // Remove legacy/old footer nodes (common class: footer-section) so the new footer can be injected
        const legacyFooters = document.querySelectorAll('footer.footer-section, footer.privacy-footer');
        legacyFooters.forEach(f => {
            if (!f.classList.contains('modern-footer')) {
                f.remove();
            }
        });

        // Append new footer to body
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    bindEvents() {
        // Newsletter subscription (if added in future)
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

        // Handle social link clicks
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click tracking if needed
                const platform = link.getAttribute('title');
                console.log(`Social link clicked: ${platform}`);
            });
        });

        // Fix relative links based on current path
        this.fixRelativeLinks();

        // Add resize handler for responsive adjustments
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.handleResponsiveChanges();
            }, 250);
        });

        // Add intersection observer for footer animations
        this.addScrollAnimations();
    }

    handleResponsiveChanges() {
        const footer = document.querySelector('.modern-footer');
        if (!footer) return;

        const width = window.innerWidth;
        
        // Adjust layout based on screen size
        if (width <= 480) {
            this.optimizeForMobile();
        } else if (width <= 768) {
            this.optimizeForTablet();
        } else {
            this.optimizeForDesktop();
        }
    }

    optimizeForMobile() {
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.style.gridTemplateColumns = '1fr';
            footerContent.style.gap = '15px';
        }

        // Ensure all sections are centered on mobile
        const sections = document.querySelectorAll('.footer-hero, .footer-shortcuts, .footer-connect');
        sections.forEach(section => {
            section.style.textAlign = 'center';
        });
    }

    optimizeForTablet() {
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.style.gridTemplateColumns = '1fr 1fr';
            footerContent.style.gap = '20px';
        }
    }

    optimizeForDesktop() {
        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.style.gridTemplateColumns = '2fr 2fr 1.5fr';
            footerContent.style.gap = '30px';
        }

        // Reset text alignment for desktop
        const sections = document.querySelectorAll('.footer-hero, .footer-shortcuts');
        sections.forEach(section => {
            section.style.textAlign = 'left';
        });
    }

    addScrollAnimations() {
        const footer = document.querySelector('.modern-footer');
        if (!footer || !('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('footer-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        observer.observe(footer);

        // Add CSS for animation
        if (!document.querySelector('#footer-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'footer-animation-styles';
            style.textContent = `
                .modern-footer {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                }
                .modern-footer.footer-visible {
                    opacity: 1;
                    transform: translateY(0);
                }
                .modern-footer .footer-hero,
                .modern-footer .footer-shortcuts > *,
                .modern-footer .footer-connect {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
                }
                .modern-footer.footer-visible .footer-hero {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.1s;
                }
                .modern-footer.footer-visible .footer-shortcuts > * {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.2s;
                }
                .modern-footer.footer-visible .footer-connect {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.3s;
                }
                @media (prefers-reduced-motion: reduce) {
                    .modern-footer,
                    .modern-footer * {
                        transition: none !important;
                        animation: none !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
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
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.footer-notification');
        existingNotifications.forEach(notification => notification.remove());

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

        // Add animation keyframes if not exists
        if (!document.querySelector('#footer-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'footer-notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 18px;
                    cursor: pointer;
                    padding: 0;
                    margin-left: auto;
                    transition: transform 0.2s ease;
                }
                .notification-close:hover {
                    transform: scale(1.1);
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        const autoRemoveTimer = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                clearTimeout(autoRemoveTimer);
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            });
        }
    }

    updateCopyright() {
        const copyrightElement = document.getElementById('footer-copyright');
        const yearElement = document.getElementById('current-year');
        
        if (copyrightElement) {
            copyrightElement.innerHTML = `&copy; ${this.currentYear} Nitra Mitra. All Rights Reserved.`;
        }
        
        if (yearElement) {
            yearElement.textContent = this.currentYear;
        }
    }

    fixRelativeLinks() {
        const currentPath = window.location.pathname;
        const footerLinks = document.querySelectorAll('.footer-links-list a, .footer-bottom-links a');
        const depth = (currentPath.match(/\//g) || []).length - 1;

        footerLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return; // Skip external links, anchors, and special links
            }

            if (href.startsWith('../')) {
                // Calculate correct path based on current location
                if (depth === 1 && !currentPath.includes('/pages/') && !currentPath.includes('/games/')) {
                    // We're in root directory, remove ../
                    const newHref = href.replace('../', '');
                    link.setAttribute('href', newHref);
                } else if (depth > 2) {
                    // We're nested deeper, might need more ../
                    const additionalDepth = depth - 2;
                    const newHref = '../'.repeat(additionalDepth) + href;
                    link.setAttribute('href', newHref);
                }
            }
        });
    }

    // Method to customize footer for specific pages
    customizeForPage(pageType) {
        const footer = document.querySelector('.modern-footer');
        if (!footer) return;

        // Add page-specific classes
        footer.classList.add(`footer-${pageType}`);

        switch (pageType) {
            case 'home':
                // Home page specific customizations
                this.highlightCurrentPage('home');
                break;
            case 'resources':
                // Resources page specific customizations
                this.highlightCurrentPage('resources');
                break;
            case 'games':
                // Games page specific customizations
                this.highlightCurrentPage('games');
                break;
            case 'gallery':
                this.highlightCurrentPage('gallery');
                break;
            case 'cgpa-calculator':
                this.highlightCurrentPage('cgpa-calculator');
                break;
            default:
                break;
        }
    }

    highlightCurrentPage(pageName) {
        const links = document.querySelectorAll('.footer-links-list a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (
                (pageName === 'home' && (href.includes('index.html') || href === '../index.html')) ||
                (href.includes(pageName))
            )) {
                link.style.color = 'var(--accent-color)';
                link.style.fontWeight = '600';
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // Method to add custom sections dynamically
    addCustomSection(sectionData, position = 'before-connect') {
        const { title, content, links, className } = sectionData;
        const sectionHTML = `
            <div class="footer-custom-section ${className || ''}">
                <h3 class="footer-heading">${title}</h3>
                ${content ? `<p class="footer-description">${content}</p>` : ''}
                ${links ? `
                    <ul class="footer-links-list">
                        ${links.map(link => `
                            <li><a href="${link.href}" ${link.target ? `target="${link.target}"` : ''}>
                                ${link.icon ? `<i class="${link.icon}"></i>` : ''}
                                ${link.text}
                            </a></li>
                        `).join('')}
                    </ul>
                ` : ''}
            </div>
        `;

        const footerContent = document.querySelector('.footer-content');
        const connectSection = document.querySelector('.footer-connect');
        
        if (footerContent && connectSection) {
            if (position === 'before-connect') {
                connectSection.insertAdjacentHTML('beforebegin', sectionHTML);
            } else if (position === 'after-connect') {
                connectSection.insertAdjacentHTML('afterend', sectionHTML);
            }
        }
    }

    // Method to update social links
    updateSocialLinks(newLinks) {
        const socialGrid = document.querySelector('.social-media-grid');
        if (!socialGrid) return;

        socialGrid.innerHTML = newLinks.map(link => `
            <a href="${link.href}" target="_blank" rel="noopener" class="social-link"
                title="${link.name}" aria-label="${link.name}">
                <i class="${link.icon}"></i>
            </a>
        `).join('');
    }

    // Method for lazy loading of social icons (if using custom icon font)
    lazyLoadIcons() {
        const socialLinks = document.querySelectorAll('.social-link i, .footer-links-list a i');
        const iconObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Icons are already loaded with FontAwesome, but this could be extended
                    // for custom icon loading
                    iconObserver.unobserve(entry.target);
                }
            });
        });

        socialLinks.forEach(icon => iconObserver.observe(icon));
    }

    // Cleanup method
    destroy() {
        // Remove event listeners
        if (this.resizeTimer) {
            clearTimeout(this.resizeTimer);
        }

        // Remove footer element
        const footer = document.querySelector('.modern-footer');
        if (footer) {
            footer.remove();
        }

        // Remove added styles
        const styles = document.querySelectorAll('#footer-animation-styles, #footer-notification-styles');
        styles.forEach(style => style.remove());
    }
}

// Initialize footer when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Check if footer should be loaded (avoid loading on admin pages, etc.)
    if (document.querySelector('[data-no-footer]')) {
        return;
    }

    const footer = new ModernFooter();

    // Auto-detect page type and customize footer
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    if (path.includes('resources') || filename.includes('resources')) {
        footer.customizeForPage('resources');
    } else if (path.includes('games') || filename.includes('games')) {
        footer.customizeForPage('games');
    } else if (path.includes('gallery') || filename.includes('gallery')) {
        footer.customizeForPage('gallery');
    } else if (path.includes('cgpa') || filename.includes('cgpa')) {
        footer.customizeForPage('cgpa-calculator');
    } else if (path === '/' || filename.includes('index')) {
        footer.customizeForPage('home');
    }

    // Make footer instance globally available for customization
    window.modernFooter = footer;
});

// Handle page visibility changes (pause animations when tab is not active)
document.addEventListener('visibilitychange', function() {
    const footer = document.querySelector('.modern-footer');
    if (!footer) return;

    if (document.hidden) {
        // Pause animations when tab is hidden
        footer.style.animationPlayState = 'paused';
        const animatedElements = footer.querySelectorAll('.social-link');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab is visible
        footer.style.animationPlayState = 'running';
        const animatedElements = footer.querySelectorAll('.social-link');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Export for potential use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernFooter;
}