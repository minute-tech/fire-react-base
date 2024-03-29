import React, { useState } from "react"
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { FaMoon, FaSun } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { updateEmail, updateProfile } from "firebase/auth";
import { useTheme } from "styled-components";
import { useForm } from "react-hook-form";

import { Column, Grid, Hr, ModalCard, ModalContainer, Row } from "../../../../utils/styles/misc.js";
import { Img } from "../../../../utils/styles/images.js";
import { TextInput, Button } from "../../../../utils/styles/forms.js";
import { Body, H1, H3, Label, LLink } from "../../../../utils/styles/text.js";
import { FormError } from "../../../misc/Misc.js";
import { BTYPES, INPUT, ITEMS, SCHEMES, SIZES } from "../../../../utils/constants.js";
import { auth, firestore } from "../../../../Fire";
import FileUpload from "../../../items-manager/FileUpload";
import { checkIfRoleIsAdmin, readTimestamp } from "../../../../utils/misc";
import Reauth from "../auth/Reauth.js";
import AccountSecurityStatus from "../auth/AccountSecurityStatus.js";
import MFASetup from "../auth/MFASetup.js";

function Profile(props) {
    const theme = useTheme();
    const [submitting, setSubmitting] = useState({ 
        updateUserProfile: false,
        email: false,
        files: false
    });

    const profileForm = useForm({
        defaultValues: {
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            email: props.user.email,
            phone: props.user.phone,
            avatar: props.user.avatar || "",
        }
    });

    const emailForm = useForm({
        defaultValues: {
            email: "",
        }
    });


    const [shownModals, setShownModals] = useState([]); 
    
    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals]
        tempShownModals[index] = newStatus
        setShownModals(tempShownModals);
    }

    const updateUserProfile = async (data) => {
        setSubmitting(prevState => ({
            ...prevState,
            updateUserProfile: true
        }));

        updateProfile(auth.currentUser, {
            displayName: `${data.firstName} ${data.lastName}`,
        }).then(() => {
            console.log("Successfully updated the user's displayName on firebase");
        }).catch((error) => {
            console.error("Error updating user's displayName: ");
            console.error(error);
        });

        updateDoc(doc(firestore, ITEMS.USERS.COLLECTION, props.fireUser.uid), {
            firstName: data.firstName,
            lastName: data.lastName,
            updated: {
                timestamp: Date.now(),
                id: props.fireUser.uid,
                email: props.fireUser.email,
                name: props.fireUser.displayName,
                summary: "Update user first and last name."
            },
        }).then(() => {
            console.log("Successful update of user doc to Firestore.");
            toast.success("Successfully updated the user profile.");
            setSubmitting(prevState => ({
                ...prevState,
                updateUserProfile: false
            }));
        }).catch((error) => {
            console.error("Error adding document: " + error);
            toast.error(`Error setting users document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
            setSubmitting(prevState => ({
                ...prevState,
                updateUserProfile: false
            }));
        });
    }

    const updateUserEmail = (data) =>{
        setSubmitting(prevState => ({
            ...prevState,
            email: true
        }));
        updateEmail(auth.currentUser, data.email).then(() => {
            console.log("Successfully updated the user email on firebase");
    
            updateDoc(doc(firestore, ITEMS.USERS.COLLECTION, props.fireUser.uid), {
                email: data.email,
                updated: {
                    timestamp: Date.now(),
                    id: props.fireUser.uid,
                    email: props.fireUser.email,
                    name: props.fireUser.displayName,
                    summary: "Updated user email."
                },
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
                toast.success("Successfully updated your email!");
                toggleModal(false, "update-email");
                profileForm.setValue("email", data.email);
                setSubmitting(prevState => ({
                    ...prevState,
                    email: false
                }));
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting your email document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                setSubmitting(prevState => ({
                    ...prevState,
                    email: false
                }));
            });
        }).catch((error) => {
            if(error.code === "auth/email-already-in-use"){
                toast.error("This email is already taken, please try another email address.");
            } else if(error.code === "auth/email-change-needs-verification") {
                toast.error("MFA so you need to verify your email.");
            } else {
                toast.error(`Error updating account. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
            }
                
            setSubmitting(prevState => ({
                ...prevState,
                email: false
            }));
        });
    }

    const setThemeScheme = (currentScheme, userId) => {
        updateDoc(doc(firestore, ITEMS.USERS.COLLECTION, userId), {
            flags: {
                themeScheme: (currentScheme === SCHEMES.DARK ? SCHEMES.LIGHT : SCHEMES.DARK),
            },
            updated: {
                timestamp: Date.now(),
                id: props.fireUser.uid,
                email: props.fireUser.email,
                name: props.fireUser.displayName,
                summary: "Updated user theme color."
            },
        }).then(() => {
            console.log("Successful update of user doc for theme color to Firestore.");
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
        });
    }

    const updateAvatar = (urls, valueName) => {
        updateDoc(doc(firestore, ITEMS.USERS.COLLECTION, props.fireUser.uid), {
            avatar: urls[0],
            updated: {
                timestamp: Date.now(),
                id: props.fireUser.uid,
                email: props.fireUser.email,
                name: props.fireUser.displayName,
                summary: "Updated user avatar."
            },
        }).then(() => {
            console.log("Successful update of user doc to Firestore for pic.");
            updateProfile(auth.currentUser, {
                photoURL: urls[0],
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile pic on firebase");
                toggleModal(false, "avatar")
                setSubmitting(prevState => ({
                    ...prevState,
                    files: false
                }));
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
            setSubmitting(prevState => ({
                ...prevState,
                files: false
            }));
        });
    }

    return (
        <>
            <Helmet>
                <title>Profile {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to={`/dashboard`}> 
                <Button type="button">
                    <FaChevronLeft />&nbsp; Return to Dashboard
                </Button>
            </LLink>
            <H1>Profile</H1>
            <form onSubmit={ profileForm.handleSubmit(updateUserProfile) }>
                <Grid fluid>
                    <Row style={{ height: "200px" }}>
                        <Column sm={12} textalign="center">
                            <Img 
                                src={props.user.avatar || require("../../../../assets/images/misc/user.png")}
                                rounded
                                alt={`${props.user.firstName} profile picture`}
                                width={"200px"}
                            />
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12} textalign="center">
                            <Button 
                                type="button"
                                btype={BTYPES.TEXTED} 
                                color={theme.color.yellow}
                                onClick={() => toggleModal(true, "avatar")}>
                                    update picture
                            </Button>
                        </Column>
                    </Row>
                    <Hr/>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.FIRST_NAME.KEY} br>First Name:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.FIRST_NAME.PLACEHOLDER} 
                                error={profileForm.formState.errors[INPUT.FIRST_NAME.KEY]}
                                {
                                    ...profileForm.register(INPUT.FIRST_NAME.KEY, { 
                                            required: INPUT.FIRST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MAX.KEY,
                                                message: INPUT.FIRST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MIN.KEY,
                                                message: INPUT.FIRST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={profileForm.formState.errors[INPUT.FIRST_NAME.KEY]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.LAST_NAME.KEY} br>Last Name:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.LAST_NAME.PLACEHOLDER} 
                                error={profileForm.formState.errors[INPUT.LAST_NAME.KEY]}
                                {
                                    ...profileForm.register(INPUT.LAST_NAME.KEY, { 
                                            required: INPUT.LAST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MAX.KEY,
                                                message: INPUT.LAST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MIN.KEY,
                                                message: INPUT.LAST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={profileForm.formState.errors[INPUT.LAST_NAME.KEY]} /> 
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.EMAIL.KEY}>Email:</Label>
                            &nbsp;
                            {checkIfRoleIsAdmin(props.customClaims.role, props.roles) && (
                                <Body 
                                    margin="0" 
                                    display="inline" 
                                    size={SIZES.SM} 
                                    color={theme.color.red}
                                >
                                    cannot change email as admin
                                </Body>
                            )}
                            {(!checkIfRoleIsAdmin(props.customClaims.role, props.roles)) && (
                                <Body 
                                    margin="0" 
                                    display="inline" 
                                    size={SIZES.SM} 
                                    color={theme.color.green}
                                    hoverColor={theme.color.yellow}
                                    onClick={() => toggleModal(true, "reauth-email")}
                                >
                                    edit
                                </Body>
                            )}
                            <br />
                            <TextInput
                                type="text" 
                                disabled
                                error={profileForm.formState.errors[INPUT.EMAIL.KEY]}
                                placeholder={INPUT.EMAIL.PLACEHOLDER} 
                                {
                                    ...profileForm.register(INPUT.EMAIL.KEY, { 
                                            required: INPUT.EMAIL.ERRORS.REQUIRED,
                                            pattern: {
                                                value: INPUT.EMAIL.ERRORS.PATTERN.KEY,
                                                message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={profileForm.formState.errors[INPUT.EMAIL.KEY]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.PHONE.KEY}>Phone:</Label>
                            &nbsp;
                            <Body 
                                margin="0"
                                display="inline"
                                size={SIZES.SM}
                                color={theme.color.green}
                                hoverColor={theme.color.yellow}
                                onClick={() => !props.fireUser.emailVerified ? toast.warn("You need to verify your email before adding a phone number to your account. Send a verification link to your email below first!") : toggleModal(true, "reauth-mfa")}
                            >
                                edit
                            </Body>
                            <br />
                            <TextInput
                                type="text"
                                disabled
                                error={profileForm.formState.errors[INPUT.PHONE.KEY]}
                                placeholder={INPUT.PHONE.PLACEHOLDER} 
                                {
                                    ...profileForm.register(INPUT.PHONE.KEY, { 
                                            maxLength: {
                                                value: INPUT.PHONE.ERRORS.MAX.KEY,
                                                message: INPUT.PHONE.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.PHONE.ERRORS.MIN.KEY,
                                                message: INPUT.PHONE.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={profileForm.formState.errors[INPUT.PHONE.KEY]} /> 
                        </Column>
                    </Row>               
                    <Row>
                        <Column md={12} textalign="center">
                            {profileForm.formState.isDirty && (
                                <Button 
                                    type="submit" 
                                    disabled={submitting.updateUserProfile}
                                >
                                    Save changes
                                </Button>
                            )}
                        </Column>
                    </Row>
                    <Hr/>
                    <Row align="center" justify="center">
                            <Column sm={12} md={4} textalign="center">
                                {(props.site.theme.color.light.enabled && props.site.theme.color.dark.enabled) && (
                                    // Dont need to show this button if both light and dark mode are disabled
                                    <Button 
                                        type="button"
                                        color={props?.user?.flags?.themeScheme === SCHEMES.DARK ? theme.color.yellow : "black"} 
                                        btype={BTYPES.INVERTED}
                                        onClick={() => setThemeScheme(props?.user?.flags?.themeScheme, props?.fireUser?.uid)}
                                    >
                                        Switch to&nbsp;
                                        {
                                            props?.user?.flags?.themeScheme === SCHEMES.DARK ? 
                                            <span>{SCHEMES.LIGHT} mode <FaSun /> </span> : 
                                            <span>{SCHEMES.DARK} mode <FaMoon /></span>
                                        }
                                    </Button>
                                )}
                            </Column>
                        
                        <Column sm={12} md={4} textalign="center">
                            <Label>Account created:&nbsp;</Label> 
                            <Body margin="0" display="inline">{readTimestamp(props.user.created.timestamp).date} @ {readTimestamp(props.user.created.timestamp).time}</Body>
                        </Column>
                        <Column sm={12} md={4} textalign="center">
                            <AccountSecurityStatus
                                site={props.site}
                                fireUser={props.fireUser}
                                toggleModal={toggleModal}
                            />
                        </Column>
                    </Row>
                </Grid>
            </form>
                       
            {shownModals["avatar"] && (
                <ModalContainer onClick={() => toggleModal(false, "avatar")}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <H3>Update profile avatar</H3>
                        <FileUpload
                            name="avatar"
                            path={`users/${props.user.id}/images/avatar/`}
                            accepts="image/png, image/jpg, image/jpeg" 
                            aspectRatio={{
                                numer: 1,
                                denom: 1,
                            }}
                            onUploadSuccess={updateAvatar}
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                            setError={profileForm.setError}
                            clearError={profileForm.clearErrors}
                            error={profileForm.formState.errors.avatar}
                        />
                        
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, "avatar")}
                        >
                            <CgClose /> Close 
                        </Button>
                    </ModalCard>
                </ModalContainer>
            )}

            {shownModals["reauth-email"] && (
                <ModalContainer onClick={() => toggleModal(false, "reauth-email")}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <H3>Reauthenticate</H3>
                        <Reauth onSuccess={toggleModal} destination="update-email" />
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, "reauth-email")}
                        >
                            <CgClose /> Close 
                        </Button>
                    </ModalCard>
                </ModalContainer>
            )}

            {shownModals["update-email"] && (
                <ModalContainer onClick={() => toggleModal(false, "update-email")}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <H3>Update Email</H3>
                        <form onSubmit={ emailForm.handleSubmit(updateUserEmail) }>
                            <Grid fluid>
                                <Row justify="center">
                                    <Column md={12} lg={8}>
                                        <Label htmlFor={INPUT.EMAIL.KEY} br>New Email Address:</Label>
                                        <TextInput
                                            type="text"
                                            error={emailForm.formState.errors[INPUT.EMAIL.KEY]}
                                            placeholder={INPUT.EMAIL.PLACEHOLDER}
                                            {
                                                ...emailForm.register(INPUT.EMAIL.KEY, { 
                                                        required: INPUT.EMAIL.ERRORS.REQUIRED,
                                                        pattern: {
                                                            value: INPUT.EMAIL.ERRORS.PATTERN.KEY,
                                                            message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                                        },
                                                    }
                                                )
                                            } 
                                        />
                                        <FormError error={emailForm.formState.errors[INPUT.EMAIL.KEY]} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column md={12} textalign="center">
                                        <Button 
                                            type="submit" 
                                            disabled={submitting.email}
                                        >
                                            Submit
                                        </Button>
                                    </Column>
                                </Row>
                            </Grid>
                        </form>
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, "update-email")}
                        >
                            <CgClose /> Close 
                        </Button>
                    </ModalCard>
                </ModalContainer>
            )}

            
            {shownModals["reauth-mfa"] && (
                <ModalContainer onClick={() => toggleModal(false, "reauth-mfa")}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <H3>Reauthenticate</H3>
                        <Reauth onSuccess={toggleModal} destination="update-mfa" />
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, "reauth-mfa")}
                        >
                            <CgClose /> Close 
                        </Button>
                    </ModalCard>
                </ModalContainer>
            )}

            {shownModals["update-mfa"] && (
                <ModalContainer onClick={() => toggleModal(false, "update-mfa")}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <H3>Setup 2FA with phone number</H3>
                        <MFASetup 
                            fireUser={props.fireUser}
                            user={props.user}
                            site={props.site}
                            toggleModal={toggleModal}
                            setPhoneField={profileForm.setValue}
                        />
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, "update-mfa")}
                        >
                            <CgClose /> Close 
                        </Button>
                    </ModalCard>
                </ModalContainer>
            )}
        </>
    )
}

export default Profile;