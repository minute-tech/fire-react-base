import React, { Component } from 'react'
import { withRouter } from '../../../utils/hocs';
import { Wrapper } from '../../../utils/styles/misc';
import { H2 } from '../../../utils/styles/text';

class UserLoggingIn extends Component {
    redirectTo(){
        setTimeout(() => {
            this.props.navigate("/user/dashboard");
        }, 1500);
    }
    
    render() {
        return (
            <Wrapper>
                <H2>Redirecting you...</H2>
                { this.redirectTo() }
            </Wrapper>
        )
    }
}

export default withRouter(UserLoggingIn);