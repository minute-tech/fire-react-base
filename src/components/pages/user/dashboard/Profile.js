import React, { Component } from "react"
import { Grid, Row, Col } from "react-flexbox-grid";
import { Form, Formik } from "formik";
import { FaChevronLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { withTheme } from "styled-components";
import { FaMoon, FaSun } from "react-icons/fa";
import { CgClose, CgAttachment } from "react-icons/cg";
import { BsCloudUpload } from "react-icons/bs";
import { Helmet } from "react-helmet-async";
import { updateProfile } from "firebase/auth";

import { withRouter } from "../../../../utils/hocs";
import { updateProfileSchema } from "../../../../utils/formSchemas"
import { Hr, Img, ModalCard, ModalContainer } from "../../../../utils/styles/misc.js";
import { FField, FileInput, FileInputLabel } from "../../../../utils/styles/forms.js";
import { Body, H1, Label, LLink } from "../../../../utils/styles/text.js";
import { Button } from "../../../../utils/styles/buttons.js";
import FormError from "../../../misc/FormError.js";
import { BTYPES, PLACEHOLDER, SCHEMES, SIZES } from "../../../../utils/constants.js";
import { auth, firestore, storage } from "../../../../Fire";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

class Profile extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            submittingUpdateUser: false,
            submittingUpdateAvatar: false,
            shownModals: [],
            files: [],
            uploadProgress: ""
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

    handleFileSelect = (e) => {
        console.log("e.target.files: ")
        console.log(e.target.files)

        this.setState({
            files: e.target.files
        })
    }

    uploadFile = async (file) => {
        this.setState({
            submittingUpdateAvatar: true
        });

        // https://firebase.google.com/docs/storage/web/upload-files
        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: file.type
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
                // this.setState({
                //     uploadProgress: progress
                // })
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
                    updateDoc(doc(firestore, "users", this.props.fireUser.uid), {
                        avatar: downloadURL
                    }).then(() => {
                        console.log("Successful update of user doc to Firestore.");
                        updateProfile(auth.currentUser, {
                            photoURL: downloadURL
                        }).then(() => {
                            toast.success(`Successfully updated the user profile.`);
                            console.log("Successfully updated the user profile on firebase");
                            this.toggleModal(false, 0)
                            this.setState({
                                submittingUpdateAvatar: false
                            })
                        }).catch((error) => {
                            console.error(error);
                        });
                    }).catch((error) => {
                        console.error("Error adding document: ", error);
                        toast.error(`Error setting users doc: ${error}`);
                        this.setState({
                            submittingUpdateAvatar: false
                        })
                    });
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

    
    toggleModal = (newStatus, index) => {
        let tempShownModals = this.state.shownModals
        tempShownModals[index] = newStatus
        this.setState({
            shownModals: tempShownModals
        })
    }

    render() {
        console.log("this.props.fireUser: ")
        console.log(this.props.fireUser)
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
                                                <FileInputLabel for="avatar" selected={this.state.files.length > 0 ? true : false}>
                                                    <CgAttachment /> Select a new image
                                                    <FileInput 
                                                        id="avatar" 
                                                        type="file" 
                                                        accept="image/png, image/jpg, image/jpeg" 
                                                        // multiple
                                                        onChange={this.handleFileSelect} 
                                                    />
                                                    {this.state.files.length > 0 && Array.from(this.state.files).map((file, f) => {
                                                        const fileSizeMb = (file.size / (1024 ** 2)).toFixed(2);
                                                        if(this.state.files.length > 1){
                                                            return (
                                                                <div style={{ margin: "15px 0" }}>
                                                                    <Body>{f + 1}. {file.name} <i>({fileSizeMb}Mb)</i></Body>
                                                                </div>
                                                            )
                                                        } else {
                                                            if(file.type.includes("image")){
                                                                return (
                                                                    <div style={{ margin: "15px 0" }}>
                                                                        <Body>{file.name} <i>({fileSizeMb}Mb)</i></Body>
                                                                        <br />
                                                                        <Img 
                                                                            key={f}
                                                                            width="300px"
                                                                            alt="file preview"
                                                                            src={URL.createObjectURL(file)}
                                                                        />
                                                                    </div>
                                                                    
                                                                );
                                                            } else {
                                                                return (
                                                                    <div style={{ margin: "15px 0" }}>
                                                                        <Label>{file.name} <i>{fileSizeMb}Mb</i></Label>
                                                                        <br />
                                                                        <embed 
                                                                            key={f}
                                                                            width="100%"
                                                                            height="auto"
                                                                            src={URL.createObjectURL(file)}
                                                                        />
                                                                    </div>
                                                                    
                                                                );
                                                            }
                                                        }
                                                    })}
                                                    {this.state.uploadProgress && (
                                                        <span>{this.state.uploadProgress}</span>
                                                    )}
                                                    {this.state.files.length > 0 && (
                                                        <Button 
                                                            type="button" 
                                                            onClick={() => this.uploadFile(this.state.files[0])}
                                                            // onClick={() => this.uploadFile(this.state.files.length > 1 ? this.state.files : this.state.files[0])}
                                                        >
                                                            Upload &amp; Save Avatar &nbsp;<BsCloudUpload size={20} />
                                                        </Button>
                                                    )}
                                                </FileInputLabel>
                                                
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