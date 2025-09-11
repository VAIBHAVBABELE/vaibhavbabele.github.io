

(function () {
 
  window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
      pageLanguage: 'en',
      includedLanguages: 'en,hi',
      autoDisplay: false
    }, 'google_translate_element');
  };

  
  function setGoogleTranslateCookie(targetLang) {
    
    const cookieValue = '/en/' + targetLang;
    const maxAge = 60 * 60 * 24 * 365; // 1 year

  
    let domain = '';
    try {
      const host = window.location.hostname;
     
      const parts = host.split('.');
      if (parts.length > 1) {
        domain = '.' + parts.slice(-2).join('.');
      }
    } catch (e) {
      domain = '';
    }

    
    if (domain) {
      document.cookie = `googtrans=${cookieValue};domain=${domain};path=/;max-age=${maxAge}`;
    }
  
    document.cookie = `googtrans=${cookieValue};path=/;max-age=${maxAge}`;
  }

  function initToggleButton() {
    const langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    const saved = localStorage.getItem('lang') || 'en';
    langBtn.textContent = saved === 'en' ? 'हिंदी' : 'English';

    langBtn.addEventListener('click', () => {
      const next = (localStorage.getItem('lang') || 'en') === 'en' ? 'hi' : 'en';
      localStorage.setItem('lang', next);
      setGoogleTranslateCookie(next);

      
      window.location.reload();
    });
  }

  
  function loadGoogleTranslateScriptIfNeeded() {
    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const s = document.createElement('script');
      s.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      s.async = true;
      document.head.appendChild(s);
    }
  }

  // On DOM ready, initialize
  document.addEventListener('DOMContentLoaded', function () {
    
    const firstVisit = !localStorage.getItem('lang');
    if (firstVisit) {
      
      setGoogleTranslateCookie('en');
      localStorage.setItem('lang', 'en');
    } else {
      
      setGoogleTranslateCookie(localStorage.getItem('lang'));
    }

    initToggleButton();
    loadGoogleTranslateScriptIfNeeded();
  });
})();
