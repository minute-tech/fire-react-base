import React, { useEffect, useRef } from "react";
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { useLocation } from "react-router-dom";
import * as FiIcons from "react-icons/fi";

import { ALink, ErrorText } from '../../utils/styles/text'
import { TooltipContainer } from '../../utils/styles/misc'
import { analytics } from "../../Fire";
import { logEvent } from "firebase/analytics";
import { useTheme } from "styled-components";
import { reverseUrlify } from "../../utils/misc";

export function FirebaseAnalytics() {
    let location = useLocation();
    useEffect(() => {
        const page_path = location.pathname;
        logEvent(analytics, "screen_view", {
            firebase_screen: page_path,
        });
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
    const { pathname, hash } = useLocation();
    let hashTimer = useRef();
    useEffect(() => {
        // if not a hash link, scroll to top
        if (hash === "") {
            // ** this smooth too? 
            window.scrollTo(0, 0);
        } else {
            // else scroll to id
            hashTimer.current = setTimeout(() => {
                const id = hash.replace("#", "");
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth"});
                }
            }, 100);
        }

        return () => {clearTimeout(hashTimer.current)};
    }, [pathname, hash])

    return null;
}

export function ColChevron(props) {
    if(props.itemColumn.direction === "desc"){
        return (
            <BiChevronDown style={{paddingBottom: "0%"}} />
        )
    } else if(props.itemColumn.direction === "asc") {
        return (
            <BiChevronUp style={{paddingBottom: "0%"}} />
        )
    } else {
        return (<></>)
    }
};

export const Tooltip = ({ children, text, link = "", ...rest }) => {
    if (link) {
        return (
            <ALink href={link} target="_blank" rel="noreferrer">
                <TooltipContainer>
                    <div>
                        {text}
                        <span />
                    </div>
                    <div {...rest}>
                        {children}
                    </div>
                </TooltipContainer>
            </ALink>
        );
    } else {
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
    }
  };

export function Icon({ name, settings = {size: 20, color: ""} }) {
    // console.log("name: ", name);
    const theme = useTheme();
    const realColor = settings.color || theme.color.font.solid;
    const realName = reverseUrlify(name); // Make sure it isnt dash separated or uncaps
    const DynamicIconComponent = FiIcons[realName] || FiIcons["FiHeart"]; // Currently only allowing Feather Icons
    return (
        <DynamicIconComponent
            size={settings.size}
            color={realColor}
        />
    )
}
 