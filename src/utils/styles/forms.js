import { transparentize } from 'polished';
import DateTimePicker from 'react-datetime-picker';
import styled from 'styled-components';
import { BTYPES, SIZES } from '../constants.js';
import { BodyFont } from './text';

export const TextInput = styled.input`
// ** Can't directly pass the attribute here like we do for other inputs because it can be number, password, and regular text
    font-size: 16px;
    ${BodyFont};
    color: black !important;
    width: ${props => props.width ? props.width : "100%"};
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid black;
    border-radius: 2px;
    background-color: white;
    resize: none;
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.color.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};

    &:disabled {
        color: ${props => props.theme.color.grey} !important;
        cursor: not-allowed;
    }

    &:focus {
        outline-color: ${props => props.theme.color.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.color.primary};
    }
`;

export const TextAreaInput = styled.textarea.attrs({ 
    type: "textarea"
})`
    font-size: 16px;
    ${BodyFont};
    color: black !important;
    width: ${props => props.width ? props.width : "100%"};
    height: ${props => props.height ? props.height : "150px"};
    padding: 12px;
    box-sizing: border-box;
    border: 1px solid black;
    border-radius: 2px;
    background-color: white;
    resize: none;

    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.color.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};

    &:focus {
        outline-color: ${props => props.theme.color.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.color.primary};
    }
`;

export const RadioInput = styled.input.attrs({ 
    type: "radio"
})`
    transform: scale(1.25);
    margin: 10px;
    
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.color.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
`;

export const CheckboxInput = styled.input.attrs({ 
    type: "checkbox"
})`
    transform: scale(1.5);
    margin: 5px 15px 0 0;
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.color.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
`;

export const CheckboxLabel = styled.label`
    ${BodyFont};
    margin: 0 0 10px 0;
    display: inline-block;
`;

export const SelectInput = styled.select.attrs({ 
    type: "select"
})`
    padding: 8px;
    width: ${props => props.width ? props.width : ""};
    ${BodyFont};
    font-size: 16px;
    color: black;
    border: 1px solid black;
    border-radius: 2px;

    option {
        ${BodyFont};
        color: black;
        font-size: 16px;
    }
    
    /* Set focus if error */   
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
    -webkit-box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
    -moz-box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};

    &:focus {
        outline-color: ${props => props.theme.color.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.color.primary};
    }
`;

export const PageSelectInput = styled.select.attrs({ 
    type: "select"
})`
    font-size: 12px;
    option {
        ${BodyFont};
        color: black !important;
    }
`;

const sliderThumb = (props) => (`
  width: 50px;
  height: 50px;
  background: ${props.color};
  cursor: pointer;
  -webkit-transition: .2s;
  transition: opacity .2s;
`);

export const Slider = styled.div`
    align-items: center;
    color: black;
    margin-top: 2rem;
    margin-bottom: 2rem;
    input {
        -webkit-appearance: none;
        width: 100%;
        height: 18px;
        border-radius: 5px;
        background: lightgrey;
        outline: none;
        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            ${props => sliderThumb(props)};
        }
        &::-moz-range-thumb {
            ${props => sliderThumb(props)};
        }
    }
`;

// File input
export const FileDragDiv = styled.div`
    transition: all 0.3s linear;
    max-width: 100%;
    position: relative;
    background-color: ${props => props.dragActive ? props.theme.color.primary : "transparent"};
`;

export const FileInputLabel = styled.label`
    transition: all 0.3s linear;
    display: block;
    cursor: pointer;
    color: ${props => props.selected ? props.theme.color.green : props.theme.color.font.body};
    border: 2px solid ${props => props.selected ? props.theme.color.green : props.theme.color.primary};
    font-size: 18px;
    padding: 20px;
    margin: 25px 0px;
    ${BodyFont};

    &:hover {
        background-color: ${props => transparentize(0.6, props.selected ? props.theme.color.green : props.theme.color.primary)};
    }
`;

export const FileInput = styled.input.attrs({ 
    type: "file"
})`
    display: none;
`;

export const FileDragBox = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

