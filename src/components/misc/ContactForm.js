import React, { Component } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { firestore } from "../../Fire";
import { CField, FField } from '../../utils/styles/forms';
import { contactFormSchema } from '../../utils/formSchemas';
import FormError from '../misc/FormError';
import { Form, Formik } from 'formik';
import { Body, H1, Label, LLink } from '../../utils/styles/text.js';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Button } from '../../utils/styles/buttons.js';
import { Hr } from '../../utils/styles/misc.js';
import { toast } from 'react-toastify';
import { PLACEHOLDER } from '../../utils/constants';

export default class ContactForm extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    submitMessage = (values, resetForm) => {
        if(!values.policyAccept){
            toast.warn('Please accept our Privacy Policy and Terms & Conditions.');
        } else {
            addDoc(collection(firestore, "messages"), {
                name: values.name,
                email: values.email,
                message: values.message,
                timestamp: Date.now(),
            }).then((doc) => {
                toast.success('Message submitted successfully, thanks!');
                console.log("doc: ");
                console.log(doc);
                resetForm();
            });
        }
       
    }

    render() {
        return (
            <div>
                <H1>Contact Form</H1>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        message: "",
                        policyAccept: false,
                    }}
                    onSubmit={(values, actions) => {
                        this.setState({ submitting: { message: true } })
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
                                            placeholder={PLACEHOLDER.MESSAGE}
                                            onKeyUp={() => this.setState({ errors: { message: false } })}
                                            onClick={() => this.setState({ errors: { message: false } })}
                                            name="message"
                                            value={props.values.message || ''}
                                            error={ ((props.errors.message && props.touched.message) || this.state?.errors?.message) ? 1 : 0 }
                                        />
                                        <FormError
                                            yupError={props.errors.message}
                                            formikTouched={props.touched.message}
                                            stateError={this.state?.errors?.message}
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
                                <br/>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <Button 
                                            type="submit" 
                                            disabled={this.state?.submitting?.message}
                                        >
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}
