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
import { LgContainer, ModalCard, ModalContainer, Recaptcha, Wrapper } from '../../../../utils/styles/misc.js';
import { ALink, Body, H1, H2, Label, LLink, SLink } from '../../../../utils/styles/text.js';
// import { FField, Input } from '../../../../utils/styles/forms.js';
import { Button } from '../../../../utils/styles/buttons.js';
import { FormError } from '../../../misc/Misc';
import { SIZES } from '../../../../utils/constants.js';

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
            name: "",
            email: "",
            body: "",
            policyAccept: false
        }
    });

    // ** Usage **
    // setSubmitting(prevState => ({
    //     ...prevState,
    //     login: false
    // }));


    const loginUser = (values) => {
        const recaptchaToastId = toast.info('Please complete the reCAPTCHA below to continue.');
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
            'size': 'normal',
            'callback': (response) => {
                 // reCAPTCHA solved, allow signIn.
                 props.setIsLoggingIn(true);
                 signInWithEmailAndPassword(auth, values.email, values.password)
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
                <H1>Login</H1>
                {/* <form onSubmit={ contactForm.handleSubmit(submitMessage) }>
                    <Grid fluid>
                        <Row>
                            <Column sm={12} md={6}>
                                <Label htmlFor="email" br>Email:</Label>
                                <TextInput 
                                    type="text" 
                                    placeholder={PLACEHOLDER.EMAIL} 
                                    {
                                        ...contactForm.register("email", { 
                                                required: "An email is required!",
                                                pattern: {
                                                    value: REGEX.EMAIL,
                                                    message: "This doesn't look like a valid email address."
                                                },
                                            }
                                        )
                                    } 
                                />
                                <FormError error={contactForm.formState.errors.email} /> 
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={12} md={6}>
                                <Label htmlFor="password" br>Password:</Label>
                                <TextInput 
                                    type="password" 
                                    placeholder={PLACEHOLDER.PASSWORD} 
                                    { 
                                        ...contactForm.register("password", {
                                            required: "A password is required!",
                                            maxLength: {
                                                value: 50,
                                                message: "The password can only be 150 characters long."
                                            },
                                            minLength: {
                                                value: 6,
                                                message: "The password must be at least 2 characters long."
                                            },
                                        })
                                    } 
                                />
                                <FormError error={contactForm.formState.errors.password} /> 
                            </Column>
                            
                        </Row>
                        <Row>
                            <Column xs={12} align="center">
                                <Button 
                                    type="submit" 
                                    disabled={submitting.login}
                                >
                                    Submit
                                </Button>
                            </Column>
                        </Row>
                    </Grid>
                </form> */}
                {/* <Formik
                    initialValues={{email: "", password: ""}}
                    validationSchema={signInSchema}
                    onSubmit={(values) => {
                        setSubmitting(prevState => ({
                            ...prevState,
                            login: true
                        }));
                        loginUser(values);
                    }}
                >
                    {formProps => (
                    <Form>
                        <Container fluid>
                            <Row style={{ marginBottom:"10px" }}>
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
                            <Row style={{ marginBottom:"10px" }}>
                                <Col xs={12}>
                                    <Label>Password: </Label>
                                    <FField
                                        type="password"
                                        required
                                        onChange={formProps.handleChange}
                                        name="password"
                                        value={formProps.values.password}
                                        placeholder={PLACEHOLDER.PASSWORD}
                                        onKeyUp={() => 
                                            setErrors(prevState => ({
                                                ...prevState,
                                                password: ""
                                            }))
                                        }
                                        onClick={() => 
                                            setErrors(prevState => ({
                                                ...prevState,
                                                password: ""
                                            }))
                                        }
                                        error={ ((formProps.errors.password && formProps.touched.password) || errors?.password) ? 1 : 0 }
                                    />
                                    <FormError
                                        yupError={formProps.errors.password}
                                        formikTouched={formProps.touched.password}
                                        stateError={errors?.password}
                                    /> 
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px", textAlign: "center" }}>
                                <Col xs={12}>
                                    <Button 
                                        type="submit"
                                        disabled={submitting.login}
                                    >
                                        Log in
                                    </Button>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px", textAlign: "center" }}>
                                <Col xs={12}>
                                    <LLink margin="20px 0" to="/register">
                                        Don't have an account?
                                    </LLink>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom:"10px", textAlign: "center" }}>
                                <Col xs={12}>
                                    <SLink onClick={() => toggleModal()}>Forgot password?</SLink>
                                </Col>
                            </Row>
                            <Row style={{ textAlign: "center" }}>
                                <Col xs={12}>
                                    <Body size={SIZES.SM}>This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
                                    <Recaptcha id="recaptcha" />
                                </Col>
                            </Row>
                        </Container>
                    </Form>
                    )}
                </Formik> */}

                {forgotExpanded && (
                    <ModalContainer onClick={() => toggleModal()}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H2>Forgot Password</H2>
                            <Body>Enter your email below and we will send you an email for you to reset your password.</Body>
                            {/* <Input 
                                type="text"
                                placeholder={PLACEHOLDER.EMAIL}
                                onChange={(e) => setForgotEmail(e.target.value)} 
                                value={forgotEmail}
                            /> */}
                            <Button color={theme.colors.green} type="button" onClick={() => sendPasswordReset()}>
                                Send password reset link
                            </Button>
                            <Button 
                                type="button"
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