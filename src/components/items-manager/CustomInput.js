import React, { useEffect, useState, useRef } from 'react'
import { BiInfoCircle } from 'react-icons/bi';
import { useTheme } from 'styled-components';
import { Controller } from 'react-hook-form';
import { AiOutlineArrowDown, AiOutlineArrowRight } from 'react-icons/ai';
import { CgClose } from 'react-icons/cg';
import { Hidden, Visible } from 'react-grid-system';
import { Editor } from '@tinymce/tinymce-react';

import { BTYPES, CRUD, DATA_TYPE, SCHEMES, SIZES } from '../../utils/constants';
import { CheckboxInput, CheckboxLabel, SelectInput, TextAreaInput, TextInput, TimestampPicker, RadioInput, Button } from '../../utils/styles/forms';
import { Body, H3, Label } from '../../utils/styles/text';
import { FormError, Tooltip } from '../misc/Misc';
import { Column, Hr, ModalCard, ModalContainer, Row } from '../../utils/styles/misc';
import FileUpload from './FileUpload';
import { Img } from '../../utils/styles/images';

export default function CustomInput(props) {
    const theme = useTheme();
    
    const [fetched, setFetched] = useState({ 
        initialValue: false,
    });

    const [shownModals, setShownModals] = useState([]); 

    const trueColumn = props.nestedColumn ? props.nestedColumn : props.itemColumn;

    const fieldKey = props.nestedColumn ? `${props.itemColumn.key}.${props.nestedColumn.key}` : props.itemColumn.key;
    const fieldPlaceholder = props.nestedColumn ? props.nestedColumn.placeholder : props.itemColumn.placeholder;
    let fieldValidators = { valueAsNumber: false };
    fieldValidators = {...trueColumn.validators, ...fieldValidators};
    const fieldLabel = trueColumn.label;
    const fieldTooltip = trueColumn.tooltip;
    const fieldTooltipLink  = trueColumn.tooltipLink;
    const fieldIsRequired = trueColumn?.validators?.required ?? false;
    const fieldType = trueColumn.type;
    const error = (props.nestedColumn ? props.setItemForm.formState.errors[props.itemColumn.key]?.[props.nestedColumn.key] : props.setItemForm.formState.errors[props.itemColumn.key]);
    const label = 
        <Label htmlFor={fieldKey} size={props.nestedColumn ? SIZES.SM : SIZES.MD} br>
            {fieldLabel}:
            {fieldTooltip && <Tooltip link={fieldTooltipLink} text={fieldTooltip}>&nbsp;<BiInfoCircle /></Tooltip>}
            {(fieldIsRequired) && <Body size={(props.nestedColumn) ? SIZES.SM : SIZES.MD} margin="0" display={"inline"} color={theme.color.red}>&nbsp;*</Body>}
        </Label>;  
        
    const editorRef = useRef(null);

    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals];
        tempShownModals[index] = newStatus;
        setShownModals(tempShownModals);
    };
    const setFileUrls = (urls, valueName) => {
        props.setItemForm.setValue(valueName, urls, { shouldValidate: true, shouldDirty: true })
        toggleModal(false, valueName)
        props.setSubmitting(prevState => ({
            ...prevState,
            files: false
        }));
        props.setSubmitted(prevState => ({
            ...prevState,
            files: true
        }));
    };

    // Only grabbing initial values once
    useEffect(() => {
        if(!fetched.initialValue){
            if (!props.updatingItem && trueColumn?.initialValue) {
                let tempValue = props.setItemForm.getValues();
                // Creating, so just grab the initialArrayField from itemStructure declaration, dont want overwritten values pulled from database
                tempValue[fieldKey] = trueColumn.initialValue;
                if (trueColumn.isBool) {
                    const convertedBool = (trueColumn.initialValue === "true" || trueColumn.initialValue === true); // Convert to boolean
                    tempValue[fieldKey] = convertedBool;
                }
                
                props.setItemForm.reset(tempValue);
            }
            setFetched(prevState => ({
                ...prevState,
                initialValue: true
            }));
        }
    }, [trueColumn, props.setItemForm, fetched.initialValue, props.updatingItem, fieldKey]);

    if (fieldType === DATA_TYPE.TEXT) {
        return (
            <>
                {label}
                <TextInput
                    type="text"
                    error={error}
                    placeholder={fieldPlaceholder ? fieldPlaceholder : `Enter a short text value.`}
                    {
                        ...props.setItemForm.register(fieldKey, fieldValidators)
                    }
                />
                <FormError error={error} />
            </>
        )
    } else if (fieldType === DATA_TYPE.NUMBER) {
        fieldValidators.valueAsNumber = true;
        return (
            <>
                {label}
                <TextInput
                    type="number"
                    error={error}
                    placeholder={fieldPlaceholder ? fieldPlaceholder : 0}
                    {
                        ...props.setItemForm.register(fieldKey, fieldValidators)
                    }
                />
                <FormError error={error} />
            </>
        )
    } else if (fieldType === DATA_TYPE.TEXTAREA) {
        return (
            <>
                {label}
                <pre>
                    <TextAreaInput
                        error={error}
                        placeholder={fieldPlaceholder ? fieldPlaceholder : `Enter a long text value.`}
                        {
                            ...props.setItemForm.register(fieldKey, fieldValidators)
                        }
                    />
                </pre> 
                <FormError error={error} /> 
            </>
        )
    } else if (fieldType === DATA_TYPE.SELECT) {
        return (
            <>
                {label}
                <SelectInput 
                    width={"100%"}
                    error={error}
                    {
                        ...props.setItemForm.register(fieldKey, fieldValidators)
                    }
                >
                    <option key={""} value={""}>No selection</option>
                    {
                        trueColumn.options.map((option) => {
                            if (trueColumn.userLookup) {
                                // If we need to lookup what labels to show for these options, we need to do that here as well.
                                const foundUser = props.users.find(user => user.id === option);
                                if(foundUser){
                                    return (
                                        <option key={option} value={option}>
                                            {
                                                (props.user.id === foundUser.id) 
                                                ?
                                                `${foundUser.name} (You!)`
                                                :
                                                foundUser.name
                                            }
                                        </option>
                                    )
                                } else {
                                    return (
                                        <option key={option} value={option}>
                                            User not found
                                        </option>
                                    );
                                }
                            } else if (trueColumn.productLookup) {
                                // If we need to lookup what labels to show for these options, we need to do that here as well.
                                const foundProduct = props.products.find(product => product.name === option);
                                if(foundProduct){
                                    return (
                                        <option key={option} value={option}>
                                            {foundProduct.name}
                                        </option>
                                    )
                                } else {
                                    return (
                                        <option key={option} value={option}>
                                            Product not found
                                        </option>
                                    );
                                }
                            } else {
                                // Normal, non-ID lookup, option
                                return (
                                    <option key={option} value={option}>{option}</option>
                                )
                            }
                            
                        })
                    }
                </SelectInput>
                <FormError error={error} /> 
            </>
        )
    } else if (fieldType === DATA_TYPE.CHECKBOX) {
        return (
            <>
                {label}
                {
                    trueColumn.options.map((option) => {
                        return (
                            <div key={option}>
                                <CheckboxInput
                                    {
                                        ...props.setItemForm.register(fieldKey, fieldValidators)
                                    }
                                    name={fieldKey}
                                    value={option}
                                />
                                <CheckboxLabel>{option}</CheckboxLabel>
                            </div>
                        )
                    })
                }
                <FormError error={error} />
            </>
        )
    } else if (fieldType === DATA_TYPE.RADIO) {
        if (trueColumn.isBool) {
            return (
                <>
                    {label}
                    <Controller
                        name={fieldKey}
                        control={props.setItemForm.control}
                        rules={fieldValidators}
                        render={({ field: { onChange, value } }) => (
                            <>
                            <RadioInput
                                name={fieldKey}
                                error={error}
                                onChange={() => onChange(true)}
                                checked={value === true}
                            />
                            <Body display="inline" margin="0">Yes</Body>
                            <RadioInput
                                name={fieldKey}
                                error={error}
                                onChange={() => onChange(false)}
                                checked={value === false}
                            />
                            <Body display="inline" margin="0">No</Body>
                            </>
                        )}
                    />
                   
                    <FormError error={error} />
                </>
            )
        } else {
            return (
                <>
                    {label}
                    {
                        trueColumn.options.map((option) => {
                            return (
                                <div key={option}>
                                    <RadioInput
                                        name={fieldKey}
                                        value={option}
                                        error={error}
                                        {
                                            ...props.setItemForm.register(fieldKey, fieldValidators)
                                        } 
                                    />
                                    <Body display="inline" margin="0">{option}</Body>
                                </div>
                            )
                        })
                    }
                    <FormError error={error} />
                </>
            )
        }
    } else if (fieldType === DATA_TYPE.TIMESTAMP) {
        return (
            <>
                {label}
                 <Controller
                    control={props.setItemForm.control}
                    name={fieldKey}
                    rules={fieldValidators}
                    render={({ field }) => {
                        return (
                            <TimestampPicker
                                calendarType={"US"}
                                minDate={trueColumn.allowPrevDates? null : new Date()}
                                onChange={(date) => field.onChange(date ? date.getTime() : "")}
                                error={error}
                                value={field?.value ? new Date(field.value) : null}
                            />
                        )
                    }}
                />
                <FormError error={error} />
            </>
        )
    } else if (fieldType === DATA_TYPE.IMAGES) {
        return (
            <>
                <Row align="center">
                    <Column sm={12} md={4} textalign="center">
                        {label}
                        { props.updatingItem && props.updatingItem?.[fieldKey].map((url, u) => {
                            return (
                                <div key={u}>
                                    <Img 
                                        hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                        bgColor={theme.color.lightGrey}
                                        src={url || "https://via.placeholder.com/200x200?text=No+image+uploaded"}
                                        border={`2px solid ${theme.color.primary}`}
                                        alt={`${props.itemColumn.label} ${u}`}
                                        width={`100px`}
                                    />
                                </div>
                            )
                        })}
                        {!props.updatingItem &&  (
                            <Img 
                                hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                bgColor={theme.color.lightGrey}
                                src={"https://via.placeholder.com/200x200?text=No+image+uploaded"}
                                border={`2px solid ${theme.color.primary}`}
                                alt={`placeholder`}
                                width={`100px`}
                            />
                        )}
                        <br/>
                        <Button 
                            type="button"
                            btype={BTYPES.INVERTED} 
                            color={theme.color.yellow}
                            hidden={props.submitted.files}
                            onClick={() => toggleModal(true, fieldKey)}
                        >
                            {props.isEditorShown === CRUD.CREATE ? "Add" : "Update"} {props.itemColumn.label}
                        </Button>
                    </Column>
                    <Hidden xs sm>
                        <Column 
                            sm={12} md={4} 
                            textalign="center" 
                            hidden={!props.submitted.files}
                        >
                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                            <Body margin="0">Ready to save changes!</Body>
                        </Column>
                    </Hidden>
                    <Visible xs sm>
                        <Column 
                            sm={12} md={4} 
                            textalign="center" 
                            hidden={!props.submitted.files}
                        >
                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                            <Body margin="0">Ready to save changes!</Body>
                        </Column>
                    </Visible>
                    <Column 
                        sm={12} 
                        md={4} 
                        textalign="center" 
                        hidden={!props.submitted.files}
                    >
                        {label}
                        { props.submitted.files && props.setItemForm.getValues(fieldKey).map((url, u) => {
                            return (
                                <div key={u}>
                                    <Img 
                                        hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                        bgColor={theme.color.lightGrey}
                                        src={url || "https://via.placeholder.com/200x200?text=No+image+uploaded"}
                                        border={`2px solid ${theme.color.primary}`}
                                        alt={`incoming ${props.itemColumn.label} ${u}`}
                                        width={`100px`}
                                    />
                                </div>
                            )
                        })}
                        <br/>
                        <Button
                            type="button"
                            btype={BTYPES.TEXTED} 
                            color={theme.color.yellow}
                            onClick={() => toggleModal(true, fieldKey)}
                        >
                            Update selection
                        </Button>
                    </Column>
                </Row>

                {shownModals[fieldKey] && (
                    <ModalContainer onClick={() => toggleModal(false, fieldKey)}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update {props.itemColumn.label}:</H3>
                            <FileUpload
                                name={fieldKey}
                                path={`items/${props.itemCollection}/${props.itemColumn.key}/`}
                                accepts="image/*"
                                onUploadSuccess={setFileUrls}
                                setSubmitting={props.setSubmitting}
                                submitting={props.submitting}
                                setError={props.setItemForm.setError}
                                clearError={props.setItemForm.clearErrors}
                                error={error}
                                multiple={true}
                            />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, fieldKey)}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}
            </>
        )
    } else if (fieldType === DATA_TYPE.RICH_TEXT) {
        return (
            <>
                {label}
                <Controller
                    name={fieldKey}
                    control={props.setItemForm.control}
                    rules={fieldValidators}
                    render={({ field: { onChange, value } }) => (
                        <Editor
                            key={fieldKey}
                            apiKey={process.env.REACT_APP_TINY_MCE_API_KEY}
                            onInit={(evt, editor) => editorRef.current = editor}
                            onEditorChange={onChange}
                            value={value || ""}
                            init={{
                                height: 500,
                                placeholder: fieldPlaceholder ? fieldPlaceholder : `Enter a long text value.`,
                                font_family_formats: `
                                    Andale Mono=andale mono,times;
                                    Arial=arial,helvetica,sans-serif;
                                    Arial Black=arial black,avant garde;
                                    Book Antiqua=book antiqua,palatino;
                                    Comic Sans MS=comic sans ms,sans-serif;
                                    Courier New=courier new,courier;
                                    Georgia=georgia,palatino;
                                    Helvetica=helvetica;
                                    Impact=impact,chicago;
                                    ${theme.font.heading.name}=${theme.font.heading.name},arial;
                                    ${theme.font.subheading.name}=${theme.font.subheading.name},arial;
                                    ${theme.font.body.name}=${theme.font.body.name},arial;
                                    Oswald=oswald;
                                    Symbol=symbol;
                                    Tahoma=tahoma,arial,helvetica,sans-serif;
                                    Terminal=terminal,monaco;
                                    Times New Roman=times new roman,times;
                                    Trebuchet MS=trebuchet ms,geneva;
                                    Verdana=verdana,geneva;
                                    Webdings=webdings;
                                    Wingdings=wingdings,zapf dingbats`,
                                font_css: `
                                    @import url(${theme.font.heading.url});
                                    @import url(${theme.font.subheading.url});
                                    @import url(${theme.font.body.url});
                                    @import url(https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&display=swap);
                                `,
                                plugins: [
                                    'advlist',
                                    'autolink',
                                    'lists',
                                    'link',
                                    'image',
                                    'charmap',
                                    'preview',
                                    'anchor',
                                    'searchreplace',
                                    'visualblocks',
                                    'code',
                                    'fullscreen',
                                    'insertdatetime',
                                    'media',
                                    'table',
                                    'code',
                                    'help',
                                    'wordcount',
                                    "image",
                                    "imagetools",
                                    "inlinecss",
                                    "emoticons",
                                    "table",
                                    // "tinydrive", // TODO: do we want to pay for their file system or just use fstorage?
                                ],
                                toolbar: 'undo redo | styleselect | fontselect blocks fontfamily fontsize | ' +
                                    'bold italic link forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | emoticons image code ' +
                                    'removeformat | help',
                                skin: theme.value === SCHEMES.DARK ? "oxide-dark" : "oxide",
                                content_css: theme.value === SCHEMES.DARK ? "dark" : "default",
                                // image_advtab: true,
                                // TODO: need to default heading and body to the theme font, but the below suggested code doesnt work fully... pushing to database doesnt show on page! aka font family not in css / html
                                // content_style:`
                                //         h1, h2, h3, h4, h5 { font-family: ${theme.font.heading.name}; }
                                //         body { font-family: ${theme.font.body.name}; }
                                //     `,
                            }}
                        />
                    )}
                />
                <FormError error={error} /> 
            
            </>
        );
    } else {
        return null;
    }
}

