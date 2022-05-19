import React, { useEffect, useState } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { SIZES } from '../../utils/constants';

import { ColA, ColB, ColC, FooterContainer } from "../../utils/styles/footer";
import { LLink, SLink} from "../../utils/styles/text";


function Footer(props) {
    const year = new Date().getFullYear();
    const [windowDims, setWindowDims] = useState({
        height: "",
        width: ""
    });

    useEffect(() => {
        setWindowDims({ 
            deviceWidth: window.innerWidth, 
            deviceHeight: window.innerHeight 
        });

        window.addEventListener('resize', setWindowDims({ 
            deviceWidth: window.innerWidth, 
            deviceHeight: window.innerHeight 
        }));
        return window.removeEventListener('resize', setWindowDims({ 
            deviceWidth: window.innerWidth, 
            deviceHeight: window.innerHeight 
        }));
    }, [])
    
    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <FooterContainer deviceWidth={windowDims.width}>
            {/* <Grid fluid>
                <Row middle="xs">
                    <ColA xs={12} sm={4} $deviceWidth={windowDims.width}>
                        <Row start={SIZES.SM}>
                            <Col lg={12} xl={4} style={{margin:"2.5px 0"}}>
                                <LLink to="/privacy-policy">Privacy Policy</LLink>
                            </Col>  
                            <Col lg={12} xl={4} style={{margin:"2.5px 0"}}>
                                <LLink to="/terms-conditions">Terms &amp; Conditions</LLink>
                            </Col>  
                            <Col lg={12} xl={4} style={{margin:"2.5px 0"}}>
                                <LLink to="/credits">Credits</LLink>
                            </Col>  
                            
                        </Row>
                    </ColA>
                    <ColB xs={12} sm={4} $deviceWidth={windowDims.width}>
                        <Row center="xs">
                            <Col xs={12}>
                                <SLink>
                                    {props?.site?.name ?? ""}
                                    {' '}
                                    &copy;
                                    {' '}
                                    {year}
                                </SLink>
                            </Col>
                        </Row>
                    </ColB>
                    <ColC xs={12} sm={4} $deviceWidth={windowDims.width}>
                        <Row end={SIZES.SM}>
                            <Col xs={12}>
                                <SLink onClick={() => backToTop()}>
                                    Back to top <FaChevronUp /> 
                                </SLink>
                            </Col>   
                        </Row>
                    </ColC>
                </Row>    
            </Grid> */}
        </FooterContainer>
    )
}

export default Footer;