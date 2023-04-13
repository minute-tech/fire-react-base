import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from 'styled-components';

import { Button } from '../../../utils/styles/forms';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Hr, Wrapper } from '../../../utils/styles/misc';
import { ALink, Body, H2, LLink } from '../../../utils/styles/text';

function Home(props){
    const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>Home {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <BgMediaContainer>
                <BgColor
                    bgColor={theme.color.primary}
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
                    {props.site.hero.cta.link.includes("https://") && (
                        <ALink href={props.site.hero.cta.link} target={"_blank"} rel="noopener noreferrer">
                            <Button 
                                type="button"
                                size={props.site.hero.cta.size} 
                                color={props.site.hero.cta.color}
                            >
                                {props.site.hero.cta.text}
                            </Button>
                        </ALink>
                    )}
                    {!props.site.hero.cta.link.includes("https://") && (
                         <LLink to={props.site.hero.cta.link}>
                            <Button 
                                type="button"
                                size={props.site.hero.cta.size} 
                                color={props.site.hero.cta.color}
                            >
                                {props.site.hero.cta.text}
                            </Button>
                        </LLink>
                    )}
                   
                </BgMediaModal>
            </BgMediaContainer>
            <Hr height={"4px"} margin={"0"}/>
            <Wrapper>
                <H2>More Content Here</H2>
                <Body>
                    Sit culpa cillum elit laboris irure minim cupidatat ad in cupidatat est culpa. Excepteur esse laboris cillum nostrud duis ut elit deserunt eiusmod adipisicing. 
                    Nisi ipsum consequat cillum adipisicing occaecat culpa voluptate. Nisi sunt deserunt ullamco et proident fugiat. Velit consequat eu commodo elit aliqua nisi. 
                    Ea culpa cillum nulla do et do ipsum adipisicing laboris adipisicing.
                </Body>
                <Body>
                    Reprehenderit non in consectetur deserunt proident eu ea laboris qui nulla cupidatat duis ea. Enim nisi velit veniam excepteur deserunt. 
                    Ea consequat minim sunt in est laborum ullamco aliquip aliquip. Sunt et ex reprehenderit officia anim exercitation ut laboris quis minim dolore consequat eu consectetur. Mollit nisi eu laborum culpa voluptate. 
                    Ut duis tempor nisi duis duis cupidatat culpa exercitation ad dolore ea laboris. Amet adipisicing deserunt nostrud labore.
                </Body>
                <Body>
                    Sit culpa cillum elit laboris irure minim cupidatat ad in cupidatat est culpa. Excepteur esse laboris cillum nostrud duis ut elit deserunt eiusmod adipisicing. 
                    Nisi ipsum consequat cillum adipisicing occaecat culpa voluptate. Nisi sunt deserunt ullamco et proident fugiat. Velit consequat eu commodo elit aliqua nisi. 
                    Ea culpa cillum nulla do et do ipsum adipisicing laboris adipisicing.
                </Body>
                <Body>
                    Reprehenderit non in consectetur deserunt proident eu ea laboris qui nulla cupidatat duis ea. Enim nisi velit veniam excepteur deserunt. 
                    Ea consequat minim sunt in est laborum ullamco aliquip aliquip. Sunt et ex reprehenderit officia anim exercitation ut laboris quis minim dolore consequat eu consectetur. Mollit nisi eu laborum culpa voluptate. 
                    Ut duis tempor nisi duis duis cupidatat culpa exercitation ad dolore ea laboris. Amet adipisicing deserunt nostrud labore.
                </Body>
            </Wrapper>
        </>
    );
}

export default Home;