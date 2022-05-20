import React, { useState } from 'react';

import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, RecaptchaVerifier, updateProfile } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-grid-system';

import { firestore, auth } from "../../../../Fire.js";
import { userRegisterSchema } from "../../../../utils/formSchemas"
import { Recaptcha, Wrapper } from '../../../../utils/styles/misc.js';
import { CField, FField } from '../../../../utils/styles/forms.js';
import { ALink, Body, H1, Label, LLink } from '../../../../utils/styles/text.js';
import { Button } from '../../../../utils/styles/buttons';
import { FormError } from '../../../misc/Misc.js';
import { PLACEHOLDER, SCHEMES, SIZES } from '../../../../utils/constants.js';

function Register(props) {
    const navigate = useNavigate();
    
    const [submitting, setSubmitting] = useState({ 
        register: false,
    }); 

    const [errors, setErrors] = useState({ 
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "", 
        policyAccept: "",
    }); 

    const registerUser = (values) => {        
        let termsToastId = "";
        if (values.confirmPassword !== values.password) { 
            setErrors(prevState => ({
                ...prevState,
                password: "Password do not match!",
                confirmPassword: "Password do not match!"
            }));            
            setSubmitting(prevState => ({
                ...prevState,
                register: false
            }));
        } else if(!values.policyAccept){
            termsToastId = toast.warn("Please read and accept our Privacy Policy and Terms & Conditions below.");
            setSubmitting(prevState => ({
                ...prevState,
                register: false
            }));
            setErrors(prevState => ({
                ...prevState,
                policyAccept: "Please accept the policies by checking the box above.",
            }));   
        } else {
            const recaptchaToastId = toast.info('Please complete the reCAPTCHA below to continue.');
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
                'size': 'normal',
                'callback': async (response) => {
                    props.setIsLoggingIn(true);
                    await createUserWithEmailAndPassword(auth, values.email, values.password)
                        .then(async (userCredential) => {
                            // Register approved
                            const tempUser = userCredential.user;
                            console.log("User created: ")
                            console.log(tempUser)

                            // Set displayName on Firebase auth user object
                            await updateProfile(auth.currentUser, {
                                displayName: (values.firstName + " " + values.lastName)
                            }).then(() => {
                                console.log("Successfully added display name to Firebase.");
                            }).catch((error) => {
                                console.error("Error adding your display name to database: ", error);
                                toast.error(`Error adding your display name to database: ${error}`);
                            });

                            // Create Firestore doc
                            await setDoc(doc(firestore, "users", tempUser.uid), {
                                firstName: values.firstName,
                                lastName: values.lastName,
                                email: values.email,
                                phone: values.phone,
                                flags: {
                                    themeScheme: window.matchMedia(`(prefers-color-scheme: ${SCHEMES.DARK})`).matches ? SCHEMES.DARK : SCHEMES.LIGHT
                                },
                                timestamp: Date.now(),
                            }).then(() => {
                                console.log("Successful write of user doc to Firestore.");
                            }).catch((error) => {
                                console.error("Error adding document: ", error);
                                toast.error(`Error setting users doc: ${error}`);
                            });

                            // Clean up
                            toast.dismiss(recaptchaToastId);
                            window.recaptchaVerifier.clear();
                            navigate("/logging-in");
                            toast.success(`Registered successfully!`);
                        }).catch((error) => {
                            console.log("Error: " + error.message);
                            if(error.code === "auth/email-already-in-use"){
                                setErrors(prevState => ({
                                    ...prevState,
                                    email: "Email already registered! Try logging in or use another email address.",
                                }));   
                            } else {
                                toast.error(`Error adding creating account: ${error.message}`);
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
                'expired-callback': () => {
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
            {/* <Formik
                initialValues={{
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    password: "",
                    confirmPassword: "",
                    policyAccept: false,
                }}
                onSubmit={(values) => {
                    setSubmitting(prevState => ({
                        ...prevState,
                        register: true
                    }));
                    registerUser(values);
                }}
                enableReinitialize={false}
                validationSchema={userRegisterSchema}
            >
                {formProps => (
                <Form>
                    <Container fluid>
                        <Row style={{ marginBottom:"10px" }}>
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
                                    placeholder={PLACEHOLDER.LAST_NAME}
                                    name="lastName"
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
                            <Col xs={12} md={6}>
                                <Label>Password: </Label>
                                <FField
                                    type="password"
                                    required
                                    onChange={formProps.handleChange}
                                    name="password"
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            confirmPassword: "",
                                            password: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            confirmPassword: "",
                                            password: ""
                                        }))
                                    }
                                    value={formProps.values.password}
                                    placeholder={PLACEHOLDER.PASSWORD}
                                    error={ ((formProps.errors.password && formProps.touched.password) || errors?.password) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.password}
                                    formikTouched={formProps.touched.password}
                                    stateError={errors?.password}
                                /> 
                            </Col>
                            <Col xs={12} md={6}>
                                <Label>Confirm Password: </Label>
                                <FField
                                    type="password"
                                    required
                                    onChange={formProps.handleChange}
                                    name="confirmPassword"
                                    onKeyUp={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            confirmPassword: "",
                                            password: ""
                                        }))
                                    }
                                    onClick={() => 
                                        setErrors(prevState => ({
                                            ...prevState,
                                            confirmPassword: "",
                                            password: ""
                                        }))
                                    }
                                    value={formProps.values.confirmPassword}
                                    placeholder={PLACEHOLDER.PASSWORD}
                                    error={ ((formProps.errors.confirmPassword && formProps.touched.confirmPassword) || errors?.confirmPassword) ? 1 : 0 }
                                />
                                <FormError
                                    yupError={formProps.errors.confirmPassword}
                                    formikTouched={formProps.touched.confirmPassword}
                                    stateError={errors?.confirmPassword}
                                /> 
                            </Col>
                        </Row>
                        <Row 
                            style={{ marginBottom: "10px", textAlign: "center" }}
                            onKeyUp={() => 
                                setErrors(prevState => ({
                                    ...prevState,
                                    policyAccept: ""
                                }))
                            }
                            onClick={() => 
                                setErrors(prevState => ({
                                    ...prevState,
                                    policyAccept: ""
                                }))
                            }
                        >
                            <Col>
                                <CField
                                    type="checkbox"
                                    name="policyAccept"
                                />
                                <Body display="inline-block" margin="0 0 10px 0">
                                    I accept the&nbsp;
                                    <LLink to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</LLink> and&nbsp;
                                    <LLink to="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</LLink>.
                                </Body>
                                <FormError stateError={errors?.policyAccept} /> 
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "10px", textAlign: "center" }}>
                            <Col xs={12}>
                                <Button 
                                    type="submit"
                                    disabled={submitting.register}
                                >
                                    Submit
                                </Button>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: "10px", textAlign: "center" }}>
                            <Col xs={12}>
                                <LLink to="/login">
                                    Already have an account?
                                </LLink>
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
        </Wrapper>
    )
}

export default Register;