export const SearchContainer = styled.div`
    position: relative;
    display: flex;
    svg {
        position: absolute;
        top: 14px;
        left: 15px;
    }

    input {
        padding-left: 40px; 
    }
`;

export const TimestampPicker = styled(DateTimePicker)`
    .react-datetime-picker__wrapper {
        ${BodyFont};
        padding: 10px;
        background: white;
        border: 1px solid black;
        border-radius: 2px;
        box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
        -webkit-box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};
        -moz-box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.color.red : "none"};  
    }
    
    .react-datetime-picker__calendar {
        
    }

    .react-datetime-picker__inputGroup {
        input {
            ${BodyFont};
            color: black;
        }
    }

    .react-calendar__navigation__label__labelText {
        ${BodyFont};
        color: black;
    }

    abbr {
        ${BodyFont};
        color: black;
    }

    .react-datetime-picker__inputGroup__divider, .react-datetime-picker__inputGroup__leadingZero {
        ${BodyFont};
        color: black;
    }

    .react-datetime-picker__calendar--open,
    .react-datetime-picker__calendar--closed,
    .react-datetime-picker__clock--open,
    .react-datetime-picker__clock--closed {
        position: absolute;
    }
`;

export const Button = styled.button`
    ${BodyFont};
    transition: background-color 0.15s linear, color 0.15s linear, border 0.15s linear;
    margin: 5px;
    color: ${props => props.btype !== BTYPES.INVERTED ? (props.btype !== BTYPES.TEXTED ? props.theme.color.font.solid : (props.color ?? props.theme.color.primary)) : (props.color ?? props.theme.color.primary)};
    border: ${props => (props.btype !== BTYPES.INVERTED && props.btype === BTYPES.TEXTED) ? "transparent" : (props.color ?? props.theme.color.primary)} solid 2px; 
    border-radius: ${props => !props.rounded ? "0px" : "20px"};
    background-color: ${props => (props.btype !== BTYPES.INVERTED && props.btype !== BTYPES.TEXTED) ? (props.color ?? props.theme.color.primary) : "transparent"};
    display: ${props => props.display ? props.display : "inline"};
    cursor: pointer;

    a {
        text-decoration: none; 
        color: ${props => props.btype !== BTYPES.INVERTED ? (props.btype !== BTYPES.TEXTED ? "white" : "black") : (props.color ?? props.theme.color.primary)};
    }
    
    // Sizing
    ${(props) => (props.size === SIZES.SM) && `
        font-size: 12px;
        padding: 5px 25px;
        font-weight: 600;
    `}

    ${(props) => (props.size === SIZES.MD || !props.size) && `
        font-size: 14px;
        padding: 10px 35px;
        font-weight: 700;
    `}

    ${(props) => (props.size === SIZES.LG) && `
        font-size: 16px;
        padding: 15px 45px;
        font-weight: 700;
    `}

    ${(props) => (props.size === SIZES.XL) && `
        font-size: 22px;
        padding: 25px 60px;
        font-weight: 700;
    `}

    ${(props) => (props.size === SIZES.XXL) && `
        font-size: 28px;
        padding: 30px 80px;
        font-weight: 900;
    `}

    ${(props) => (props.size === SIZES.XXXL) && `
        font-size: 36px;
        padding: 45px 100px;
        font-weight: 900;
    `}

    // Psuedo
    &:hover {
        text-decoration: none;
        cursor: pointer;
        background-color: ${props => (props.btype !== BTYPES.INVERTED && props.btype !== BTYPES.TEXTED) ? "transparent" : (props.color ?? props.theme.color.primary)};
        color: ${props => (props.btype !== BTYPES.INVERTED) ? (props.btype !== BTYPES.TEXTED ? (props.color ?? props.theme.color.font.inverted) : !props.color ? props.theme.color.font.solid : "black") : props.theme.color.font.solid};
        border: ${props => (props.color ?? props.theme.color.primary)} solid 2px;
        a {
            color: ${props => props.btype !== BTYPES.INVERTED ? (props.color ?? props.theme.color.primary) : "white"};
        }
    }

    &:focus {
        outline-color: ${props => props.theme.color.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.color.primary};
    }
`;