/**
 * Site Configuration for Nitra Mitra Platform
 * Centralized configuration management for security and maintainability
 */

window.SITE_CONFIG = {
    // Analytics Configuration
    GOOGLE_ANALYTICS_ID: 'G-WZP9NSCWF5',
    GOOGLE_ADSENSE_CLIENT: 'ca-pub-1013609987989002',
    
    // Contact Information
    CONTACT_EMAIL: 'contact@nitramitra.com',
    WHATSAPP_NUMBER: '919999999999', // Replace with actual number when available
    
    // Social Media Links
    SOCIAL_LINKS: {
        youtube: 'https://youtube.com/@my.vlog_spot',
        linkedin: 'https://www.linkedin.com/in/vaibhavbabele',
        instagram: 'https://www.instagram.com/my_vlog.spot/',
        twitter: '#'
    },
    
    // API Configuration
    GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    
    // Feature Flags
    FEATURES: {
        analytics_enabled: true,
        adsense_enabled: true,
        error_tracking: true,
        performance_monitoring: true
    },
    
    // Security Configuration
    SECURITY: {
        content_security_policy: true,
        sri_hashes: true,
        secure_headers: true
    }
};

// Freeze the configuration to prevent tampering
Object.freeze(window.SITE_CONFIG);
Object.freeze(window.SITE_CONFIG.SOCIAL_LINKS);
Object.freeze(window.SITE_CONFIG.FEATURES);
Object.freeze(window.SITE_CONFIG.SECURITY);

console.log('Site configuration loaded successfully');
