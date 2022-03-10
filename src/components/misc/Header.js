import React, { Component } from 'react';
import { BrandContainer, NavHoverText, NavLinks, NavLLink, NavLogo, NavTitle } from '../../utils/styles/header';
import { withTheme } from 'styled-components'
import { LLink } from '../../utils/styles/text';

class Header extends Component {
  render() {
    return (
        <header>
            <BrandContainer>
                <LLink to='/'>
                    <NavLogo 
                        width={this.props.site.logo.width} 
                        margin="0" 
                        src={this.props.site.logo.url || require("../../assets/images/logos/logo.png")} 
                        // src={require("../../assets/images/logos/logo.png")} 
                    />
                    {this.props.site.logo.showTitle && (<NavTitle>{this.props?.site?.name ?? ""}</NavTitle>)}
                </LLink>
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