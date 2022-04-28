import React, { Component } from "react"
import { Grid, Row, Col } from "react-flexbox-grid";
import { Form, Formik } from "formik";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { withTheme } from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { updateProfile } from "firebase/auth";

import { withRouter } from "../../../../utils/hocs";
import { updateProfileSchema } from "../../../../utils/formSchemas"
import { Hr } from "../../../../utils/styles/misc.js";
import { FField } from "../../../../utils/styles/forms.js";
import { H1, Label, LLink } from "../../../../utils/styles/text.js";
import { Button } from "../../../../utils/styles/buttons.js";
import FormError from "../../../misc/FormError.js";
import { BTYPES, PLACEHOLDER, SCHEMES } from "../../../../utils/constants.js";
import { auth, firestore, storage } from "../../../../Fire";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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

    // TODO: build upload input and style it for profile pic.
    uploadFile = async (file) => {
        // https://firebase.google.com/docs/storage/web/upload-files
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: "image/jpeg"
        };
        
        // Upload file and metadata to the object "images/mountains.jpg"
        const storageRef = ref(storage, `users/${this.props.user.id}/images/` + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);
        
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on("state_changed",
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload is " + progress + "% done");
                switch (snapshot.state) {
                    case "paused":
                    console.log("Upload is paused");
                    break;

                    case "running":
                    console.log("Upload is running");
                    break;

                    default:
                    console.log("Default case upload snapshot...");
                    break;
                }
            }, 
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case "storage/unauthorized":
                    console.log("User doesn't have permission to access the object");
                    break;

                    case "storage/canceled":
                    console.log("User canceled the upload");
                    break;
            
                    case "storage/unknown":
                    console.log("Unknown error occurred, inspect error.serverResponse");
                    break;

                    default:
                    console.log("Default case upload snapshot...");
                    break;
                }
            }, 
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                });
            }
        );
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