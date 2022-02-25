import React, { Component } from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';
import { doc, updateDoc } from 'firebase/firestore';
import { withTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { FaMoon, FaSun } from 'react-icons/fa';

import { withRouter } from '../../../utils/hocs';
import { auth, firestore } from "../../../Fire.js";
import { LLink, H1, H3, Body, H2 } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons.js';
import { Hr, Spinner, Wrapper } from '../../../utils/styles/misc.js';
import ConfirmAlert from '../../misc/ConfirmAlert';
import { BTYPES, DEFAULT_THEME } from '../../../utils/constants';

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
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
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
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        }
    }
    
    
    render() {
        if(!this.props.user && !this.props.fireUser){
            return (
                <Wrapper>
                    <H2>Loading... <Spinner /> </H2> 
                </Wrapper>
            )
        } else {
            return (
                <Wrapper>
                    <H1>User Dashboard</H1>
                    {this.props?.fireUser?.displayName && (<H3>Hi, {this.props?.fireUser?.displayName}!</H3>)}
                    <LLink to={`/profile`}> 
                        <Button>
                            Edit your profile
                        </Button>
                    </LLink>
                    <Button 
                        color={this.props?.user?.flags?.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? this.props.theme.colors.yellow : 'black'} 
                        btype={BTYPES.INVERTED}
                        onClick={() => this.setThemeScheme(this.props?.user?.flags?.themeScheme, this.props?.fireUser?.uid)}
                    >
                        Switch to&nbsp;
                        {
                            this.props?.user?.flags?.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? 
                            <span>{DEFAULT_THEME.SCHEME.LIGHT.VALUE} mode <FaSun /> </span> : 
                            <span>{DEFAULT_THEME.SCHEME.DARK.VALUE} mode <FaMoon /></span>
                        }
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
}

export default withRouter(withTheme(Dashboard))