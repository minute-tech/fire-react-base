import React, { Component } from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';
import { withTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { FaCog, FaUserEdit } from 'react-icons/fa';

import { withRouter } from '../../../utils/hocs';
import { auth } from "../../../Fire.js";
import { LLink, H1, H3, Body } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons.js';
import { Hr, Wrapper } from '../../../utils/styles/misc.js';
import ConfirmAlert from '../../misc/ConfirmAlert';

class Dashboard extends Component {
    logOut = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful.");
            toast.success(`Signed out successfully!`);
            this.props.navigate("/");
            this.props.userLoggingOut();
            // onClose()
        }).catch((error) => {
            console.error("Error signing out: " + error);
            toast.error(`Error signing out: ${error}`);
        });
    }
    
    render() {
        return (
            <Wrapper>
                <H1>Dashboard</H1>
                <H3>Hi, {this.props?.fireUser?.displayName}!</H3>
                <LLink to={`/profile`}> 
                    <Button>
                        Edit your profile <FaUserEdit size={20} />
                    </Button>
                </LLink>
                <Hr/>
                {this.props.readOnlyFlags?.isAdmin && (
                    <LLink to={`/admin/dashboard`}> 
                        <Button>
                            Admin Dashboard <FaCog /> 
                        </Button>
                    </LLink>
                )}
                <Button 
                    color={this.props.theme.colors.red}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert 
                                        theme={this.props.theme}
                                        onClose={onClose} 
                                        headingText={`Log out?`}
                                        bodyComponent={<Body>Are you sure you want to log out?</Body>}
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

export default withRouter(withTheme(Dashboard))