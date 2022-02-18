import React, { Component } from 'react';
import { store } from 'react-notifications-component';

import { withRouter } from '../../../utils/hocs';
import { auth } from "../../../Fire.js";
import { LLink, H1, H3 } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons.js';
import { Hr, Wrapper } from '../../../utils/styles/misc.js';
import { NOTIFICATION } from '../../../utils/constants.js';
import { signOut } from 'firebase/auth';

class UserDashboard extends Component {
    logOut = () => {
        console.log("Signing out...")
        signOut(auth).then(() => {
            console.log("Sign out successful.");
            this.props.navigate("/")
            window.location.reload();
            // store.addNotification({
            //     title: "Success",
            //     message: `Signed out successfully!`,
            //     type: "success",
            //     ...NOTIFICATION
            // })
        }).catch((error) => {
            console.error("Error signing out: " + error);
            // store.addNotification({
            //     title: "Error",
            //     message: `Error signing out: ${error}`,
            //     type: "danger",
            //     ...NOTIFICATION
            // })
        });
    }
    
    render() {
        return (
            <Wrapper>
                <H1>User Dashboard</H1>
                <H3>Hi, {this.props.user.displayName}!</H3>
                <LLink to={`/user/profile`}> 
                    <Button>
                        Edit your profile
                    </Button>
                </LLink>
                <Hr/>
                <Button 
                    color="red" 
                    onClick={() => this.logOut()}>
                    Log out
                </Button>
            </Wrapper>
        )
    }
}

export default withRouter(UserDashboard)