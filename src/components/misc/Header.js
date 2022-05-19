import React, { useState } from 'react';
import { BurgerNavLink, NavLLink, NavLogo, NavTitle, HeaderContainer, NavLinks, BurgerNavContainer, NavMenuContainer, BrandContainer, BgOverlay, BrandLink } from '../../utils/styles/header';
import { Burger, BurgerNav } from '../../utils/styles/header';
import { FullWidthLine } from '../../utils/styles/misc';

function Header(props) {
    const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
console.log("props.user: ")
console.log(props.user)
    return (
        <>
        <HeaderContainer>
            <BrandContainer>
                <BrandLink to="/">
                    <NavLogo 
                        width={props.site.logo.width}
                        margin="0" 
                        src={props.site.logo.url} 
                        // TODO: if logo is loading slow, just load from local folder instead of URL
                        // src={require("../../assets/images/logos/logo.png")} 
                        // src={require("../../assets/images/logos/cc-logo.png")}  
                    />
                    {props.site.logo.showTitle && (<NavTitle removeActiveStyle>{props?.site?.name ?? ""}</NavTitle>)}
                </BrandLink>
            </BrandContainer>

            {/* Desktop menu */}
            <NavMenuContainer>
                <NavLinks>
                    <NavLLink to='/'>Home</NavLLink>
                    <NavLLink to='/about'>About</NavLLink>
                    {!props.user && (
                        <>
                            <NavLLink to='/login'>Login</NavLLink>
                            <NavLLink to='/register'>Register</NavLLink>
                        </>
                    )}
                    {props.user && (
                        <>
                            <NavLLink to='/dashboard'>Dashboard</NavLLink>
                        </>
                    )}
                </NavLinks>
            </NavMenuContainer>
        
            {/* Mobile menu */}
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
                    <BurgerNavLink to="/" onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}>
                        Home
                    </BurgerNavLink>
                    <BurgerNavLink to="/about" onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}>
                        About
                    </BurgerNavLink>
                    
                    {!props.user && (
                        <>
                            <BurgerNavLink 
                                to="/login" 
                                onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
                            >
                                Login
                            </BurgerNavLink>
                            <BurgerNavLink 
                                to="/register" 
                                onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
                            >
                                Register
                            </BurgerNavLink>
                        </>
                    )}
                    {props.user && (
                        <>
                            <BurgerNavLink 
                                to='/dashboard'
                                onClick={() => setBurgerMenuOpen(!isBurgerMenuOpen)}
                            >
                                Dashboard
                            </BurgerNavLink>
                        </>
                    )}
                </BurgerNav>
            </BurgerNavContainer>

        </HeaderContainer>
        <FullWidthLine height={"5px"}/>
        </>
    )
}

export default Header;