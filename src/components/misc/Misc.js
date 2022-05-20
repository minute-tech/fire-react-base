import React, { useEffect } from "react";
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useLocation } from "react-router-dom";

import { ErrorText } from '../../utils/styles/text'
import { TooltipContainer } from '../../utils/styles/misc'
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
            {props.error ? (
                <ErrorText>{props.error.message}</ErrorText>
            ) : (
                ""
            )}
        </div>
    )
}

export function StartAtTop() {
    let location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location])

    return null;
}

export function ColChevron(props) {
    if(props.column.direction === "desc"){
        return (
            <BiChevronDown style={{paddingBottom: "0%"}} />
        )
    } else if(props.column.direction === "asc") {
        return (
            <BiChevronUp style={{paddingBottom: "0%"}} />
        )
    } else {
        return (<></>)
    }
};

export const Tooltip = ({ children, text, ...rest }) => {
    return (
        <TooltipContainer>
            <div>
                {text}
                <span />
            </div>
            <div {...rest}>
                {children}
            </div>
        </TooltipContainer>
    );
  };