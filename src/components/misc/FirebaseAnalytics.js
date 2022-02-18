import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { analytics } from "../../Fire";

export function FirebaseAnalytics() {
    let location = useLocation();
    useEffect(() => {
        const fireAnalytics = analytics;
        if (typeof fireAnalytics === "function") {
            const page_path = location.pathname + location.search;
            fireAnalytics().setCurrentScreen(page_path);
            fireAnalytics().logEvent("page_view", { page_path });
        }
    }, [location]);
    return null;
}