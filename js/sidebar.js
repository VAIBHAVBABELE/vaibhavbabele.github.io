// Floating Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create floating sidebar
    createFloatingSidebar();
    
    // Set active link based on current page
    setActiveLink();
    
    // Smooth scroll for anchor links
    handleAnchorLinks();
});

function createFloatingSidebar() {
    const sidebar = document.createElement('div');
    sidebar.className = 'floating-sidebar';
    sidebar.innerHTML = `
        <ul class="sidebar-menu">
            <li class="sidebar-item" data-tooltip="Home">
                <a href="index.html" class="sidebar-link">
                    <i class="fas fa-home"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="Services">
                <a href="#Services" class="sidebar-link">
                    <i class="fas fa-th-large"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="Resources">
                <a href="pages/resorces.html" class="sidebar-link">
                    <i class="fas fa-book"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="Games">
                <a href="games/gamess.html" class="sidebar-link">
                    <i class="fas fa-gamepad"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="Gallery">
                <a href="pages/gallery.html" class="sidebar-link">
                    <i class="fas fa-images"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="AI Tools">
                <a href="pages/assistant/assistant.html" class="sidebar-link">
                    <i class="fas fa-robot"></i>
                </a>
            </li>
            <li class="sidebar-item" data-tooltip="Contact">
                <a href="pages/contact.html" class="sidebar-link">
                    <i class="fas fa-envelope"></i>
                </a>
            </li>
        </ul>
    `;
    
    document.body.appendChild(sidebar);
}

function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.sidebar-link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function handleAnchorLinks() {
    const anchorLinks = document.querySelectorAll('.sidebar-link[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
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
        });
    });
}