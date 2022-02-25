import React, { Component } from 'react';
import { Form, Formik } from "formik";
import { Grid, Row, Col } from 'react-flexbox-grid';
import { toast } from 'react-toastify';
import { RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';

import { withRouter } from '../../../utils/hocs';
import { auth } from "../../../Fire.js";
import { signInSchema } from "../../../utils/formSchemas"
import { CenteredDiv, Hr, LgContainer, Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { ALink, Body, H1, Label, LLink, SLink } from '../../../utils/styles/text.js';
import { FField, Input } from '../../../utils/styles/forms.js';
import { Button } from '../../../utils/styles/buttons.js';
import FormError from '../../misc/FormError';
import { PLACEHOLDER } from '../../../utils/constants';
import { withTheme } from 'styled-components';

class UserLogin extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            forgotExpanded: false,
            forgotEmail: ""
        }
    }

    loginUser = (values) => {
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
            'size': 'normal',
            'callback': async (response) => {
                this.setState({ loading: { loginUser: true } });
                 // reCAPTCHA solved, allow signIn.
                 signInWithEmailAndPassword(auth, values.email, values.password)
                    .then((userCredential) => {
                        // Signed in 
                        const tempUser = userCredential.user;
                        console.log("Logged in successfully: ")
                        console.log(tempUser)
                        this.props.navigate("/dashboard");
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
                        
                        window.recaptchaVerifier.clear();
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
                <LLink to="/">
                    <Button type="button">
                        <FaChevronLeft />
                        &nbsp; Return home
                    </Button>
                </LLink>
                <LgContainer>
                    <H1>User Login</H1>
                    <Formik
                        initialValues={{email: "", password: ""}}
                        validationSchema={signInSchema}
                        onSubmit={(values, actions) => {
                            this.setState({ submitting: { loginUser: true } })
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
                                            disabled={this.state?.submitting?.loginUser}
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
                        <CenteredDiv>
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
                        </CenteredDiv>
                    )}
                </LgContainer>
            </Wrapper>
        )
    }
}

export default withRouter(withTheme(UserLogin));