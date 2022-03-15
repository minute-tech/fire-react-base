import React, { Component } from 'react';
import { BurgerNavLink, NavLLink, NavLogo, NavTitle, HeaderContainer, NavLinks, BurgerNavContainer, NavMenuContainer, BrandContainer, BgOverlay, BrandLink } from '../../utils/styles/header';
import { withTheme } from 'styled-components'
import { Burger, BurgerNav } from '../../utils/styles/header';
import { FullWidthLine } from '../../utils/styles/misc';

class Header extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
        isBurgerMenuOpen: false,
      }
    }

    setBurgerMenuOpen = (isBurgerMenuOpen) => {
        this.setState({
            isBurgerMenuOpen: isBurgerMenuOpen
        })
    };

    render() {
        return (
            <>
            <HeaderContainer>
                <BrandContainer>
                    <BrandLink to="/">
                        <NavLogo 
                            width={this.props.site.logo.width}
                            margin="0" 
                            // src={this.props.site.logo.url} 
                            src={require("../../assets/images/logos/logo.png")} 
                            // src={require("../../assets/images/logos/cc-logo.png")}  
                        />
                        {this.props.site.logo.showTitle && (<NavTitle removeActiveStyle>{this.props?.site?.name ?? ""}</NavTitle>)}
                    </BrandLink>
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
                <BurgerNavContainer>
                    <BgOverlay 
                        open={this.state.isBurgerMenuOpen} 
                        onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)} 
                    />
                    <Burger 
                        open={this.state.isBurgerMenuOpen} 
                        onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}
                    >
                        <div />
                        <div />
                        <div />
                    </Burger>
                    
                    <BurgerNav open={this.state.isBurgerMenuOpen}>
                        <BurgerNavLink to="/" onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}>
                            Home
                        </BurgerNavLink>
                        <BurgerNavLink to="/about" onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}>
                            About
                        </BurgerNavLink>
                        
                        {!this.props.user && (
                            <>
                                <BurgerNavLink 
                                    to="/login" 
                                    onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}
                                >
                                    Login
                                </BurgerNavLink>
                                <BurgerNavLink 
                                    to="/register" 
                                    onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}
                                >
                                    Register
                                </BurgerNavLink>
                            </>
                        )}
                        {this.props.user && (
                            <>
                                <BurgerNavLink 
                                    to='/dashboard'
                                    onClick={() => this.setBurgerMenuOpen(!this.state.isBurgerMenuOpen)}
                                >
                                    Dashboard
                                </BurgerNavLink>
                            </>
                        )}
                    </BurgerNav>
                </BurgerNavContainer>

            </HeaderContainer>
            <FullWidthLine />
            </>
        );
    }
}

export default withTheme(Header)