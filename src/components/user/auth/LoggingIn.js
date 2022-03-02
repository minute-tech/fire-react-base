import React, { Component } from 'react'

import { withRouter } from '../../../utils/hocs.js';
import { Spinner, Wrapper } from '../../../utils/styles/misc';
import { H2 } from '../../../utils/styles/text';

class LoggingIn extends Component {
    componentDidMount(){
        this.redirectTo()
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
    } 

    redirectTo = () => {
        this.timer = setTimeout(() => {
            this.props.navigate("/dashboard");
            this.props.userLoggingIn(false);
        }, 2000);
    }
    
    render() {
        return (
            <Wrapper>
                <H2>Success! Redirecting you now... <Spinner /></H2>
            </Wrapper>
        )
    }
}

export default withRouter(LoggingIn);