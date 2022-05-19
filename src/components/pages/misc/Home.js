import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';
import { Container, Row, Col } from 'react-grid-system';

import { BTYPES, SIZES } from '../../../utils/constants.js';
import { Button } from '../../../utils/styles/buttons';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Hr, Wrapper } from '../../../utils/styles/misc';
import { Body, H1, H2, H3, LLink } from '../../../utils/styles/text';
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
                <H2>Grid System</H2>
                <Container fluid>
                    <Row style={{marginBottom: "10px", textAlign: "center"}}>
                        <Col xs={12}>
                            <H3>Column 1</H3>
                            <Body>More information below</Body>
                        </Col>
                    </Row>
                    
                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12} md={6}>
                            <H3>Column 2</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={6}>
                            <H3>Column 3</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                    </Row>

                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12} md={4}>
                            <H3>Column 4</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={4}>
                            <H3>Column 5</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={4}>
                            <H3>Column 6</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                    </Row>

                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12} md={6} lg={3}>
                            <H3>Column 7</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={3}>
                            <H3>Column 8</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={3}>
                            <H3>Column 9</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={3}>
                            <H3>Column 9</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                    </Row>

                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 10</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 11</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 12</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 13</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 14</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2}>
                            <H3>Column 15</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                    </Row>

                    <Row style={{marginBottom: "10px"}}>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 16</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 17</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 18</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 19</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 20</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 21</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 22</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 23</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 24</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 25</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 26</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={2} xxl={1}>
                            <H3>Column 27</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Col>
                    </Row>
                </Container>
                <Hr />
                <Tooltip text="Add more information to an element here!">
                    <Button>Tooltip button <FaInfoCircle /></Button>
                </Tooltip>
            </Wrapper>
        </>
    );
}

export default Home;