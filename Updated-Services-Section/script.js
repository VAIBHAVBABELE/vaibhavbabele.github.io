document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    const tooltip = document.getElementById('tooltip');
    
    // Variables to track mouse position and timer
    let tooltipTimer;
    let isTooltipVisible = false;
    
    // Function to show tooltip
    function showTooltip(event, content) {
        // Clear any existing timer
        clearTimeout(tooltipTimer);
        
        // Get mouse position
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // Set tooltip content
        tooltip.textContent = content;
        tooltip.classList.add('visible');
        
        // Position tooltip based on mouse position
        // Ensure it stays within viewport
        const tooltipWidth = tooltip.offsetWidth;
        const tooltipHeight = tooltip.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Calculate position to ensure tooltip stays in viewport
        let posX = mouseX + 15; // Offset from cursor
        let posY = mouseY + 15;
        
        // Adjust if tooltip would go off-screen
        if (posX + tooltipWidth > windowWidth) {
            posX = mouseX - tooltipWidth - 15;
        }
        
        if (posY + tooltipHeight > windowHeight) {
            posY = mouseY - tooltipHeight - 15;
        }
        
        // Apply position
        tooltip.style.left = `${posX}px`;
        tooltip.style.top = `${posY}px`;
        
        isTooltipVisible = true;
    }
    
    // Function to hide tooltip with delay
    function hideTooltipWithDelay() {
        tooltipTimer = setTimeout(() => {
            tooltip.classList.remove('visible');
            isTooltipVisible = false;
        }, 300); // Small delay before hiding to prevent flickering
    }
    
    // Add event listeners to service cards
    serviceCards.forEach(card => {
        const tooltipContent = card.getAttribute('data-tooltip');
        
        // Show tooltip on mouseenter
        card.addEventListener('mouseenter', (event) => {
            showTooltip(event, tooltipContent);
        });
        
        // Hide tooltip on mouseleave
        card.addEventListener('mouseleave', () => {
            hideTooltipWithDelay();
        });
        
        // Update tooltip position on mousemove within the card
        card.addEventListener('mousemove', (event) => {
            if (isTooltipVisible) {
                showTooltip(event, tooltipContent);
            }
        });
    });
    
    // Hide tooltip when clicking elsewhere
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.service-card')) {
            tooltip.classList.remove('visible');
            isTooltipVisible = false;
        }
    });
    
    console.log('Services section with tooltips initialized');
});