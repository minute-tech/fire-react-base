import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { analytics } from "../../Fire";

export function FirebaseAnalytics() {
    let location = useLocation();
    useEffect(() => {
        const firebaseAnalytics = analytics;
        if (typeof firebaseAnalytics === "function") {
            const page_path = location.pathname + location.search;
            firebaseAnalytics().setCurrentScreen(page_path);
            firebaseAnalytics().logEvent("page_view", { page_path });
        }
    }, [location]);
    return null;
}