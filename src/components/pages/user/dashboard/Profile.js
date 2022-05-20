import React, { useEffect, useRef, useState } from "react"
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { FaMoon, FaSun } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { useTheme } from "styled-components";
import { AiOutlineReload } from "react-icons/ai";
import { BiCheck } from "react-icons/bi";
import { Container, Row, Col } from 'react-grid-system';

import { updateProfileSchema } from "../../../../utils/formSchemas";
import { Hr, Img, ModalCard, ModalContainer } from "../../../../utils/styles/misc.js";
import { FField } from "../../../../utils/styles/forms.js";
import { Body, H1, Label, LLink } from "../../../../utils/styles/text.js";
import { Button } from "../../../../utils/styles/buttons.js";
import { FormError } from "../../../misc/Misc.js";
import { BTYPES, PLACEHOLDER, SCHEMES, SIZES } from "../../../../utils/constants.js";
import { auth, firestore } from "../../../../Fire";
import FileUpload from "../../../misc/FileUpload";
import { readTimestamp } from "../../../../utils/misc";
import { useNavigate } from "react-router-dom";

function Profile(props) {
    const theme = useTheme();
    const navigate = useNavigate()
    const [submitting, setSubmitting] = useState({ 
        updateUser: false,
        file: false
    });

    const [errors, setErrors] = useState({ 
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        file: ""
    });

    const [shownModals, setShownModals] = useState([false]); 
    const [emailVerifySent, setEmailVerifySent] = useState(false); 
    const [refreshButtonShown, setRefreshButtonShown] = useState(false); 
    const verifyEmailTimer = useRef();

    useEffect(() => {
        return clearTimeout(verifyEmailTimer.current);
    }, [])

    const updateUserProfile = (values) => {
        updateDoc(doc(firestore, "users", props.fireUser.uid), {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone
        }).then(() => {
            console.log("Successful update of user doc to Firestore.");
            updateProfile(auth.currentUser, {
                displayName: `${values.firstName} ${values.lastName}`,
                // phoneNumber: values.phone,
                email: values.email,
                // photoURL: "https://example.com/jane-q-user/profile.jpg"
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

    const updateAvatar = (url) => {
        updateDoc(doc(firestore, "users", props.fireUser.uid), {
            avatar: url
        }).then(() => {
            console.log("Successful update of user doc to Firestore for pic.");
            updateProfile(auth.currentUser, {
                photoURL: url
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile pic on firebase");
                toggleModal(false, 0)
                setSubmitting(prevState => ({
                    ...prevState,
                    file: false
                }));
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
            setSubmitting(prevState => ({
                ...prevState,
                file: false
            }));
        });
    }

    const sendEmailVerifyLink = () => {
        sendEmailVerification(auth.currentUser).then(() => {
            console.log(`Successfully sent a verification email to ${props.fireUser.email}.`);
            setEmailVerifySent(true)
            verifyEmailTimer.current = setTimeout(() => {
                console.log("time up")
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
            {/* <Formik
                initialValues={{
                    firstName: props.user.firstName,
                    lastName: props.user.lastName,
                    email: props.user.email,
                    phone: props.user.phone
                }}
                enableReinitialize={true}
                validationSchema={updateProfileSchema}
                onSubmit={(values) => {
                    setSubmitting(prevState => ({
                        ...prevState,
                        updateUser: false
                    }));
                    updateUserProfile(values);
                }}
            >
                {formProps => (
                <Form>
                    <Container fluid>
                        <Row style={{ height: "200px", textAlign: "center" }}>
                            <Col xs={12}>
                                <Img 
                                    src={props.user.avatar || require("../../../../assets/images/misc/user.png")}
                                    rounded
                                    alt={`${props.user.firstName} profile picture`}
                                    width={"200px"}
                                />
                            </Col>
                        </Row>
                        <Row style={{ textAlign: "center" }}>
                            <Col xs={12}>
                                <Button 
                                    type="button"
                                    btype={BTYPES.TEXTED} 
                                    color={theme.colors.yellow}
                                    onClick={() => toggleModal(true, 0)}>
                                        update picture
                                </Button>
                                <Hr/>
                                {shownModals[0] && (
                                    <ModalContainer onClick={() => toggleModal(false, 0)}>
                                        <ModalCard onClick={(e) => e.stopPropagation()}>
                                            <Label>Update profile avatar</Label>
                                            <Body>Select a new picture from your machine:</Body>
                                            <FileUpload
                                                theme={theme}
                                                name="avatar"
                                                selectBtn=""
                                                accepts="image/png, image/jpg, image/jpeg" 
                                                onUploadSuccess={updateAvatar}
                                                user={props.user}
                                                setSubmitting={setSubmitting}
                                                submitting={submitting}
                                                setErrors={setErrors}
                                                errors={errors}
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
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "10px" }}>
                            <Col sm={12} md={6}>
                                <Label>First name:</Label>
                                <br/>
                                <FField
                                    type="text"
                                    required
                                    onChange={formProps.handleChange}
                                    placeholder={PLACEHOLDER.FIRST_NAME}
                                    name="firstName"
                                    value={formProps.values.firstName || ""}
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            firstName: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            firstName: ""
                                        }))
                                    }
                                    error={ ((formProps.errors.firstName && formProps.touched.firstName) || errors?.firstName) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.firstName}
                                    formikTouched={formProps.touched.firstName}
                                    stateError={errors?.firstName}
                                /> 
                            </Col>
                            <Col sm={12} md={6}>
                                <Label>Last name:</Label>
                                <br/>
                                <FField
                                    type="text"
                                    required
                                    onChange={formProps.handleChange}
                                    name="lastName"
                                    placeholder={PLACEHOLDER.LAST_NAME}
                                    value={formProps.values.lastName || ""}
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            lastName: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            lastName: ""
                                        }))
                                    }
                                    error={ ((formProps.errors.lastName && formProps.touched.lastName) || errors?.lastName) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.lastName}
                                    formikTouched={formProps.touched.lastName}
                                    stateError={errors?.lastName}
                                /> 
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "10px" }}>
                            <Col xs={12}>
                                <Label>Email:</Label>&nbsp;
                                <br/>
                                <FField
                                    type="text"
                                    required
                                    onChange={formProps.handleChange}
                                    placeholder={PLACEHOLDER.EMAIL}
                                    name="email"
                                    value={formProps.values.email || ""}
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            email: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            email: ""
                                        }))
                                    }
                                    error={ ((formProps.errors.email && formProps.touched.email) || errors?.email) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.email}
                                    formikTouched={formProps.touched.email}
                                    stateError={errors?.email}
                                /> 
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "10px" }}>
                            <Col xs={12}>
                                <Label>Phone:</Label>
                                <br/>
                                <FField
                                    type="phone"
                                    onChange={formProps.handleChange}
                                    placeholder={PLACEHOLDER.PHONE}
                                    name="phone"
                                    value={formProps.values.phone || ""}
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            phone: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            phone: ""
                                        }))
                                    }
                                    error={ ((formProps.errors.phone && formProps.touched.phone) || errors?.phone) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.phone}
                                    formikTouched={formProps.touched.phone}
                                    stateError={errors?.phone}
                                /> 
                            </Col>
                        </Row>
                        {formProps.dirty && (
                            <Row center="xs">
                                <Col xs={12}>
                                    <Button
                                        type="submit"
                                        disabled={submitting.updateUser}
                                    >
                                        Submit changes
                                    </Button>
                                </Col>
                            </Row>
                        )}
                        <Hr/>
                        <Row align="center" style={{ marginBottom: "10px", textAlign: "center" }}>
                            <Col sm={12} md={4}>
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
                            </Col>
                            <Col sm={12} md={4}>
                                <Label>Account created:&nbsp;</Label> 
                                <Body margin="0" display="inline">{readTimestamp(props.user.timestamp).date} @ {readTimestamp(props.user.timestamp).time}</Body>
                            </Col>
                            <Col sm={12} md={4}>
                                {!props.fireUser.emailVerified && !emailVerifySent && (
                                    <Button type="button" onClick={() => sendEmailVerifyLink()} color={theme.colors.green}>
                                        Verify Email
                                    </Button>
                                )}
                                {emailVerifySent && !refreshButtonShown && (
                                    <Body color={theme.colors.yellow}>Email sent, check your email inbox!</Body>
                                )}
                                {emailVerifySent && refreshButtonShown && (
                                    <Button type="button" onClick={() => navigate(0)} btype={BTYPES.INVERTED} color={theme.colors.green}>
                                       <AiOutlineReload /> Reload page
                                    </Button>
                                )}
                                {props.fireUser.emailVerified && (
                                    <Body color={theme.colors.green}><BiCheck /> Email verified!</Body>
                                )}
                            </Col>
                        </Row>
                    </Container>
                </Form>
                )}
            </Formik> */}
            
                
        </>
    )
}

export default Profile;