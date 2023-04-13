import React from 'react'
import { BiInfoCircle } from 'react-icons/bi';
import { useTheme } from 'styled-components';
import { DATA_TYPE, SIZES } from '../../utils/constants';
import { Column, Row } from '../../utils/styles/misc';
import { Body, Label } from '../../utils/styles/text';
import { Tooltip } from '../misc/Misc';
import CustomArrayInput from './CustomArrayInput';
import CustomInput from './CustomInput';
import { getDefaultBreakpointValue } from '../../utils/misc';

export default function CustomObjectInput(props) {
    const theme = useTheme();

    const label = 
        <Label htmlFor={props.itemColumn.key} br>
            {props.itemColumn.label}{props.labelCount ? <sup>{props.labelCount+1}</sup> : ""}:
            {/* {itemColumn.label}{labelCount ? <sup>{labelCount+1}</sup> : <sup>{1}</sup>}: */}
            {props.itemColumn.tooltip && <Tooltip link={props.itemColumn.tooltipLink} text={props.itemColumn.tooltip}>&nbsp;<BiInfoCircle /></Tooltip>}
            {(props.itemColumn?.validators?.required ?? false) && <Body margin="0" display={"inline"} color={theme.color.red}>&nbsp;*</Body>}
        </Label>;
    
    return (
        <>
            <Column margin="0" xs={12}>{label}</Column>
            <Column margin="0" xs={12}>
                <Row padding="0 0 0 10px">
                    {
                        props.itemColumn.nestedColumns.filter(nestedColumn => (!nestedColumn.uneditable)).map((nestedColumn) => {
                            if (nestedColumn.type === DATA_TYPE.ARRAY && nestedColumn.subColumns && nestedColumn.defaultArrayFieldStruct) {
                                // Reasons for a separate input component detailed within!
                                return (
                                    <Column
                                        key={nestedColumn.key}
                                        xs={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XS)}
                                        sm={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.SM)}
                                        md={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.MD)}
                                        lg={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.LG)}
                                        xl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XL)}
                                        xxl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XXL)}
                                        xxxl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XXXL)}
                                    >
                                        <CustomArrayInput
                                            nestedColumn={nestedColumn}
                                            {...props} 
                                        />
                                    </Column>
                                )
                            } else {
                                return (
                                    <Column
                                        key={nestedColumn.key}
                                        xs={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XS)}
                                        sm={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.SM)}
                                        md={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.MD)}
                                        lg={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.LG)}
                                        xl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XL)}
                                        xxl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XXL)}
                                        xxxl={getDefaultBreakpointValue(nestedColumn.breakpoints, SIZES.XXXL)}
                                    >
                                        <CustomInput 
                                            nestedColumn={nestedColumn}
                                            {...props} 
                                        />
                                    </Column>
                                )
                            }
                        })
                    }
                </Row>
            </Column>
        </>
    )
    
    
}
