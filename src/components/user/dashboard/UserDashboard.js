import React, { Component } from 'react';
import { store } from 'react-notifications-component';

import { withRouter } from '../../../utils/misc';
import { fire, firestore } from "../../../Fire.js";
import { LLink, H1, H3 } from '../../../utils/styles/text.js';
import { MdBlackToInvBtn, MdBlueToInvBtn, MdGreenToInvBtn, MdInvToRedBtn, MdPrimaryToInvBtn, MdSecondaryToInvBtn, MdYellowToInvBtn } from '../../../utils/styles/buttons.js';
import { Hr, Wrapper } from '../../../utils/styles/misc.js';
import { NOTIFICATION } from '../../../utils/constants.js';

class UserDashboard extends Component {
    signOut = () => {
        console.log("Signing out...")
        fire.auth().signOut().then(() => {
            console.log("Sign out successful.");
            this.props.history.push("/");
            window.location.reload();
            store.addNotification({
                title: "Success",
                message: `Signed out successfully!`,
                type: "success",
                ...NOTIFICATION
            })
        }).catch((error) => {
                console.error("Error signing out: " + error);
                store.addNotification({
                    title: "Error",
                    message: `Error signing out: ${error}`,
                    type: "danger",
                    ...NOTIFICATION
                })
        });
    }
    
    render() {
        return (
            <Wrapper>
                <H1>User Dashboard</H1>
                <H3>Hi, {this.props.user.displayName}!</H3>
                <LLink to={`/user/profile`}> 
                    <MdBlackToInvBtn type="button">
                        Edit your profile
                    </MdBlackToInvBtn>
                </LLink>
                <Hr/>
                <MdInvToRedBtn type="button" onClick={()=>this.signOut()}>
                    Log out
                </MdInvToRedBtn>
            </Wrapper>
        )
    }
}

export default withRouter(UserDashboard)