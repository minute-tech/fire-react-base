import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BiError } from 'react-icons/bi';
import { FaChevronLeft } from 'react-icons/fa';

import { Button } from '../../../utils/styles/buttons';
import { Wrapper } from '../../../utils/styles/misc';
import { ALink, Body, H1, LLink } from '../../../utils/styles/text';

function Page404 (props){
    return (
        <Wrapper>
            <Helmet>
                <title>404 Error {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Return home
                </Button>
            </LLink>
            <H1><BiError /> Page Not Found</H1>
            <Body>Sorry, but it looks like the page you were looking for was not found in our directory. Please check the address, or contact <ALink href="mailto:help@minute.tech">help@minute.tech</ALink></Body>
        </Wrapper>
    );
}

export default Page404;
