import React from 'react'
import { ErrorText } from '../../utils/styles/text'

export default function FormError(props) {
    return (
        <div>
            {props.stateError ? (
                <ErrorText>{props.stateError}</ErrorText>
            ) : (
                ""
            )}
            
            {props.yupError && props.formikTouched ? (
                <ErrorText>{props.yupError}</ErrorText>
            ) : (
                ""
            )}
        </div>
    )
}