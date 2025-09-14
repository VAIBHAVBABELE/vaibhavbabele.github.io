# 🛡️ Security Enhancements for Nitra Mitra Platform

**Summary**

This PR delivers a fully revised and corrected version of the contributor page code for the Nitra Mitra platform. The update focuses on improving functionality, usability, maintainability, and visual clarity for both GSSoC and OSCI contributors.

**Key updates include:**

-Resolved multiple errors present in the previous contributor page code.

-Dynamic rendering of contributor cards with accurate levels, PR counts, and avatars.

-Clear separation between GSSoC and OSCI contributors for better readability.

-Admin card now always displayed at the top, independent of contribution data.

-Verified responsiveness and consistent behavior across desktop, tablet, and mobile devices.

-optimized code for performance and maintainability, ensuring smooth updates when leaderboard data changes.

**Files Updated**

-Only files relevant to the contributor page have been modified.

-No personal data or emails have been included.

-The code now supports automatic updates from the GitHub API, reflecting latest contributions in real-time.

**Key Improvements**

-Dynamic Contributor Display

-Cards generated automatically from GitHub API and leaderboard data.

-Shows levels for GSSoC contributors (Level1, Level2, Level3) and task counts for OSCI contributors (Easy, Intermediate, Hard).

-Separation by Program

-GSSoC and OSCI contributors displayed in distinct sections.

-Easier navigation and understanding of contributions.

-Admin Card Priority

-Admin card is pinned at the top to highlight project administration.

-Responsiveness & Cross-Device Compatibility

-Fully functional on desktop, tablet, and mobile.

-Layout, spacing, and font sizes optimized for readability.

-Error Handling & Performance

-Graceful handling of missing or incomplete data.

-Optimized rendering for minimal page load times.

**Reviewer Checklist**

 -Contributor levels and PR counts match the latest leaderboard.

 -GSSoC and OSCI sections display correctly and separately.

 -Admin card always appears at the top.

 -Avatars and images load correctly for all contributors.

 -Page is fully responsive across all devices.

 -No console errors or layout issues.

 -Code is maintainable, clean, and follows project standards.