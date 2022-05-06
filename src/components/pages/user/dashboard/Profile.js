import React, { Component } from "react"
import { Grid, Row, Col } from "react-flexbox-grid";
import { Form, Formik } from "formik";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { withTheme } from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { Helmet } from "react-helmet-async";
import { updateProfile } from "firebase/auth";

import { withRouter } from "../../../../utils/hocs";
import { updateProfileSchema } from "../../../../utils/formSchemas"
import { Hr, Img, ModalCard, ModalContainer } from "../../../../utils/styles/misc.js";
import { FField } from "../../../../utils/styles/forms.js";
import { Body, H1, Label, LLink } from "../../../../utils/styles/text.js";
import { Button } from "../../../../utils/styles/buttons.js";
import FormError from "../../../misc/FormError.js";
import { BTYPES, PLACEHOLDER, SCHEMES, SIZES } from "../../../../utils/constants.js";
import { auth, firestore } from "../../../../Fire";
import FileUpload from "../../../misc/FileUpload";

class Profile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            submittingUpdateUser: false,
            shownModals: [],
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
            updateProfile(auth.currentUser, {
                displayName: `${values.firstName} ${values.lastName}`,
                // phoneNumber: values.phone,
                email: values.email,
                // photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile on firebase");
            }).catch((error) => {
                console.error(error);
            });
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

    updateAvatar = (url) => {
        updateDoc(doc(firestore, "users", this.props.fireUser.uid), {
            avatar: url
        }).then(() => {
            console.log("Successful update of user doc to Firestore.");
            updateProfile(auth.currentUser, {
                photoURL: url
            }).then(() => {
                toast.success(`Successfully updated the user profile.`);
                console.log("Successfully updated the user profile on firebase");
                this.toggleModal(false, 0)
                this.setState({
                    submittingFile: false
                })
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
            this.setState({
                submittingFile: false
            })
        });
    }

    
    toggleModal = (newStatus, index) => {
        let tempShownModals = this.state.shownModals
        tempShownModals[index] = newStatus
        this.setState({
            shownModals: tempShownModals
        })
    }

    render() {
        return (
            <>
                <Helmet>
                    <title>Profile {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <LLink to={`/dashboard`}> 
                    <Button>
                        <FaChevronLeft />&nbsp; Return to Dashboard
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
                            <Row center="xs">
                                <Col xs={12}>
                                    <Img 
                                        src={this.props.user.avatar}
                                        rounded
                                        alt={`${this.props.user.firstName} profile picture`}
                                        width={"300px"}
                                    />
                                </Col>
                            </Row>
                            <Row center="xs">
                                <Col xs={12}>
                                    <Button 
                                        type="button"
                                        btype={BTYPES.TEXTED} 
                                        color={this.props.theme.colors.yellow}
                                        onClick={() => this.toggleModal(true, 0)}>
                                            update picture
                                    </Button>
                                    {this.state.shownModals[0] && (
                                        <ModalContainer onClick={() => this.toggleModal(false, 0)}>
                                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                                <Label>Update profile avatar</Label>
                                                <Body>Select a new picture from your machine:</Body>
                                                <FileUpload
                                                    name="avatar"
                                                    selectBtn=""
                                                    accepts="image/png, image/jpg, image/jpeg" 
                                                    onUploadSuccess={this.updateAvatar}
                                                    user={this.props.user}
                                                />
                                                
                                                <Hr />
                                                <Button 
                                                    size={SIZES.SM} 
                                                    onClick={() => this.toggleModal(false, 0)}
                                                >
                                                    <CgClose /> Close 
                                                </Button>
                                            </ModalCard>
                                        </ModalContainer>
                                        
                                    )}
                                </Col>
                               
                            </Row>
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
                                        value={props.values.firstName || ""}
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
                                        value={props.values.lastName || ""}
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
                                        value={props.values.email || ""}
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
                                        value={props.values.phone || ""}
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
                    color={this.props?.user?.flags?.themeScheme === SCHEMES.DARK ? this.props.theme.colors.yellow : "black"} 
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
                    
            </>
        )
    }
}

export default withRouter(withTheme(Profile));