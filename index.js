const element = document.getElementById('scroll-hide');
const mode = document.getElementById("mode");
const load = document.getElementById("onload");

function checkWindowSize() {
    if (window.innerWidth < 1000) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 10) {
                element.style.display = 'none';
            }
        });
    }
    if (window.innerWidth > 1000) {
        element.style.display = 'flex';
    }
}

// Check the window size when the page loads
window.addEventListener('load', checkWindowSize);

// Check the window size when the window is resized
window.addEventListener('resize', checkWindowSize);

document.getElementById('click').addEventListener('click', function () {
    element.style.display = 'block';
    // You can call any function here
});

mode.onclick = function () {
    const wasDarkmode = localStorage.getItem('mode') === 'true';
    localStorage.setItem('mode', !wasDarkmode);
    document.body.classList.toggle("dark-mode", !wasDarkmode);
    if (document.body.classList.contains("dark-mode")) {
        mode.src = "../images/sun.png";
    } else {
        mode.src = "../images/moon.png ";
    }
};

load.onload = function () {
    document.body.classList.toggle('dark-mode', localStorage.getItem('mode') === 'true');
};

document.addEventListener("DOMContentLoaded", function () {
    const year = new Date().getFullYear();
    const copyright = document.getElementById("copyright");
    if (copyright) {
        copyright.textContent = `© ${year} nitramitra | All Right Reserved`;
    }

    // ✅ New Visitor Counter Feature

    function animateCounter(id, finalNumber, duration = 2000) {
        const element = document.getElementById(id);
        let start = 0;
        const stepTime = Math.abs(Math.floor(duration / finalNumber));

        const timer = setInterval(() => {
            start++;
            element.textContent = start;
            if (start >= finalNumber) {
                clearInterval(timer);
            }
        }, stepTime);
    }

    function setupScrollTrigger() {
        const section = document.getElementById("visitor-section");
        if (!section) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const finalCount = 1234; // 🟡 You can replace this with dynamic value
                    animateCounter("visitor-counter", finalCount);
                    observer.unobserve(section);
                }
            });
        });

        observer.observe(section);
    }

    setupScrollTrigger();
});
