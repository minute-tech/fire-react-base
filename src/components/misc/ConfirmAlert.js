import React, { Component } from 'react'
import { withTheme } from 'styled-components';
import { BTYPES } from '../../utils/constants';
import { Button } from '../../utils/styles/buttons'
import { ModalCard } from '../../utils/styles/misc';
import { Body, H2 } from '../../utils/styles/text';

class ConfirmAlert extends Component {
    yesClicked = () => {
        console.log("User accepted confirmation.")
        this.props.yesFunc();
        this.props.onClose();
    }

    noClicked = () => {
        console.log("User denied confirmation.")
        this.props.noFunc()
        this.props.onClose();
    }

    render() {
        return (
            // ** I need to pass the theme to each of these components separately because it is undefined in the ConfirmAlert library
            <ModalCard theme={this.props.theme}>
                <H2 theme={this.props.theme}>{this.props.headingText}</H2>
                <Body theme={this.props.theme}>{this.props.body}</Body>
                <Button 
                    size="sm"
                    theme={this.props.theme}
                    color={this.props.theme.colors.green}
                    onClick={() => this.yesClicked()}
                >
                    {this.props.yesText}
                </Button>
                <Button
                    size="sm"
                    theme={this.props.theme}
                    color={this.props.theme.colors.red}
                    btype={BTYPES.INVERTED}
                    onClick={() => this.noClicked()}
                >
                    {this.props.noText}
                </Button>
            </ModalCard>
        )
    }
}

export default withTheme(ConfirmAlert);
