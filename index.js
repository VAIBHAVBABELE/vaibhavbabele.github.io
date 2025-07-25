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
}

load.onload = function () {
    document.body.classList.toggle('dark-mode', localStorage.getItem('mode') === 'true');

}


document.addEventListener("DOMContentLoaded", function () {
    const year = new Date().getFullYear();
    const copyright = document.getElementById("copyright");
    if (copyright) {
        copyright.textContent = `© ${year} nitramitra | All Right Reserved`;
    }
});

// banner
function applyBannerTheme() {
    const isDark = document.body.classList.contains('dark-mode');
    const banner = document.getElementById('custom-banner');
    const heading = document.getElementById('banner-heading');
    const paragraph = document.getElementById('banner-paragraph');

    if (banner && heading && paragraph) {
        if (isDark) {
            banner.style.backgroundColor = '#111A2D';
            heading.style.color = '#facc15';
            paragraph.style.color = '#d1d5db';
        } else {
            banner.style.backgroundColor = '#F0D8EB';
            heading.style.color = '#1a202c';
            paragraph.style.color = '#2d3748';
        }
    }
}

// Run on load and on toggle
window.addEventListener('load', applyBannerTheme);
mode.onclick = function () {
    const wasDarkmode = localStorage.getItem('mode') === 'true';
    localStorage.setItem('mode', !wasDarkmode);
    document.body.classList.toggle("dark-mode", !wasDarkmode);

    if (document.body.classList.contains("dark-mode")) {
        mode.src = "../images/sun.png";
    } else {
        mode.src = "../images/moon.png";
    }

    applyBannerTheme();
};
