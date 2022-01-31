import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
import { store } from 'react-notifications-component';

import { withRouter } from '../../../utils/misc';
import { firebase, firestore, fire } from "../../../Fire.js";
import { userRegisterSchema } from "../../../utils/formSchemas"
import { Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { FField } from '../../../utils/styles/forms.js';
import { H1, Label, LLink, RedText } from '../../../utils/styles/text.js';
import { MdBlackToInvBtn, MdGreenToInvBtn } from '../../../utils/styles/buttons.js';
import { NOTIFICATION } from '../../../utils/constants.js';

class UserRegister extends Component {
    addUser = (values) => {
        if (values.confirmPassword === values.password) {
                store.addNotification({
                    title: "reCAPTCHA",
                    message: `Please complete the reCAPTCHA below to continue.`,
                    type: "success",
                    ...NOTIFICATION
                })
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
                'callback': (response) => {
                // reCAPTCHA solved, allow Ask.
                fire.auth().createUserWithEmailAndPassword(values.email, values.password)
                    .then((userData) => {
                        // No existing user, now add to Firestore
                        var currentUser = fire.auth().currentUser;
                        currentUser.updateProfile({
                            displayName: (values.firstName + " " + values.lastName)
                        }).then(() => {
                            console.log("Successfully added display name to Firebase.");
                        }).catch((error) => {
                            console.error("Error adding your display name to database: ", error);
                            store.addNotification({
                                title: "Error",
                                message: `Error adding your display name to database: ${error}`,
                                type: "danger",
                                ...NOTIFICATION
                            })
                            window.recaptchaVerifier.clear()
                        });

                        firestore.collection("users").doc(userData.user.uid).set({
                            firstName: values.firstName,
                            lastName: values.lastName,
                            email: values.email,
                            phone: values.phone,
                            timestamp: Date.now(),
                        }, { merge: true }).then(() => {
                            console.log("Successful write to Firestore.");
                        }).catch((error) => {
                            console.error("Error adding document: ", error);
                            store.addNotification({
                                title: "Error",
                                message: `Error adding document: ${error}`,
                                type: "danger",
                                ...NOTIFICATION
                            })
                            window.recaptchaVerifier.clear()
                        });

                        this.props.history.push("/user/logging-in"); // This was moved outside the firestore doc set above so the "you must be signed out to view this page" alert doesnt show

                    }).catch((error) => {
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log("Error registering: " + errorCode + ": " + errorMessage)
                        store.addNotification({
                            title: "Error",
                            message: `Error registering: ${errorMessage}`,
                            type: "danger",
                            ...NOTIFICATION
                        })
                        window.recaptchaVerifier.clear()
                    });
                },
                'expired-callback': () => {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    store.addNotification({
                        title: "Timeout",
                        message: `Please solve the reCAPTCHA again.`,
                        type: "danger",
                        ...NOTIFICATION
                    })
                    window.recaptchaVerifier.clear()
                }
            })
            window.recaptchaVerifier.render()
        } else {
            store.addNotification({
                title: "Error",
                message: `Passwords must match!`,
                type: "danger",
                ...NOTIFICATION
            })
        }
        
      }
    render() {
        const initialFormState = {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
        };

        return (
            <Wrapper>
                <Link to="/">
                    <MdBlackToInvBtn type="button">
                        <i className="fas fa-chevron-left" />
                        &nbsp; Return home
                    </MdBlackToInvBtn>
                </Link>
                <H1>User Register</H1>
                <Formik
                    initialValues={initialFormState}
                    validationSchema={userRegisterSchema}
                    onSubmit={(values, actions) => {
                        this.addUser(values)
                    }}
                >
                    {props => (
                    <Form>
                        <Grid fluid>
                            <Row>
                                <Col xs={12} sm={6}>
                                    <Label htmlFor="firstName">First name: </Label>
                                    <FField
                                        type="text"
                                        onChange={props.handleChange}
                                        name="firstName"
                                        value={props.values.firstName}
                                        placeholder="John"
                                    />  
                                    {props.errors.firstName && props.touched.firstName ? (
                                        <RedText>{props.errors.firstName}</RedText>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                                <Col xs={12} sm={6}>
                                    <Label htmlFor="lastName">Last name: </Label>
                                    <FField
                                        type="text"
                                        onChange={props.handleChange}
                                        name="lastName"
                                        value={props.values.lastName}
                                        placeholder="Doe"
                                    />
                                    {props.errors.lastName && props.touched.lastName ? (
                                        <RedText>{props.errors.lastName}</RedText>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <Label htmlFor="email">Email: </Label>
                                    <FField
                                        type="email"
                                        onChange={props.handleChange}
                                        name="email"
                                        value={props.values.email}
                                        placeholder="john_doe@email.com"
                                    />
                                    {props.errors.email && props.touched.email ? (
                                        <RedText>{props.errors.email}</RedText>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6}>
                                    <Label htmlFor="password">Password: </Label>
                                    <FField
                                        type="password"
                                        onChange={props.handleChange}
                                        name="password"
                                        autoComplete={"off"}
                                        value={props.values.password}
                                        placeholder="*********************"
                                    />
                                    {props.errors.password && props.touched.password ? (
                                        <RedText>{props.errors.password}</RedText>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                                <Col xs={12} md={6}>
                                    <Label htmlFor="confirmPassword">Confirm password: </Label>
                                    <FField
                                        type="password"
                                        onChange={props.handleChange}
                                        name="confirmPassword"
                                        autoComplete={"off"}
                                        value={props.values.confirmPassword}
                                        placeholder="*********************"
                                    />
                                    {props.errors.confirmPassword && props.touched.confirmPassword ? (
                                        <RedText>{props.errors.confirmPassword}</RedText>
                                    ) : (
                                        ""
                                    )}
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                        Submit
                                    </MdGreenToInvBtn>
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <LLink to="/user/login">
                                        Already have an account?
                                    </LLink>
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <Recaptcha id="recaptcha" />
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                    )}
                </Formik>
            </Wrapper>
        )
    }
}

export default withRouter(UserRegister);