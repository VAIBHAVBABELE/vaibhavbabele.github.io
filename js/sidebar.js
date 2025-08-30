// Floating Sidebar Functionality

function getBasePath() {
    // Determine if we're in a subdirectory and calculate the correct base path
    const currentPath = window.location.pathname;
    
    // Check if we're in the pages directory
    if (currentPath.includes('/pages/')) {
        // Count how deep we are in subdirectories
        const pathParts = currentPath.split('/');
        const pagesIndex = pathParts.indexOf('pages');
        const depth = pathParts.length - pagesIndex - 2; // -2 for pages and filename
        
        if (depth > 0) {
            // We're in a subdirectory of pages (like assistant/)
            return '../'.repeat(depth + 1); // +1 to get out of pages directory
        } else {
            // We're directly in pages directory
            return '../';
        }
    }
    
    // Check if we're in the games directory
    if (currentPath.includes('/games/')) {
        // Count how deep we are in subdirectories
        const pathParts = currentPath.split('/');
        const gamesIndex = pathParts.indexOf('games');
        const depth = pathParts.length - gamesIndex - 2; // -2 for games and filename
        
        if (depth > 0) {
            // We're in a subdirectory of games
            return '../'.repeat(depth + 1); // +1 to get out of games directory
        } else {
            // We're directly in games directory
            return '../';
        }
    }
    
    // We're in the root directory
    return '';
}

function createFloatingSidebar() {
    const basePath = getBasePath();
    
    const sidebar = document.createElement('div');
    sidebar.className = 'floating-sidebar';
    sidebar.innerHTML = `
        <ul class="sidebar-menu">
            <li class="sidebar-item">
                <a href="${basePath}index.html" class="sidebar-link">
                    <i class="fas fa-home"></i>
                    <span class="sidebar-text">Home</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}index.html#Services" class="sidebar-link">
                    <i class="fas fa-th-large"></i>
                    <span class="sidebar-text">Services</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}pages/resorces.html" class="sidebar-link">
                    <i class="fas fa-book"></i>
                    <span class="sidebar-text">Resources</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}games/gamess.html" class="sidebar-link">
                    <i class="fas fa-gamepad"></i>
                    <span class="sidebar-text">Games</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}index.html#Feedback" class="sidebar-link">
                    <i class="fas fa-comment-dots"></i>
                    <span class="sidebar-text">Feedback</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}index.html#about" class="sidebar-link">
                    <i class="fas fa-info-circle"></i>
                    <span class="sidebar-text">About</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}pages/assistant/assistant.html" class="sidebar-link">
                    <i class="fas fa-robot"></i>
                    <span class="sidebar-text">AI Tools</span>
                </a>
            </li>
            <li class="sidebar-item">
                <a href="${basePath}pages/contact.html" class="sidebar-link">
                    <i class="fas fa-envelope"></i>
                    <span class="sidebar-text">Contact</span>
                </a>
            </li>
        </ul>
        <button class="sidebar-toggle-btn" onclick="toggleSidebar()">
            <i class="fas fa-chevron-right"></i>
        </button>
    `;
    
    document.body.appendChild(sidebar);
}

function setActiveLink() {
    const links = document.querySelectorAll('.sidebar-link');
    const currentUrl = new URL(window.location.href);
    
    links.forEach(link => {
        // Resolve the link href to an absolute URL then compare pathname and hash where appropriate
        try {
            const resolved = new URL(link.getAttribute('href'), window.location.href);
            // Match either exact pathname (same page) or pathname+hash for index anchors
            if (resolved.pathname === currentUrl.pathname && (!resolved.hash || resolved.hash === currentUrl.hash)) {
                link.classList.add('active');
            } else if (resolved.pathname === '/index.html' || resolved.pathname.endsWith('/index.html')) {
                // If on index page and the link points to an index anchor, match by hash if present
                if ((currentUrl.pathname.endsWith('/index.html') || currentUrl.pathname === '/' ) &&
                    resolved.hash && resolved.hash === currentUrl.hash) {
                    link.classList.add('active');
                }
            }
        } catch (e) {
            // ignore malformed hrefs
        }
    });
}

function handleAnchorLinks() {
    const anchorLinks = document.querySelectorAll('.sidebar-link[href*="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's a link to a different page with an anchor
            if (href.includes('.html#')) {
                // Let the browser handle navigation to different page with anchor
                return;
            }
            
            // Handle same-page anchor links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update active state
                    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.floating-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('expanded');
        
        // Save state to localStorage
        const isExpanded = sidebar.classList.contains('expanded');
        localStorage.setItem('sidebarExpanded', isExpanded);
    }
}

// Restore sidebar state on page load
function restoreSidebarState() {
    const sidebar = document.querySelector('.floating-sidebar');
    const isExpanded = localStorage.getItem('sidebarExpanded') === 'true';
    
    if (sidebar && isExpanded) {
        sidebar.classList.add('expanded');
    }
}

// Initialize sidebar state after creation
document.addEventListener('DOMContentLoaded', function() {
    // Create floating sidebar
    createFloatingSidebar();
    
    // Restore previous state
    setTimeout(restoreSidebarState, 100);
    
    // Set active link based on current page
    setActiveLink();
    
    // Smooth scroll for anchor links
    handleAnchorLinks();
});