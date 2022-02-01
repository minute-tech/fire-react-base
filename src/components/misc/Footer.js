import React, { Component } from 'react';
import { FooterContainer } from "../../utils/styles/footer";
import { LLink, ALink} from "../../utils/styles/text";

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
                <div style={{marginBottom:"10px"}}>
                    <ALink href="https://fire-react-base" target="_blank" rel="noopener">
                        Built with Fire React Base &copy;
                        {' '}
                        {this.state.year}
                        {' '}
                    </ALink>
                </div>
                <div>
                    {/* <LLink to="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</LLink>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <LLink href="/terms-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</LLink>  */}
                </div>
            </FooterContainer>
        )
    }
}