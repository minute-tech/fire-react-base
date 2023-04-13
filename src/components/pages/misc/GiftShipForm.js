import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import { INPUT, SIZES } from '../../../utils/constants';
import { Body, H1, LLink, Label, H2, H3, ALink } from '../../../utils/styles/text';
import { Button, TextInput } from '../../../utils/styles/forms';
import { BgColor, BgMedia, BgMediaBody, BgMediaContainer, BgMediaHeading, BgMediaModal, Centered, Column, Grid, Hr, Row, Wrapper } from '../../../utils/styles/misc';
import { FormError } from '../../misc/Misc';
import { useForm } from 'react-hook-form';
import _ from 'lodash';
import ProductSelector from '../../misc/ProductSelector';
import { useTheme } from 'styled-components';

function GiftShipForm(props) {
    const theme = useTheme();
    const [submitting, setSubmitting] = useState({ 
        order: false,
    });
    const [submitted, setSubmitted] = useState({ 
        order: false,
    });
    const products = [
        {
            objectID: "1a",
            name: "Test Product 1",
            images: [],
        },
        {
            objectID: "1b",
            name: "Test Product 2",
            images: [],
        },
        {
            objectID: "1c",
            name: "Test Product 3",
            images: [],
        },
        {
            objectID: "1d",
            name: "Test Product 4",
            images: [],
        },
    ];

    const [finalChoices, setFinalChoices] = useState([]);

    const orderForm = useForm({
        defaultValues: {
            products: [],
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            line1: "",
            line2: "",
            line3: "",
            city: "",
            state: "",
            zip: "",
            country: "",
        }
    });

    const [selectedChoice, setSelectedChoice] = useState("");
    const [productChoices, setProductChoices] = useState([]);

    const formSettings = {
        hasInventory: true,
        showInventory: true,
        reqChoices: 2,
    };

    const placeOrder = async (data) => {   
        setSubmitting(prevState => ({
            ...prevState,
            order: true,
        }));

        
        console.log("Successful write of order doc to Firestore.");
        toast.success("Order successfully placed!");
        setSubmitting(prevState => ({
            ...prevState,
            order: false,
        }));
        setSubmitted(prevState => ({
            ...prevState,
            order: true,
        }));
        setFinalChoices(productChoices);
        setProductChoices([]);
        setSelectedChoice("");
    }

    const deleteProductChoice = (product) => {
        if(productChoices.some((productChoice) => productChoice.objectID === product.objectID)){
            let selectedChoiceCloned = _.cloneDeep(product);
            selectedChoiceCloned.optionChoices = [];
        }
        // product clicked was previously selected, so removing it from the state of productChoices
        const productChoicesAfterRemovingClickedProduct = productChoices.filter((productChoice) => productChoice.objectID !== product.objectID)
        setProductChoices(productChoicesAfterRemovingClickedProduct);
    }
    
    if(submitted.order) {
        return (
            <Wrapper>
                <Centered>
                    <br/>
                    <br/>
                    <H1>Thanks for your order!</H1>
                    <Body>We are now processing your order, keep an eye out for an email from us with updates on your order.</Body>
                    {((finalChoices?.length ?? 0) > 0) && (
                        <Centered>
                            <H3>Your Order:</H3> 
                            {
                                finalChoices.map((productChoice, p) => {
                                    return (
                                        <div key={p}>
                                            <Body size={SIZES.LG} margin="0" color={theme.color.green}>
                                                {p+1}.)&nbsp; <b>{productChoice.name}</b>&nbsp;&nbsp;
                                            </Body>
                                            {/* Check if product is varianted, if so then display variant choice  */}
                                            {/* {productChoice?.variant?.name && Object.keys(productChoice.variant).length !== 0 && (
                                                <Body margin="0" display="inline"><u>{productChoice.variant.name}</u>: <i>{productChoice?.optionChoices[0]?.choice ?? "Empty"}</i></Body>
                                            )} */}
                                        </div>
                                    
                                    )
                                    
                                })
                            }
                        </Centered>
                    )}
                    <Body>If you have any questions, reach out to us at <ALink href={`mailto:${props.site?.emails?.support ?? "help@minute.tech"}`}>{props.site?.emails?.support ?? "help@minute.tech"}</ALink></Body>
                    <Hr margin="150px 0 50px 0" />
                </Centered>

                {/* TODO: add feedback here */}
                {/* <Feedback
                    shop={this.props.shop} 
                    orderId={this.state.orderId} 
                    identifier={this.state.identifier} 
                /> */}
            </Wrapper>
        )
    } else {
        return (
            <>
                <Helmet>
                    <title>Gift Ship Form {props.site.name ? `| ${props.site.name}` : ""}</title>
                </Helmet>
                <BgMediaContainer>
                    <BgColor
                        bgColor={theme.color.primary}
                        bodyLength={500}
                    >
                        <BgMedia
                            alt="hero background" 
                            // Honestly the below snippet somehow works so the little "image not found" icon with the alt tag doesn't pop up in the upper left of the banner bgColor, so don't remove the below til we find a better solution lol
                            src={
                                "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fbanners%2Fog-banner.png?alt=media&token=43d57edb-3b15-4b72-b476-f4dadb1eb759"
                                ?? 
                                require("../../../assets/images/misc/blank-bg.png")
                            }
                            bodyLength={500}
                        />
                    </BgColor>
                    <BgMediaModal>
                        <BgMediaHeading>Form Title</BgMediaHeading>
                        <BgMediaBody textAlign="center">
                            Pick a selection below! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        </BgMediaBody>
                        <LLink to={"/gift-ship-form#form"}>
                            <Button 
                                type="button"
                                size={SIZES.LG} 
                                color={theme.color.yellow}
                            >
                                Complete Form
                            </Button>
                        </LLink>
                    
                    </BgMediaModal>
                </BgMediaContainer>
                <Wrapper>
                    <form onSubmit={orderForm.handleSubmit(placeOrder)}>
                        <Grid fluid>
                            <H2 id="form">Choose Product(s)</H2>
                            <Row>
                                <Column sm={12}>
                                    {/* TODO: is cloneDeep needed here? */}
                                    <ProductSelector
                                        products={_.cloneDeep(products)}
                                        selectedChoice={_.cloneDeep(selectedChoice)}
                                        productChoices={_.cloneDeep(productChoices)}
                                        formSettings={formSettings}
                                        setSelectedChoice={setSelectedChoice}
                                        setProductChoices={setProductChoices}
                                        deleteProductChoice={deleteProductChoice}
                                        // handleSizeChart={this.handleSizeChart}
                                        // sizeChart={this.state.sizeChart}
                                    />
                                </Column>
                                <Column sm={12}>
                                    {productChoices.length > 0 && (
                                        <Row align="center">
                                            <Hr/>
                                            <br/>
                                            <Column xs={12} textalign="center">
                                                <H3>Current Product Choice(s): {`${(formSettings?.reqChoices - productChoices.length)} remaining` }</H3> 
                                                {productChoices.map((productChoice, p) => {
                                                    return (
                                                        <div key={p}>
                                                            <Body 
                                                                display="inline" 
                                                                color={theme.color.green} 
                                                                size={SIZES.LG} 
                                                                margin="0"  
                                                                verticalAlign="middle"
                                                            >
                                                                {p+1}.)&nbsp;
                                                                <b>{productChoice.name}</b>&nbsp;&nbsp;
                                                            </Body>
                                                            <Body 
                                                                margin="0" 
                                                                display="inline" 
                                                                size={SIZES.SM} 
                                                                color={theme.color.grey} 
                                                                onClick={() => deleteProductChoice(productChoice)} 
                                                                verticalAlign="middle"
                                                            >
                                                                delete
                                                            </Body>
                                                            {/* Check if product is varianted, if so then display variant choice  */}
                                                            {(productChoice?.variant?.name ?? "") && Object.keys(productChoice.variant).length !== 0 && (
                                                                <>
                                                                    {!(productChoice?.optionChoices?.[0] ?? false) ? 
                                                                        <div>
                                                                            <Body display="inline" margin="0" color={theme.color.red}><i>Choose {productChoice.variant.name} option</i></Body>
                                                                        </div>
                                                                    :
                                                                        <div>
                                                                            <Body display="inline" margin="0"><u>{productChoice.variant.name}</u> : <i>{productChoice.optionChoices[0].choice}</i></Body>
                                                                        </div>
                                                                    }
                                                                </>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </Column>
                                            <br/>
                                            <Hr/>
                                        </Row>
                                    )}
                                </Column>
                            </Row>

                            <H2>Shipping Information</H2>
                            <Row>
                                <Column sm={12} md={6}>
                                    <Label htmlFor={INPUT.FIRST_NAME.KEY} br>{INPUT.FIRST_NAME.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        placeholder={INPUT.FIRST_NAME.PLACEHOLDER} 
                                        error={orderForm.formState.errors[INPUT.FIRST_NAME.KEY]}
                                        {
                                            ...orderForm.register(INPUT.FIRST_NAME.KEY, { 
                                                    required: INPUT.FIRST_NAME.ERRORS.REQUIRED,
                                                    maxLength: {
                                                        value: INPUT.FIRST_NAME.ERRORS.MAX.KEY,
                                                        message: INPUT.FIRST_NAME.ERRORS.MAX.MESSAGE
                                                    },
                                                    minLength: {
                                                        value: INPUT.FIRST_NAME.ERRORS.MIN.KEY,
                                                        message: INPUT.FIRST_NAME.ERRORS.MIN.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.FIRST_NAME.KEY]} /> 
                                </Column>
                                <Column sm={12} md={6}>
                                    <Label htmlFor={INPUT.LAST_NAME.KEY} br>{INPUT.LAST_NAME.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        placeholder={INPUT.LAST_NAME.PLACEHOLDER} 
                                        error={orderForm.formState.errors[INPUT.LAST_NAME.KEY]}
                                        {
                                            ...orderForm.register(INPUT.LAST_NAME.KEY, { 
                                                    required: INPUT.LAST_NAME.ERRORS.REQUIRED,
                                                    maxLength: {
                                                        value: INPUT.LAST_NAME.ERRORS.MAX.KEY,
                                                        message: INPUT.LAST_NAME.ERRORS.MAX.MESSAGE
                                                    },
                                                    minLength: {
                                                        value: INPUT.LAST_NAME.ERRORS.MIN.KEY,
                                                        message: INPUT.LAST_NAME.ERRORS.MIN.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.LAST_NAME.KEY]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12} md={6}>
                                    <Label htmlFor={INPUT.EMAIL.KEY} br>{INPUT.EMAIL.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.EMAIL.KEY]}
                                        placeholder={INPUT.EMAIL.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.EMAIL.KEY, { 
                                                    required: INPUT.EMAIL.ERRORS.REQUIRED,
                                                    pattern: {
                                                        value: INPUT.EMAIL.ERRORS.PATTERN.KEY,
                                                        message: INPUT.EMAIL.ERRORS.PATTERN.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.EMAIL.KEY]} /> 
                                </Column>
                                <Column sm={12} md={6}>
                                    <Label htmlFor={INPUT.PHONE.KEY} br>{INPUT.PHONE.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.PHONE.KEY]}
                                        placeholder={INPUT.PHONE.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.PHONE.KEY, { 
                                                    required: INPUT.PHONE.ERRORS.REQUIRED,
                                                    maxLength: {
                                                        value: INPUT.PHONE.ERRORS.MAX.KEY,
                                                        message: INPUT.PHONE.ERRORS.MAX.MESSAGE
                                                    },
                                                    minLength: {
                                                        value: INPUT.PHONE.ERRORS.MIN.KEY,
                                                        message: INPUT.PHONE.ERRORS.MIN.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.PHONE.KEY]} /> 
                                </Column>
                            </Row>
                            <H3 margin="0">Address</H3>
                            <Row>
                                <Column sm={12}>
                                    <Label htmlFor={INPUT.ADDRESS.LINE1.KEY} br>Street:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.LINE1.KEY]}
                                        placeholder={INPUT.ADDRESS.LINE1.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.LINE1.KEY, { 
                                                    required: INPUT.ADDRESS.LINE1.ERRORS.REQUIRED,
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.LINE1.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.LINE1.ERRORS.MAX.MESSAGE
                                                    },
                                                    minLength: {
                                                        value: INPUT.ADDRESS.LINE1.ERRORS.MIN.KEY,
                                                        message: INPUT.ADDRESS.LINE1.ERRORS.MIN.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.LINE1.KEY]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12}>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.LINE2.KEY]}
                                        placeholder={INPUT.ADDRESS.LINE2.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.LINE2.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.LINE2.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.LINE2.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.LINE2.KEY]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12}>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.LINE3.KEY]}
                                        placeholder={INPUT.ADDRESS.LINE3.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.LINE3.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.LINE3.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.LINE3.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.LINE3.KEY]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12} md={6} lg={3}>
                                    <Label htmlFor={INPUT.ADDRESS.CITY.KEY} br>{INPUT.ADDRESS.CITY.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.CITY.KEY]}
                                        placeholder={INPUT.ADDRESS.CITY.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.CITY.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.CITY.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.CITY.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.CITY.KEY]} /> 
                                </Column>
                                <Column sm={12} md={6} lg={3}>
                                    <Label htmlFor={INPUT.ADDRESS.STATE.KEY} br>{INPUT.ADDRESS.STATE.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.STATE.KEY]}
                                        placeholder={INPUT.ADDRESS.STATE.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.STATE.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.STATE.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.STATE.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.STATE.KEY]} /> 
                                </Column>
                                <Column sm={12} md={6} lg={3}>
                                    <Label htmlFor={INPUT.ADDRESS.ZIP.KEY} br>{INPUT.ADDRESS.ZIP.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.ZIP.KEY]}
                                        placeholder={INPUT.ADDRESS.ZIP.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.ZIP.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.ZIP.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.ZIP.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.ZIP.KEY]} /> 
                                </Column>
                                <Column sm={12} md={6} lg={3}>
                                    <Label htmlFor={INPUT.ADDRESS.COUNTRY.KEY} br>{INPUT.ADDRESS.COUNTRY.LABEL}:</Label>
                                    <TextInput
                                        type="text" 
                                        error={orderForm.formState.errors[INPUT.ADDRESS.CITY.KEY]}
                                        placeholder={INPUT.ADDRESS.COUNTRY.PLACEHOLDER} 
                                        {
                                            ...orderForm.register(INPUT.ADDRESS.COUNTRY.KEY, { 
                                                    maxLength: {
                                                        value: INPUT.ADDRESS.COUNTRY.ERRORS.MAX.KEY,
                                                        message: INPUT.ADDRESS.COUNTRY.ERRORS.MAX.MESSAGE
                                                    },
                                                }
                                            )
                                        } 
                                    />
                                    <FormError error={orderForm.formState.errors[INPUT.ADDRESS.COUNTRY.KEY]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12} textalign="center">
                                    <Body>
                                        By submitting this form you are accepting the&nbsp;
                                        <LLink to="/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</LLink> and&nbsp;
                                        <LLink to="/terms-conditions" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</LLink>.
                                    </Body>
                                </Column>
                            </Row>
                            <Row>
                                <Column md={12} textalign="center">
                                    <Button
                                        size={SIZES.LG}
                                        type="submit" 
                                        disabled={submitting.order}
                                    >
                                        Submit
                                    </Button>
                                </Column>
                            </Row>
                        </Grid>
                    </form>
                </Wrapper>
            </>
        )
    }
}

export default GiftShipForm;
