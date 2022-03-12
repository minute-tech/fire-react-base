import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { withTheme } from 'styled-components';

import { BTYPES } from '../../../utils/constants.js';
import { Button } from '../../../utils/styles/buttons';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Hr, Wrapper } from '../../../utils/styles/misc';
import { Body, H1, H3, LLink } from '../../../utils/styles/text';

class Home extends Component {
    sendAlert = (alertType) => {
        toast[alertType]('🦄 Wow so easy to send an alert!');
    }
    
    render() {
        return (
            <>
                <Helmet>
                    <title>Home {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <BgMediaContainer>
                    <BgColor
                        bgColor={this.props.theme.colors.primary}
                        bodyLength={500}
                    >
                        <BgMedia
                            alt="hero background" 
                            // Honestly the below snippet somehow works so the little "image not found" icon with the alt tag doesn't pop up in the upper left of the banner bgColor, so don't remove the below til we find a better solution lol
                            src={
                                this.props.site?.hero?.banner
                                ?? 
                                require("../../../assets/images/misc/blank-bg.png")
                            }
                            bodyLength={500}
                        />
                    </BgColor>
                    <BgMediaModal>
                        <BgMediaHeading>{this.props.site.hero.heading}</BgMediaHeading>
                        <BgMediaBody>
                            {this.props.site.hero.body}
                        </BgMediaBody>
                        
                        <LLink to={this.props.site.hero.cta.link}>
                            <Button 
                                size={this.props.site.hero.cta.size} 
                                color={this.props.site.hero.cta.color}
                            >
                                {this.props.site.hero.cta.text}
                            </Button>
                        </LLink>
                    </BgMediaModal>
                </BgMediaContainer>
                <Wrapper>
                    <H1>Buttons</H1>
                    <Button>Default</Button>
                    <Button size='lg' onClick={() => this.sendAlert("info")}>Primary Large Normal Button</Button>
                    <Button color={this.props.theme.colors.secondary} size='md' btype={BTYPES.INVERTED} onClick={() => this.sendAlert("warn")}>Secondary Medium Inverted Button</Button>
                    <Button color={this.props.theme.colors.red} size='sm' btype={BTYPES.TEXTED} onClick={() => this.sendAlert("error")}>Red Small Texted Button</Button>
                    <Button color={this.props.theme.colors.green} size='md' rounded={true} onClick={() => this.sendAlert("success")}>Green Rounded Button</Button>
                    <Button color={this.props.theme.colors.yellow}size='lg' btype={BTYPES.INVERTED}>Yellow Rounded Inverted Button</Button>
                    <Button color={this.props.theme.colors.lightGrey} size='sm' btype={BTYPES.TEXTED}>Red Small Texted Button</Button>
                    <Hr />
                    <Grid fluid>
                        <Row center="xs">
                            <Col xs={12} sm={3}>
                                <H3>First Column</H3>
                                <Body>More information below</Body>
                            </Col>
                            <Col xs={12} sm={3}>
                                <H3>Second Column</H3>
                                <Body>More information below</Body>
                            </Col>
                            <Col xs={12} sm={3}>
                                <H3>Third Column</H3>
                                <Body>More information below</Body>
                            </Col>
                        </Row>
                    </Grid>
                    <Hr />
                </Wrapper>
            </>
        );
    }
}

export default withTheme(Home)