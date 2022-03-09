import React, { Component } from 'react';
import { Form, Formik } from "formik";
import { Grid, Row, Col } from 'react-flexbox-grid';
import { toast } from 'react-toastify';
import { RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';
import { withTheme } from 'styled-components';

import { withRouter } from '../../../../utils/hocs';
import { auth } from "../../../../Fire.js";
import { signInSchema } from "../../../../utils/formSchemas"
import { Centered, Hr, LgContainer, Recaptcha, Wrapper } from '../../../../utils/styles/misc.js';
import { ALink, Body, H1, Label, LLink, SLink } from '../../../../utils/styles/text.js';
import { FField, Input } from '../../../../utils/styles/forms.js';
import { Button } from '../../../../utils/styles/buttons.js';
import FormError from '../../../misc/FormError';
import { PLACEHOLDER } from '../../../../utils/constants';
import { Helmet } from 'react-helmet-async';

class UserLogin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            forgotExpanded: false,
            forgotEmail: ""
        }
    }

    loginUser = (values) => {
        const recaptchaToastId = toast.info('Please complete the reCAPTCHA below to continue.');
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
            'size': 'normal',
            'callback': (response) => {
                 // reCAPTCHA solved, allow signIn.
                 this.props.userLoggingIn(true);
                 signInWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        // Signed in 
                        const tempUser = userCredential.user;
                        console.log("Logged in successfully: ");
                        console.log(tempUser);
                        // Clean up
                        toast.dismiss(recaptchaToastId);
                        window.recaptchaVerifier.clear();
                        this.props.navigate("/logging-in");
                        toast.success(`Logged in successfully!`);
                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        if(error.code === "auth/multi-factor-auth-required"){
                            // TODO: add MFA to user accounts as an OPTION if admin its REQUIRED
                            console.log("MFA required.")
                        } 
                        
                        console.log("Error signing in: " + errorCode + " - " + errorMessage)
                        if(errorCode === "auth/user-not-found"){
                            toast.error(`User with that email and/or password was not found.`);
                        } else {
                            toast.error(`Error: ${errorMessage}`);
                        }
                        
                        this.setState({ submittingLoginUser: false });
                        window.recaptchaVerifier.clear();
                        this.props.userLoggingIn(false);
                    });
            },
            'expired-callback': () => {
                toast.warn('Please solve the reCAPTCHA again!');
                window.recaptchaVerifier.clear()
            }
        }, auth);
        window.recaptchaVerifier.render(); 
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
            sendPasswordResetEmail(auth, this.state.forgotEmail)
            .then(() => {
                toast.success('Check your email for a password reset link!');
                this.setState({
                    forgotExpanded: false
                })
            }).catch((error) => {
                toast.error(`Error sending password reset: ${error}`);
            });
        }
    }
  
    render() {
        return (
            <Wrapper>
                <Helmet>
                    <title>Login {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/">
                    <Button type="button">
                        <FaChevronLeft />
                        &nbsp; Return home
                    </Button>
                </LLink>
                <LgContainer>
                    <H1>Login</H1>
                    <Formik
                        initialValues={{email: "", password: ""}}
                        validationSchema={signInSchema}
                        onSubmit={(values) => {
                            this.setState({ submittingLoginUser: true })
                            this.loginUser(values);
                        }}
                    >
                        {props => (
                        <Form>
                            <Grid fluid>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Email:</Label>&nbsp;
                                        <br/>
                                        <FField
                                            type="text"
                                            required
                                            onChange={props.handleChange}
                                            placeholder={PLACEHOLDER.EMAIL}
                                            name="email"
                                            value={props.values.email || ''}
                                            onKeyUp={() => this.setState({ errors: { email: false } })}
                                            onClick={() => this.setState({ errors: { email: false } })}
                                            error={ ((props.errors.email && props.touched.email) || this.state?.errors?.email) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={props.errors.email}
                                            formikTouched={props.touched.email}
                                            stateError={this.state?.errors?.email}
                                        /> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Password: </Label>
                                        <FField
                                            type="password"
                                            required
                                            onChange={props.handleChange}
                                            name="password"
                                            autoComplete={"off"}
                                            value={props.values.password}
                                            placeholder={PLACEHOLDER.PASSWORD}
                                            onKeyUp={() => this.setState({ errors: { password: false } })}
                                            onClick={() => this.setState({ errors: { password: false } })}
                                            error={ ((props.errors.password && props.touched.password) || this.state?.errors?.password) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={props.errors.password}
                                            formikTouched={props.touched.password}
                                            stateError={this.state?.errors?.password}
                                        /> 
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <Button 
                                            type="submit"
                                            disabled={this.state.submittingLoginUser}
                                        >
                                            Log in
                                        </Button>
                                    </Col>
                                </Row>
                                <Row center="xs" style={{margin:"10px 0"}}>
                                    <Col xs={12}>
                                        <LLink margin="20px 0" to="/register">
                                            Don't have an account?
                                        </LLink>
                                    </Col>
                                </Row>
                                <Row center="xs" style={{margin:"10px 0"}}>
                                    <Col xs={12}>
                                        <SLink onClick={() => this.toggleForgot()}>Forgot password?</SLink>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <Body size="sm">This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
                                        <Recaptcha id="recaptcha" />
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                        )}
                    </Formik>

                    {this.state.forgotExpanded && (
                        <Centered>
                            <Hr/>
                            <Body>Enter your email below and we will send you an email for you to reset your password.</Body>
                            <Input 
                                type="text"
                                placeholder={PLACEHOLDER.EMAIL}
                                onChange={this.handleChange} 
                                value={this.state.forgotEmail}
                            />
                            <Button color={this.props.theme.colors.green} type="button" onClick={() => this.sendPasswordReset()}>
                                Send link
                            </Button>
                            <Hr/>
                        </Centered>
                    )}
                </LgContainer>
            </Wrapper>
        ) 
        
    }
}

export default withRouter(withTheme(UserLogin));