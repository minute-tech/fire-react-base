import React, { Component } from 'react';
import { BurgerMenuLink, NavLLink, NavLogo, NavTitle, HeaderContainer, NavLinks, BurgerMenuContainer, NavMenuContainer, BrandContainer } from '../../utils/styles/header';
import { withTheme } from 'styled-components'
import { LLink } from '../../utils/styles/text';
import { Burger, BurgerMenu } from '../../utils/styles/header';

class Header extends Component {
    render() {
        return (
            <HeaderContainer>
                <BrandContainer>
                    <LLink to='/'>
                        <NavLogo 
                            width={this.props.site.logo.width} 
                            margin="0" 
                            src={this.props.site.logo.url} 
                            // src={require("../../assets/images/logos/logo.png")} 
                        />
                        {this.props.site.logo.showTitle && (<NavTitle>{this.props?.site?.name ?? ""}</NavTitle>)}
                    </LLink>
                </BrandContainer>
                

                {/* Desktop menu */}
                <NavMenuContainer>
                    <NavLinks>
                        <NavLLink to='/'>Home</NavLLink>
                        <NavLLink to='/about'>About</NavLLink>
                        {!this.props.user && (
                            <>
                                <NavLLink to='/login'>Login</NavLLink>
                                <NavLLink to='/register'>Register</NavLLink>
                            </>
                        )}
                        {this.props.user && (
                            <>
                                <NavLLink to='/dashboard'>Dashboard</NavLLink>
                            </>
                        )}
                    </NavLinks>
                </NavMenuContainer>
            
                {/* Mobile menu */}
                <BurgerMenuContainer>
                    <Burger 
                        open={this.props.isBurgerMenuOpen} 
                        onClick={() => this.props.setBurgerMenuOpen(!this.props.isBurgerMenuOpen)}
                    >
                        <div />
                        <div />
                        <div />
                    </Burger>
                    <BurgerMenu open={this.props.isBurgerMenuOpen}>
                        <BurgerMenuLink to="/" onClick={() => this.props.setBurgerMenuOpen(!this.props.isBurgerMenuOpen)}>
                            Home
                        </BurgerMenuLink>
                        <BurgerMenuLink to="/about">
                            About
                        </BurgerMenuLink>
                        <BurgerMenuLink to="/login">
                            Login
                        </BurgerMenuLink>
                    </BurgerMenu>
                </BurgerMenuContainer>
            </HeaderContainer>
        );
    }
}

export default withTheme(Header)