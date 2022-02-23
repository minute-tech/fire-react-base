import React, { Component } from 'react';
import { Form, Formik } from "formik";
import { Grid, Row, Col } from 'react-flexbox-grid';
import { toast } from 'react-toastify';
import { RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

import { withRouter } from '../../../utils/hocs';
import { auth } from "../../../Fire.js";
import { signInSchema } from "../../../utils/formSchemas"
import { Hr, LgContainer, Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { Body, H1, Label, LLink, SLink } from '../../../utils/styles/text.js';
import { FField, Input } from '../../../utils/styles/forms.js';
import { Button } from '../../../utils/styles/buttons.js';
import FormError from '../../misc/FormError';

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
                        const user = userCredential.user;
                        console.log("Logged in successfully: ")
                        console.log(user)
                        this.props.navigate("/user/dashboard");
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
                        <i className="fas fa-chevron-left" />
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
                                            placeholder="john_doe@email.com"
                                            name="email"
                                            value={props.values.email || ''}
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
                                            placeholder="*********************"
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
                                <Row center="xs">
                                    <Col xs={12}>
                                        <LLink to="/user/register">
                                            Don't have an account?
                                        </LLink>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <SLink onClick={() => this.toggleForgot()}>Forgot password?</SLink>
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

                    {this.state.forgotExpanded && (
                        <div>
                            <Hr/>
                            <Body>Enter your email below and we will send you an email for you to reset your password.</Body>
                            <Input 
                                type="text"
                                placeholder="john_doe@email.com" 
                                onChange={this.handleChange} 
                                value={this.state.forgotEmail}
                            />
                            <Button color={this.props.theme.colors.green} type="button" onClick={() => this.sendPasswordReset()}>
                                Send link
                            </Button>
                            <Hr/>
                        </div>
                    )}
                </LgContainer>
            </Wrapper>
        )
    }
}

export default withRouter(UserLogin);