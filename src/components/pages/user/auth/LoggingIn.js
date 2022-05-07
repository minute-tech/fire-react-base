import React, { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import { Spinner, Wrapper } from '../../../../utils/styles/misc';
import { H2 } from '../../../../utils/styles/text';

function LoggingIn(props) {
    const navigate = useNavigate();
    const timer = useRef();
    
    useEffect(() => {
        timer.current = setTimeout(() => {
            navigate("/dashboard");
            props.setIsLoggingIn(false);
        }, 2000);

        return () => {
            clearTimeout(timer.current);
        }
    })
    
    return (
        <Wrapper>
            <Helmet>
                <title>Logging in... {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <H2>Success! Redirecting you now... <Spinner /></H2>
        </Wrapper>
    )
}

export default (LoggingIn)