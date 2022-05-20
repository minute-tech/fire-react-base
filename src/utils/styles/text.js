import styled, { css }  from 'styled-components';
import { Link } from "react-router-dom";
import { SIZES } from '../constants';
// import { HashLink } from 'react-router-hash-link'; // ** hash links with react-router v6?

export const HeadingFont = css`
    color: ${props => props.theme?.colors?.font?.heading ?? "black"};
    font-family: ${props => props.theme?.fonts?.heading ?? "Arial, Helvetica, sans-serif"};
`;

export const BodyFont = css`
    color: ${props => props.theme?.colors?.font?.body ?? "black"};
    font-family: ${props => props.theme?.fonts?.body ?? "Arial, Helvetica, sans-serif"};
`;

// Headings //
export const H1 = styled.h1`
    font-size: 50px;
    ${HeadingFont}
    font-weight: 900;
    margin: ${props => props.margin ? props.margin : "10px 0"};
    display: ${props => props.inline ? "inline" : "block"};
    @media (max-width: 992px) {
        font-size: 35px;
    }
`;

export const H2 = styled.h2`
    font-size: 40px;
    ${HeadingFont}
    margin: ${props => props.margin ? props.margin : "10px 0"};
    display: ${props => props.inline ? "inline" : "block"};
    @media (max-width: 992px) {
        font-size: 25px;
        /* margin-bottom: 15px; */
    }
`;

export const H3 = styled.h3`
    font-size: 30px;
    ${HeadingFont}
    margin: ${props => props.margin ? props.margin : "10px 0"};
    display: ${props => props.inline ? "inline" : "block"};
    @media (max-width: 992px) {
        font-size: 20px;
    }
`;

export const H4 = styled.h4`
    font-size: 24px;
    ${HeadingFont}
    margin: ${props => props.margin ? props.margin : "10px 0"};
    display: ${props => props.inline ? "inline" : "block"};
    @media (max-width: 992px) {
        font-size: 18px;
    }
`;

// Paragraph Body
export const Body = styled.p`
    margin: ${props => props.margin ? props.margin : "1em 0"};
    display: ${props => props.display ? props.display : "block"};
    font-weight: ${props => props.bold ? 900 : 0};
    ${BodyFont};

    ${(props) => (props.color) && `
        color: ${props.color} !important;
    `};

    ${(props) => (props.size === SIZES.SM) && `
        font-size: 12px;
        @media (max-width: 992px) {
            font-size: 10px;
        }
    `};

    ${(props) => (props.size === SIZES.MD) && `
        font-size: 16px;
        @media (max-width: 992px) {
            font-size: 14px;
        }
    `};

    ${(props) => (props.size === SIZES.LG) && `
        font-size: 20px;
        @media (max-width: 992px) {
            font-size: 18px;
        }
    `};

    ${(props) => (props.size === SIZES.XL) && `
        font-size: 28px;
        @media (max-width: 992px) {
            font-size: 24px;
        }
    `};

    ${(props) => (props.hoverColor) && `
        &:hover {
            color: ${props.hoverColor};
            cursor: pointer;
        }
    `};  
`;

// Links
export const ALink = styled.a`
    cursor: pointer;
    ${BodyFont};
    color: ${props => props.color ? props.color : (props.theme?.colors?.font?.link ?? "navy")} !important;
    text-decoration: none;
    transition: color 0.15s linear;
    margin: ${props => props.margin ? props.margin : "0"};
    &:hover {
        color: ${props => (props.theme?.colors?.yellow || "gold")};
        text-decoration: none;
    }
`;

export const LLink = styled(Link)`
    ${BodyFont};
    color: ${props => props.color ? props.color : (props.theme?.colors?.font?.link || "navy")} !important;
    cursor: pointer;
    margin: ${props => props.margin ? props.margin : "0"};
    text-decoration: none;
    transition: color 0.15s linear;
    &:hover {
        color: ${props => (props.theme?.colors?.yellow ?? "gold")};
        text-decoration: none;
    }
`;

export const SLink = styled.span`
    ${BodyFont};
    color: ${props => props.color ? props.color : (props.theme?.colors?.font?.link ?? "navy")} !important;
    cursor: pointer;
    text-decoration: none;
    transition: color 0.15s linear;
    margin: ${props => props.margin ? props.margin : "0"};
    &:hover {
        color: ${props => (props.theme?.colors?.yellow ?? "gold")};
        text-decoration: none;
    }
`;

export const Anchor = styled.a`
    font-size: 0;
    display: block;
    position: relative;
    top: -100px;
    visibility: hidden;
`;

//  Misc
export const Label = styled.label`
    ${BodyFont};
    display: ${props => props.br ? "block" : "inline-block"};
    font-size: 20px;
    font-weight: 700;
    margin-bottom: ${props => props.$marginBottom ? props.$marginBottom : "5px"};
`;

export const ErrorText = styled.div`
    ${BodyFont};
    color: ${props => (props.theme?.colors?.red ?? "firebrick")} !important;
    margin: ${props => props.margin ? props.margin : "5px 0 0 0"};
    font-weight: 900;
`;

export const Ol = styled.ol`
    ${BodyFont};
`;

export const Ul = styled.ul`
    ${BodyFont};
    margin: ${props => props.margin ? props.margin : "0px"};
`;

export const Li = styled.li`
    ${BodyFont}
`;