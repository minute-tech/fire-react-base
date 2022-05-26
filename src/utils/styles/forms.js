import styled from 'styled-components';
import { BTYPES, SIZES } from '../constants.js';
import { BodyFont } from './text';

export const TextInput = styled.input`
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
    outline-color: ${props => props.error ? props.theme.colors.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.colors.red : "none"};

    &:focus {
        outline-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.colors.primary};
    }

    @media (max-width: 768px) {
        width: 90%;
    }
`;

export const TextAreaInput = styled.textarea`
    font-size: 16px;
    ${BodyFont};
    color: black !important;
    width: ${props => props.width ? props.width : "100%"};
    height: 150px;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid black;
    border-radius: 2px;
    background-color: white;
    resize: none;

    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.colors.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.colors.red : "none"};

    &:focus {
        outline-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.colors.primary};
    }

    @media (max-width: 768px) {
        width: 90%;
    }
`;

export const RadioInput = styled.input`
    transform: scale(1.25);
    margin: 15px 15px 0 0;
    
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.colors.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.colors.red : "none"};
`;

export const CheckboxInput = styled.input`
    transform: scale(1.5);
    margin: 15px 15px 0 0;
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.colors.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.colors.red : "none"};
`;

export const CheckboxLabel = styled.label`
    ${BodyFont};
    margin: 0 0 10px 0;
    display: inline-block;
`;

export const SelectInput = styled.select`
    padding: 12px;
    option {
        ${BodyFont};
        color: black !important;
    }
    
    /* Set focus if error */
    outline-color: ${props => props.error ? props.theme.colors.red : "none"};
    box-shadow: 0 0 2pt 1pt ${props => props.error ? props.theme.colors.red : "none"};
`;

export const PageSelectInput = styled.select`
    font-size: 12px;
    option {
        ${BodyFont};
        color: black !important;
    }
`;

// File input
export const FileInputLabel = styled.label`
    display: block;
    cursor: pointer;
    color: ${props => props.selected ? props.theme.colors.red : props.theme.colors.font.body};
    border: 2px solid ${props => props.selected ? props.theme.colors.red : props.theme.colors.primary};
    font-size: 18px;
    padding: 20px;
    margin: 25px 0px;
    ${BodyFont};
`;

export const FileInput = styled.input`
    display: none;
`;

// Search
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

export const Button = styled.button`
    ${BodyFont}
    transition: background-color 0.15s linear, color 0.15s linear, border 0.15s linear;
    margin: 5px;
    color: ${props => props.btype !== BTYPES.INVERTED ? (props.btype !== BTYPES.TEXTED ? "white" : props.theme.colors.font.body) : (props.color ?? props.theme.colors.primary)};
    border: ${props => (props.btype !== BTYPES.INVERTED && props.btype === BTYPES.TEXTED) ? "transparent" : (props.color ?? props.theme.colors.primary)} solid 2px; 
    border-radius: ${props => !props.rounded ? "0px" : "20px"};
    background-color: ${props => (props.btype !== BTYPES.INVERTED && props.btype !== BTYPES.TEXTED) ? (props.color ?? props.theme.colors.primary) : "transparent"};
    cursor: pointer;
    a {
        text-decoration: none; 
        color: ${props => props.btype !== BTYPES.INVERTED ? (props.btype !== BTYPES.TEXTED ? "white" : "black") : (props.color ?? props.theme.colors.primary)};
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

    // Psuedo-classes
    &:hover {
        text-decoration: none;
        cursor: pointer;
        background-color: ${props => (props.btype !== BTYPES.INVERTED && props.btype !== BTYPES.TEXTED) ? "transparent" : (props.color ?? props.theme.colors.primary)};
        color: ${props => (props.btype !== BTYPES.INVERTED) ? (props.btype !== BTYPES.TEXTED ? (props.color ?? props.theme.colors.primary) : !props.color ? "white" : "black") : "white"};
        border: ${props => (props.color ?? props.theme.colors.primary)} solid 2px;
        a {
            color: ${props => props.btype !== BTYPES.INVERTED ? (props.color ?? props.theme.colors.primary) : "white"};
        }
    }
`;