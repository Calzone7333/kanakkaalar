import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * Ensures that the page scrolls to the top whenever the route changes.
 * This handles both the main window scroll and specific dashboard containers.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // 1. Scroll the main browser window to the top
        try {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // Use instant to avoid smooth scroll lag on route change
            });
        } catch (e) {
            // Fallback for older browsers
            window.scrollTo(0, 0);
        }

        // 2. Handle Dashboard Layouts (which have their own scrollable containers)
        // The class 'main-wrapper' is used in UserDashboard.css and likely others
        const dashboardMain = document.querySelector('.main-wrapper');
        if (dashboardMain) {
            try {
                dashboardMain.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "instant",
                });
            } catch (e) {
                dashboardMain.scrollTop = 0;
            }
        }

        // 3. Handle 'content-container' if used as a scroll root
        const contentContainer = document.querySelector('.content-container');
        if (contentContainer && window.getComputedStyle(contentContainer).overflowY === 'auto') {
            try {
                contentContainer.scrollTo({ top: 0, left: 0, behavior: "instant" });
            } catch (e) {
                contentContainer.scrollTop = 0;
            }
        }

    }, [pathname]);

    return null;
}
