import { addDoc, arrayRemove, arrayUnion, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState} from 'react'
import { confirmAlert } from 'react-confirm-alert';
import { CgMail, CgMailOpen } from 'react-icons/cg';
import { FaShieldAlt, FaShieldVirus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';
import { firestore } from '../../../../Fire';
import { BTYPES, SIZES } from '../../../../utils/constants';
import { readTimestamp } from '../../../../utils/misc';
import { Button } from '../../../../utils/styles/forms';
import { Spinner } from '../../../../utils/styles/images';
import { Div } from '../../../../utils/styles/misc';
import { ALink, Body, H2, H3 } from '../../../../utils/styles/text';
import ConfirmAlert from '../../../misc/ConfirmAlert';

import DataManager from '../../../misc/DataManager';

function ManageUsers(props) {
    const theme = useTheme();
    
    const [admins, setAdmins] = useState([]);
    const [superAdmins, setSuperAdmins] = useState([]);
    const [messengerEmails, setMessengerEmails] = useState([]);
    const [loading, setLoading] = useState({ 
        sensitive: true,
    });

    const [tableCols, setTableCols] = useState([
        {
            label: "ID",
            value: "id",
            direction: "",
            active: false
        },
        {
            label: "Timestamp",
            value: "timestamp",
            direction: "desc", // Set to "desc" by default, so this will be sorted first, only init one of these columns as desc, others should be null for now!
            active: true
        },
        {
            label: "First Name",
            value: "firstName",
            direction: "",
            active: false
        },
        {
            label: "Last Name",
            value: "lastName",
            direction: "",
            active: false
        },
        {
            label: "Email",
            value: "email",
            direction: "",
            active: false
        },
        {
            label: "Phone",
            value: "phone",
            direction: "",
            active: false
        },
    ]);

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "sensitive"), (sensitiveDoc) => {
            if(sensitiveDoc.exists()){
                let sensitiveData = sensitiveDoc.data();
                setAdmins(sensitiveData.admins);
                setSuperAdmins(sensitiveData.superAdmins);
                setMessengerEmails(sensitiveData.messengers);

                setLoading(prevState => ({
                    ...prevState,
                    sensitive: false
                }));
            } else {
                console.log("No custom site set, can't properly find sensitives.")
                setLoading(prevState => ({
                    ...prevState,
                    sensitive: false
                }));
            }
        });
    }, []);

    const submitNewAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new admin doc to Firestore.");
            toast.success("Successful add of new admin!");
        }).catch((error) => {
            console.error("Error adding newAdmins doc: ", error);
            toast.error(`Error setting new admin. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
        });
    };

    const submitNewSuperAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            superAdmin: true,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new super admin doc to Firestore.");
            toast.success("Successful add of new super admin!");
        }).catch((error) => {
            console.error("Error adding newAdmins doc: ", error);
            toast.error(`Error setting new super admin. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
        });
    };

    const addMessenger = (email) => {
        // Write to the current newAdmins collection to be verified on the backend.
        updateDoc(doc(firestore, "site", "sensitive"), {
            "messengers": arrayUnion(email)
        }).then(() => {
            console.log("Successful add of email to get contact users doc to Firestore.");
            toast.success("Successful add of a new email to get contact users.");
        }).catch((error) => {
            console.error("Error updating sensitive doc: ", error);
            toast.error(`Error updating sensitive document. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
        });
    };

    const removeMessenger = (email) => {
        // Write to the current newAdmins collection to be verified on the backend.
        updateDoc(doc(firestore, "site", "sensitive"), {
            "messengers": arrayRemove(email)
        }).then(() => {
            console.log("Successfully removed email from contact users doc to Firestore.");
            toast.success("Successfully removed email from contact users.");
        }).catch((error) => {
            console.error("Error updating sensitive doc: ", error);
            toast.error(`Error updating sensitive document. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
        });
    };
    
    const renderAdminBadge = (user) => {
        if(admins.some(admin => admin.id === user.id)){
            <Body margin="0" display="inline-block" color={theme.colors.red}><FaShieldAlt /> Admin</Body>
        } else {
            return (
                <Button
                    type="button"
                    color={theme.colors.yellow}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Admin`}
                                        body={`Are you sure you want to upgrade <${user.email}> to be an Admin?`}
                                        yesFunc={() => submitNewAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)} 
                                        yesText={`Yes`} 
                                        noFunc={function () {}} 
                                        noText={`No`}   
                                    />
                                );
                            }
                        })}       
                >
                    Set as Admin <FaShieldAlt />
                </Button> 
            )
            
        }
    };

    const renderSuperAdminBadge = (user) => {
        if(
            !superAdmins.some(superAdmin => superAdmin.id === user.id) && 
            admins.some(admin => admin.id === user.id)
        ){
            // Already admin, but not super admin yet
            return (
                <Button
                    type="button"
                    color={theme.colors.red}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Super Admin`}
                                        body={`Are you sure you want to upgrade <${user.email}> to be a SUPER Admin?`}
                                        yesFunc={() => submitNewSuperAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Set as Super Admin <FaShieldVirus />
                </Button> 
            )
            
        } else if (superAdmins.some(superAdmin => superAdmin.id === user.id)) {
            // Already superAdmin
            return (
                <Body margin="0" display="inline-block" color={theme.colors.red}><FaShieldVirus /> Super Admin</Body>
            )
            
        } else {
            // Not admin
            return (
                ""
            )
        }
    };

    const renderMessengerBadge = (user) => {
        if(
            !messengerEmails.some(email => email === user.email) && 
            admins.some(admin => admin.id === user.id)
        ){
            // Is admin but not on email list
            return (
                <Button
                    type="button"
                    color={theme.colors.green}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Contact Messenger`}
                                        body={`Are you sure you want to add <${user.email}> to be a recipient of all incoming contact messages?`}
                                        yesFunc={() => addMessenger(user.email)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Set as Messenger <CgMailOpen />
                </Button> 
            )
            
        } else if (
            messengerEmails.some(email => email === user.email) && 
            admins.some(admin => admin.id === user.id)
        ) {
            // Is admin and already receiving emails, but prompted to remove
            return (
                <Button
                    type="button"
                    color={theme.colors.red}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Remove Messenger`}
                                        body={`Are you sure you want to remove <${user.email}> so the user will no longer receive contact messages?`}
                                        yesFunc={() => removeMessenger(user.email)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Remove Messenger? <CgMail />
                </Button> 
            )
            
        } else {
            // Not admin
            return (
                ""
            )
        }
    };

    const renderDetailModal = (item) => {
        return (
            <>
                <H3>{item.firstName} {item.lastName}</H3> <ALink href={`mailto:${item.email}`}>&lt;{item.email}&gt;</ALink>
                <Body margin="0" size={SIZES.SM}><i>{readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}</i></Body>
                <Div margin="10px 30px 0 0">
                    { renderAdminBadge(item) }
                    { renderSuperAdminBadge(item) }
                    { renderMessengerBadge(item) }
                </Div>
            </>
        )
    }

    if(loading.sensitive){
        return (
            <>
                <H2>Loading... <Spinner /> </H2> 
            </>
        )
    } else {
        return (
            <DataManager 
                pageTitle="Users"
                user={props.user}
                fireUser={props.fireUser}
                readOnlyFlags={props.readOnlyFlags}
                site={props.site}
                tableCols={tableCols}
                setTableCols={setTableCols}
                dataName={"users"}
                renderDetailModal={renderDetailModal}
            />
        )
    }
  
}

export default ManageUsers;