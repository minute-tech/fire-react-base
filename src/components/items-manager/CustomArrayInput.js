import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray} from 'react-hook-form';
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import { FaTrash } from 'react-icons/fa';
import { useTheme } from 'styled-components';
import { DATA_TYPE, SIZES } from '../../utils/constants';
import { Button, CheckboxInput, CheckboxLabel, SelectInput, TextInput } from '../../utils/styles/forms';
import { Column, Hr, Row } from '../../utils/styles/misc';
import { Body, Label } from '../../utils/styles/text';
import { FormError, Tooltip } from '../misc/Misc';
import { getDefaultBreakpointValue } from '../../utils/misc';
import CustomObjectInput from './CustomObjectInput';

export default function CustomArrayInput(props) {
    const theme = useTheme();
    
    const [fetched, setFetched] = useState({ 
        initialValue: false,
    });

    const trueColumn = props.nestedColumn ? props.nestedColumn : props.itemColumn;
    const fieldKey = props.nestedColumn ? `${props.itemColumn.key}.${props.nestedColumn.key}` : props.itemColumn.key;
    let fieldValidators = { valueAsNumber: false };
    fieldValidators = {...trueColumn.validators, ...fieldValidators};
    const fieldLabel = trueColumn.label;
    const fieldTooltip = trueColumn.tooltip;
    const fieldTooltipLink  = trueColumn.tooltipLink;
    const fieldIsRequired = trueColumn?.validators?.required ?? false;
    const error = props.nestedColumn ? props.setItemForm.formState.errors?.[props.itemColumn.key]?.[props.nestedColumn.key]?.root : props.setItemForm.formState.errors?.[props.itemColumn.key]?.root;
    const label = 
        <Label htmlFor={fieldKey} size={(props.nestedColumn || props.isRecursiveArray) ? SIZES.SM : SIZES.MD} br>
            {fieldLabel}:
            {fieldTooltip && <Tooltip link={fieldTooltipLink} text={fieldTooltip}>&nbsp;<BiInfoCircle /></Tooltip>}
            {(fieldIsRequired) && <Body size={(props.nestedColumn || props.isRecursiveArray) ? SIZES.SM : SIZES.MD} margin="0" display={"inline"} color={theme.color.red}>&nbsp;*</Body>}
        </Label>;

    // ** This value is the only reason why I had to split CustomInput and CustomArrayInput. 
    // I couldn't call this conditionally, I was breaking React Hooks rules!
    const fieldArray = useFieldArray({
        control: props.setItemForm.control,
        name: fieldKey,
        rules: fieldValidators,
    });

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
    return (
        <>
            <Column margin="0" xs={12}>{label}</Column>
            <Column margin="0" xs={12}>
                 {
                    fieldArray.fields.map((field, f) => {
                        return (
                            <Row key={f} align={"center"} padding="0 0 0 10px">
                                { 
                                    trueColumn.subColumns.map((subColumn, s) => {
                                        const subError = props.setItemForm.formState?.errors?.[fieldKey]?.[f]?.[subColumn.key] ?? "";
                                        const subPlaceholder = subColumn?.placeholder ?? "";
                                        let subValidators = { valueAsNumber: false };
                                        subValidators = {...subColumn.validators, ...subValidators};
                                        const subLabel = 
                                            <Label htmlFor={subColumn.key} br size={(subColumn) ? SIZES.XS : SIZES.SM}>
                                                {subColumn.label}:
                                                {subColumn.tooltip && <Tooltip link={subColumn.tooltipLink} text={subColumn.tooltip}>&nbsp;<BiInfoCircle /></Tooltip>}
                                                {(subColumn?.validators?.required ?? false) && <Body size={(subColumn) ? SIZES.XS : SIZES.SM} margin="0" display={"inline"} color={theme.color.red}>&nbsp;*</Body>}
                                            </Label>;
                                            
                                        // Test for data type
                                        if (subColumn.type === DATA_TYPE.TEXT) {
                                            return (
                                                <Column
                                                    key={s}
                                                    xs={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XS)}
                                                    sm={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.SM)}
                                                    md={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.MD)}
                                                    lg={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.LG)}
                                                    xl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XL)}
                                                    xxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXL)}
                                                    xxxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXXL)}
                                                >
                                                    {subLabel}
                                                    <Controller
                                                        name={`${fieldKey}.${f}.${subColumn.key}`}
                                                        control={props.setItemForm.control}
                                                        rules={subValidators}
                                                        render={({ field }) => (
                                                            <TextInput
                                                                type="text"
                                                                placeholder={subPlaceholder ? subPlaceholder : `Enter a long text value.`}
                                                                key={field.id}
                                                                error={subError}
                                                                {...props.setItemForm.register(`${fieldKey}.${f}.${subColumn.key}`, subValidators)}
                                                            />
                                                        )}
                                                    />
                                                    <FormError error={subError} /> 
                                                </Column>
                                            )
                                        } else if (subColumn.type === DATA_TYPE.NUMBER) {
                                            subValidators.valueAsNumber = true;
                                            return (
                                                <Column
                                                    key={s}
                                                    xs={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XS)}
                                                    sm={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.SM)}
                                                    md={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.MD)}
                                                    lg={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.LG)}
                                                    xl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XL)}
                                                    xxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXL)}
                                                    xxxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXXL)}
                                                >
                                                    {subLabel}
                                                    <Controller
                                                        name={`${fieldKey}.${f}.${subColumn.key}`}
                                                        control={props.setItemForm.control}
                                                        rules={subValidators}
                                                        render={({ field }) => (
                                                            <TextInput
                                                                type="number"
                                                                key={field.id}
                                                                error={subError}
                                                                placeholder={subPlaceholder ? subPlaceholder : 0}
                                                                {...props.setItemForm.register(`${fieldKey}.${f}.${subColumn.key}`, subValidators)}
                                                            />
                                                        )}
                                                    />
                                                    <FormError error={subError} /> 
                                                </Column>
                                            )
                                        } else if (subColumn.type === DATA_TYPE.SELECT) {
                                            return (
                                                <Column
                                                    key={s}
                                                    xs={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XS)}
                                                    sm={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.SM)}
                                                    md={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.MD)}
                                                    lg={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.LG)}
                                                    xl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XL)}
                                                    xxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXL)}
                                                    xxxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXXL)}
                                                >
                                                    {subLabel}
                                                    <Controller
                                                        name={`${fieldKey}.${f}.${subColumn.key}`}
                                                        control={props.setItemForm.control}
                                                        render={({ field: onChange }) => (
                                                            <SelectInput 
                                                                key={field.id}
                                                                width={"100%"}
                                                                error={subError} 
                                                                onClick={() => fieldArray.update()}
                                                                onChange={() => fieldArray.update()}
                                                                {...props.setItemForm.register(`${fieldKey}.${f}.${subColumn.key}`, subValidators)}
                                                            >
                                                                <option key={""} value={""}>No selection</option>
                                                                {
                                                                    subColumn.options.map((option) => {
                                                                        if (subColumn.userLookup) {
                                                                            const foundUser = props.users.find(user => user.id === option);
                                                                            if(foundUser){
                                                                                return (
                                                                                    <option 
                                                                                        key={option} 
                                                                                        value={option}
                                                                                        // Below hides duplicate user dropdowns
                                                                                        hidden={
                                                                                            (!subColumn?.noDups) ? null :
                                                                                            (fieldArray?.fields?.some(field => field[subColumn.key] === option) ? "hidden" : null)
                                                                                        }
                                                                                    >
                                                                                        {(props.user.id === foundUser.id) ?
                                                                                            `${foundUser.name} (You!)`
                                                                                            :
                                                                                            foundUser.name}
                                                                                    </option>
                                                                                )
                                                                            } else {
                                                                                return (
                                                                                    <option key={option} value={option}>
                                                                                        User not found
                                                                                    </option>
                                                                                );
                                                                            }
                                                                        } else if (subColumn.productLookup) {
                                                                            const foundProduct = props.products.find(product => product.name === option);
                                                                            if(foundProduct){
                                                                                return (
                                                                                    <option 
                                                                                        key={option} 
                                                                                        value={option}
                                                                                        // Below hides duplicate product dropdowns
                                                                                        hidden={
                                                                                            (!subColumn?.noDups) ? null :
                                                                                            (fieldArray?.fields?.some(field => field[subColumn.key] === option) ? "hidden" : null)
                                                                                        }
                                                                                    >
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
                                                                                <option 
                                                                                    key={option} 
                                                                                    value={option}
                                                                                    // Below hides duplicate role dropdowns
                                                                                    hidden={(!subColumn?.noDups) ? null :
                                                                                        (fieldArray?.fields?.some(field => field[subColumn.key] === option) ? "hidden" : null)} 
                                                                                >
                                                                                    {option}
                                                                                </option>
                                                                            )
                                                                        }
                                                                    })                                                               
                                                                }
                                                            </SelectInput>
                                                        )}
                                                    />
                                                    <FormError error={subError} /> 
                                                </Column>
                                            )
                                        } else if (subColumn.type === DATA_TYPE.CHECKBOX) {
                                            return (
                                                <Column
                                                    key={s}
                                                    xs={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XS)}
                                                    sm={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.SM)}
                                                    md={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.MD)}
                                                    lg={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.LG)}
                                                    xl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XL)}
                                                    xxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXL)}
                                                    xxxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXXL)}
                                                >
                                                    {subLabel}
                                                    <Controller
                                                        name={`${fieldKey}.${f}.${subColumn.key}`}
                                                        control={props.setItemForm.control}
                                                        render={({ field }) => 
                                                            (
                                                                subColumn.options.map((option) => {
                                                                    return (
                                                                        <div key={option}>
                                                                            <CheckboxInput
                                                                                onClick={() => fieldArray.update()}
                                                                                onChange={() => fieldArray.update()}
                                                                                key={field.id}
                                                                                { ...props.setItemForm.register(`${fieldKey}.${f}.${subColumn.key}`, subValidators) }
                                                                                value={option}
                                                                                checked={fieldArray.fields[f][`${subColumn.key}`]?.includes(option)}
                                                                        
                                                                            />
                                                                            <CheckboxLabel>{option}</CheckboxLabel>
                                                                        </div>
                                                                    )
                                                                })
                                                            )
                                                        }
                                                    />
                                                    
                                                    <FormError error={subError} /> 
                                                </Column>
                                            )
                                        } else if (subColumn.type === DATA_TYPE.OBJECT) {
                                            return (
                                                <CustomObjectInput
                                                    key={s}
                                                    labelCount={f}
                                                    itemColumn={subColumn}
                                                    users={props.users}
                                                    user={props.user}
                                                    products={props.products}
                                                    setItemForm={props.setItemForm}
                                                    updatingItem={props.updatingItem}
                                                />
                                            )
                                        } else if (subColumn.type === DATA_TYPE.ARRAY) {
                                            return (
                                                <Column
                                                    key={s}
                                                    xs={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XS)}
                                                    sm={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.SM)}
                                                    md={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.MD)}
                                                    lg={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.LG)}
                                                    xl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XL)}
                                                    xxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXL)}
                                                    xxxl={getDefaultBreakpointValue(subColumn.breakpoints, SIZES.XXXL)}
                                                >
                                                    <CustomArrayInput
                                                        itemColumn={subColumn}
                                                        users={props.users}
                                                        user={props.user}
                                                        products={props.products}
                                                        setItemForm={props.setItemForm}
                                                        updatingItem={props.updatingItem}
                                                        isRecursiveArray={true}
                                                    />
                                                </Column>
                                            )
                                        } else {
                                            console.log("Invalid subColumn type of: " + subColumn.type);
                                            return (
                                                <Body>Invalid!</Body>
                                            )
                                        }
                                    })
                                }
                                <Column sm={12} md={6} lg={4} xl={3}>
                                    <Button 
                                        type="button"
                                        size={SIZES.SM} 
                                        color={theme.color.red} 
                                        onClick={() => [fieldArray.remove(f), fieldArray.update()]}
                                    >
                                        <FaTrash /> Remove {fieldLabel}<sup>{f ? f+1 : 1}</sup> entry
                                    </Button>
                                </Column>
                            </Row>
                        )
                    })
                }
            </Column>
            <Column margin="0" sm={12}>
                <FormError error={error} />
            </Column>
            <Column margin="0" sm={12}>
                <Button 
                    size={SIZES.SM} 
                    color={theme.color.green} 
                    type="button"
                    onClick={() => [fieldArray.append(trueColumn.defaultArrayFieldStruct), fieldArray.update()]}
                >
                    <BiPlus /> Add new "{fieldLabel}" entry
                </Button>
            </Column>
            <Column margin="0" sm={12}>
                <Hr color={theme.color.grey} />
            </Column>
        </>
    )
}
