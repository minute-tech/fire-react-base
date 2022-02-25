import React, { Component } from 'react';
import { BrandContainer, NavHoverText, NavLinks, NavLLink, NavLogo, NavTitle } from '../../utils/styles/header';
import { withTheme } from 'styled-components'

class Header extends Component {
  render() {
    return (
        <header>
            <BrandContainer>
                <NavLogo size='100px' margin="0" src={require("../../assets/images/logos/logo.png")} />
                <NavLLink to='/'>
                    <NavTitle>Header Title</NavTitle>
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
            {/* <div style={{backgroundColor: this.props.theme.colors.primary, height: "5px"}} /> */}
        </header>
    );
  }
}

export default withTheme(Header)