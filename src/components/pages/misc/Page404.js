import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { BiError } from 'react-icons/bi';
import { FaChevronLeft } from 'react-icons/fa';

import { Button } from '../../../utils/styles/buttons';
import { Wrapper } from '../../../utils/styles/misc';
import { ALink, Body, H1, LLink } from '../../../utils/styles/text';

export default class Page404 extends Component {
  render() {
    return (
        <Wrapper>
            <Helmet>
                <title>404 Error {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Return home
                </Button>
            </LLink>
            <H1><BiError style={{}} /> Page Not Found</H1>
            <Body>Sorry, but it looks like the page you were looking for was not found in our directory. Please check the address, or contact <ALink href="mailto:help@camposjames.com">help@camposjames.com</ALink></Body>
        </Wrapper>
    );
  }
}
