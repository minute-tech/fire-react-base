import React, { useState } from 'react';
import { useTheme } from 'styled-components';
import { SCHEMES } from '../../utils/constants';
import { BurgerNavLink, NavLLink, NavLogo, NavTitle, HeaderContainer, NavLinks, BurgerNavContainer, NavMenuContainer, BrandContainer, BgOverlay, BrandLink } from '../../utils/styles/header';
import { Burger, BurgerNav } from '../../utils/styles/header';
import { FullWidthLine } from '../../utils/styles/misc';

function Header(props) {
    const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
    const theme = useTheme();
    const navLinks = [
        {
            label: "Home",
            path: "/",
            type: ""
        },
        {
            label: "About",
            path: "/about",
            type: ""
        },
        {
            label: "Login",
            path: "/login",
            type: "visitor"
        },
        {
            label: "Register",
            path: "/register",
            type: "visitor"
        },
        {
            label: "Dashboard",
            path: "/dashboard",
            type: "user"
        },
    ];
    
    return (
        <>
        <HeaderContainer>
            <BrandContainer>
                <BrandLink to="/" height={props.site.logo.height}>
                    <NavLogo 
                        width={props.site.logo.width}
                        height={props.site.logo.height}
                        margin="0" 
                        src={theme.value === SCHEMES.DARK ? props.site.logo.darkUrl : props.site.logo.lightUrl} 
                        // TODO: if logo is loading slow, just load from local folder instead of URL
                        // src={require("../../assets/images/logos/logo.png")} 
                    />
                    {props.site.logo.showTitle && (<NavTitle removeActiveStyle>{props?.site?.name ?? ""}</NavTitle>)}
                </BrandLink>
            </BrandContainer>

            {/* Desktop menu */}
            <NavMenuContainer>
                <NavLinks>
                    {navLinks.map((link, l) => {
                        if(!link.type || (link.type === "visitor" && !props.user) || (link.type === "user" && props.user)){
                            return (
                                <NavLLink key={l} to={link.path}>{link.label}</NavLLink>
                            )
                        } else {
                            return (null)
                        }
                    })}
                </NavLinks>
            </NavMenuContainer>
            <BurgerNavContainer>
                <BgOverlay 
                    open={isBurgerMenuOpen} 
                    onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)} 
                />
                <Burger 
                    open={isBurgerMenuOpen} 
                    onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
                >
                    <div />
                    <div />
                    <div />
                </Burger>
                
                <BurgerNav open={isBurgerMenuOpen}>
                    {navLinks.map((link, l) => {
                        if(!link.type || (link.type === "visitor" && !props.user) || (link.type === "user" && props.user)){
                            return (
                                <BurgerNavLink 
                                    key={l} 
                                    to={link.path}
                                    onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
                                >
                                    {link.label}
                                </BurgerNavLink>
                            )
                        } else {
                            return (null)
                        }
                    })}
                </BurgerNav>
            </BurgerNavContainer>

        </HeaderContainer>
        <FullWidthLine height={"5px"}/>
        </>
    )
}

export default Header;