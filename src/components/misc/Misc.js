import React, { useEffect } from "react";
import { ErrorText } from '../../utils/styles/text'
import { useLocation } from "react-router-dom";
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

export function FormError(props) {
    return (
        <div>
            {props.stateError ? (
                <ErrorText>{props.stateError}</ErrorText>
            ) : (
                ""
            )}
            
            {props.yupError && props.formikTouched ? (
                <ErrorText>{props.yupError}</ErrorText>
            ) : (
                ""
            )}
        </div>
    )
}

export function StartAtTop () {
    let location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location])

    return null;
}