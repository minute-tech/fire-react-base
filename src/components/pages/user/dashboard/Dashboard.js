import React from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { FaCog, FaUserEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { auth } from "../../../../Fire.js";
import { LLink, H1, Body } from '../../../../utils/styles/text.js';
import { Button } from '../../../../utils/styles/forms.js';
import { Hr } from '../../../../utils/styles/misc.js';
import ConfirmAlert from '../../../misc/ConfirmAlert';
import { APHORISMS, SCHEMES } from '../../../../utils/constants.js';
import { checkIfRoleIsAdmin } from '../../../../utils/misc.js';

function Dashboard(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const quote = APHORISMS[Math.floor(Math.random() * APHORISMS.length)]; // Rendering of these can show React DOM render patterns! 

    const logOut = () => {
        signOut(auth).then(() => {
            navigate("/")
            console.log("Sign out successful.");
            toast.success(`Signed out successfully!`);
            props.cleanUpLogout();
        }).catch((error) => {
            console.error("Error signing out: " + error);
            toast.error(`Error signing out. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
        });
    }
    
    return (
        <>
            <Helmet>
                <title>Dashboard {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <H1>{props?.user?.firstName ?? "User"}'s Dashboard</H1>
            <Body color={theme.value === SCHEMES.DARK ? theme.color.lightGrey : theme.color.grey} margin="5px 0 15px 0">{quote}</Body>
            <LLink to={`/dashboard/profile`}> 
                <Button type="button">
                    Edit your profile <FaUserEdit size={20} />
                </Button>
            </LLink>
            <Hr/>
            {checkIfRoleIsAdmin(props.customClaims.role, props.roles) && (
                <LLink to={`/dashboard/admin`}> 
                    <Button type="button">
                        Admin Dashboard <FaCog /> 
                    </Button>
                </LLink>
            )}
            <Button 
                type="button"
                color={theme.color.red}
                onClick={() =>         
                    confirmAlert({
                        customUI: ({ onClose }) => {
                            return (
                                <ConfirmAlert 
                                    theme={theme}
                                    onClose={onClose} 
                                    headingText={`Log out?`}
                                    body={<span>Are you sure you want to log out?</span>}
                                    yesFunc={logOut} 
                                    yesText={`Yes`} 
                                    noFunc={function () {}} 
                                    noText={`Cancel`}   
                                />
                            );
                        }
                    })}
                >
                Log out
            </Button>
        </>
    )
        
}

export default Dashboard;