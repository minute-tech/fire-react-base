import React, { Component } from 'react';
import { LogoContainer, NavTitle } from '../../utils/styles/header';
import { withTheme } from 'styled-components'

class Header extends Component {
  render() {
    return (
        <header>
            <LogoContainer>
                <NavTitle>Header</NavTitle>
            </LogoContainer>
            <div style={{backgroundColor: this.props.theme.colors.primary, height: "5px"}} />
        </header>
    );
  }
}

export default withTheme(Header)