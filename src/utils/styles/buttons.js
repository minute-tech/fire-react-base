import styled from 'styled-components';
import { BTYPES, SIZES } from '../constants.js';
import { BodyFont } from './text';

// ** Do we need to set the type for each button? like ` type="button" `
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

        /* TODO: custom padding wasnt working
        padding: ${props => props.padding ? props.padding : "25px 60px"}; */


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