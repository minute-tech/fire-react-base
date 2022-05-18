import styled, { css }  from 'styled-components';
import { Field } from "formik";
import { BodyFont } from './text';

export const FField = styled(Field)`
    font-size: 16px;
    ${BodyFont}
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

    ${props => props.component === "textarea" && css`
        height: 150px;
        padding: 15px;
    `}

    @media (max-width: 900px) {
        width: 90%;
    }
`;

export const Input = styled.input`
    font-size: 16px;
    ${BodyFont}
    width: ${props => props.width ? props.width : "100%"};
    padding: 10px;
    margin: 0 0 5px 0;
    box-sizing: border-box;
    border: 1px solid black;
    border-radius: 2px;
    background-color: white;
    resize: none;
    
    &:focus {
        outline-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 2pt 1pt ${props => props.theme.colors.primary};
    }

    ${props => props.component === "textarea" && css`
        height: 150px;
        padding: 15px;
    `}
    
    @media (max-width: 900px) {
        width: 90%;
    }
`;

export const RField = styled(Field)`
    transform: scale(1.25);
    margin: 15px 15px 0 0;
`;

export const CField = styled(Field)`
    transform: scale(1.5);
    margin: 15px 15px 0 0;
`;

export const SField = styled(Field)`
    padding: 12px;
    option {
        ${BodyFont};
    }
`;

export const PageSelect = styled.select`
    option {
        ${BodyFont};
        font-size: 12px;
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