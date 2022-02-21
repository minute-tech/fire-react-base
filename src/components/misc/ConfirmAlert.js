import React, { Component } from 'react'
import { withTheme } from 'styled-components';
import { Button } from '../../utils/styles/buttons'
import { ConfirmCard } from '../../utils/styles/misc';
import { Body, H1 } from '../../utils/styles/text';

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
            <ConfirmCard>
                <div>
                    <H1>{this.props.headingText}</H1>
                    <Body>{this.props.bodyText}</Body>
                    {/* TODO: somehow the theme isnt being passed to button below */}
                    {/* <Button>Test</Button> */}
                    <button
                        
                        onClick={() => this.yesClicked()}
                    >
                        {this.props.yesText}
                    </button>
                    <button
                        onClick={() => this.noClicked()}
                    >
                        {this.props.noText}
                    </button>
                </div>
            </ConfirmCard>
        )
    }
}

export default withTheme(ConfirmAlert);
