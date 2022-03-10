import React, { Component } from 'react'
import { BTYPES } from '../../utils/constants';
import { Button } from '../../utils/styles/buttons'
import { ModalCard } from '../../utils/styles/misc';
import { H2 } from '../../utils/styles/text';

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
            <ModalCard>
                <H2>{this.props.headingText}</H2>
                {this.props.bodyComponent}
                <Button
                    color={this.props.theme.colors.green}
                    onClick={() => this.yesClicked()}
                >
                    {this.props.yesText}
                </Button>
                <Button
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

export default ConfirmAlert;
