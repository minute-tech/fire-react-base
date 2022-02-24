import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';

import { withRouter } from '../../../utils/misc';
import { firestore, firebase } from "../../../Fire.js";
import { updateProfileSchema } from "../../../utils/formSchemas"
import { Recaptcha, Wrapper } from '../../../utils/styles/misc.js';
import { FField } from '../../../utils/styles/forms.js';
import { H1, Label, RedText, H2, LLink, GreenHoverText, SmText, H3, MdBody, MdText } from '../../../utils/styles/text.js';
import { Button, MdGreenToInvBtn, MdInvToPrimaryBtn, MdPrimaryToInvBtn } from '../../../utils/styles/buttons.js';
import FormError from '../../misc/FormError.js';
import { PLACEHOLDER } from '../../../utils/constants';

class UserProfile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             user: "",
             loading: {
                user: true
             }
        }
    }

    componentDidMount(){
        this.unsubscribeUser = firestore.collection("users").doc(this.props.user.uid)
            .onSnapshot((doc) => {
                if(doc.exists){
                    let docWithMore = Object.assign({}, doc.data());
                    docWithMore.id = doc.id;
                    this.setState({
                        user: docWithMore,
                        loading: {
                            user: false
                        }
                    })
                } else {
                    console.error("User doesn't exist.")
                }
            });
    }
  
    componentWillUnmount() {
        if(this.unsubscribeUser){
            this.unsubscribeUser();
        }
    }

    updateProfile = (values) => {
        firestore.collection("users").doc(this.props.user.uid).update({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email
        }).then(() => {
            console.log("Successful updated user on Firestore.");
            toast.success(`Successfully updated your profile details`);
        }).catch((error) => {
            console.error("Error updating user document: ", error);
            toast.error(`Error updating user details: ${errorMessage}`);
        });   
    }

    // TODO add input for email for me
    sendPasswordReset = (email) => {
        firebase.auth().sendPasswordResetEmail(email).then(() => {
            toast.success(`Password reset email sent to user's email on file, check your inbox!`);
        }).catch((error) => {
            toast.error(`Error sending password reset link: ${error}`);
        });
    }

    render() {
        // TODO: simplify me omg, break into steps on flow chart
        if(this.state.loading.user){
            return (
                <Wrapper>
                    <H2>Loading...</H2>
                </Wrapper>
            )
        } else {
            return (
                <Wrapper>
                    <LLink to={`/user/dashboard`}> 
                        <MdInvToPrimaryBtn type="button">
                            <i className="fas fa-chevron-left" />&nbsp; Return to user dashboard
                        </MdInvToPrimaryBtn>
                    </LLink>
                    <H1>User Profile</H1>
                    <Formik
                        initialValues={{
                            firstName: this.state.user.firstName,
                            lastName: this.state.user.lastName,
                            email: this.state.user.email,
                            phone: this.state.user.phone
                        }}
                        enableReinitialize={true}
                        validationSchema={updateProfileSchema}
                        onSubmit={(values, actions) => {
                            this.updateProfile(values);
                            actions.resetForm();
                        }}
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
                                            name="lastName"
                                            placeholder={PLACEHOLDER.LAST_NAME}
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
                                    <Col xs={12}>
                                        <Label>Phone:</Label>
                                        <br/>
                                        <FField
                                            type="phone"
                                            onChange={props.handleChange}
                                            placeholder={PLACEHOLDER.PHONE}
                                            name="phone"
                                            value={props.values.lastName || ''}
                                            onKeyUp={() => this.setState({ errors: { phone: false } })}
                                            onClick={() => this.setState({ errors: { phone: false } })}
                                            error={ ((props.errors.phone && props.touched.phone) || this.state?.errors?.phone) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={props.errors.phone}
                                            formikTouched={props.touched.phone}
                                            stateError={this.state?.errors?.phone}
                                        /> 
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
                                        <Body size="sm">This site is protected by reCAPTCHA and the <ALink target="_blank" rel="noopener" href="https://policies.google.com">Google Privacy Policy and Terms of Service</ALink> apply.</Body>
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

export default withRouter(UserProfile);