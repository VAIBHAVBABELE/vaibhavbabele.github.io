/**
 * Site Configuration
 * This file contains configuration settings for the Nitra Mitra website
 * In production, these values should come from environment variables
 */

const SITE_CONFIG = {
    // Analytics and Advertising
    GOOGLE_ADSENSE_CLIENT: 'ca-pub-1013609987989002',
    GOOGLE_ANALYTICS_ID: 'G-WZP9NSCWF5',
    
    // Contact Information
    CONTACT_EMAIL: 'nitramitra@gmail.com',
    WHATSAPP_NUMBER: null, // Set to null until real number is available
    
    // External Links
    SOCIAL_MEDIA: {
        YOUTUBE: 'https://youtube.com/@my.vlog_spot',
        LINKEDIN: 'https://www.linkedin.com/in/vaibhavbabele',
        INSTAGRAM: 'https://www.instagram.com/my_vlog.spot/',
        TWITTER: '#'
    }
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.SITE_CONFIG = SITE_CONFIG;
}

// For Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
