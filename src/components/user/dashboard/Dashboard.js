import React, { Component } from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';
import { doc, updateDoc } from 'firebase/firestore';
import { withTheme } from 'styled-components';
import { toast } from 'react-toastify';

import { withRouter } from '../../../utils/hocs';
import { auth, firestore } from "../../../Fire.js";
import { LLink, H1, H3, Body } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons.js';
import { Hr, Wrapper } from '../../../utils/styles/misc.js';
import ConfirmAlert from '../../misc/ConfirmAlert';
import { DEFAULT_THEME } from '../../../utils/constants';

class Dashboard extends Component {
    logOut = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful.");
            // this.props.navigate("/")
            // window.location.reload();
            toast.success(`Signed out successfully!`);
            this.props.navigate("/");
            this.props.userLoggedOut();
            // onClose()
        }).catch((error) => {
            console.error("Error signing out: " + error);
            toast.error(`Error signing out: ${error}`);
        });
    }

    setThemeScheme = (currentScheme, userId) => {
        if(currentScheme === DEFAULT_THEME.SCHEME.DARK.VALUE){
            // Currently Dark Theme, change to Light
            // Update Firestore doc to remember
            updateDoc(doc(firestore, "users", userId), {
                flags: {
                    themeScheme: DEFAULT_THEME.SCHEME.LIGHT.VALUE
                }
            }).then((doc) => {
                console.log("Successful update of user doc to Firestore: ");
                console.log(doc)
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        } else {
            // Currently Light Theme, change to Dark
            // Update Firestore doc to remember
            updateDoc(doc(firestore, "users", userId), {
                flags: {
                    themeScheme: DEFAULT_THEME.SCHEME.DARK.VALUE
                }
            }).then((doc) => {
                console.log("Successful update of user doc to Firestore: ");
                console.log(doc)
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        }
    }
    
    
    render() {
        return (
            <Wrapper>
                <H1>User Dashboard</H1>
                {this.props.fireUser.displayName && (<H3>Hi, {this.props.fireUser.displayName}!</H3>)}
                <LLink to={`/profile`}> 
                    <Button>
                        Edit your profile
                    </Button>
                </LLink>
                <Button onClick={() => this.setThemeScheme(this.props.user.flags.themeScheme, this.props.fireUser.uid)}>
                    Switch to {this.props.user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.LIGHT.VALUE : DEFAULT_THEME.SCHEME.DARK.VALUE} mode
                </Button>
                <Hr/>
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