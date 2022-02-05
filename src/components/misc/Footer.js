import React, { Component } from 'react';
import { FooterContainer } from "../../utils/styles/footer";
import { LLink, ALink, Body} from "../../utils/styles/text";

export default class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = { 
          year: new Date().getFullYear(),
        };
    }

    render() {
        return (
            <FooterContainer>
                <Body>
                    <ALink href="https://fire-react-base.web.app" target="_blank" rel="noopener">
                        Built with Fire React Base &copy;
                        {' '}
                        {this.state.year}
                        {' '}
                    </ALink>
                </Body>
                <Body>
                    <LLink to="/privacy-policy">Privacy Policy</LLink>&nbsp;||&nbsp;
                    <LLink to="/terms-conditions">Terms &amp; Conditions</LLink>&nbsp;||&nbsp;
                    <LLink to="/credits">Credits</LLink>
                </Body>
            </FooterContainer>
        )
    }
}