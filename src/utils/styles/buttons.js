import styled from 'styled-components';
import { BTN_TYPES } from '../constants';
import { BodyFont } from './text';

// ** Do we need to set the type for each button? like ` type="button" `
export const Button = styled.button`
    ${BodyFont}
    transition: background-color 0.15s linear, color 0.15s linear, border 0.15s linear;
    margin: 5px;
    color: ${props => props.btnType !== BTN_TYPES.INVERTED ? (props.btnType !== BTN_TYPES.TEXTED ? 'white' : 'black') : (props?.theme?.colors[props.color] ?? "black")};
    border: ${props => (!props.inverted && props.btnType === BTN_TYPES.TEXTED) ? 'transparent' : (props?.theme?.colors[props.color] ?? "black")} solid 2px; 
    border-radius: ${props => !props.rounded ? '0px' : '20px'};
    background-color: ${props => (props.btnType !== BTN_TYPES.INVERTED && props.btnType !== BTN_TYPES.TEXTED) ? (props?.theme?.colors[props.color] ?? "black") : 'transparent'};
    cursor: pointer;
    a {
        text-decoration: none; 
        color: ${props => props.btnType !== BTN_TYPES.INVERTED ? (props.btnType !== BTN_TYPES.TEXTED ? 'white' : 'black') : (props?.theme?.colors[props.color] ?? "black")};
    }

    // Sizing
    ${(props) => (props.size === 'sm') && `
        font-size: 12px;
        padding: 5px 25px;
        font-weight: 600;
    `}

    ${(props) => (props.size === 'md' || !props.size) && `
        font-size: 14px;
        padding: 10px 35px;
        font-weight: 700;
    `}

    ${(props) => (props.size === 'lg') && `
        font-size: 16px;
        padding: 15px 45px;
        font-weight: 700;
    `}

    // Psuedo-classes
    &:hover {
        text-decoration: none;
        cursor: pointer;
        background-color: ${props => (props.btnType !== BTN_TYPES.INVERTED && props.btnType !== BTN_TYPES.TEXTED) ? 'transparent' : (props?.theme?.colors[props.color] ?? "black")};
        color: ${props => (props.btnType !== BTN_TYPES.INVERTED) ? (props.btnType !== BTN_TYPES.TEXTED ? (props?.theme?.colors[props.color] ?? "black") : !props.color.includes('light') ? 'white' : 'black') : 'white'};
        border: ${props => (props?.theme?.colors[props.color] ?? "black")} solid 2px;
        a {
            color: ${props => props.btnType !== BTN_TYPES.INVERTED ? (props?.theme?.colors[props.color] ?? "black") : 'white'};
        }
    }

    &:focus {
        border: none;
    }
`;