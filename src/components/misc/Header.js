import React, { Component } from 'react';
import { BrandContainer, NavHoverText, NavLinks, NavLLink, NavLogo, NavTitle } from '../../utils/styles/header';
import { withTheme } from 'styled-components'

class Header extends Component {
  render() {
    return (
        <header>
            <BrandContainer>
                <NavLogo 
                    width={this.props.site.logo.width} 
                    margin="0" 
                    // src={this.props.site.logo.url || require("../../assets/images/logos/logo.png")} 
                    src={require("../../assets/images/logos/logo.png")} 
                />
                <NavLLink to='/'>
                    <NavTitle>{this.props?.site?.name ?? ""}</NavTitle>
                </NavLLink>
            </BrandContainer>
            
            <NavLinks>
                <NavLLink to='/'><NavHoverText>Home</NavHoverText></NavLLink>
                <NavLLink to='/about'><NavHoverText>About</NavHoverText></NavLLink>
                {!this.props.fireUser && (
                    <>
                        <NavLLink to='/login'><NavHoverText>Login</NavHoverText></NavLLink>
                        <NavLLink to='/register'><NavHoverText>Register</NavHoverText></NavLLink>
                    </>
                )}
                {this.props.fireUser && (
                    <>
                        <NavLLink to='/dashboard'><NavHoverText>Dashboard</NavHoverText></NavLLink>
                    </>
                )}
            </NavLinks>
        </header>
    );
  }
}

export default withTheme(Header)