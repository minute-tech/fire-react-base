import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Helmet } from 'react-helmet-async';
import { withTheme } from 'styled-components';

import { BTN_TYPES } from '../../utils/constants';
import { Button } from '../../utils/styles/buttons';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Hr, Wrapper } from '../../utils/styles/misc';
import { Body, H1, H3, LLink } from '../../utils/styles/text';
import ContactForm from '../misc/ContactForm';


class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: {
                message: true
            },
            errors: {
                message: ""
            }
        }
    }


    render() {
        return (
            <>
                <Helmet>
                    <title>Home | Fire React Base</title>
                </Helmet>
                <BgMediaContainer>
                    <BgColor
                        bgColor={this.props.theme.colors.primary}
                        bodyLength={500}
                    >
                        <BgMedia
                            alt="hero background" 
                            // Honestly the below snippet somehow works so the little "image not found" icon with the alt tag doesn't pop up in the upper left of the banner bgColor, so don't remove the below til we find a better solution lol
                            src={"https://firebasestorage.googleapis.com/v0/b/fire-react-base.appspot.com/o/public%2Fbackgrounds%2FDSC_0047.JPG?alt=media&token=9e53f2b2-25b7-4b7d-a85c-84ecf97fa1eb" || "https://firebasestorage.googleapis.com/v0/b/ship-form-template.appspot.com/o/public%2Fbanners%2Fblank-bg.png?alt=media&token=3c9c4000-80ef-4ed6-afa1-ed0097040efc"}
                            bodyLength={500}
                        />
                    </BgColor>
                    <BgMediaModal>
                        <BgMediaHeading>Fire React Base</BgMediaHeading>
                        <BgMediaBody>
                            <p>
                                This is the homepage, customize it as you please, please. Dolore irure deserunt occaecat tempor. Dolore reprehenderit ut consequat anim officia amet. 
                                Laboris officia ea eu elit consectetur sit dolor duis adipisicing reprehenderit reprehenderit deserunt reprehenderit quis. 
                                Fugiat est reprehenderit quis labore aute anim in labore officia non ut aliquip mollit. In laboris amet amet occaecat. Laboris minim culpa cillum veniam adipisicing et deserunt sit.
                            </p>
                        </BgMediaBody>
                        <LLink to="/about">
                            <Button color='primary' size='lg'>
                                Call to Action
                            </Button>
                        </LLink>
                    </BgMediaModal>
                </BgMediaContainer>
                <Wrapper>
                    <H1>Buttons</H1>
                    <Button color='primary' size='lg'>Primary Large Normal Button</Button>
                    <Button color='secondary' size='md' btnType={BTN_TYPES.INVERTED}>Secondary Medium Inverted Button</Button>
                    <Button color='red' size='sm' btnType={BTN_TYPES.TEXTED}>Red Small Texted Button</Button>
                    <Button color='green' size='md' rounded={true}>Green Rounded Button</Button>
                    <Button color='yellow' size='lg' btnType={BTN_TYPES.INVERTED}>Yellow Rounded Inverted Button</Button>
                    <Button>Default</Button>
                    <Hr />
                    {/* TODO: Add the BgMedia section from the ship-form-template here in misc styles */}
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
                    <ContactForm />
                </Wrapper>
            </>
        );
    }
}

export default withTheme(Home)