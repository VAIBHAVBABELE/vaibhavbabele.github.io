/**
 * Analytics and Ads Loader
 * Dynamically loads Google Analytics and AdSense scripts using configuration
 */

// Wait for config to be available
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.SITE_CONFIG === 'undefined') {
        console.warn('Site configuration not loaded. Analytics and ads will not be initialized.');
        return;
    }

    initializeAnalytics();
    initializeAdSense();
});

/**
 * Initialize Google Analytics
 */
function initializeAnalytics() {
    if (!window.SITE_CONFIG.GOOGLE_ANALYTICS_ID) {
        console.warn('Google Analytics ID not configured');
        return;
    }

    // Load Google Analytics script
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${window.SITE_CONFIG.GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(analyticsScript);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', window.SITE_CONFIG.GOOGLE_ANALYTICS_ID);

    // Make gtag available globally
    window.gtag = gtag;

    console.log('Google Analytics initialized successfully');
}

/**
 * Initialize Google AdSense
 */
function initializeAdSense() {
    if (!window.SITE_CONFIG.GOOGLE_ADSENSE_CLIENT) {
        console.warn('Google AdSense client ID not configured');
        return;
    }

    // Load Google AdSense script
    const adsenseScript = document.createElement('script');
    adsenseScript.async = true;
    adsenseScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${window.SITE_CONFIG.GOOGLE_ADSENSE_CLIENT}`;
    adsenseScript.crossOrigin = 'anonymous';
    document.head.appendChild(adsenseScript);

    console.log('Google AdSense initialized successfully');
}

/**
 * Utility function for contact handling
 */
function handleWhatsAppContact() {
    if (window.SITE_CONFIG.WHATSAPP_NUMBER && window.SITE_CONFIG.WHATSAPP_NUMBER !== '919999999999') {
        window.open(`https://wa.me/${window.SITE_CONFIG.WHATSAPP_NUMBER}`, '_blank');
    } else {
        alert(`WhatsApp contact will be available soon. Please use email: ${window.SITE_CONFIG.CONTACT_EMAIL}`);
    }
}
