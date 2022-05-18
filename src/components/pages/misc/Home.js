import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Helmet } from 'react-helmet-async';
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';

import { BTYPES, SIZES } from '../../../utils/constants.js';
import { Button } from '../../../utils/styles/buttons';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Hr, Wrapper } from '../../../utils/styles/misc';
import { Body, H1, H3, LLink } from '../../../utils/styles/text';
import { Tooltip } from '../../misc/Misc.js';

function Home(props){
    const theme = useTheme();

    const sendAlert = (alertType) => {
        toast[alertType]('🦄 Wow so easy to send an alert!');
    }

    return (
        <>
            <Helmet>
                <title>Home {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <BgMediaContainer>
                <BgColor
                    bgColor={theme.colors.primary}
                    bodyLength={500}
                >
                    <BgMedia
                        alt="hero background" 
                        // Honestly the below snippet somehow works so the little "image not found" icon with the alt tag doesn't pop up in the upper left of the banner bgColor, so don't remove the below til we find a better solution lol
                        src={
                            props.site?.hero?.banner
                            ?? 
                            require("../../../assets/images/misc/blank-bg.png")
                        }
                        bodyLength={500}
                    />
                </BgColor>
                <BgMediaModal>
                    <BgMediaHeading>{props.site.hero.heading}</BgMediaHeading>
                    <BgMediaBody>
                        {props.site.hero.body}
                    </BgMediaBody>
                    
                    <LLink to={props.site.hero.cta.link}>
                        <Button 
                            type="button"
                            size={props.site.hero.cta.size} 
                            color={props.site.hero.cta.color}
                        >
                            {props.site.hero.cta.text}
                        </Button>
                    </LLink>
                </BgMediaModal>
            </BgMediaContainer>
            <Wrapper>
                <H1>Buttons</H1>
                <Button>Default button</Button>
                <Button size={SIZES.LG} onClick={() => sendAlert("info")} type="button">Primary Large Normal Button</Button>
                <Button color={theme.colors.secondary} size={SIZES.MD} btype={BTYPES.INVERTED} onClick={() => sendAlert("warn")} type="button">Secondary Medium Inverted Button</Button>
                <Button color={theme.colors.red} size={SIZES.SM} btype={BTYPES.TEXTED} onClick={() => sendAlert("error")} type="button">Red Small Texted Button</Button>
                <Button color={theme.colors.green} size={SIZES.MD} rounded={true} onClick={() => sendAlert("success")} type="button">Green Rounded Button</Button>
                <Button color={theme.colors.yellow} size={SIZES.MD} btype={BTYPES.INVERTED} type="button">Yellow Rounded Inverted Button</Button>
                <Button color={theme.colors.lightGrey} size={SIZES.SM} btype={BTYPES.TEXTED} type="button">Red Small Texted Button</Button>
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
                <Tooltip text="Add more information to an element here!">
                    <Button>Tooltip button <FaInfoCircle /></Button>
                </Tooltip>
            </Wrapper>
        </>
    );
}

export default Home;