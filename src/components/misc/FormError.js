import React, { Component } from 'react'
import { ErrorText } from '../../utils/styles/text'

export default class FormError extends Component {
    render() {
        return (
            <div>
                {this.props.stateError ? (
                    <ErrorText>{this.props.stateError}</ErrorText>
                ) : (
                    ""
                )}
                
                {this.props.yupError && this.props.formikTouched ? (
                    <ErrorText>{this.props.yupError}</ErrorText>
                ) : (
                    ""
                )}
            </div>
        )
    }
}