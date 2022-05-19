import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { Container, Row, Col } from 'react-grid-system';

import { SIZES } from '../../utils/constants';
import { FooterContainer } from "../../utils/styles/footer";
import { LLink, SLink} from "../../utils/styles/text";


function Footer(props) {
    const year = new Date().getFullYear();
    
    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <FooterContainer>
            <Container fluid>
                <Row justify="between">
                    <Col xs={12} sm={4} style={{margin: "5px 0"}}>
                        <Row>
                            <Col lg={12} xl={4}>
                                <LLink to="/privacy-policy">Privacy Policy</LLink>
                            </Col>  
                            <Col lg={12} xl={4}>
                                <LLink to="/terms-conditions">Terms &amp; Conditions</LLink>
                            </Col>  
                            <Col lg={12} xl={4}>
                                <LLink to="/credits">Credits</LLink>
                            </Col>  
                        </Row>
                    </Col>
                    <Col xs={12} sm={4} style={{margin: "5px 0"}}>
                        <SLink>
                            {props?.site?.name ?? ""}
                            {' '}
                            &copy;
                            {' '}
                            {year}
                        </SLink>
                    </Col>
                    <Col xs={12} sm={4} style={{margin: "5px 0"}}>
                        <SLink onClick={() => backToTop()}>
                            Back to top <FaChevronUp /> 
                        </SLink>
                    </Col>
                </Row>    
            </Container>
        </FooterContainer>
    )
}

export default Footer;