import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, RecaptchaVerifier, updateProfile } from 'firebase/auth';

import { firestore, auth } from "../../../Fire.js";
import { userRegisterSchema } from "../../../utils/formSchemas"
import { Hr, Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { CField, FField } from '../../../utils/styles/forms.js';
import { Body, H1, H2, Label, LLink } from '../../../utils/styles/text.js';
import { Button } from '../../../utils/styles/buttons';
import { doc, setDoc } from 'firebase/firestore';
import FormError from '../../misc/FormError.js';
import { withRouter } from '../../../utils/hocs.js';

class UserRegister extends Component {
    constructor(props) {
        super(props)

        this.state = {
            submitting: {
                registerUser: false
            }
        }
    }

    registerUser = (values) => {        
        if (values.confirmPassword !== values.password) { 
            toast.warn("Passwords must match!");
        } else if(!values.policyAccept){
            toast.warn("Please accept our Privacy Policy and Terms & Conditions.");
        } else {
            toast.info('Please complete the reCAPTCHA below to continue.');
            
            window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
                'size': 'normal',
                'callback': async (response) => {
                    this.setState({ loading: { registerUser: true } });
                    await createUserWithEmailAndPassword(auth, values.email, values.password)
                        .then(async (userCredential) => {
                            // Signed in 
                            const user = userCredential.user;
                            console.log("User created: ")
                            console.log(user)

                            await updateProfile(auth.currentUser, {
                                displayName: (values.firstName + " " + values.lastName)
                            }).then(() => {
                                console.log("Successfully added display name to Firebase.");
                            }).catch((error) => {
                                console.error("Error adding your display name to database: ", error);
                                toast.error(`Error adding your display name to database: ${error}`);
                            });

                            await setDoc(doc(firestore, "users", user.uid), {
                                firstName: values.firstName,
                                lastName: values.lastName,
                                email: values.email,
                                phone: values.phone,
                                timestamp: Date.now(),
                            }).then((doc) => {
                                console.log("Successful write of user doc to Firestore: ");
                                console.log(doc)
                            }).catch((error) => {
                                console.error("Error adding document: ", error);
                                toast.error(`Error setting users doc: ${error}`);
                            });
                            
                            this.props.navigate("/user/dashboard");
                            window.recaptchaVerifier.clear();
                        }).catch((error) => {
                            console.log("Error: " + error.message);
                            toast.error(`Error adding creating account: ${error.message}`);
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
    }

    render() {
        if(this.state?.loading?.registerUser){
            return (
                <Wrapper>
                    <H2>Creating your account... <i className="fas fa-spinner fa-spin" /></H2> 
                </Wrapper>
            )
        } else {
            return (
                <Wrapper>
                    <Link to="/">
                        <Button>
                            <i className="fas fa-chevron-left" />
                            &nbsp; Return home
                        </Button>
                    </Link>
                    <H1>User Register</H1>
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
                            this.setState({ submitting: { registerUser: true } })
                            this.registerUser(values);
                        }}
                        enableReinitialize={true}
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
                                            placeholder="Taylor"
                                            name="firstName"
                                            value={props.values.firstName || ''}
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
                                            placeholder="Doe"
                                            name="lastName"
                                            value={props.values.lastName || ''}
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
                                    <Col xs={12} md={6}>
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
                                    <Col xs={12} md={6}>
                                        <Label>Confirm Password: </Label>
                                        <FField
                                            type="password"
                                            required
                                            onChange={props.handleChange}
                                            name="confirmPassword"
                                            autoComplete={"off"}
                                            value={props.values.confirmPassword}
                                            placeholder="*********************"
                                            error={ ((props.errors.confirmPassword && props.touched.confirmPassword) || this.state?.errors?.confirmPassword) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={props.errors.confirmPassword}
                                            formikTouched={props.touched.confirmPassword}
                                            stateError={this.state?.errors?.confirmPassword}
                                        /> 
                                    </Col>
                                </Row>
                                <Hr/>
                                <Row center="xs">
                                    <Col>
                                        <CField
                                            type="checkbox"
                                            name="policyAccept"
                                        />
                                        <Body display="inline">
                                            I accept the&nbsp;
                                            <LLink to="/privacy-policy">Privacy Policy</LLink> and&nbsp;
                                            <LLink to="/terms-conditions">Terms &amp; Conditions</LLink>.
                                        </Body>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <Button 
                                            type="submit"
                                            disabled={this.state?.submitting?.registerUser}
                                        >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <LLink to="/user/login">
                                            Already have an account?
                                        </LLink>
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
                </Wrapper>
            )
        }
    }
}

export default withRouter(UserRegister);