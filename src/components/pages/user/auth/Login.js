import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { RecaptchaVerifier, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { CgClose } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import { useForm } from "react-hook-form";

import { auth } from "../../../../Fire.js";
import { Column, Grid, LgContainer, ModalCard, ModalContainer, Recaptcha, Row, Wrapper } from '../../../../utils/styles/misc.js';
import { ALink, Body, H1, H2, Label, LLink, SLink } from '../../../../utils/styles/text.js';
import { FormError } from '../../../misc/Misc';
import { INPUT, SIZES } from '../../../../utils/constants.js';
import { TextInput, Button } from '../../../../utils/styles/forms.js';

function UserLogin(props) {
    const navigate = useNavigate();
    const theme = useTheme();
    const [forgotExpanded, setForgotExpanded] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [submitting, setSubmitting] = useState({ 
        login: false,
    }); 
    
    const loginForm = useForm({
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const loginUser = (data) => {
        const recaptchaToastId = toast.info('Please complete the reCAPTCHA below to continue.');
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
            'size': 'normal',
            'callback': (response) => {
                 // reCAPTCHA solved, allow signIn.
                 props.setIsLoggingIn(true);
                 signInWithEmailAndPassword(auth, data.email, data.password)
                    .then((userCredential) => {
                        // Signed in 
                        const tempUser = userCredential.user;
                        console.log("Logged in successfully: ");
                        console.log(tempUser);
                        // Clean up
                        toast.dismiss(recaptchaToastId);
                        window.recaptchaVerifier.clear();
                        navigate("/logging-in");
                        toast.success(`Logged in successfully!`);
                    }).catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        
                        console.log("Error signing in: " + errorCode + " - " + errorMessage);
                        if(errorCode === "auth/user-not-found" || errorCode === "auth/wrong-password"){
                            toast.error(`Email or password was not accepted, please try another combination.`);
                        } else {
                            toast.error(`Error: ${errorMessage}`);
                        }
                        
                        // Clean up
                        setSubmitting(prevState => ({
                            ...prevState,
                            login: false
                        }));
                        window.recaptchaVerifier.clear();
                        props.setIsLoggingIn(false);
                        toast.dismiss(recaptchaToastId);
                    });
            },
            'expired-callback': () => {
                toast.warn('Please solve the reCAPTCHA again!');
                window.recaptchaVerifier.clear();
            }
        }, auth);
        window.recaptchaVerifier.render(); 
    }
    
    const toggleModal = () => {
        setForgotEmail("");
        setForgotExpanded(!forgotExpanded);
    }

    const sendPasswordReset = () => {
        if(forgotEmail){
            sendPasswordResetEmail(auth, forgotEmail).then(() => {
                toast.success('Check your email for a password reset link!');
                setForgotExpanded(false);
            }).catch((error) => {
                toast.error(`Error sending password reset: ${error}`);
            });
        }
    }
  
    return (
        <Wrapper>
            <Helmet>
                <title>Login {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Return home
                </Button>
            </LLink>
            <LgContainer>
                <form onSubmit={ loginForm.handleSubmit(loginUser) }>
                    <Grid fluid>
                        <Row justify="center">
                            <Column md={12} lg={8}>
                                <H1>Login</H1>
                            </Column>
                        </Row>
                        <Row justify="center">
                            <Column md={12} lg={8}>
                                <Label htmlFor={INPUT.EMAIL.VALUE} br>Email:</Label>
                                <TextInput
                                    type="text" 
                                    error={loginForm.formState.errors[INPUT.EMAIL.VALUE]}
                                    placeholder={INPUT.EMAIL.PLACEHOLDER} 
                                    {
                                        ...loginForm.register(INPUT.EMAIL.VALUE, { 
                                                required: INPUT.EMAIL.ERRORS.REQUIRED,
                                                pattern: {
                                                    value: INPUT.EMAIL.ERRORS.PATTERN.VALUE,
                                                    message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                                },
                                            }
                                        )
                                    } 
                                />
                                <FormError error={loginForm.formState.errors[INPUT.EMAIL.VALUE]} /> 
                            </Column>
                        </Row>
                        <Row justify="center">
                            <Column md={12} lg={8}>
                                <Label htmlFor={INPUT.PASSWORD.VALUE} br>Password:</Label>
                                <TextInput
                                    type="password"
                                    error={loginForm.formState.errors[INPUT.PASSWORD.VALUE]}
                                    placeholder={INPUT.PASSWORD.PLACEHOLDER} 
                                    { 
                                        ...loginForm.register(INPUT.PASSWORD.VALUE, {
                                            required: INPUT.PASSWORD.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.PASSWORD.ERRORS.MAX.VALUE,
                                                message: INPUT.PASSWORD.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.PASSWORD.ERRORS.MIN.VALUE,
                                                message: INPUT.PASSWORD.ERRORS.MIN.MESSAGE
                                            },
                                        })
                                    } 
                                />
                                <FormError error={loginForm.formState.errors[INPUT.PASSWORD.VALUE]} /> 
                            </Column>
                            
                        </Row>
                        <Row>
                            <Column md={12} align="center">
                                <Button 
                                    type="submit" 
                                    disabled={submitting.login}
                                >
                                    Submit
                                </Button>
                            </Column>
                        </Row>
                        <Row>
                            <Column md={12} align="center">
                                <LLink to="/register">
                                    Don't have an account?
                                </LLink>
                            </Column>
                        </Row>
                        <Row>
                            <Column md={12} align="center">
                                <SLink onClick={() => toggleModal()}>Forgot password?</SLink>
                            </Column>
                        </Row>
                        <Row>
                            <Column md={12} align="center">
                                <Body size={SIZES.SM}>This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
                                <Recaptcha id="recaptcha" />
                            </Column>
                        </Row>
                    </Grid>
                </form>

                {forgotExpanded && (
                    <ModalContainer onClick={() => toggleModal()}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H2>Forgot Password</H2>
                            <Body>Enter your email below and we will send you an email for you to reset your password.</Body>
                            <TextInput 
                                type="text"
                                placeholder={INPUT.EMAIL.PLACEHOLDER}
                                onChange={(e) => setForgotEmail(e.target.value)} 
                                value={forgotEmail}
                            />
                            <Button color={theme.colors.green} type="button" onClick={() => sendPasswordReset()}>
                                Send password reset link
                            </Button>
                            <Button 
                                type="button"
                                color={theme.colors.red}
                                size={SIZES.SM}
                                onClick={() => toggleModal()}
                            >
                                <CgClose /> Cancel 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}
            </LgContainer>
        </Wrapper>
    ) 
}

export default UserLogin;