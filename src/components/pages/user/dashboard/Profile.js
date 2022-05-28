import React, { useEffect, useRef, useState } from "react"
import { FaChevronLeft, FaUserShield } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { FaMoon, FaSun } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { useTheme } from "styled-components";
import { AiOutlineReload } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Column, Grid, Hr, ModalCard, ModalContainer, Row } from "../../../../utils/styles/misc.js";
import { Img } from "../../../../utils/styles/images.js";
import { TextInput, Button } from "../../../../utils/styles/forms.js";
import { Body, H1, Label, LLink } from "../../../../utils/styles/text.js";
import { FormError } from "../../../misc/Misc.js";
import { BTYPES, INPUT, SCHEMES, SIZES } from "../../../../utils/constants.js";
import { auth, firestore } from "../../../../Fire";
import FileUpload from "../../../misc/FileUpload";
import { readTimestamp } from "../../../../utils/misc";

function Profile(props) {
    const theme = useTheme();
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState({ 
        updateUser: false,
        files: false
    });

    const updateUserForm = useForm({
        defaultValues: {
            firstName: props.user.firstName,
            lastName: props.user.lastName,
            email: props.user.email,
            phone: props.user.phone,
            avatar: props.user.avatar || "",
        }
    });

    const [shownModals, setShownModals] = useState([false]); 
    const [emailVerifySent, setEmailVerifySent] = useState(false); 
    const [refreshButtonShown, setRefreshButtonShown] = useState(false); 
    const verifyEmailTimer = useRef();

    useEffect(() => {
        return clearTimeout(verifyEmailTimer.current);
    }, [])

    const updateUser = (data) => {
        updateDoc(doc(firestore, "users", props.fireUser.uid), {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone
        }).then(() => {
            console.log("Successful update of user doc to Firestore.");
            updateProfile(auth.currentUser, {
                displayName: `${data.firstName} ${data.lastName}`,
                // phoneNumber: data.phone,
                email: data.email,
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile on firebase");
            }).catch((error) => {
                console.error(error);
            });
            setSubmitting(prevState => ({
                ...prevState,
                updateUser: false
            }));
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
            setSubmitting(prevState => ({
                ...prevState,
                updateUser: false
            }));
        });
    }

    const setThemeScheme = (currentScheme, userId) => {
        if(currentScheme === SCHEMES.DARK){
            // Currently Dark Theme, change to Light
            // Update Firestore doc to remember
            updateDoc(doc(firestore, "users", userId), {
                flags: {
                    themeScheme: SCHEMES.LIGHT
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
                    themeScheme: SCHEMES.DARK
                }
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        }
    }

    const updateAvatar = (urls, valueName) => {
        updateDoc(doc(firestore, "users", props.fireUser.uid), {
            avatar: urls[0],
        }).then(() => {
            console.log("Successful update of user doc to Firestore for pic.");
            updateProfile(auth.currentUser, {
                photoURL: urls[0],
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile pic on firebase");
                toggleModal(false, 0)
                setSubmitting(prevState => ({
                    ...prevState,
                    files: false
                }));
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
            setSubmitting(prevState => ({
                ...prevState,
                files: false
            }));
        });
    }

    const sendEmailVerifyLink = () => {
        sendEmailVerification(auth.currentUser).then(() => {
            console.log(`Successfully sent a verification email to ${props.fireUser.email}.`);
            setEmailVerifySent(true)
            verifyEmailTimer.current = setTimeout(() => {
                setRefreshButtonShown(true)
            }, 8000);
        }).catch((error) => {
            console.error(error);
        });
    }
    
    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals]
        tempShownModals[index] = newStatus
        setShownModals(tempShownModals);
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
            <form onSubmit={ updateUserForm.handleSubmit(updateUser) }>
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
                                color={theme.colors.yellow}
                                onClick={() => toggleModal(true, 0)}>
                                    update picture
                            </Button>
                        </Column>
                    </Row>
                    <Hr/>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.FIRST_NAME.VALUE} br>First Name:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.FIRST_NAME.PLACEHOLDER} 
                                error={updateUserForm.formState.errors[INPUT.FIRST_NAME.VALUE]}
                                {
                                    ...updateUserForm.register(INPUT.FIRST_NAME.VALUE, { 
                                            required: INPUT.FIRST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MAX.VALUE,
                                                message: INPUT.FIRST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MIN.VALUE,
                                                message: INPUT.FIRST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={updateUserForm.formState.errors[INPUT.FIRST_NAME.VALUE]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.LAST_NAME.VALUE} br>Last Name:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.LAST_NAME.PLACEHOLDER} 
                                error={updateUserForm.formState.errors[INPUT.LAST_NAME.VALUE]}
                                {
                                    ...updateUserForm.register(INPUT.LAST_NAME.VALUE, { 
                                            required: INPUT.LAST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MAX.VALUE,
                                                message: INPUT.LAST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MIN.VALUE,
                                                message: INPUT.LAST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={updateUserForm.formState.errors[INPUT.LAST_NAME.VALUE]} /> 
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.EMAIL.VALUE} br>Email:</Label>
                            <TextInput
                                type="text" 
                                error={updateUserForm.formState.errors[INPUT.EMAIL.VALUE]}
                                placeholder={INPUT.EMAIL.PLACEHOLDER} 
                                {
                                    ...updateUserForm.register(INPUT.EMAIL.VALUE, { 
                                            required: INPUT.EMAIL.ERRORS.REQUIRED,
                                            pattern: {
                                                value: INPUT.EMAIL.ERRORS.PATTERN.VALUE,
                                                message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={updateUserForm.formState.errors[INPUT.EMAIL.VALUE]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.PHONE.VALUE} br>Phone:</Label>
                            <TextInput
                                type="text" 
                                error={updateUserForm.formState.errors[INPUT.PHONE.VALUE]}
                                placeholder={INPUT.PHONE.PLACEHOLDER} 
                                {
                                    ...updateUserForm.register(INPUT.PHONE.VALUE, { 
                                            maxLength: {
                                                value: INPUT.PHONE.ERRORS.MAX.VALUE,
                                                message: INPUT.PHONE.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.PHONE.ERRORS.MIN.VALUE,
                                                message: INPUT.PHONE.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={updateUserForm.formState.errors[INPUT.PHONE.VALUE]} /> 
                        </Column>
                    </Row>               
                    <Row>
                        <Column md={12} textalign="center">
                            {updateUserForm.formState.isDirty && (
                                <Button 
                                    type="submit" 
                                    disabled={submitting.updateUser}
                                >
                                    Save changes
                                </Button>
                            )}
                        </Column>
                    </Row>
                    <Hr/>
                    <Row align="center" justify="center">
                        <Column sm={12} md={4} textalign="center">
                            <Button 
                                type="button"
                                color={props?.user?.flags?.themeScheme === SCHEMES.DARK ? theme.colors.yellow : "black"} 
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
                        </Column>
                        <Column sm={12} md={4} textalign="center">
                            <Label>Account created:&nbsp;</Label> 
                            <Body margin="0" display="inline">{readTimestamp(props.user.timestamp).date} @ {readTimestamp(props.user.timestamp).time}</Body>
                        </Column>
                        <Column sm={12} md={4} textalign="center">
                            {!props.fireUser.emailVerified && !emailVerifySent && (
                                <Button type="button" onClick={() => sendEmailVerifyLink()} color={theme.colors.green}>
                                    Verify Email
                                </Button>
                            )}
                            {emailVerifySent && !refreshButtonShown && (
                                <Body color={theme.colors.yellow} display="inline">Email sent, check your email inbox!</Body>
                            )}
                            {emailVerifySent && refreshButtonShown && (
                                <Button type="button" onClick={() => navigate(0)} btype={BTYPES.INVERTED} color={theme.colors.green}>
                                    <AiOutlineReload /> Reload page
                                </Button>
                            )}
                            {props.fireUser.emailVerified && (
                                <Body display="inline" color={theme.colors.green}>
                                    <BiCheck /> Email verified!
                                    <br/>
                                    <Button size={SIZES.SM} btype={BTYPES.TEXTED} color={theme.colors.green}>Now secure account with a phone number <FaUserShield /></Button>
                                </Body>
                            )}
                        </Column>
                    </Row>
                </Grid>
            </form>
                       
            {shownModals[0] && (
                <ModalContainer onClick={() => toggleModal(false, 0)}>
                    <ModalCard onClick={(e) => e.stopPropagation()}>
                        <Label>Update profile avatar</Label>
                        <FileUpload
                            name="avatar"
                            path={`users/${props.user.id}/images/avatar/`}
                            accepts="image/png, image/jpg, image/jpeg" 
                            imageRatio={1}
                            onUploadSuccess={updateAvatar}
                            setSubmitting={setSubmitting}
                            submitting={submitting}
                            setError={updateUserForm.setError}
                            clearError={updateUserForm.clearErrors}
                            error={updateUserForm.formState.errors.avatar}
                        />
                        
                        <Hr />
                        <Button 
                            type="button"
                            size={SIZES.SM} 
                            onClick={() => toggleModal(false, 0)}
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