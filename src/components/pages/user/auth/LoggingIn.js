import React, { Component } from 'react'
import { Helmet } from 'react-helmet-async';

import { withRouter } from '../../../../utils/hocs.js';
import { Spinner, Wrapper } from '../../../../utils/styles/misc';
import { H2 } from '../../../../utils/styles/text';

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
                <Helmet>
                    <title>Logging in... {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <H2>Success! Redirecting you now... <Spinner /></H2>
            </Wrapper>
        )
    }
}

export default withRouter(LoggingIn);