import React, { Component } from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { FaChevronUp } from 'react-icons/fa';

import { ColA, ColB, ColC, FooterContainer } from "../../utils/styles/footer";
import { LLink, SLink} from "../../utils/styles/text";
export default class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = { 
          year: new Date().getFullYear(),
          deviceWidth: 0,
          deviceHeight: 0,
        };
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions = () => {
        this.setState({ 
            deviceWidth: window.innerWidth, 
            deviceHeight: window.innerHeight 
        });
    }
    
    scrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    render() {
        return (
            <FooterContainer deviceWidth={this.state.deviceWidth}>
                <Grid fluid>
                    <Row middle="xs">
                        <ColA xs={12} sm={4} $deviceWidth={this.state.deviceWidth}>
                            <Row start="sm">
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
                        <ColB xs={12} sm={4} $deviceWidth={this.state.deviceWidth}>
                            <Row center="xs">
                                <Col xs={12}>
                                    <SLink>
                                        {this.props?.site?.name ?? ""}
                                        {' '}
                                        &copy;
                                        {' '}
                                        {this.state.year}
                                    </SLink>
                                </Col>
                            </Row>
                        </ColB>
                        <ColC xs={12} sm={4} $deviceWidth={this.state.deviceWidth}>
                            <Row end="sm">
                                <Col xs={12}>
                                    <SLink onClick={() => this.scrollTop()}>
                                        Back to top <FaChevronUp /> 
                                    </SLink>
                                </Col>   
                            </Row>
                        </ColC>
                    </Row>    
                </Grid>
            </FooterContainer>
        )
    }
}