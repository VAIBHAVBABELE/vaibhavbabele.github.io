// Prevent Google from using its cookies/auto-detect
var gtCookie = document.cookie.split(';').filter(c => c.includes('googtrans'));
if (gtCookie.length) {
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',      // force English
        includedLanguages: 'en,hi', // only allow English and Hindi
        autoDisplay: false
    }, 'google_translate_element');
}

document.addEventListener("DOMContentLoaded", function () {
    let currentLang = localStorage.getItem("lang") || 'en'; // default English

    const checkDropdown = setInterval(() => {
        const select = document.querySelector(".goog-te-combo");
        if (select) {
            clearInterval(checkDropdown);

            // Force English first if first visit
            if (!localStorage.getItem("lang")) {
                currentLang = 'en';
                localStorage.setItem("lang", currentLang);
            }

            // Force dropdown to English or Hindi only
            select.value = currentLang;
            select.dispatchEvent(new Event("change"));

            const langToggle = document.getElementById("lang-toggle");
            if (langToggle) {
                langToggle.textContent = currentLang === 'en' ? "हिंदी" : "English";

                langToggle.onclick = () => {
                    currentLang = currentLang === 'en' ? 'hi' : 'en';
                    select.value = currentLang;
                    select.dispatchEvent(new Event("change"));
                    langToggle.textContent = currentLang === 'en' ? "हिंदी" : "English";
                    localStorage.setItem("lang", currentLang);
                };
            }
        }
    }, 200);
});

// Load Google Translate script once
if (!document.querySelector('script[src*="translate.google.com"]')) {
    const translateScript = document.createElement('script');
    translateScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.body.appendChild(translateScript);
}
