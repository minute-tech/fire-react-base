import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
import { FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { doc, updateDoc } from 'firebase/firestore';
import { withTheme } from 'styled-components';
import { FaMoon, FaSun } from 'react-icons/fa';

import { withRouter } from '../../../../utils/hocs';
import { updateProfileSchema } from "../../../../utils/formSchemas"
import { Hr, Wrapper } from '../../../../utils/styles/misc.js';
import { FField } from '../../../../utils/styles/forms.js';
import { H1, Label, LLink } from '../../../../utils/styles/text.js';
import { Button } from '../../../../utils/styles/buttons.js';
import FormError from '../../../misc/FormError.js';
import { BTYPES, PLACEHOLDER, SCHEMES } from '../../../../utils/constants';
import { firestore } from '../../../../Fire';
import { Helmet } from 'react-helmet-async';

class Profile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            submittingUpdateUser: false
        }
    }

    updateProfile = (values) => {
        updateDoc(doc(firestore, "users", this.props.fireUser.uid), {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone
        }).then(() => {
            console.log("Successful update of user doc to Firestore.");
            toast.success(`Successfully updated the user profile.`);
            this.setState({
                submittingUpdateUser: false
            })
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
            this.setState({
                submittingUpdateUser: false
            })
        });
    }

    // TODO add input for email for me
    sendPasswordReset = (email) => {
        // firebase.auth().sendPasswordResetEmail(email).then(() => {
        //     toast.success(`Password reset email sent to user's email on file, check your inbox!`);
        // }).catch((error) => {
        //     toast.error(`Error sending password reset link: ${error}`);
        // });
    }

    setThemeScheme = (currentScheme, userId) => {
        if(currentScheme === SCHEMES.DARK){
            // Currently Dark Theme, change to Light
            // Update Firestore doc to remember
            updateDoc(doc(firestore, "users", userId), {
                flags: {
                    themeScheme: SCHEMES.LIGHT
                }
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        } else {
            // Currently Light Theme, change to Dark
            // Update Firestore doc to remember
            updateDoc(doc(firestore, "users", userId), {
                flags: {
                    themeScheme: SCHEMES.DARK
                }
            }).then(() => {
                console.log("Successful update of user doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding document: ", error);
                toast.error(`Error setting users doc: ${error}`);
            });
        }
    }

    render() {
        return (
            <Wrapper>
                <Helmet>
                    <title>Profile {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <LLink to={`/dashboard`}> 
                    <Button>
                        <FaChevronLeft />&nbsp; Return to dashboard
                    </Button>
                </LLink>
                <H1>Profile</H1>
                <Formik
                    initialValues={{
                        firstName: this.props.user.firstName,
                        lastName: this.props.user.lastName,
                        email: this.props.user.email,
                        phone: this.props.user.phone
                    }}
                    enableReinitialize={true}
                    validationSchema={updateProfileSchema}
                    onSubmit={(values) => {
                        this.setState({
                            submittingUpdateUser: true
                        })
                        this.updateProfile(values);
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
                                        value={props.values.phone || ''}
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
                                        disabled={this.state.submittingUpdateUser || !props.dirty}
                                    >
                                        Submit
                                    </Button>
                                </Col>
                            </Row>
                        </Grid>
                    </Form>
                    )}
                </Formik>
                <Hr />
                <Button 
                    color={this.props?.user?.flags?.themeScheme === SCHEMES.DARK ? this.props.theme.colors.yellow : 'black'} 
                    btype={BTYPES.INVERTED}
                    onClick={() => this.setThemeScheme(this.props?.user?.flags?.themeScheme, this.props?.fireUser?.uid)}
                >
                    Switch to&nbsp;
                    {
                        this.props?.user?.flags?.themeScheme === SCHEMES.DARK ? 
                        <span>{SCHEMES.LIGHT} mode <FaSun /> </span> : 
                        <span>{SCHEMES.DARK} mode <FaMoon /></span>
                    }
                </Button>
                    
            </Wrapper>
        )
    }
}

export default withRouter(withTheme(Profile));