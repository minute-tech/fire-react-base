import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { toast } from 'react-toastify';
import { Form, Formik } from 'formik';
import { FaCheck } from "react-icons/fa"
import { useTheme } from 'styled-components';
import { Container, Row, Col } from 'react-grid-system';

import { firestore } from "../../Fire";
import { CField, FField } from '../../utils/styles/forms';
import { contactFormSchema } from '../../utils/formSchemas';
import { FormError } from '../misc/Misc';
import { Body, H1, H3, Label, LLink } from '../../utils/styles/text.js';
import { Button } from '../../utils/styles/buttons.js';
import { Centered, Hr } from '../../utils/styles/misc.js';
import { PLACEHOLDER } from '../../utils/constants.js';

function ContactForm(props) {
    const theme = useTheme();
    const [messageSent, setMessageSent] = useState(false);
    const [submitting, setSubmitting] = useState({ 
        message: false,
    }); 

    const [errors, setErrors] = useState({ 
        name: "",
        email: "",
        body: "",
        policyAccept: ""
    }); 

    const submitMessage = (values, resetForm) => {      
        let termsToastId = "";
        setSubmitting(prevState => ({
            ...prevState,
            message: true
        }));
        if(!values.policyAccept){
            termsToastId = toast.warn("Please read and accept our Privacy Policy and Terms & Conditions below.");
            setErrors(prevState => ({
                ...prevState,
                policyAccept: "Please accept the policies by checking the box above.",
            }));   
            setSubmitting(prevState => ({
                ...prevState,
                message: false
            }));
        } else {
            toast.dismiss();
            addDoc(collection(firestore, "messages"), {
                name: values.name,
                email: values.email,
                body: values.body,
                timestamp: Date.now(),
            }).then(() => {
                setSubmitting(prevState => ({
                    ...prevState,
                    message: false
                }));
                if(termsToastId){
                    toast.dismiss(termsToastId);
                }
                setMessageSent(true);
                toast.success(`Message submitted successfully, thanks!`);
                resetForm();
            }).catch(error => {
                toast.error(`Error submitting message: ${error}`);
                setSubmitting(prevState => ({
                    ...prevState,
                    message: false
                }));
            });
        }
       
    }

    if(messageSent){
        return (
            <>
            <H1>Contact Form</H1>
            <Centered>
                <H3 color={theme.colors.green}><FaCheck /> Submitted.</H3>
            </Centered>
            </>
        )
    } else {
        return (
            <>
                <H1>Contact Form</H1>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        body: "",
                        policyAccept: false,
                    }}
                    onSubmit={(values, actions) => {
                        setSubmitting(prevState => ({
                            ...prevState,
                            message: true
                        }));
                        submitMessage(values, actions.resetForm);
                    }}
                    enableReinitialize={true}
                    validationSchema={contactFormSchema}
                >
                    {formProps => (
                        <Form>
                            <Container fluid>
                                <Row style={{marginBottom: "10px"}}>
                                    <Col sm={12} md={6}>
                                        <Label>Name:</Label>
                                        <br/>
                                        <FField
                                            type="text"
                                            required
                                            onChange={formProps.handleChange}
                                            placeholder={`${PLACEHOLDER.FIRST_NAME} ${PLACEHOLDER.LAST_NAME}`}
                                            name="name"
                                            value={formProps.values.name || ""}
                                            onKeyUp={() => 
                                                setErrors(prevState => ({
                                                    ...prevState,
                                                    name: ""
                                                }))
                                            }
                                            onClick={() => 
                                                setErrors(prevState => ({
                                                    ...prevState,
                                                    name: ""
                                                }))
                                            }
                                            error={ ((formProps.errors.name && formProps.touched.name) || errors?.name) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={formProps.errors.name}
                                            formikTouched={formProps.touched.name}
                                            stateError={errors?.name}
                                        /> 
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <Label>Email:</Label>&nbsp;
                                        <br/>
                                        <FField
                                            type="text"
                                            required
                                            onChange={formProps.handleChange}
                                            placeholder={PLACEHOLDER.EMAIL}
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
                                            name="email"
                                            value={formProps.values.email || ""}
                                            error={ ((formProps.errors.email && formProps.touched.email) || errors?.email) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={formProps.errors.email}
                                            formikTouched={formProps.touched.email}
                                            stateError={errors?.email}
                                        /> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={12}>
                                        <Label>Message:</Label>&nbsp;
                                        <br/>
                                        <FField
                                            component="textarea"
                                            required
                                            onChange={formProps.handleChange}
                                            placeholder={PLACEHOLDER.BODY}
                                            onKeyUp={() => 
                                                setErrors(prevState => ({
                                                    ...prevState,
                                                    body: ""
                                                }))
                                            }
                                            onClick={() => 
                                                setErrors(prevState => ({
                                                    ...prevState,
                                                    body: ""
                                                }))
                                            }
                                            name="body"
                                            value={formProps.values.body || ""}
                                            error={ ((formProps.errors.body && formProps.touched.body) || errors?.body) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={formProps.errors.body}
                                            formikTouched={formProps.touched.body}
                                            stateError={errors?.body}
                                        /> 
                                    </Col>
                                </Row>
                                <Hr/>
                                <Row                                        
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
                                    <Col style={{textAlign: "center" }}>
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
                                <br/>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <Button 
                                            type="submit" 
                                            disabled={submitting.message}
                                        >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    )}
                </Formik>
            </>
        )
    }
}

export default ContactForm;