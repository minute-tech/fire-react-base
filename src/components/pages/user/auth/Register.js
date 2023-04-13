import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, RecaptchaVerifier, updateProfile } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";

import { firestore, auth } from "../../../../Fire.js";
import { Column, Grid, Recaptcha, Row, Wrapper } from '../../../../utils/styles/misc.js';
import { TextInput, Button } from '../../../../utils/styles/forms.js';
import { ALink, Body, H1, Label, LLink } from '../../../../utils/styles/text.js';
import { FormError } from '../../../misc/Misc.js';
import { INPUT, ITEMS, SCHEMES, SIZES } from '../../../../utils/constants.js';

function Register(props) {
    const navigate = useNavigate();
    
    const [submitting, setSubmitting] = useState({ 
        register: false,
    }); 

    const registerForm = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            policyAccept: false
        }
    });

    const registerUser = (data) => {        
        let termsToastId = "";
        if (data.confirmPassword !== data.password) { 
            registerForm.setError(INPUT.CONFIRM_PASSWORD.KEY, { 
                type: INPUT.CONFIRM_PASSWORD.ERRORS.NO_MATCH.TYPE, 
                message: INPUT.CONFIRM_PASSWORD.ERRORS.NO_MATCH.MESSAGE
            });   
            setSubmitting(prevState => ({
                ...prevState,
                register: false
            }));
        } else {
            const recaptchaToastId = toast.info("Please complete the reCAPTCHA below to continue.");
            window.recaptchaVerifier = new RecaptchaVerifier("recaptcha", {
                "size": "normal",
                "callback": async (response) => { 
                    props.setIsLoggingIn(true);
                    await createUserWithEmailAndPassword(auth, data.email, data.password)
                        .then(async (userCredential) => {
                            // Register approved
                            const tempUser = userCredential.user;
                            console.log("User created: ")
                            console.log(tempUser)

                            // Set displayName on Firebase auth user object
                            await updateProfile(auth.currentUser, {
                                displayName: (data.firstName + " " + data.lastName)
                            }).then(() => {
                                console.log("Successfully added display name to Firebase.");
                            }).catch((error) => {
                                console.error("Error adding your display name to database: " + error);
                                toast.error(`Error adding your display name to database. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                            });

                            const currentTime = Date.now();
                            // Create Firestore doc
                            await setDoc(doc(firestore, ITEMS.USERS.COLLECTION, tempUser.uid), {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                                phone: "",
                                flags: {
                                    themeScheme: window.matchMedia(`(prefers-color-scheme: ${SCHEMES.DARK})`).matches ? SCHEMES.DARK : SCHEMES.LIGHT
                                },
                                created: {
                                    timestamp: currentTime,
                                    id: tempUser.uid,
                                    email: data.email,
                                    name: (data.firstName + " " + data.lastName),
                                },
                                updated: {
                                    timestamp: currentTime,
                                    id: tempUser.uid,
                                    email: data.email,
                                    name: (data.firstName + " " + data.lastName),
                                    summary: "Registration of user."
                                },
                            }).then(() => {
                                console.log("Successful write of user doc to Firestore.");
                            }).catch((error) => {
                                console.error("Error adding document: " + error);
                                toast.error(`Error setting users document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                            });

                            // Clean up
                            toast.dismiss(recaptchaToastId);
                            window.recaptchaVerifier.clear();
                            navigate("/logging-in");
                            toast.success(`Registered successfully!`);
                        }).catch((error) => {
                            console.log("Error: " + error.message);
                            if(error.code === "auth/email-already-in-use"){
                                // registerForm.setError(INPUT.EMAIL.KEY, { 
                                //     type: INPUT.EMAIL.ERRORS.TAKEN.TYPE, 
                                //     message: INPUT.EMAIL.ERRORS.TAKEN.MESSAGE
                                // });
                                registerForm.setError(INPUT.EMAIL.KEY, { 
                                    type: "error", 
                                    message: "Sorry, we encountered an error while registering. Please double check your email, this email could be taken."
                                });
                            } else {
                                console.error("Error creating account: " + error.message)
                                toast.error(`Error creating account. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                            }

                            setSubmitting(prevState => ({
                                ...prevState,
                                register: false
                            }));

                            toast.dismiss(recaptchaToastId);

                            if(termsToastId){
                                toast.dismiss(termsToastId);
                            }

                            window.recaptchaVerifier.clear();
                            props.setIsLoggingIn(false);
                        });
                },
                "expired-callback": () => {
                    toast.warn('Please solve the reCAPTCHA again!');
                    window.recaptchaVerifier.clear()
                }
            }, auth);
            window.recaptchaVerifier.render(); 
        }
    }

    return (
        <Wrapper>
            <Helmet>
                <title>Register {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Return home
                </Button>
            </LLink>
            <H1>Register</H1>
            <form onSubmit={ registerForm.handleSubmit(registerUser) }>
                <Grid fluid>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.FIRST_NAME.KEY} br>{INPUT.FIRST_NAME.LABEL}:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.FIRST_NAME.PLACEHOLDER} 
                                error={registerForm.formState.errors[INPUT.FIRST_NAME.KEY]}
                                {
                                    ...registerForm.register(INPUT.FIRST_NAME.KEY, { 
                                            required: INPUT.FIRST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MAX.KEY,
                                                message: INPUT.FIRST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.FIRST_NAME.ERRORS.MIN.KEY,
                                                message: INPUT.FIRST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={registerForm.formState.errors[INPUT.FIRST_NAME.KEY]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.LAST_NAME.KEY} br>{INPUT.LAST_NAME.LABEL}:</Label>
                            <TextInput
                                type="text" 
                                placeholder={INPUT.LAST_NAME.PLACEHOLDER} 
                                error={registerForm.formState.errors[INPUT.LAST_NAME.KEY]}
                                {
                                    ...registerForm.register(INPUT.LAST_NAME.KEY, { 
                                            required: INPUT.LAST_NAME.ERRORS.REQUIRED,
                                            maxLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MAX.KEY,
                                                message: INPUT.LAST_NAME.ERRORS.MAX.MESSAGE
                                            },
                                            minLength: {
                                                value: INPUT.LAST_NAME.ERRORS.MIN.KEY,
                                                message: INPUT.LAST_NAME.ERRORS.MIN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={registerForm.formState.errors[INPUT.LAST_NAME.KEY]} /> 
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12}>
                            <Label htmlFor={INPUT.EMAIL.KEY} br>{INPUT.EMAIL.LABEL}:</Label>
                            <TextInput
                                type="text" 
                                error={registerForm.formState.errors[INPUT.EMAIL.KEY]}
                                placeholder={INPUT.EMAIL.PLACEHOLDER} 
                                {
                                    ...registerForm.register(INPUT.EMAIL.KEY, { 
                                            required: INPUT.EMAIL.ERRORS.REQUIRED,
                                            pattern: {
                                                value: INPUT.EMAIL.ERRORS.PATTERN.KEY,
                                                message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                            },
                                        }
                                    )
                                } 
                            />
                            <FormError error={registerForm.formState.errors[INPUT.EMAIL.KEY]} /> 
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.PASSWORD.KEY} br>{INPUT.PASSWORD.LABEL}:</Label>
                            <TextInput
                                type="password"
                                placeholder={INPUT.PASSWORD.PLACEHOLDER} 
                                error={registerForm.formState.errors[INPUT.PASSWORD.KEY]}
                                { 
                                    ...registerForm.register(INPUT.PASSWORD.KEY, {
                                        required: INPUT.PASSWORD.ERRORS.REQUIRED,
                                        maxLength: {
                                            value: INPUT.PASSWORD.ERRORS.MAX.KEY,
                                            message: INPUT.PASSWORD.ERRORS.MAX.MESSAGE
                                        },
                                        minLength: {
                                            value: INPUT.PASSWORD.ERRORS.MIN.KEY,
                                            message: INPUT.PASSWORD.ERRORS.MIN.MESSAGE
                                        },
                                    })
                                } 
                            />
                            <FormError error={registerForm.formState.errors[INPUT.PASSWORD.KEY]} /> 
                        </Column>
                        <Column sm={12} md={6}>
                            <Label htmlFor={INPUT.CONFIRM_PASSWORD.KEY} br>Confirm {INPUT.PASSWORD.LABEL}:</Label>
                            <TextInput
                                type="password"
                                placeholder={INPUT.CONFIRM_PASSWORD.PLACEHOLDER} 
                                error={registerForm.formState.errors[INPUT.CONFIRM_PASSWORD.KEY]}
                                { 
                                    ...registerForm.register(INPUT.CONFIRM_PASSWORD.KEY, {
                                        required: INPUT.CONFIRM_PASSWORD.ERRORS.REQUIRED,
                                        maxLength: {
                                            value: INPUT.CONFIRM_PASSWORD.ERRORS.MAX.KEY,
                                            message: INPUT.CONFIRM_PASSWORD.ERRORS.MAX.MESSAGE
                                        },
                                        minLength: {
                                            value: INPUT.CONFIRM_PASSWORD.ERRORS.MIN.KEY,
                                            message: INPUT.CONFIRM_PASSWORD.ERRORS.MIN.MESSAGE
                                        },
                                    })
                                } 
                            />
                            <FormError error={registerForm.formState.errors[INPUT.CONFIRM_PASSWORD.KEY]} /> 
                        </Column>
                    </Row>
                    <Row>
                        <Column sm={12} textalign="center">
                            <Body>
                                By submitting this form you are accepting the&nbsp;
                                <LLink to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</LLink> and&nbsp;
                                <LLink to="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</LLink>.
                            </Body>
                        </Column>
                    </Row>
                    <Row>
                        <Column md={12} textalign="center">
                            <Button 
                                type="submit" 
                                disabled={submitting.register}
                            >
                                Submit
                            </Button>
                        </Column>
                    </Row>
                    <Row>
                        <Column md={12} textalign="center">
                            <LLink to="/login">
                                Already have an account?
                            </LLink>
                        </Column>
                    </Row>
                    <Row>
                        <Column md={12} textalign="center">
                            <Body size={SIZES.SM}>This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
                            <Recaptcha id="recaptcha" />
                        </Column>
                    </Row>
                </Grid>
            </form>
        </Wrapper>
    )
}

export default Register;