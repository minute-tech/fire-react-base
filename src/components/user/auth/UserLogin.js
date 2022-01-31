import React, { Component } from 'react';
import { Form, Formik } from "formik";
import { store } from 'react-notifications-component';
import { Grid, Row, Col } from 'react-flexbox-grid';

import { withRouter } from '../../../utils/misc';
import { firebase, fire } from "../../../Fire.js";
import { signInSchema, checkVCodeSchema } from "../../../utils/formSchemas"
import { CenteredDiv, Hr, LgContainer, Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { H1, Label, LLink, MdBody, RedText, SLink } from '../../../utils/styles/text.js';
import { MdBlackToInvBtn, MdGreenToInvBtn } from '../../../utils/styles/buttons.js';
import { FField, Input } from '../../../utils/styles/forms.js';
import { NOTIFICATION } from '../../../utils/constants.js';

class UserLogin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            forgotExpanded: false,
            vCode: "",
            forgotEmail: "",
            loginCodeSent: false
        }
    }

    logIn = (values) => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha', {
          'callback': (response) => {
            // reCAPTCHA solved, allow signIn.
            fire.auth().signInWithEmailAndPassword(values.email, values.password)
                .then((user) => {
                    console.log("Sign in success!")
                    this.props.history.push("/user/logging-in");
                    window.location.reload();
                }).catch((error) => {
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    let resolver;
                    if(error.code === "auth/multi-factor-auth-required"){
                        resolver = error.resolver;
                        let phoneInfoOptions = {
                            multiFactorHint: resolver.hints[0],
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
                        console.log("Error signing in: " + errorCode + ": " + errorMessage)
                        store.addNotification({
                            title: "Error",
                            message: `Error signing in: ${errorMessage}`,
                            type: "danger",
                            ...NOTIFICATION
                          })
                        window.recaptchaVerifier.clear();
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
                vCode: ""
            })

            this.props.history.push("/user/logging-in");
            window.location.reload();
            
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

    handleChange = (event) => {
        this.setState({ forgotEmail: event.target.value });
    }    

    toggleForgot = () => {
        this.setState({
            forgotExpanded: !this.state.forgotExpanded
        })
    }

    sendPasswordReset = () => {
        if(this.state.forgotEmail){
            firebase.auth().sendPasswordResetEmail(this.state.forgotEmail).then(() => {
                store.addNotification({
                    title: "Email sent",
                    message: `Check your email for a password reset link!`,
                    type: "success",
                    ...NOTIFICATION
                })

                this.setState({
                    forgotExpanded: false
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
    }
  
    render() {
        // TODO: need to separate a lot of these conditional statements (and admin profile page as well)
        return (
            <Wrapper>
                <LLink to="/">
                    <MdBlackToInvBtn type="button">
                        <i className="fas fa-chevron-left" />
                        &nbsp; Return home
                    </MdBlackToInvBtn>
                </LLink>
                <LgContainer>
                    <H1>User Login</H1>
                    {!this.state.loginCodeSent && (
                        <Formik
                            initialValues={{email: "", password: ""}}
                            validationSchema={signInSchema}
                            onSubmit={(values, actions) => {
                                this.logIn(values);
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
                                        Log in
                                    </MdGreenToInvBtn>
                                    <br/><br/>
                                    <LLink to="/user/register">Don't have an account?</LLink>
                                    <br/><br/>
                                    <SLink onClick={() => this.toggleForgot()}>Forgot password?</SLink>
                                </CenteredDiv>
                            </Form>
                            )}
                        </Formik>
                    )}
                    
                    {this.state.loginCodeSent && (
                        <>
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
                                        <Col>
                                            <MdBody>We sent you a verification code to your phone number on file, please enter the code you received below.</MdBody>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <FField
                                            type="text"
                                            onChange={props.handleChange}
                                            name="vCode"
                                            value={props.values.vCode}
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
                        
                    <CenteredDiv>
                        <Recaptcha id="recaptcha" />
                    </CenteredDiv>

                    {this.state.forgotExpanded && (
                        <div>
                            <Hr/>
                            <MdBody>Enter your email below and we will send you an email for you to reset your password.</MdBody>
                            <Input 
                                type="text"
                                placeholder="john_doe@email.com" 
                                onChange={this.handleChange} 
                                value={this.state.forgotEmail}
                            />
                            <MdGreenToInvBtn type="button" onClick={() => this.sendPasswordReset()}>
                                Send link
                            </MdGreenToInvBtn>
                            <Hr/>
                        </div>
                    )}
                </LgContainer>
            </Wrapper>
        )
    }
}

export default withRouter(UserLogin);