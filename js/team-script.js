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
        image: null, // This will show placeholder
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

// Function to create team card HTML
function createTeamCard(member, index) {
    const basePath = getBasePath();

    // Resolve image path (only prefix if it's a relative path)
    let imgSrc = '';
    if (member.image) {
        if (member.image.startsWith('http') || member.image.startsWith('/')) {
            imgSrc = member.image;
        } else {
            imgSrc = `${basePath}${member.image}`;
        }
    }

    const avatarHTML = imgSrc
        ? `<img src="${imgSrc}" alt="${member.name}" loading="lazy">`
        : `<i class="fas fa-users"></i>`;
    
    const avatarClass = member.image ? '' : 'placeholder';
    
    const socialLinksHTML = member.social.map(social => {
        let url = social.url || '#';
        // Prefix local links that are not absolute (http), anchors, or special schemes
        if (!url.startsWith('http') && !url.startsWith('#') && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('/')) {
            url = `${basePath}${url}`;
        }

        return `
            <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${member.name} ${social.platform}">
                <i class="${social.icon}"></i>
            </a>`;
    }).join('');

    return `
        <div class="team-showcase-card" data-aos="fade-up" data-aos-delay="${index * 100}">
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

// Function to add hover sound effect (optional)
function addSoundEffects() {
    const cards = document.querySelectorAll('.team-showcase-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // You can add a subtle sound effect here if needed
            card.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
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
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.team-showcase-card');
    cards.forEach(card => {
        card.style.animationPlayState = 'paused';
        observer.observe(card);
    });
}

// Function to add parallax effect to team section
function addParallaxEffect() {
    const teamSection = document.querySelector('.team-showcase');
    if (!teamSection) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.3;
        
        if (teamSection.querySelector('.container')) {
            teamSection.querySelector('.container').style.transform = `translateY(${parallax}px)`;
        }
    });
}

// Function to add interactive card tilt effect (simplified for horizontal layout)
function addTiltEffect() {
    const cards = document.querySelectorAll('.team-showcase-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
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
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
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
        addSoundEffects();
        addScrollAnimations();
        addTiltEffect();
        addLoadingAnimation();
        // Uncomment the line below if you want parallax effect
        // addParallaxEffect();
    }, 100);
    
    // Add error handling for images
    const images = targetElement.querySelectorAll('.team-avatar img');
    images.forEach(img => {
        img.addEventListener('error', (e) => {
            console.warn(`Failed to load image: ${img.src}`);
            // Replace with placeholder
            const placeholder = document.createElement('div');
            placeholder.className = 'team-avatar placeholder';
            placeholder.innerHTML = '<i class="fas fa-user"></i>';
            img.parentNode.replaceChild(placeholder, img);
        });
    });
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Look for existing team section or create new one
    let teamSection = document.querySelector('.team-showcase');
    
    if (!teamSection) {
        // If no existing section, look for a target container
        const targetContainer = document.getElementById('team-section') || 
                               document.querySelector('[data-team-section]') ||
                               document.body;
        
        if (targetContainer === document.body) {
            // Create a new section element
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
    // Function to update team member data dynamically
    updateTeamMember: (index, newData) => {
        if (index >= 0 && index < teamData.length) {
            teamData[index] = { ...teamData[index], ...newData };
            // Re-render the section
            const teamSection = document.querySelector('.team-showcase');
            if (teamSection) {
                initializeTeamSection(teamSection);
            }
        }
    },
    
    // Function to add new team member
    addTeamMember: (memberData) => {
        teamData.push(memberData);
        const teamSection = document.querySelector('.team-showcase');
        if (teamSection) {
            initializeTeamSection(teamSection);
        }
    },
    
    // Function to remove team member
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