import React, { Component } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { withTheme } from 'styled-components';
import { toast } from 'react-toastify';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Form, Formik } from 'formik';
import { FaCheck } from "react-icons/fa"

import { firestore } from "../../Fire";
import { CField, FField } from '../../utils/styles/forms';
import { contactFormSchema } from '../../utils/formSchemas';
import { FormError } from '../misc/Misc';
import { Body, H1, H3, Label, LLink } from '../../utils/styles/text.js';
import { Button } from '../../utils/styles/buttons.js';
import { Centered, Hr } from '../../utils/styles/misc.js';
import { PLACEHOLDER } from '../../utils/constants.js';

class ContactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            messageSubmitted: false,
            submittingMessage: false
        }
    }

    submitMessage = (values, resetForm) => {
        this.setState({
            submittingMessage: true
        })
        if(!values.policyAccept){
            toast.warn('Please accept our Privacy Policy and Terms & Conditions.');
            this.setState({
                submittingMessage: false
            })
        } else {
            toast.dismiss();
            addDoc(collection(firestore, "messages"), {
                name: values.name,
                email: values.email,
                body: values.body,
                timestamp: Date.now(),
            }).then((doc) => {
                console.log("doc: ");
                console.log(doc);
                this.setState({
                    messageSubmitted: true,
                    submittingMessage: false
                })
                toast.success(`Message submitted successfully, thanks!`);
                resetForm();
            }).catch(error => {
                toast.error(`Error submitting message: ${error}`);
                this.setState({
                    submittingMessage: false
                })
            });
        }
       
    }

    render() {
        if(this.state.messageSubmitted){
            return (
                <>
                <H1>Contact Form</H1>
                <Centered>
                    <H3 color={this.props.theme.colors.green}><FaCheck /> Submitted.</H3>
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
                            this.setState({ submittingMessage: true })
                            this.submitMessage(values, actions.resetForm);
                        }}
                        enableReinitialize={true}
                        validationSchema={contactFormSchema}
                    >
                        {props => (
                            <Form>
                                <Grid fluid>
                                    <Row>
                                        <Col sm={12} md={6}>
                                            <Label>Name:</Label>
                                            <br/>
                                            <FField
                                                type="text"
                                                required
                                                onChange={props.handleChange}
                                                placeholder={`${PLACEHOLDER.FIRST_NAME} ${PLACEHOLDER.LAST_NAME}`}
                                                name="name"
                                                value={props.values.name || ''}
                                                onKeyUp={() => this.setState({ errors: { name: false } })}
                                                onClick={() => this.setState({ errors: { name: false } })}
                                                error={ ((props.errors.name && props.touched.name) || this.state?.errors?.name) ? 1 : 0 }
                                            />
                                            <FormError
                                                yupError={props.errors.name}
                                                formikTouched={props.touched.name}
                                                stateError={this.state?.errors?.name}
                                            /> 
                                        </Col>
                                        <Col sm={12} md={6}>
                                            <Label>Email:</Label>&nbsp;
                                            <br/>
                                            <FField
                                                type="text"
                                                required
                                                onChange={props.handleChange}
                                                placeholder={PLACEHOLDER.EMAIL}
                                                onKeyUp={() => this.setState({ errors: { email: false } })}
                                                onClick={() => this.setState({ errors: { email: false } })}
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
                                        <Col xs={12}>
                                            <Label>Message:</Label>&nbsp;
                                            <br/>
                                            <FField
                                                component="textarea"
                                                required
                                                onChange={props.handleChange}
                                                placeholder={PLACEHOLDER.BODY}
                                                onKeyUp={() => this.setState({ errors: { body: false } })}
                                                onClick={() => this.setState({ errors: { body: false } })}
                                                name="body"
                                                value={props.values.body || ''}
                                                error={ ((props.errors.body && props.touched.body) || this.state?.errors?.body) ? 1 : 0 }
                                            />
                                            <FormError
                                                yupError={props.errors.body}
                                                formikTouched={props.touched.body}
                                                stateError={this.state?.errors?.body}
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
                                                <LLink to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</LLink> and&nbsp;
                                                <LLink to="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</LLink>.
                                            </Body>
                                        </Col>
                                    </Row>
                                    <br/>
                                    <Row center="xs">
                                        <Col xs={12}>
                                            <Button 
                                                type="submit" 
                                                disabled={this.state.submittingMessage}
                                            >
                                                Submit
                                            </Button>
                                        </Col>
                                    </Row>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </>
            )
        }
       
    }
}

export default withTheme(ContactForm)