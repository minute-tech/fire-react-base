import React, { Component } from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';

import { withRouter } from '../../../utils/hocs';
import { auth } from "../../../Fire.js";
import { LLink, H1, H3 } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons.js';
import { Hr, Wrapper } from '../../../utils/styles/misc.js';
import { toast } from 'react-toastify';
import ConfirmAlert from '../../misc/ConfirmAlert';

class UserDashboard extends Component {
    logOut = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful.");
            // this.props.navigate("/")
            // window.location.reload();
            toast.success(`Signed out successfully!`);
            this.props.navigate("/");
            this.props.userLogged();
            // onClose()
        }).catch((error) => {
            console.error("Error signing out: " + error);
            toast.error(`Error signing out: ${error}`);
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
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert 
                                        onClose={onClose} 
                                        headingText={`Log out?`}
                                        bodyText={`Are you sure you want to log out?`}
                                        yesFunc={this.logOut} 
                                        yesText={`Yes`} 
                                        noFunc={function () {}} 
                                        noText={`No`}   
                                    />
                                );
                            }
                        })}
                    >
                    Log out
                </Button>
            </Wrapper>
        )
    }
}

export default withRouter(UserDashboard)