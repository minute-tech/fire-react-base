import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FaAnchor, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';

import { BTYPES, SCHEMES, SIZES } from '../../../utils/constants.js';
import { Button } from '../../../utils/styles/buttons';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Column, Grid, Hr, Wrapper, Row, Centered } from '../../../utils/styles/misc';
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
                <Tooltip text="Add more information to an element here!">
                    <Button>Tooltip button <FaInfoCircle /></Button>
                </Tooltip>
                <LLink to="/#anchored">
                    <Button>Anchor linked button <FaAnchor /></Button>
                </LLink>
                <Hr />
                <H2>Grid System</H2>
                <Grid fluid>
                    <Row>
                        <Column xs={12} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 1</H3>
                            <Body>More information below</Body>
                        </Column>
                    </Row>
                    
                    <Row>
                        <Column sm={12} md={6} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 2</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={6} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 3</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                    </Row>

                    <Row>
                        <Column sm={12} md={4} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 4</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={4} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 5</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={4} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 6</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                    </Row>

                    <Row>
                        <Column sm={12} md={6} lg={3} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 7</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={3} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 8</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={3} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 9</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={3} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 9</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                    </Row>

                    <Row>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 10</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 11</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 12</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 13</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 14</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 15</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                    </Row>
                    
                    <Row>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 16</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 17</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 18</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 19</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 20</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 21</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 22</H3>
                            <Body>More information below, but in this cell we are going to have longer text.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 23</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 24</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 25</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 26</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                        <Column sm={12} md={6} lg={4} xl={2} xxl={1} align="center" $bgColor={theme.colors.primary}>
                            <H3>Column 27</H3>
                            <Body>More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here. 
                            More information below, but in this cell we are going to have longer text to see what it is like if a cell has extra content relative to it's neighboring cells in the grid system that we are creating here.</Body>
                        </Column>
                    </Row>
                </Grid>
            </Wrapper>
            <Centered>
            <svg 
                version="1.1" 
                xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                x="0px" 
                y="0px"
                viewBox="0 0 1366 221" 
                xmlSpace="preserve"
                style={{fill: theme.colors.primary, width:"100%", maxWidth: "60%"}}
            >
                <g>
                    <g>
                        <path style={{fill: theme.colors.primary}} d="M104.9,200.2c11.5,0.3,23.1,0.1,34.3-2.6c10.5-2.6,20.8-5.7,30.9-9.4c4.6-1.6,9.1-3.3,13.6-5.1
                            c2.6-1,5.2-2.1,7.7-3.2c-0.9,0.4,7.3-3.1,4.4-1.9c-3.1,1.3,5.1-2.2,6.4-2.8c9.9-4.6,19.5-9.7,29.1-15c38.2-21,74.2-45.5,112.6-66
                            c9.4-5,18.8-9.9,28.4-14.5c4.8-2.3,9.6-4.4,14.5-6.6c3.5-1.5-3.7,1.5-0.2,0.1c1-0.4,2-0.8,2.9-1.2c3-1.2,5.9-2.3,8.9-3.4
                            c9.8-3.6,19.7-6.6,29.8-9c4.6-1.1,9.2-2,13.8-2.9c2-0.4,5.9-1.7,8-1.3c-0.6-0.1-5.9,0.7-0.8,0.1c1.3-0.1,2.7-0.3,4-0.4
                            c10.3-1,20.6-1.3,30.9-0.8c2.3,0.1,4.6,0.3,6.9,0.5c1.5,0.1,9.9,0.4,3,0.2c5.1,0.1,10.6,1.8,15.5,3c4.5,1.1,8.9,2.4,13.2,3.9
                            c2.3,0.8,5.3,1.4,7.4,2.7c-0.6-0.4-5.1-2.3-0.7-0.3c1.2,0.6,2.4,1.1,3.6,1.7c9.5,4.6,18.4,10.3,26.9,16.5c1.6,1.2,6.3,4.4,2.1,1.5
                            c2.2,1.5,4.3,3.4,6.4,5.1c4.3,3.5,8.4,7,12.6,10.6c7.8,6.7,15.5,13.4,23.6,19.9c17.3,13.9,35.3,26.7,54.5,37.8
                            c36.8,21.6,76.9,37.8,118,47.6c85.4,20.3,174,12.6,257.3-13.2c84.4-26.1,164.5-65.2,241.3-108.5c10.7-6,20.2-13.2,29.6-21.1
                            c8.6-7.3,10.1-22.9,4.2-32.2c-6.1-9.5-18.6-16.1-30-12.2c-12,4.1-23.3,9.1-34.3,15.3c-9.2,5.2-18.4,10.4-27.7,15.6
                            c-18.9,10.5-37.7,21.2-56.8,31.3c-19.3,10.3-38.9,20.2-58.7,29.4c-9.5,4.4-19.1,8.9-28.8,12.9c0.8-0.3,5.1-2.1,0.5-0.2
                            c-1,0.4-1.9,0.8-2.9,1.2c-2.6,1.1-5.2,2.1-7.8,3.2c-4.9,1.9-9.8,3.7-14.7,5.5c-20.3,7.2-40.8,13.6-61.7,18.8
                            c-10,2.5-20.1,4.7-30.3,6.6c-5.1,1-10.2,1.8-15.3,2.6c-2.4,0.4-4.8,0.7-7.1,1.1c-1.3,0.2-5,1,0.8-0.1c-1.7,0.3-3.4,0.4-5.1,0.6
                            c-20.9,2.5-42.1,3.5-63.2,3c-10.1-0.3-20.2-0.9-30.2-1.9c-2.6-0.3-5.3-0.6-7.9-0.9c-0.6-0.1-4-0.6-0.5,0c3.7,0.6-0.5-0.1-1.5-0.2
                            c-5.3-0.8-10.5-1.6-15.7-2.6c-19.9-3.7-39.6-8.9-58.7-15.5c-4.4-1.5-8.8-3.1-13.1-4.8c-2.5-0.9-5-1.9-7.4-2.9
                            c-1.1-0.5-2.7-0.9-3.7-1.5c1.6,1,3.6,1.5,0.7,0.3c-9.4-4.1-18.7-8.5-27.9-13.3c-17.9-9.4-35.2-20.2-51.5-32.2
                            c-1.9-1.4-3.7-2.8-5.6-4.2c-3-2.2,3.4,2.7,0.5,0.4c-1-0.8-2.1-1.6-3.1-2.5c-4-3.2-7.9-6.5-11.8-9.8c-8.1-6.9-16.1-13.9-24.4-20.6
                            c-18.8-15.2-37.9-28.1-60.5-37c-20.1-7.9-42.2-11.5-63.7-12c-45.2-1.1-89.1,12.1-129.6,31.3c-39.1,18.6-74.4,44.4-110.4,68.2
                            c-17.9,11.8-36,23.3-54.8,33.6c-18.9,10.3-36.1,19.5-55,26.1c-10.2,3.6-19.2,8-29.2,11.8C87.9,179.4,89.2,199.8,104.9,200.2
                            L104.9,200.2z"/>
                    </g>
                </g>
            </svg>
            </Centered>
            
            <Wrapper>
                <H2 id="anchored">Anchored Section!</H2>
                <Body>
                    When you click the anchor link button above, it should jump down here! Long body of text to follow Sunt aliqua veniam nisi non quis cupidatat Lorem dolor. 
                    Sit in ad ex deserunt non laboris. Exercitation eu amet nulla laborum ea magna aliquip tempor nulla ipsum duis culpa dolore eu. Nostrud qui enim officia consequat dolore reprehenderit est laboris esse. 
                    Excepteur irure sint culpa exercitation magna irure ad aute qui. Sunt amet eu cupidatat enim sunt elit sunt laborum nisi aute. 
                    Exercitation laborum id dolore et nulla excepteur ullamco ea consectetur excepteur magna amet.
                    Laborum pariatur cillum ad ex aliqua eiusmod ullamco ex qui tempor labore ipsum sint consequat. Tempor sint sunt enim aliquip eiusmod cillum fugiat anim. Dolore in aliqua laboris sit irure nulla. 
                    Et tempor veniam anim proident aliquip exercitation veniam amet laborum consectetur proident. Anim qui aute culpa nisi nulla do esse duis aute. Eu dolore elit cupidatat nulla cupidatat amet qui. 
                    Esse consequat ea est est officia anim reprehenderit occaecat amet qui.
                </Body>
                <Body>
                    Proident incididunt labore ea eiusmod sint anim exercitation. Ipsum magna consectetur proident enim nisi esse in ea labore culpa est cillum laboris reprehenderit. Dolore elit cupidatat occaecat magna >
                    Nisi commodo dolore aliquip occaecat anim culpa. Est sint qui fugiat eiusmod laboris incididunt mollit pariatur. Esse commodo duis sit fugiat esse laborum. Incididunt esse minim consequat aliquip aute exercitation in.
                    Dolore nulla veniam veniam proident deserunt voluptate est ex ex eiusmod incididunt ad voluptate adipisicing. Sint non ea nisi consectetur cupidatat. Ad elit minim reprehenderit ea nostrud elit amet est 
                    dolor adipisicing. Non irure excepteur fugiat nisi aliqua anim nostrud eiusmod et aliqua cillum reprehenderit quis pariatur. Do officia nulla ea ex consectetur est occaecat ad.
                </Body>
                <Body>
                    Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                    Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                </Body>
                <Body>
                    When you click the anchor link button above, it should jump down here! Long body of text to follow Sunt aliqua veniam nisi non quis cupidatat Lorem dolor. 
                    Sit in ad ex deserunt non laboris. Exercitation eu amet nulla laborum ea magna aliquip tempor nulla ipsum duis culpa dolore eu. Nostrud qui enim officia consequat dolore reprehenderit est laboris esse. 
                    Excepteur irure sint culpa exercitation magna irure ad aute qui. Sunt amet eu cupidatat enim sunt elit sunt laborum nisi aute. 
                    Exercitation laborum id dolore et nulla excepteur ullamco ea consectetur excepteur magna amet.
                </Body>
                <Body>
                    Laborum pariatur cillum ad ex aliqua eiusmod ullamco ex qui tempor labore ipsum sint consequat. Tempor sint sunt enim aliquip eiusmod cillum fugiat anim. Dolore in aliqua laboris sit irure nulla. 
                    Et tempor veniam anim proident aliquip exercitation veniam amet laborum consectetur proident. Anim qui aute culpa nisi nulla do esse duis aute. Eu dolore elit cupidatat nulla cupidatat amet qui. 
                    Esse consequat ea est est officia anim reprehenderit occaecat amet qui.
                </Body>
                <Body>
                    Proident incididunt labore ea eiusmod sint anim exercitation. Ipsum magna consectetur proident enim nisi esse in ea labore culpa est cillum laboris reprehenderit. Dolore elit cupidatat occaecat magna 
                    mollit non magna aliquip commodo dolor et duis. Enim duis nostrud sit Lorem occaecat incididunt ea sunt commodo deserunt et. Elit ad mollit pariatur mollit.
                </Body>
                <Body>
                    Nisi commodo dolore aliquip occaecat anim culpa. Est sint qui fugiat eiusmod laboris incididunt mollit pariatur. Esse commodo duis sit fugiat esse laborum. Incididunt esse minim consequat aliquip aute exercitation in.
                    Dolore nulla veniam veniam proident deserunt voluptate est ex ex eiusmod incididunt ad voluptate adipisicing. Sint non ea nisi consectetur cupidatat. Ad elit minim reprehenderit ea nostrud elit amet est 
                    dolor adipisicing. Non irure excepteur fugiat nisi aliqua anim nostrud eiusmod et aliqua cillum reprehenderit quis pariatur. Do officia nulla ea ex consectetur est occaecat ad.
                </Body>
                <Body>
                    Ullamco sint dolore commodo irure anim tempor ad commodo magna sunt veniam labore velit tempor. Dolor ut reprehenderit fugiat aute Lorem. Dolore eiusmod laborum anim non minim labore qui occaecat nulla excepteur duis.
                    Ad eiusmod officia nisi nisi cupidatat non cupidatat in proident elit cupidatat ex proident ullamco. Ipsum commodo dolore tempor cupidatat amet eu quis minim eu consectetur occaecat occaecat nulla commodo. 
                    Laboris consequat sint commodo id esse ex minim esse amet reprehenderit ex excepteur. Sit culpa irure cillum culpa nostrud enim qui ex irure ea pariatur est eiusmod.
                    Occaecat non officia nostrud enim tempor. Eiusmod nisi occaecat elit dolore eiusmod reprehenderit tempor. Labore excepteur enim tempor excepteur nisi minim ex quis consequat cupidatat. Laboris incididunt velit 
                    consequat elit incididunt nisi adipisicing aliqua proident quis reprehenderit pariatur aliquip. Dolore excepteur nisi ipsum occaecat culpa laboris ad.
                </Body>
                <Body>
                    Ullamco sint dolore commodo irure anim tempor ad commodo magna sunt veniam labore velit tempor. Dolor ut reprehenderit fugiat aute Lorem. Dolore eiusmod laborum anim non minim labore qui occaecat nulla excepteur duis.
                    Ad eiusmod officia nisi nisi cupidatat non cupidatat in proident elit cupidatat ex proident ullamco. Ipsum commodo dolore tempor cupidatat amet eu quis minim eu consectetur occaecat occaecat nulla commodo. 
                    Laboris consequat sint commodo id esse ex minim esse amet reprehenderit ex excepteur. Sit culpa irure cillum culpa nostrud enim qui ex irure ea pariatur est eiusmod.
                    Occaecat non officia nostrud enim tempor. Eiusmod nisi occaecat elit dolore eiusmod reprehenderit tempor. Labore excepteur enim tempor excepteur nisi minim ex quis consequat cupidatat. Laboris incididunt velit 
                    consequat elit incididunt nisi adipisicing aliqua proident quis reprehenderit pariatur aliquip. Dolore excepteur nisi ipsum occaecat culpa laboris ad.
                </Body>
                <Body>
                    Eiusmod in deserunt dolore esse reprehenderit aliquip non aliquip dolore deserunt adipisicing deserunt magna. Do consequat duis Lorem ad pariatur. Magna elit mollit aliqua ut aliquip dolor ex proident velit deserunt. 
                    Sit adipisicing tempor nostrud amet. Reprehenderit sunt adipisicing dolor enim amet do eiusmod consequat reprehenderit culpa irure. Aute minim pariatur ipsum tempor sint magna. Dolor dolore laborum culpa do laboris veniam 
                    aliquip.
                </Body>
                <Body>
                    Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                    Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                </Body>
                <Body>
                    Proident incididunt labore ea eiusmod sint anim exercitation. Ipsum magna consectetur proident enim nisi esse in ea labore culpa est cillum laboris reprehenderit. Dolore elit cupidatat occaecat magna >
                    Nisi commodo dolore aliquip occaecat anim culpa. Est sint qui fugiat eiusmod laboris incididunt mollit pariatur. Esse commodo duis sit fugiat esse laborum. Incididunt esse minim consequat aliquip aute exercitation in.
                    Dolore nulla veniam veniam proident deserunt voluptate est ex ex eiusmod incididunt ad voluptate adipisicing. Sint non ea nisi consectetur cupidatat. Ad elit minim reprehenderit ea nostrud elit amet est 
                    dolor adipisicing. Non irure excepteur fugiat nisi aliqua anim nostrud eiusmod et aliqua cillum reprehenderit quis pariatur. Do officia nulla ea ex consectetur est occaecat ad.
                </Body>
                <Body>
                    Ullamco sint dolore commodo irure anim tempor ad commodo magna sunt veniam labore velit tempor. Dolor ut reprehenderit fugiat aute Lorem. Dolore eiusmod laborum anim non minim labore qui occaecat nulla excepteur duis.
                    Ad eiusmod officia nisi nisi cupidatat non cupidatat in proident elit cupidatat ex proident ullamco. Ipsum commodo dolore tempor cupidatat amet eu quis minim eu consectetur occaecat occaecat nulla commodo. 
                    Laboris consequat sint commodo id esse ex minim esse amet reprehenderit ex excepteur. Sit culpa irure cillum culpa nostrud enim qui ex irure ea pariatur est eiusmod.
                    Occaecat non officia nostrud enim tempor. Eiusmod nisi occaecat elit dolore eiusmod reprehenderit tempor. Labore excepteur enim tempor excepteur nisi minim ex quis consequat cupidatat. Laboris incididunt velit 
                    consequat elit incididunt nisi adipisicing aliqua proident quis reprehenderit pariatur aliquip. Dolore excepteur nisi ipsum occaecat culpa laboris ad.
                </Body>
                <Body>
                    Eiusmod in deserunt dolore esse reprehenderit aliquip non aliquip dolore deserunt adipisicing deserunt magna. Do consequat duis Lorem ad pariatur. Magna elit mollit aliqua ut aliquip dolor ex proident velit deserunt. 
                    Sit adipisicing tempor nostrud amet. Reprehenderit sunt adipisicing dolor enim amet do eiusmod consequat reprehenderit culpa irure. Aute minim pariatur ipsum tempor sint magna. Dolor dolore laborum culpa do laboris veniam 
                    aliquip.
                </Body>
                <Body>
                    Eiusmod in deserunt dolore esse reprehenderit aliquip non aliquip dolore deserunt adipisicing deserunt magna. Do consequat duis Lorem ad pariatur. Magna elit mollit aliqua ut aliquip dolor ex proident velit deserunt. 
                    Sit adipisicing tempor nostrud amet. Reprehenderit sunt adipisicing dolor enim amet do eiusmod consequat reprehenderit culpa irure. Aute minim pariatur ipsum tempor sint magna. Dolor dolore laborum culpa do laboris veniam 
                    aliquip.
                </Body>
                <Body>
                    Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                    Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                </Body>
                <Body>
                    Proident incididunt labore ea eiusmod sint anim exercitation. Ipsum magna consectetur proident enim nisi esse in ea labore culpa est cillum laboris reprehenderit. Dolore elit cupidatat occaecat magna >
                    Nisi commodo dolore aliquip occaecat anim culpa. Est sint qui fugiat eiusmod laboris incididunt mollit pariatur. Esse commodo duis sit fugiat esse laborum. Incididunt esse minim consequat aliquip aute exercitation in.
                    Dolore nulla veniam veniam proident deserunt voluptate est ex ex eiusmod incididunt ad voluptate adipisicing. Sint non ea nisi consectetur cupidatat. Ad elit minim reprehenderit ea nostrud elit amet est 
                    dolor adipisicing. Non irure excepteur fugiat nisi aliqua anim nostrud eiusmod et aliqua cillum reprehenderit quis pariatur. Do officia nulla ea ex consectetur est occaecat ad.
                </Body>
                <Body>
                    Ullamco sint dolore commodo irure anim tempor ad commodo magna sunt veniam labore velit tempor. Dolor ut reprehenderit fugiat aute Lorem. Dolore eiusmod laborum anim non minim labore qui occaecat nulla excepteur duis.
                    Ad eiusmod officia nisi nisi cupidatat non cupidatat in proident elit cupidatat ex proident ullamco. Ipsum commodo dolore tempor cupidatat amet eu quis minim eu consectetur occaecat occaecat nulla commodo. 
                    Laboris consequat sint commodo id esse ex minim esse amet reprehenderit ex excepteur. Sit culpa irure cillum culpa nostrud enim qui ex irure ea pariatur est eiusmod.
                    Occaecat non officia nostrud enim tempor. Eiusmod nisi occaecat elit dolore eiusmod reprehenderit tempor. Labore excepteur enim tempor excepteur nisi minim ex quis consequat cupidatat. Laboris incididunt velit 
                    consequat elit incididunt nisi adipisicing aliqua proident quis reprehenderit pariatur aliquip. Dolore excepteur nisi ipsum occaecat culpa laboris ad.
                </Body>
                <Body>
                    Eiusmod in deserunt dolore esse reprehenderit aliquip non aliquip dolore deserunt adipisicing deserunt magna. Do consequat duis Lorem ad pariatur. Magna elit mollit aliqua ut aliquip dolor ex proident velit deserunt. 
                    Sit adipisicing tempor nostrud amet. Reprehenderit sunt adipisicing dolor enim amet do eiusmod consequat reprehenderit culpa irure. Aute minim pariatur ipsum tempor sint magna. Dolor dolore laborum culpa do laboris veniam 
                    aliquip.
                </Body>
                <Body>
                    Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                    Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                </Body>
                <Body>
                    Proident incididunt labore ea eiusmod sint anim exercitation. Ipsum magna consectetur proident enim nisi esse in ea labore culpa est cillum laboris reprehenderit. Dolore elit cupidatat occaecat magna >
                    Nisi commodo dolore aliquip occaecat anim culpa. Est sint qui fugiat eiusmod laboris incididunt mollit pariatur. Esse commodo duis sit fugiat esse laborum. Incididunt esse minim consequat aliquip aute exercitation in.
                    Dolore nulla veniam veniam proident deserunt voluptate est ex ex eiusmod incididunt ad voluptate adipisicing. Sint non ea nisi consectetur cupidatat. Ad elit minim reprehenderit ea nostrud elit amet est 
                    dolor adipisicing. Non irure excepteur fugiat nisi aliqua anim nostrud eiusmod et aliqua cillum reprehenderit quis pariatur. Do officia nulla ea ex consectetur est occaecat ad.
                </Body>
                <Body>
                    Ullamco sint dolore commodo irure anim tempor ad commodo magna sunt veniam labore velit tempor. Dolor ut reprehenderit fugiat aute Lorem. Dolore eiusmod laborum anim non minim labore qui occaecat nulla excepteur duis.
                    Ad eiusmod officia nisi nisi cupidatat non cupidatat in proident elit cupidatat ex proident ullamco. Ipsum commodo dolore tempor cupidatat amet eu quis minim eu consectetur occaecat occaecat nulla commodo. 
                    Laboris consequat sint commodo id esse ex minim esse amet reprehenderit ex excepteur. Sit culpa irure cillum culpa nostrud enim qui ex irure ea pariatur est eiusmod.
                    Occaecat non officia nostrud enim tempor. Eiusmod nisi occaecat elit dolore eiusmod reprehenderit tempor. Labore excepteur enim tempor excepteur nisi minim ex quis consequat cupidatat. Laboris incididunt velit 
                    consequat elit incididunt nisi adipisicing aliqua proident quis reprehenderit pariatur aliquip. Dolore excepteur nisi ipsum occaecat culpa laboris ad.
                </Body>
                <Body>
                    Eiusmod in deserunt dolore esse reprehenderit aliquip non aliquip dolore deserunt adipisicing deserunt magna. Do consequat duis Lorem ad pariatur. Magna elit mollit aliqua ut aliquip dolor ex proident velit deserunt. 
                    Sit adipisicing tempor nostrud amet. Reprehenderit sunt adipisicing dolor enim amet do eiusmod consequat reprehenderit culpa irure. Aute minim pariatur ipsum tempor sint magna. Dolor dolore laborum culpa do laboris veniam 
                    aliquip.
                </Body>
                <Body>
                    Ipsum nulla tempor proident commodo magna anim sint minim ea culpa eiusmod nisi do enim. Enim nostrud sit exercitation duis culpa. Ullamco ex ullamco est reprehenderit deserunt qui et amet ex minim dolore irure esse consequat. 
                    Culpa ad anim eu commodo irure irure esse enim Lorem ipsum non sunt pariatur cupidatat. Culpa tempor id sit officia duis ipsum mollit cupidatat cupidatat.
                </Body>
            </Wrapper>
        </>
    );
}

export default Home;