import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, RecaptchaVerifier, updateProfile } from 'firebase/auth';
import { FaChevronLeft } from 'react-icons/fa';
import { doc, setDoc } from 'firebase/firestore';

import { firestore, auth } from "../../../../Fire.js";
import { userRegisterSchema } from "../../../../utils/formSchemas"
import { Recaptcha, Wrapper } from '../../../../utils/styles/misc.js';
import { CField, FField } from '../../../../utils/styles/forms.js';
import { ALink, Body, H1, Label, LLink } from '../../../../utils/styles/text.js';
import { Button } from '../../../../utils/styles/buttons';
import FormError from '../../../misc/FormError.js';
import { withRouter } from '../../../../utils/hocs.js';
import { PLACEHOLDER, SCHEMES, SIZES } from '../../../../utils/constants.js';
import { Helmet } from 'react-helmet-async';

class Register extends Component {
    constructor(props) {
        super(props)

        this.state = {
            submittingRegisterUser: false,
        }
    }

    registerUser = (values) => {        
        let termsToastId = "";
        if (values.confirmPassword !== values.password) { 
            this.setState({ 
                submittingRegisterUser: false, 
                errors: { confirmPassword: "Passwords do not match!" } 
            })
        } else if(!values.policyAccept){
            termsToastId = toast.warn("Please accept our Privacy Policy and Terms & Conditions.");
            this.setState({ submittingRegisterUser: false })
        } else {
            const recaptchaToastId = toast.info('Please complete the reCAPTCHA below to continue.');
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
                'size': 'normal',
                'callback': async (response) => {
                    this.props.userLoggingIn(true);
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
                            this.props.navigate("/logging-in");
                            toast.success(`Registered successfully!`);
                        }).catch((error) => {
                            console.log("Error: " + error.message);
                            if(error.code === "auth/email-already-in-use"){
                                this.setState({ 
                                    errors: { email: "Email already registered! Try logging in or use another email address." } 
                                })
                            } else {
                                toast.error(`Error adding creating account: ${error.message}`);
                            }
                            this.setState({ 
                                submittingRegisterUser: false, 
                            })
                            toast.dismiss(recaptchaToastId);
                            if(termsToastId){
                                toast.dismiss(termsToastId);
                            }
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
    }

    render() {
        return (
            <Wrapper>
                <Helmet>
                    <title>Register {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/">
                    <Button>
                        <FaChevronLeft />
                        &nbsp; Return home
                    </Button>
                </LLink>
                <H1>Register</H1>
                <Formik
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
                        this.setState({ submittingRegisterUser: true })
                        this.registerUser(values);
                    }}
                    enableReinitialize={false}
                    validationSchema={userRegisterSchema}
                >
                    {props => (
                    <Form>
                        <Grid fluid>
                            <Row>
                                <Col sm={12} md={6}>
                                    <Label>First name:</Label>
                                    <br/>
                                    <FField
                                        type="text"
                                        required
                                        onChange={props.handleChange}
                                        placeholder={PLACEHOLDER.FIRST_NAME}
                                        name="firstName"
                                        value={props.values.firstName || ''}
                                        onKeyUp={() => this.setState({ errors: { firstName: false } })}
                                        onClick={() => this.setState({ errors: { firstName: false } })}
                                        error={ ((props.errors.firstName && props.touched.firstName) || this.state?.errors?.firstName) ? 1 : 0 }
                                    />
                                    <FormError
                                        yupError={props.errors.firstName}
                                        formikTouched={props.touched.firstName}
                                        stateError={this.state?.errors?.firstName}
                                    /> 
                                </Col>
                                <Col sm={12} md={6}>
                                    <Label>Last name:</Label>
                                    <br/>
                                    <FField
                                        type="text"
                                        required
                                        onChange={props.handleChange}
                                        placeholder={PLACEHOLDER.LAST_NAME}
                                        name="lastName"
                                        value={props.values.lastName || ''}
                                        onKeyUp={() => this.setState({ errors: { lastName: false } })}
                                        onClick={() => this.setState({ errors: { lastName: false } })}
                                        error={ ((props.errors.lastName && props.touched.lastName) || this.state?.errors?.lastName) ? 1 : 0 }
                                    />
                                    <FormError
                                        yupError={props.errors.lastName}
                                        formikTouched={props.touched.lastName}
                                        stateError={this.state?.errors?.lastName}
                                    /> 
                                </Col>
                            </Row>
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
                                <Col xs={12} md={6}>
                                    <Label>Password: </Label>
                                    <FField
                                        type="password"
                                        required
                                        onChange={props.handleChange}
                                        name="password"
                                        autoComplete={"off"}
                                        onKeyUp={() => this.setState({ errors: { password: false } })}
                                        onClick={() => this.setState({ errors: { password: false } })}
                                        value={props.values.password}
                                        placeholder={PLACEHOLDER.PASSWORD}
                                        error={ ((props.errors.password && props.touched.password) || this.state?.errors?.password) ? 1 : 0 }
                                    />
                                    <FormError
                                        yupError={props.errors.password}
                                        formikTouched={props.touched.password}
                                        stateError={this.state?.errors?.password}
                                    /> 
                                </Col>
                                <Col xs={12} md={6}>
                                    <Label>Confirm Password: </Label>
                                    <FField
                                        type="password"
                                        required
                                        onChange={props.handleChange}
                                        name="confirmPassword"
                                        autoComplete={"off"}
                                        onKeyUp={() => this.setState({ errors: { confirmPassword: false } })}
                                        onClick={() => this.setState({ errors: { confirmPassword: false } })}
                                        value={props.values.confirmPassword}
                                        placeholder={PLACEHOLDER.PASSWORD}
                                        error={ ((props.errors.confirmPassword && props.touched.confirmPassword) || this.state?.errors?.confirmPassword) ? 1 : 0 }
                                    />
                                    <FormError
                                        yupError={props.errors.confirmPassword}
                                        formikTouched={props.touched.confirmPassword}
                                        stateError={this.state?.errors?.confirmPassword}
                                    /> 
                                </Col>
                            </Row>
                            <Row center="xs" style={{margin:"10px 0"}}>
                                <Col>
                                    <CField
                                        type="checkbox"
                                        name="policyAccept"
                                    />
                                    <Body display="inline">
                                        I accept the&nbsp;
                                        <LLink to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</LLink> and&nbsp;
                                        <LLink to="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</LLink>.
                                    </Body>
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <Button 
                                        type="submit"
                                        disabled={this.state.submittingRegisterUser}
                                    >
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                            <Row center="xs" style={{margin:"10px 0"}}>
                                <Col xs={12}>
                                    <LLink to="/login">
                                        Already have an account?
                                    </LLink>
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <Body size={SIZES.SM}>This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
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

export default withRouter(Register);