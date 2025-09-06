// team-script.js

// Team data
const teamData = [
    {
        name: "Vaibhav Babele",
        role: "Lead Developer & Founder",
        description: "Computer Science Engineering student passionate about creating educational platforms for students.",
        image: "images/vaibhav.jpg",
        social: [
            { platform: "linkedin", url: "https://www.linkedin.com/in/vaibhavbabele", icon: "fab fa-linkedin" },
            { platform: "github", url: "https://github.com/vaibhavbabele", icon: "fab fa-github" }
        ]
    },
    {
        name: "Ghanshyam Prajapati",
        role: "Co-Developer",
        description: "Dedicated developer contributing to the platform's growth and student experience enhancement.",
        image: "images/ghanshyam.jpeg",
        social: [
            { platform: "linkedin", url: "https://www.linkedin.com/in/ghanshyam-prajapati-ab5710266/?originalSubdomain=in", icon: "fab fa-linkedin" }
        ]
    },
    {
        name: "Development Team",
        role: "Contributors & Maintainers",
        description: "A growing community of student developers working together to improve the platform.",
        image: null,
        social: [
            { platform: "team", url: "pr-contributors.html", icon: "fas fa-users" }
        ]
    }
];

// Compute a base path from current location so image and local links resolve correctly
function getBasePath() {
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

// Function to create team card HTML with flip structure
function createTeamCard(member, index) {
    const base = getBasePath();

    // Helper to detect external/absolute URLs that should not be prefixed
    const isExternal = (url) => {
        if (!url) return false;
        return /^(https?:)?\/\//i.test(url) || url.startsWith('mailto:') || url.startsWith('tel:') || url.startsWith('#') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/');
    };

    // Resolve image src with base path when image path is relative
    let imgSrc = null;
    if (member.image) {
        imgSrc = isExternal(member.image) ? member.image : (base + member.image);
    }

    const avatarHTML = imgSrc
        ? `<img src="${imgSrc}" alt="${member.name}" loading="lazy">`
        : `<i class="fas fa-users"></i>`;

    const avatarClass = imgSrc ? '' : 'placeholder';

    const socialLinksHTML = member.social.map(social => {
        let href = social.url || '#';
        // Prefix local links (like pr-contributors.html) so they resolve from nested pages
        if (!isExternal(href)) {
            href = base + href;
        }
        const targetAttrs = isExternal(social.url) ? ' target="_blank" rel="noopener noreferrer"' : '';
        return `<a href="${href}"${targetAttrs} aria-label="${member.name} ${social.platform}">
            <i class="${social.icon}"></i>
        </a>`;
    }).join('');

    return `
        <div class="team-showcase-card" data-aos="fade-up" data-aos-delay="${index * 100}">
            <!-- Mobile Layout (Always visible on mobile) -->
            <div class="mobile-layout">
                <div class="team-avatar ${avatarClass}">
                    ${avatarHTML}
                </div>
                <div class="team-content">
                    <h3>${member.name}</h3>
                    <p class="role">${member.role}</p>
                    <p class="description">${member.description}</p>
                    <div class="social-links">
                        ${socialLinksHTML}
                    </div>
                </div>
            </div>

            <!-- Desktop Flip Card (Hidden on mobile) -->
            <div class="flip-card">
                <div class="flip-card-inner">
                    <!-- Front Face -->
                    <div class="flip-card-front">
                        <div class="team-avatar ${avatarClass}">
                            ${avatarHTML}
                        </div>
                        <div class="team-info">
                            <h3>${member.name}</h3>
                            <p class="role">${member.role}</p>
                        </div>
                    </div>

                    <!-- Back Face -->
                    <div class="flip-card-back">
                        <div class="back-content">
                            <h3>${member.name}</h3>
                            <p class="description">${member.description}</p>
                            <div class="social-links">
                                ${socialLinksHTML}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Function to create the complete team section HTML
function createTeamSectionHTML() {
    return `
        <div class="container">
            <div class="section-header">
                <h2>Meet Our Team</h2>
                <p>Dedicated developers working together to create the best educational platform for NITRA students.</p>
            </div>
            <div class="team-grid" id="teamGrid">
                ${teamData.map((member, index) => createTeamCard(member, index)).join('')}
            </div>
        </div>
    `;
}

// Function to add hover sound effect and interactions
function addInteractiveEffects() {
    const cards = document.querySelectorAll('.team-showcase-card');
    
    cards.forEach(card => {
        const flipCard = card.querySelector('.flip-card');
        const flipCardInner = card.querySelector('.flip-card-inner');
        
        if (flipCard && flipCardInner) {
            // Desktop hover effects
            flipCard.addEventListener('mouseenter', () => {
                flipCardInner.style.transform = 'rotateY(180deg)';
            });
            
            flipCard.addEventListener('mouseleave', () => {
                flipCardInner.style.transform = 'rotateY(0deg)';
            });
        }

        // Mobile touch effects
        const mobileLayout = card.querySelector('.mobile-layout');
        if (mobileLayout) {
            mobileLayout.addEventListener('touchstart', () => {
                mobileLayout.style.transform = 'scale(0.98)';
            });
            
            mobileLayout.addEventListener('touchend', () => {
                mobileLayout.style.transform = 'scale(1)';
            });
        }
    });
}

// Function to add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.team-showcase-card');
    cards.forEach(card => {
        observer.observe(card);
    });
}

// Function to add loading animation
function addLoadingAnimation() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    
    const cards = teamGrid.querySelectorAll('.team-showcase-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Function to handle responsive behavior
function handleResponsiveBehavior() {
    const cards = document.querySelectorAll('.team-showcase-card');
    
    function checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        
        cards.forEach(card => {
            const mobileLayout = card.querySelector('.mobile-layout');
            const flipCard = card.querySelector('.flip-card');
            
            if (isMobile) {
                mobileLayout.style.display = 'flex';
                flipCard.style.display = 'none';
            } else {
                mobileLayout.style.display = 'none';
                flipCard.style.display = 'block';
            }
        });
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

// Function to initialize the team section
function initializeTeamSection(targetElement) {
    if (!targetElement) {
        console.error('Target element not found for team section');
        return;
    }
    
    // Add the team-showcase class to the target element
    targetElement.classList.add('team-showcase');
    
    // Insert the HTML content
    targetElement.innerHTML = createTeamSectionHTML();
    
    // Add interactive effects after DOM is ready
    setTimeout(() => {
        addInteractiveEffects();
        addScrollAnimations();
        addLoadingAnimation();
        handleResponsiveBehavior();
    }, 100);
    
    // Add error handling for images
    const images = targetElement.querySelectorAll('.team-avatar img');
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.warn(`Failed to load image: ${img.src}`);
            const placeholder = document.createElement('div');
            placeholder.className = 'team-avatar placeholder';
            placeholder.innerHTML = '<i class="fas fa-user"></i>';
            img.parentNode.replaceChild(placeholder, img);
        });
    });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Fix common relative image paths on pages located in subfolders (e.g., pages/*)
    function fixRelativeImages() {
        const base = getBasePath();
        if (!base) return;

        const imgs = document.querySelectorAll('img');
        imgs.forEach(img => {
            const raw = img.getAttribute('src');
            if (!raw) return;

            // only handle images that look like they point to the project-level images folder
            if (raw.startsWith('images/') || raw.startsWith('./images/')) {
                // Avoid double-prefixing if already prefixed
                if (!raw.startsWith('../') && !raw.startsWith(base)) {
                    const newSrc = base + raw.replace(/^\.\//, '');
                    img.setAttribute('src', newSrc);
                }
            }
        });
    }
        // Fix page-level relative images for nested pages (icons, logos, etc.)
        try { fixRelativeImages(); } catch (e) { /* non-fatal */ }
    let teamSection = document.querySelector('.team-showcase');
    
    if (!teamSection) {
        const targetContainer = document.getElementById('team-section') || 
                               document.querySelector('[data-team-section]') ||
                               document.body;
        
        if (targetContainer === document.body) {
            teamSection = document.createElement('section');
            targetContainer.appendChild(teamSection);
        } else {
            teamSection = targetContainer;
        }
    }
    
    initializeTeamSection(teamSection);
});

// Export functions for manual initialization
window.TeamShowcase = {
    init: initializeTeamSection,
    data: teamData,
    createHTML: createTeamSectionHTML
};

// Additional utility functions
const TeamUtils = {
    updateTeamMember: (index, newData) => {
        if (index >= 0 && index < teamData.length) {
            teamData[index] = { ...teamData[index], ...newData };
            const teamSection = document.querySelector('.team-showcase');
            if (teamSection) {
                initializeTeamSection(teamSection);
            }
        }
    },
    
    addTeamMember: (memberData) => {
        teamData.push(memberData);
        const teamSection = document.querySelector('.team-showcase');
        if (teamSection) {
            initializeTeamSection(teamSection);
        }
    },
    
    removeTeamMember: (index) => {
        if (index >= 0 && index < teamData.length) {
            teamData.splice(index, 1);
            const teamSection = document.querySelector('.team-showcase');
            if (teamSection) {
                initializeTeamSection(teamSection);
            }
        }
    }
};

// Make utility functions globally available
window.TeamUtils = TeamUtils;