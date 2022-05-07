import React from 'react';
import { signOut } from 'firebase/auth';
import { confirmAlert } from 'react-confirm-alert';
import { toast } from 'react-toastify';
import { FaCog, FaUserEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useTheme } from 'styled-components';
import { useNavigate } from 'react-router-dom';

import { auth } from "../../../../Fire.js";
import { LLink, H1, H3 } from '../../../../utils/styles/text.js';
import { Button } from '../../../../utils/styles/buttons.js';
import { Hr } from '../../../../utils/styles/misc.js';
import ConfirmAlert from '../../../misc/ConfirmAlert';

function Dashboard(props) {
    const theme = useTheme();
    const navigate = useNavigate();

    const logOut = () => {
        signOut(auth).then(() => {
            navigate("/")
            console.log("Sign out successful.");
            toast.success(`Signed out successfully!`);
            props.cleanUpLogout();
        }).catch((error) => {
            console.error("Error signing out: " + error);
            toast.error(`Error signing out: ${error}`);
        });
    }
    
    return (
        <>
            <Helmet>
                <title>Dashboard {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <H1>Dashboard</H1>
            <H3>Hi, {props?.fireUser?.displayName}!</H3>
            <LLink to={`/dashboard/profile`}> 
                <Button>
                    Edit your profile <FaUserEdit size={20} />
                </Button>
            </LLink>
            <Hr/>
            {props.readOnlyFlags?.isAdmin && (
                <LLink to={`/dashboard/admin`}> 
                    <Button>
                        Admin Dashboard <FaCog /> 
                    </Button>
                </LLink>
            )}
            <Button 
                color={theme.colors.red}
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