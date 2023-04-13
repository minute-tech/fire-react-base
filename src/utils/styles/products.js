import styled from "styled-components";
import { lighten } from 'polished';

import { BodyFont } from "./text";

export const ProductPreview = styled.div`
    padding: 10px;
    margin: 40px 15px;
    cursor: pointer;
    border: ${props => {
        if(props.isSoldOut){
            return `2px solid ${props.theme.color.red}`
        } else if(props.selected) {
            return `2px solid ${props.theme.color.primary}`;
        } else {
            return ``;
        }
    }};
    border-left: ${props => {
        if(props.isSoldOut){
            return ``
        } else if(props.selected) {
            return ``;
        } else {
            return `2px solid ${props.theme.color.primary}`;
        }
    }};
    border-bottom: ${props => {
        if(props.isSoldOut){
            return ``
        } else if(props.selected) {
            return ``;
        } else {
            return `2px solid ${props.theme.color.primary}`;
        }
    }};
    background-color: ${props => {
        if(props.isSoldOut){
            return `${lighten(0.5, props.theme.color.red)}`
        } else if(props.selected) {
            return `rgba(38, 153, 0, 0.2)`;
        } else {
            return '';
        }
    }};
    transition: background-color 0.2s linear;
    &:hover {
        background-color: ${props => props.isSoldOut ? '' : "rgba(38, 153, 0, 0.5)" } ;
        border: 2px solid ${props => props.isSoldOut ? '' : props.theme.color.primary };
    }
`;

export const ProductImg = styled.img`
    width: 100%;
    height: auto;
    max-width: ${props => props.size || '300px'};
    /* box-shadow: none;
    background-color: none;
    transition: box-shadow 0.2s linear, background-color 0.3s linear ; */
    /* &:hover {
        border: 2px solid ${props => props.theme.color.primary};
        background-color: white;
        box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    } */
`;

export const VariantButtons = styled.button`
    ${BodyFont};
    display: ${props => props.hidden ? "none" : "block"};
    position: relative;
    background-color: ${props => 
        props.disabled
        ? 
        (props.optionColor ? props.optionColor : props.theme.color.red)
        : 
        (
            props.optionColor
            ? 
            props.optionColor
            : 
            (
                props.chosen 
                ? 
                props.theme.color.primary 
                : 
                'white'
            )
        )
    };

    ${(props) => (props.disabled && props.optionColor) && `
        &:after {
            content: "";
            position: absolute;
            border-top: 4px solid ${props.theme.color.red};
            width: 125%;
            transform: rotate(34deg) translateX(-50%) translateY(-50%);
            transform-origin: 0 0;
        }
    `};
    
        
    border: ${props => 
        props.outOfStock 
        ? 
        `4px solid ${props.theme.color.red}` 
        : 
        (
            props.chosen 
            ? 
            `4px solid ${props.theme.color.primary}`
            : 
            (
                props.optionColor 
                ? 
                `2px solid ${props.optionColor}` 
                : 
                `2px solid ${props.theme.color.primary}`
            )
        )
    };
    text-decoration-line: ${props => props.outOfStock ? 'line-through' : 'none'};
    color: ${props => props.chosen ? "white" : "black"};
    min-width: 50px;
    min-height: 50px;
    width: 100%;
    float: left;
    margin: 10px;
    transition: border 0.1s linear, background-color 0.3s linear;
    :hover {
        color: ${props => props.disabled ? null : props.theme.color.font.solid};
        background-color: ${props => (props.disabled || props.optionColor) ? null : props.theme.color.primary};
        border: ${props => props.chosen ? `4px solid ${props.theme.color.primary}` : (props.disabled ? `4px solid ${props.theme.color.red}` : (props.optionColor === props.theme.color.primary ? `4px solid white` : `4px solid ${props.theme.color.primary}`))};
        cursor: pointer;
    }
    :focus {
        background-color: ${props => props.optionColor ? null : props.theme.color.primary};
        border: ${props => `4px solid white`};
        color: white;
    }
`;


// Text
export const H4Product = styled.h4`
    font-size: 24px;
    ${BodyFont};
    margin: 10px 0;
    display: inline;
    @media (max-width: 1200px) {
        font-size: 18px;
    }
`;

export const NonVariantInventoryCount = styled.div`
    ${BodyFont};
    display: inline;
    float: right;
    color: ${props => (props.productCount) > 30 ? props.theme.color.grey :
            (props.productCount) <= 0 ? props.theme.color.red : props.theme.color.grey}; // ** can't find a yellow that actually looks good on the green background of selected product
`;

export const OptionLabel = styled.div`
    ${BodyFont};
    font-size: 16px;
    padding-left: 15px;
`;

export const InventoryCount = styled.div`
    ${BodyFont};
    font-size: 12px;
    padding-left: 15px;
    color: ${props => (props.productCount) > 30 ? props.theme.color.grey :
            (props.productCount) <= 0 ? props.theme.color.red : props.theme.color.grey};
`;

export const VariantGroup = styled.div`
    display: ${props => props.isProductSelected ? "flex" : "block"};
    width: ${props => props.isProductSelected ? "100%" : "25%"};
    flex-wrap: wrap;
`;

export const VariantOptions = styled.div`
    min-width: 60px;
    margin-right: 10px;
    display: flex;
    flex-wrap: wrap; 
`;
