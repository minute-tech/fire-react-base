import React, { useState } from 'react'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';
import { useForm } from "react-hook-form";

import { firestore } from "../../Fire.js";
import { Centered, Column, Grid, Row } from '../../utils/styles/misc';
import { Body, ErrorText, H4, Label } from '../../utils/styles/text';
import { INPUT } from '../../utils/constants.js';
import { Emoji } from '../../utils/styles/images.js';
import { Button, Slider, TextAreaInput } from '../../utils/styles/forms.js';
import { FormError } from './Misc.js';

export function Feedback(props) {
    const theme = useTheme();
    const [neutral, setNeutral] = useState(false);
    const [rangeValue, setRangeValue] = useState(50);
    const [feedbackId, setFeedbackId] = useState("");
    const [submitted, setSubmitted] = useState({ 
        emotion: false,
        body: false,
    });
    const [submitting, setSubmitting] = useState({
        emotion: false,
        body: false,
    }); 
    const feedbackForm = useForm({
        defaultValues: {
            body: "",
        }
    });

    const submitEmotion = () => {
        setSubmitting(prevState => ({
            ...prevState,
            emotion: true
        }));

        let emotionLabel = "";
        let emotionSymbol = "";
        if (Number(rangeValue) === 50) {
            setNeutral(true);
        } else {
            if (rangeValue < 25) {
                emotionLabel="very unhappy"
                emotionSymbol = "0x1F621"
            } else if (rangeValue >= 25 && rangeValue < 50) {
                emotionLabel="unhappy"
                emotionSymbol = "0x1F641"
            } else if (rangeValue > 50 && rangeValue < 75) {
                emotionLabel="happy"
                emotionSymbol = "0x1F642"
            } else if (rangeValue >= 75 && rangeValue <= 100) {
                emotionLabel="very happy"
                emotionSymbol = "0x1F604"
            }
            

            addDoc(collection(firestore, "feedback", feedbackId), {
                rangeValue: rangeValue,
                emotionLabel: emotionLabel,
                emotionSymbol: emotionSymbol,
                userId: props.user ? props.user.id : "",
                timestamp: Date.now(),
            }).then((docRef) => {
                setSubmitting(prevState => ({
                    ...prevState,
                    emotion: false
                }));
                setSubmitted(prevState => ({
                    ...prevState,
                    emotion: true
                }));
                setFeedbackId(docRef.id);
            }).catch(error => {
                toast.error(`Error submitting feedback. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
                console.error("Error submitting feedback: " + error);
                setSubmitting(prevState => ({
                    ...prevState,
                    message: false
                }));
            });
        }
    }

    const submitMessage = (data) => {   
        setSubmitting(prevState => ({
            ...prevState,
            body: true
        }));

        updateDoc(doc(firestore, "feedback", feedbackId), {
            body: data.body,
        }).then(() => {
            setSubmitting(prevState => ({
                ...prevState,
                body: false
            }));
            setSubmitted(prevState => ({
                ...prevState,
                body: true
            }));
            toast.success("Feedback submitted successfully, thanks!");
            props.toggleModal(false, "feedback");
        }).catch(error => {
            toast.error(`Error submitting body message. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
            console.error("Error submitting body message: " + error);
            setSubmitting(prevState => ({
                ...prevState,
                body: false
            }));
        });
    }


    return (
        <>
            { !feedbackId && !submitted.message &&  (
                <Centered>
                    <H4>How was your experience? <Body spanned color={theme.colors.red}>(* optional)</Body></H4>
                    <Body margin="0"><b>(slide the square)</b></Body>
                    <Slider color={theme.colors.primary}>
                        <input 
                            type="range" 
                            min={0} 
                            max={100} 
                            value={rangeValue} 
                            className="slider" 
                            onChange={(e) => setRangeValue(e.target.value)} 
                        />
                        {renderEmotion(rangeValue)}
                    </Slider>
                    
                    {neutral && (
                        <div>
                            <ErrorText>Please select a <u>non-neutral</u> response to give <i>optional</i> feedback!</ErrorText>
                        </div>
                    )}
                    
                    <Button onClick={() => submitEmotion()}>Submit feedback</Button>
                </Centered>
            )}

            { feedbackId && submitted.emotion && (
                <Centered>
                    <H4>Thanks! Anything else you'd like to add?</H4>
                    <form onSubmit={ feedbackForm.handleSubmit(submitMessage) }>
                        <Grid fluid>
                            <Row>
                                <Column sm={12}>
                                    <Label htmlFor={INPUT.BODY.VALUE} br>{INPUT.BODY.LABEL}:</Label>
                                    <TextAreaInput
                                        placeholder={INPUT.BODY.PLACEHOLDER}  
                                        error={feedbackForm.formState.errors[INPUT.BODY.VALUE]}
                                        {
                                            ...feedbackForm.register(INPUT.BODY.VALUE, {
                                                required: INPUT.BODY.ERRORS.REQUIRED,
                                                maxLength: {
                                                    value: INPUT.BODY.ERRORS.MAX.VALUE,
                                                    message: INPUT.BODY.ERRORS.MAX.MESSAGE
                                                },
                                                minLength: {
                                                    value: INPUT.BODY.ERRORS.MIN.VALUE,
                                                    message: INPUT.BODY.ERRORS.MIN.MESSAGE
                                                },
                                            })
                                        } 
                                    />
                                    <FormError error={feedbackForm.formState.errors[INPUT.BODY.VALUE]} /> 
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12} textalign="center">
                                    <Button 
                                        type="submit" 
                                        disabled={submitting.body}
                                    >
                                        Submit
                                    </Button>
                                </Column>
                            </Row>
                        </Grid>
                    </form>
                </Centered>
            )}

            { submitted.message && (
                <H4>Thanks for the feedback!</H4>
            )}
        </>
    )
};

// TODO: convert to useMemo
const EmojiWithText = React.memo(({ className, label, symbol }) =>
    <Body className={className} role="img" aria-label={label}>
        <Emoji
            margin="15px 0 0 0" 
            display="block"
            size="45px"
        >
            {String.fromCodePoint(symbol)}
        </Emoji>
        <b>{label}</b>
    </Body>
);

function renderEmotion (rangeValue){
    if(rangeValue < 25){
        return (
            <EmojiWithText symbol="0x1F621" label="very unhappy"/>
        )
    } else if(rangeValue >= 25 && rangeValue < 50) {
        return (
            <EmojiWithText symbol="0x1F641" label="unhappy"/>
        )
    } else if(Number(rangeValue) === 50) {
        return (
            <EmojiWithText symbol="0x1F610" label="neutral"/>
        )
    } else if(rangeValue > 50 && rangeValue < 75) {
        return (
            <EmojiWithText symbol="0x1F642" label="happy"/>
        )
    } else if(rangeValue >= 75 && rangeValue <= 100) {
        return (
            <EmojiWithText symbol="0x1F604" label="very happy"/>
        )
    }
};