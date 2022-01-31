import React, { Component } from 'react'
import { store } from 'react-notifications-component';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';

import { withRouter } from '../../../utils/misc';
import { NOTIFICATION } from '../../../utils/constants.js';
import { firestore, firebase } from "../../../Fire.js";
import { updateProfileSchema, updateProfilePhoneSchema, checkVCodeSchema, signInSchema } from "../../../utils/formSchemas"
import { CenteredDiv, Hr, Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { FField } from '../../../utils/styles/forms.js';
import { H1, Label, RedText, H2, LLink, GreenHoverText, SmText, H3, MdBody, MdText } from '../../../utils/styles/text.js';
import { MdGreenToInvBtn, MdInvToPrimaryBtn, MdPrimaryToInvBtn } from '../../../utils/styles/buttons.js';
import FormError from '../../misc/FormError.js';

class UserProfile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             user: "",
             reauthingUser: false,
             newCodeSent: false,
             loginCodeSent: false,
             verifyingCode: false,
             vCode: "",
             loading: {
                user: true
             }
        }
    }

    componentDidMount(){
        this.unsubscribeUser = firestore.collection("users").doc(this.props.user.uid)
            .onSnapshot((doc) => {
                if(doc.exists){
                    let docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    this.setState({
                        user: docWithMore,
                        loading: {
                            user: false
                        }
                    })
                } else {
                    console.error("User doesn't exist.")
                }
            });
    }
  
    componentWillUnmount() {
        if(this.unsubscribeUser){
            this.unsubscribeUser();
        }
    }

    updateProfile = (values) => {
        firestore.collection("users").doc(this.props.user.uid).update({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email
        }).then(() => {
            console.log("Successful updated user on Firestore.");
            store.addNotification({
                title: "Success",
                message: `Successfully updated your profile details.`,
                type: "success",
                ...NOTIFICATION
            })
        }).catch((error) => {
            console.error("Error updating user document: ", error);
            store.addNotification({
                title: "Error",
                message: `Error updating user details: ${error}`,
                type: "danger",
                ...NOTIFICATION
            })
        });   
    }

    resendVerify = () => {
        let currentUser = firebase.auth().currentUser;
        currentUser.sendEmailVerification().then(() => {
            console.log("Email verification sent!")
            store.addNotification({
                title: "Sent",
                message: `Email verification sent, please check your inbox!`,
                type: "success",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 3000,
                    onScreen: true,
                    pauseOnHover: true
                }
            })
          }).catch((error) => {
            console.error("Error sending email verification link: " + error)
            store.addNotification({
                title: "Error",
                message: `Error sending email verification link: ${error}`,
                type: "danger",
                insert: "top",
                container: "top-center",
                animationIn: ["animate__animated", "animate__fadeIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                    duration: 5000,
                    onScreen: true,
                    pauseOnHover: true
                }
            })
          });
    }

    reauthUser = (values) => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
            'callback': (response) => {
                // reCAPTCHA solved, allow signIn.
                const user = firebase.auth().currentUser;

                let credentials = firebase.auth.EmailAuthProvider.credential(
                    values.email,
                    values.password
                );

                user.reauthenticateWithCredential(credentials).then(() => {
                    // First time users will go this path
                    this.setState({ verifyingCode: true, reauthingUser: false })
                    window.recaptchaVerifier.clear()
                }).catch((error) => {
                    if(error.code === "auth/multi-factor-auth-required"){
                        let resolver = error.resolver;
                        let phoneInfoOptions = {
                            multiFactorHint: resolver.hints[0], // Just grabbing first factor source (phone)
                            session: resolver.session
                        };
                        let phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
                        // Send SMS verification code.
                        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier).then((verificationId) => {
                            this.setState({
                                loginCodeSent: true,
                                verificationId: verificationId,
                                resolver: resolver
                            })
                            
                            store.addNotification({
                                title: "Success",
                                message: `We just sent that phone number a verification code, go grab the code and input it below!`,
                                type: "success",
                                ...NOTIFICATION
                            })
                            window.recaptchaVerifier.clear()
                        }).catch((error) => {
                            console.error("Error adding phone: ", error);
                            store.addNotification({
                                title: "Error",
                                message: `Error adding phone: ${error.message}`,
                                type: "danger",
                                ...NOTIFICATION
                            })
                            window.recaptchaVerifier.clear()
                        });
                    } else {
                        console.error("Error logging you in, please try again: " + error)
                        store.addNotification({
                            title: "Error",
                            message: `Error logging you in, please try again: ${error}`,
                            type: "danger",
                            ...NOTIFICATION
                        })
                        
                        window.recaptchaVerifier.clear()
                    }
                    
                });
            },
            'expired-callback': () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              store.addNotification({
                  title: "Timeout",
                  message: `Please solve the reCAPTCHA again!`,
                  type: "danger",
                  ...NOTIFICATION
                })
              window.recaptchaVerifier.clear()
            }
          })
          window.recaptchaVerifier.render()
    }

    getAttemptedLoginCode = (values) => {
        let cred = firebase.auth.PhoneAuthProvider.credential(this.state.verificationId, values.vCode);
        let multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);

        // Complete sign-in.
        this.state.resolver.resolveSignIn(multiFactorAssertion).then((userCredential) => {
            // User successfully signed in with the second factor phone number.
            store.addNotification({
                title: "Success",
                message: `Successfully logged in with two factor authentication!`,
                type: "success",
                ...NOTIFICATION
            })

            this.setState({
                loginCodeSent: false,
                verifyingCode: true, 
                reauthingUser: false,
                vCode: ""
            })
        }).catch(error => {
            if(error.code === "auth/invalid-verification-code"){
                console.error(`The code you entered was not correct, please try again.`)
                store.addNotification({
                    title: "Error",
                    message: `The code you entered was not correct, please try again.`,
                    type: "danger",
                    ...NOTIFICATION
                })
            } else { 
                console.error(`Error with entered code: ${error}`)
                store.addNotification({
                    title: "Error",
                    message: `Error with entered code: ${error.message}`,
                    type: "danger",
                    ...NOTIFICATION
                })
            }
            
        });
    }

    sendVerificationCode = (values) => {
        if(values.phone.substring(0, 2) !== "+1"){
            store.addNotification({
                title: "Phone wrong format",
                message: `Please reformat your phone number to international format such as: +1 234 567 8901`,
                type: "warning",
                ...NOTIFICATION
              })
        } else {
            store.addNotification({
                title: "reCAPTCHA",
                message: `Please complete the reCAPTCHA below to continue.`,
                type: "success",
                ...NOTIFICATION
              })
        
            
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
                'callback': (response) => {
                    this.props.user.multiFactor.getSession().then((multiFactorSession) => {
                        // Specify the phone number and pass the MFA session.
                        let phoneInfoOptions = {
                            phoneNumber: values.phone,
                            session: multiFactorSession
                        };
                        let phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
                        // Send SMS verification code.
                        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, window.recaptchaVerifier).then((verificationId) => {
                            this.setState({
                                newCodeSent: true,
                                verificationId: verificationId,
                                enteredPhone: values.phone
                            })
                            
                            store.addNotification({
                                title: "Success",
                                message: `We just sent that phone number a verification code, go grab the code and input it below!`,
                                type: "success",
                                ...NOTIFICATION
                              })
                            window.recaptchaVerifier.clear()
                        }).catch((error) => {
                            console.error("Error adding phone: ", error);
                            store.addNotification({
                              title: "Error",
                              message: `Error adding phone: ${error.message}`,
                              type: "danger",
                              ...NOTIFICATION
                            })
                            window.recaptchaVerifier.clear()
                        });
                    }).catch((error) => {
                        console.error("Error adding multi-factor authentication: ", error);
                        store.addNotification({
                          title: "Error",
                          message: `Error adding multi-factor authentication: ${error}`,
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
               });
               
               window.recaptchaVerifier.render()
        }
        
    }

    getAttemptedNewCode = (values) => {
        let cred = firebase.auth.PhoneAuthProvider.credential(this.state.verificationId, values.vCode);
        let multiFactorAssertion = firebase.auth.PhoneMultiFactorGenerator.assertion(cred);
        this.props.user.multiFactor.enroll(multiFactorAssertion, this.props.user.userName).then(response => {
            store.addNotification({
                title: "Success",
                message: `Successfully added a backup phone number!`,
                type: "success",
                ...NOTIFICATION
            })

            if(this.state.user.phone){
                // Unenroll old phone number if user has one
                this.props.user.multiFactor.unenroll(this.props.user.multiFactor.enrolledFactors[0]).then(() => {
                    console.log("Successful removed old phone.");
                }).catch((error) => {
                    console.error("Error removing old phone", error);
                });
            }
            
            firestore.collection("users").doc(this.props.user.uid).update({
                phone: this.state.enteredPhone
            }).then(() => {
                console.log("Successful updated user on Firestore.");
            }).catch((error) => {
                console.error("Error updating user document: ", error);
                store.addNotification({
                    title: "Error",
                    message: `Error updating user details: ${error}`,
                    type: "danger",
                    ...NOTIFICATION
                })
            });  
            
            this.setState({
                reauthingUser: false,
                newCodeSent: false,
                verifyingCode: false,
                vCode: ""
            })
        }).catch(error => {
            store.addNotification({
                title: "Error",
                message: `Error with entered code: ${error.message}`,
                type: "danger",
                ...NOTIFICATION
            })
        });
    }

    // TODO add input for email for me
    sendPasswordReset = (email) => {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            store.addNotification({
                title: "Email sent",
                message: `Password reset email sent to user's email on file.`,
                type: "success",
                ...NOTIFICATION
            })
        }).catch((error) => {
            store.addNotification({
                title: "Error",
                message: `Error signing in: ${error}`,
                type: "danger",
                ...NOTIFICATION
            })
        });
    }

    render() {
        // TODO: simplify me omg, break into steps on flow chart
        if(this.state.loading.user){
            return (
                <Wrapper>
                    <H2>Loading...</H2>
                </Wrapper>
            )
        } else {
            return (
                <Wrapper>
                    <LLink to={`/user/dashboard`}> 
                        <MdInvToPrimaryBtn type="button">
                            <i className="fas fa-chevron-left" />&nbsp; Return to user dashboard
                        </MdInvToPrimaryBtn>
                    </LLink>
                    <H1>User Profile</H1>
                    {/* Step 1. Check if user email is verified before continuing */}
                    {!this.props.user.emailVerified && ( 
                        <>
                        <H3>Please verify your email</H3>
                        <MdPrimaryToInvBtn type="button" onClick={() => this.resendVerify()}>
                            Send email verification link
                        </MdPrimaryToInvBtn>
                        <MdInvToPrimaryBtn type="button" onClick={() => window.location.reload()}>
                            <i className="fas fa-redo" />&nbsp; Reload to check
                        </MdInvToPrimaryBtn>
                        </>
                    )}
                    {/* Step 2. Check if MFA is added */}
                    {this.props.user.emailVerified && this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0 && !this.state.reauthingUser && !this.state.verifyingCode && !this.state.newCodeSent && (
                        <>
                        <H3>Please add a phone number for multi-factor authentication</H3>
                        <MdPrimaryToInvBtn type="button" onClick={() => this.setState({ reauthingUser: true })}>
                            Start process
                        </MdPrimaryToInvBtn>
                        </>
                    )}
                    {this.props.user.emailVerified && (
                        <>
                        {/* Step 3. If they have MFA added and email verified they will start here */}
                        {!this.state.reauthingUser && !this.state.newCodeSent && !this.state.loginCodeSent && !this.state.verifyingCode && !(this.props.user?.multiFactor?.enrolledFactors && this.props.user.multiFactor.enrolledFactors.length === 0) && (
                            <Formik
                                initialValues={{
                                    firstName: this.state.user.firstName,
                                    lastName: this.state.user.lastName,
                                    email: this.state.user.email,
                                    phone: this.state.user.phone
                                }}
                                enableReinitialize={true}
                                validationSchema={updateProfileSchema}
                                onSubmit={(values, actions) => {
                                    this.updateProfile(values);
                                    actions.resetForm();
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
                                                    error={ ((props.errors.firstName && props.touched.firstName) || this.state?.errors?.firstName) ? 1 : 0 }
                                                /> 
                                                <FormError
                                                    yupError={props.errors.firstName}
                                                    formikTouched={props.touched.firstName}
                                                    stateError={this.state?.errors?.firstName}
                                                /> 
                                            </Col>
                                            <Col xs={12} sm={6}>
                                                <Label htmlFor="lastName">Last name: </Label>
                                                <FField
                                                    type="text"
                                                    onChange={props.handleChange}
                                                    name="lastName"
                                                    value={props.values.lastName}
                                                    error={props.errors.lastName}
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
                                                <Label htmlFor="email">Email: </Label>&nbsp;<SmText>cannot change email</SmText>
                                                <FField
                                                    type="email"
                                                    onChange={props.handleChange}
                                                    disabled={true}
                                                    name="email"
                                                    value={props.values.email}
                                                    error={props.errors.email}
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
                                            <Col xs={12}>
                                                <Label htmlFor="phone">Phone: </Label>
                                                <MdText><RedText> <GreenHoverText onClick={() => this.setState({reauthingUser: true})}>update phone</GreenHoverText></RedText></MdText>
                                                <FField
                                                    type="phone"
                                                    disabled={true}
                                                    onChange={props.handleChange}
                                                    name="phone"
                                                    value={props.values.phone}
                                                    error={props.errors.phone}
                                                    placeholder="+1 (123) 456-7890"
                                                />
                                            </Col>
                                        </Row>
                                        <Row center="xs">
                                            <Col xs={12}>
                                                <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                                    Update
                                                </MdGreenToInvBtn>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </Form>
                                )}
                            </Formik>
                        )}

                        {/* Step 4. If they wish to change their phone number, auth first */}
                        {this.state.reauthingUser && !this.state.loginCodeSent && (
                            <>
                            <H3>Please reauthenticate first</H3>
                            <Formik
                                initialValues={{email: "", password: ""}}
                                validationSchema={signInSchema}
                                onSubmit={(values, actions) => {
                                    this.reauthUser(values);
                                }}
                            >
                                {props => (
                                <Form>
                                    <Label htmlFor="email">Email: </Label>
                                    <br/>
                                    <FField
                                        type="email"
                                        onChange={props.handleChange}
                                        name="email"
                                        value={props.values.email}
                                        error={props.errors.email}
                                        placeholder="john_doe@email.com"
                                    />
                                    <br/>
                                    {props.errors.email && props.touched.email ? (
                                        <RedText>{props.errors.email}</RedText>
                                    ) : (
                                        ""
                                    )}
                                    
                                    <br/>
                                    <Label htmlFor="password">Password: </Label>
                                    <br/>
                                    <FField
                                        type="password"
                                        onChange={props.handleChange}
                                        name="password"
                                        autoComplete={"on"}
                                        value={props.values.password}
                                        error={props.errors.password}
                                        placeholder="*********************"
                                    />
                                    <br/>
                                    {props.errors.password && props.touched.password ? (
                                        <RedText>{props.errors.password}</RedText>
                                    ) : (
                                        ""
                                    )}
                                    <br /><br />
                                    <CenteredDiv>
                                        <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                            Submit
                                        </MdGreenToInvBtn>
                                    </CenteredDiv>
                                </Form>
                                )}
                            </Formik>
                            </>
                        )}
                        {/* Step 5. They will need to auth with 2FA on their phone here */}
                        {this.state.loginCodeSent && (
                            <>
                            <Hr/>
                            <H3>Check your phone</H3>
                            <MdBody>We sent a code to the phone number you just entered. Go check it and input the code below.</MdBody>
                            <Formik
                                initialValues={{
                                    vCode: ""
                                }}
                                enableReinitialize={true}
                                validationSchema={checkVCodeSchema}
                                onSubmit={(values, actions) => {
                                    this.getAttemptedLoginCode(values);
                                }}
                            >
                                {props => (
                                <Form>
                                    <Grid fluid>
                                        <Row>
                                            <FField
                                                type="text"
                                                onChange={props.handleChange}
                                                name="vCode"
                                                autoComplete={"off"}
                                                value={props.values.vCode}
                                                placeholder="123456"
                                                error={props.errors.vCode}
                                            />
                                            {props.errors.vCode && props.touched.vCode ? (
                                                <RedText>{props.errors.vCode}</RedText>
                                            ) : (
                                                ""
                                            )}
                                        </Row>
                                        <Row center="xs">
                                            <Col xs={12}>
                                                {/* TODO: add send code again button? */}
                                                <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                                    Submit verification code
                                                </MdGreenToInvBtn>
                                            </Col>
                                        </Row>
                                        
                            
                                    </Grid>
                                </Form>
                                )}
                            </Formik>
                            </>
                        )}
                        {/* Step 6. Re-authed successfully, now ask for new phone number for MFA */}
                        {this.state.verifyingCode && !this.state.newCodeSent && (
                            <>
                            <Hr/>
                            <H3>Please enter your new phone number</H3>
                            <MdBody>This will be used to send you codes to log you in and keep your account secure.</MdBody>
                            <Formik
                                initialValues={{
                                    phone: this.state.user.phone
                                }}
                                enableReinitialize={true}
                                validationSchema={updateProfilePhoneSchema}
                                onSubmit={(values, actions) => {
                                    this.sendVerificationCode(values);
                                }}
                            >
                                {props => (
                                <Form>
                                    <Grid fluid>
                                        <Row>
                                            <Col xs={12} sm={6}>
                                                <Label htmlFor="phone">Phone: </Label>
                                                <FField
                                                    type="phone"
                                                    onChange={props.handleChange}
                                                    name="phone"
                                                    value={props.values.phone}
                                                    placeholder="+1 123 456 7890"
                                                    error={props.errors.phone}
                                                />
                                                {props.errors.phone && props.touched.phone ? (
                                                    <RedText>{props.errors.phone}</RedText>
                                                ) : (
                                                    ""
                                                )}
                                            </Col>
                                        </Row>
                                        <Row center="xs">
                                            <Col xs={12}>
                                                <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                                    Send verification code
                                                </MdGreenToInvBtn>
                                            </Col>
                                        </Row>
                                        
                            
                                    </Grid>
                                </Form>
                                )}
                            </Formik>
                            </>
                        )}
                        
                        {/* Step 7. Code sent to that new phone number, ask them for it to change it */}
                        {this.state.newCodeSent && (
                            <>
                            <Hr />
                            <H3>Check your phone</H3>
                            <MdBody>We sent a code to the phone number you just entered. Go check it and input the code below.</MdBody>
                            <Formik
                                initialValues={{
                                    vCode: ""
                                }}
                                enableReinitialize={true}
                                validationSchema={checkVCodeSchema}
                                onSubmit={(values, actions) => {
                                    this.getAttemptedNewCode(values);
                                }}
                            >
                                {props => (
                                <Form>
                                    <Grid fluid>
                                        <Row>
                                            <FField
                                                type="text"
                                                onChange={props.handleChange}
                                                name="vCode"
                                                value={props.values.vCode}
                                                error={props.errors.vCode}
                                                placeholder="123456"
                                            />
                                            {props.errors.vCode && props.touched.vCode ? (
                                                <RedText>{props.errors.vCode}</RedText>
                                            ) : (
                                                ""
                                            )}
                                        </Row>
                                        <Row center="xs">
                                            <Col xs={12}>
                                                {/* TODO: add send code again button? */}
                                                <MdGreenToInvBtn type="submit" disabled={!props.dirty && !props.isSubmitting}>
                                                    Submit verification code
                                                </MdGreenToInvBtn>
                                            </Col>
                                        </Row>
                                        
                            
                                    </Grid>
                                </Form>
                                )}
                            </Formik>
                            </>
                        )}
                        
                        <Recaptcha id="recaptcha" />
                        </>
                    )}
                    
                        
                </Wrapper>
            )
        }
    }
}

export default withRouter(UserProfile);