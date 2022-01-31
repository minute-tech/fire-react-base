import React, { Component } from 'react'
import { withRouter } from '../../../utils/misc';
import { Wrapper } from '../../../utils/styles/misc';
import { H2 } from '../../../utils/styles/text';

class UserLoggingIn extends Component {
    constructor(props) {
        super(props)
        this.redirectTo = this.redirectTo.bind(this);
    }

    redirectTo(){
        setTimeout(() => {
            this.props.history.push("/user/dashboard");
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