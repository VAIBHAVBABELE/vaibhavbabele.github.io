function createScrollToTopButton() {
    const button = document.createElement("div");
    button.className = "scroll-to-top";
    button.innerHTML = `
        <i class="fas fa-arrow-up"></i>
        <span class="scroll-percentage">0%</span>
    `;
    document.body.appendChild(button);
    return button;
}

function updateProgressBarPosition() {
    const navbar = document.querySelector('nav');
    const progressContainer = document.querySelector('.scroll-progress-container');
    
    if (navbar && progressContainer) {
        const navbarHeight = navbar.offsetHeight;
        progressContainer.style.top = navbarHeight + 'px';
    }
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update progress bar width
    const progressBar = document.querySelector(".scroll-progress-bar");
    if (progressBar) {
        progressBar.style.width = scrolled + "%";
    }
    
    // Update scroll to top button
    const scrollToTop = document.querySelector(".scroll-to-top");
    if (scrollToTop) {
        scrollToTop.querySelector(".scroll-percentage").textContent = Math.round(scrolled) + "%";
        if (scrolled > 20) {
            scrollToTop.classList.add("visible");
        } else {
            scrollToTop.classList.remove("visible");
        }
    }
}

function goBack() {
    window.history.back();
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create scroll to top button
    const scrollToTopBtn = createScrollToTopButton();
    scrollToTopBtn.addEventListener("click", scrollToTop);
    
    // Position the progress bar correctly
    updateProgressBarPosition();
    
    // Initial call to set progress bar
    updateScrollProgress();
});

// Add scroll event listener
window.addEventListener("scroll", updateScrollProgress);

// Update progress bar position when window resizes
window.addEventListener("resize", updateProgressBarPosition);

// Also update position after fonts load (in case navbar height changes)
window.addEventListener("load", updateProgressBarPosition);