import styled, { createGlobalStyle }  from 'styled-components';
import { rgb, rgba, transparentize } from 'polished'
import { Col as GCol } from 'react-grid-system';
import { Row as GRow } from 'react-grid-system';
import { Container as GContainer } from 'react-grid-system';
import { Body, BodyFont, HeadingFont } from './text';
import { SIZES } from '../constants';

export const GlobalStyle = createGlobalStyle`
    // Try to stay away from using this Global Styling mainly for load times 
    // See: https://github.com/styled-components/styled-components/issues/2900
    body {
        margin: 0;
    }
`;

export const BodyWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    background-color: ${props => props.theme.color.background};

    /* Overflow hidden so side nav can stay hidden, but transition-able */
    overflow-x: hidden;
    
    // ** might be better to start using pixels here? because it should be adjusted for every charge to the amount of content it has
    padding-bottom: 8rem;  
    @media (max-width: 992px) {
        padding-bottom: 15rem; 
    }

    /* Change notification color */
    :root{
        --toastify-color-dark: ${props => props.theme?.color?.background ?? "black"};
        --toastify-color-light: ${props => props.theme?.color?.background ?? "white"};
        --toastify-color-info: ${props => props?.theme?.color?.primary};
        --toastify-color-success: ${props => props?.theme?.color?.green};
        --toastify-color-warning: ${props => props?.theme?.color?.yellow};
        --toastify-color-error: ${props => props?.theme?.color?.red};
        --toastify-color-transparent: rgba(255, 255, 255, 0.7);
        --toastify-icon-color-info: var(--toastify-color-info);
        --toastify-icon-color-success: var(--toastify-color-success);
        --toastify-icon-color-warning: var(--toastify-color-warning);
        --toastify-icon-color-error: var(--toastify-color-error);
        --toastify-toast-width: 320px;
        --toastify-toast-background: #fff;
        --toastify-toast-min-height: 64px;
        --toastify-toast-max-height: 800px;
        --toastify-font-family: "Body" !important;
        --toastify-z-index: 9999;
        --toastify-text-color-dark: ${props => props.theme?.color?.font?.body ?? "white"};
        --toastify-text-color-light: ${props => props.theme?.color?.font?.body ?? "black"};
        --toastify-text-color-info: ${props => props.theme?.color?.font?.body ?? "black"};
        --toastify-text-color-success: ${props => props.theme?.color?.font?.body ?? "black"};
        --toastify-text-color-warning: ${props => props.theme?.color?.font?.body ?? "black"};
        --toastify-text-color-error: ${props => props.theme?.color?.font?.body ?? "black"};
        --toastify-spinner-color: #616161;
        --toastify-spinner-color-empty-area: #e0e0e0;
        --toastify-color-progress-dark: #bb86fc;
        --toastify-color-progress-light: linear-gradient( to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55 );
        --toastify-color-progress-info: var(--toastify-color-info);
        --toastify-color-progress-success: var(--toastify-color-success);
        --toastify-color-progress-warning: var(--toastify-color-warning);
        --toastify-color-progress-error: var(--toastify-color-error);
    }
`;

// Alignment //
export const Wrapper = styled.div`
    margin: 0 auto;
    width: 75%;
    padding: 3% 0;

    @media (max-width: 992px) {
        width: 85%;
    }
`;

// Containers
export const Container = styled.div`
    margin: auto;
    padding: 1%;

    ${(props) => (props.size === SIZES.SM) && `
        width: 25%;
        @media (max-width: 992px) {
            width: 70%;
        }
    `};

    ${(props) => (props.size === SIZES.MD || !props.size) && `
        width: 50%;
        @media (max-width: 992px) {
            width: 80%;
        }
    `};

    ${(props) => (props.size === SIZES.LG) && `
        width: 90%;
        @media (max-width: 992px) {
            width: 90%;
        }
    `};
`;

// Widths
export const SmWidth = styled.div`
    width: 50%;

    @media (max-width: 992px) {
        width: 70%;
    }
`;

export const MdWidth = styled.div`
    width: 75%;

    @media (max-width: 992px) {
        width: 80%;
    }
`;

export const LgWidth = styled.div`
    width: 80%;

    @media (max-width: 992px) {
        width: 90% !important;
    }
`;

// Table
export const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    ${BodyFont};

    th:nth-child(${props => props.columnHover}),
    td:nth-child(${props => props.columnHover}),
        tbody tr:hover {
        background: ${props => rgba(props.theme.color.secondary, 0.2)};
        border-left: 2px solid ${props => props.theme.color.secondary};
        border-right: 2px solid ${props => props.theme.color.secondary};
    }

    th:not(:hover) {
        background: ${props => props.theme.color.primary};
    }
`;

export const Thead = styled.thead`
    background-color: ${props => props.theme.color.primary};
`;

// TODO: active is not doing anything?
// color: ${props => props.active ? props.theme.color.secondary : "white"};
export const Th = styled.th`
    padding: 8px;
    border-bottom: 1px solid ${props => props.theme.color.lightGrey};
    /* border-right: 1px solid ${props => props.theme.color.lightGrey}; */
    text-align: center;
    color: ${props => props.theme.color.font.solid} !important;

    &:hover {
        cursor: ${props => props.sortable ? "pointer" : "normal"};
        color: ${props => props.sortable ? props.theme.color.secondary : "white"};
        border-top: 2px solid ${props => props.noTop ? "transparent" : props.theme.color.secondary};
    }
`;

export const Tr = styled.tr`
    color: ${props => props.theme.color.font.body};
    background-color: ${props => props.color ? props.color : "transparent"};

`;

export const Td = styled.td`
    text-align: center;
    padding: 8px;
    border-bottom: 1px solid ${props => props.theme.color.lightGrey};
    &.bottom-cell {
        border-bottom: 2px solid ${props => props.theme.color.primary};
      }
`;

export const TColumnHead = styled.td`
    background-color: ${props => props.theme.color.primary};
    color: white;
    border-top: 2px solid ${props => props.theme.color.primary};
    font-weight: bolder;
    padding-left: 15px;
`;

export const Tbody = styled.tbody`
    ${Td}:hover {
        background-color: ${props => rgba(props.theme.color.primary, 0.4)};
    }

    ${Tr}:hover {
        border-top: 2px solid ${props => props.theme.color.secondary};
        border-bottom: 2px solid ${props => props.theme.color.secondary} !important;
        background: ${props => rgba(props.theme.color.secondary, 0.2)};
    }

    ${Tr}:nth-child(n):hover { 
        border-left: 2px solid ${props => props.theme.color.secondary};
    }

    ${Tr}:nth-child(n):hover {
        border-right: 2px solid ${props => props.theme.color.secondary};
    }

`;

// Grid
export const Grid = styled(GContainer)`
    /* Add custom styles here */
`;

export const Row = styled(GRow)`
    /* Add custom styles here */
    padding: ${props => props.padding ? props.padding : "0 0 0 5px"};
    margin: ${props => props.margin ? props.margin : "0 0 0 0"};
`;

export const Column = styled(GCol)`
    transition: all 0.3s linear;
    /* Forced to label this as not camelcase because of some weird react console error  */
    /* Error: React does not recognize the textAlign prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, 
    spell it as lowercase textalign instead. If you accidentally passed it from a parent component, remove it from the DOM element. */
    text-align: ${props => props.textalign ? props.textalign : "left"};
    margin: ${props => props.margin ? props.margin : "0 0 10px 0"};
    opacity: ${props => props.hidden ? 0 : 1};
    background: ${props => props.background ? props.background : "none"};
    background-clip: ${props => props.background ? "content-box" : "none"};
    color: ${props => props.color ? props.color : "inherit"} !important;
    vertical-align: ${props => props.verticalAlign ? props.verticalAlign : "baseline"} !important;
`;

// Background with text
export const BgMediaContainer = styled.div`
    height: 100%;
    width: 100%;
    margin-top: -5px;
    overflow: hidden;
    ${BodyFont};
    position: relative;
`;

export const BgMedia = styled.img`
    position: relative;
    z-index: -1;
    vertical-align: middle;
    width: 100vw;
    height: 70vh;
    object-fit: cover;
    /* filter: blur(1px); */
    @media (max-width: 992px), (max-height: 992px) {
        height: ${props => props.bodyLength > 900 ? "120vh" : "100vh"};
    }
`;

export const BgColor = styled.div`
    position: relative;
    z-index: -2;
    width: 100vw;
    height: 70vh;
    background-color: ${props => props.bgColor ? props.bgColor : props.theme.color.primary};
    @media (max-width: 992px), (max-height: 992px) {
        height: ${props => props.bodyLength > 900 ? "120vh" : "100vh"};
    }
`;

export const BgMediaModal = styled.div`
    ${BodyFont}
    text-align: center;
    background-color: ${props => props.noBg ? "" : rgb(255, 255, 255, 0.95)};
    border-radius: 5px;
    max-width: 60%;
    padding: 3rem 7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    @media (max-width: 992px), (max-height: 992px) {
        max-width: 80%;
        padding: 10px 25px 25px 25px;
    }
`;

export const BgMediaHeading = styled.h1`
    font-size: 55px;
    ${HeadingFont}
    color: ${props => props.color ? props.color : "black"};
    margin-bottom: 1%;
    @media (max-width: 992px), (max-height: 992px) {
        font-size: 30px
    }
`;

export const BgMediaBody = styled.div`
    font-size: 18px;
    white-space: pre-wrap;
    color: ${props => props.color ? props.color : "black"};
    line-height: 1.6;
    text-align: ${props => props.textAlign ? props.textAlign : "left"};
    margin: 20px;
    @media (max-width: 992px), (max-height: 992px) {
        font-size: 16px;
        margin: 5px;
    }
`;

// Modal
export const ModalCard = styled.div`
    text-align: left;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: ${props => props.theme?.color?.background ?? "white"};
    border-radius: 5px;
    transition: 0.3s;
    padding: 30px 60px;
    width: 40%;
    z-index: 10;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-height: 85vh;
    overflow-y: auto;

    @media (max-width: 992px) {
        padding: 15px 30px;
        width: 80%;
    }

    // CSS Snippet to ensure internal words like in the message field are still readable
    /* These are technically the same, but use both */
    overflow-wrap: break-word;
    word-wrap: break-word;

    -ms-word-break: break-all;
    /* This is the dangerous one in WebKit, as it breaks things wherever */
    word-break: break-all;
    /* Instead use this non-standard one: */
    word-break: break-word;

    /* Adds a hyphen where the word breaks, if supported (No Blink) */
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
`

export const ModalContainer = styled.div`
position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => rgba(props.theme.color.grey, 0.7)};
`;

// Progress bar
export const Progress = styled.div`
    margin: 20px auto;
    padding: 0;
    width: 90%;
    height: 30px;
    overflow: hidden;
    background: ${props => props.theme.color.lightGrey};
    border-radius: 4px;

    div {
        transition: all 0.5s linear;
        position: relative;
        float: left;
        min-width: 1%;
        width: ${props => `${props.uploadProgress}%`};
        height: 100%;
        background: ${props => props.uploadProgress !== 100 ? props.theme.color.primary : props.theme.color.green};
    }

    p {
        ${Body};
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        margin: 0;
        font-size: 10px;
        color: white;
    }
`

// Tooltip
export const TooltipContainer = styled.div`
    position: relative;
    display: inline-block;
    // TODO: would be nice if this tooltip could extend past it's child... might pose an issue in the future.
    div:first-child  {
        font-size: 14px !important;
        ${BodyFont};
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        width: 12vw;
        color: white !important;
        padding: 10px;
        border-radius: 5px;
        top: calc(100% + 5px);
        display: none;
        
        @media (max-width: 768px) {
            width: 20vw;
        }
    }

    &:hover div:first-child {
        display: block;
        z-index: 5;
    }

`;

// Tabs
export const TabWrapper = styled.div`
    border-left: 2px solid ${props => props.theme.color.primary};
    border-bottom: 2px solid ${props => props.theme.color.primary};
    border-right: 2px solid ${props => props.theme.color.primary};
    padding: 20px 10px;
`;

export const TabList = styled.ol`
    border-bottom: 2px solid ${props => props.theme.color.primary};
    padding-left: 0;
    ${BodyFont};
    font-size: 20px;
    font-weight: 900;
    margin: 20px 0 0 0;
`;

export const TabItem = styled.li`
    transition: all 0.2s linear;
    display: inline-block;
    list-style: none;
    margin-bottom: -1px;
    padding: 0.8rem 3rem;
    cursor: pointer;
    color: ${props => props.isActiveTab ? props.theme.color.font.solid : props.theme.color.font.inverted};
    background-color: ${props =>  props.isActiveTab ? props.theme.color.primary : "transparent"};
    border: 2px solid ${props =>  props.isActiveTab ? props.theme.color.primary : "transparent"};
    border-width: 1px 1px 0 1px; // Will go transparent when isActive
    &:hover {
        background-color: ${props => props.isActiveTab ? "" : transparentize(0.6, props.theme.color.primary)};
    }

`;

export const TabContent = styled.div`
    /* No styles for this section yet */
`;


// Misc Misc //
export const Centered = styled.div`
    width: 100%;
    margin: auto;
    text-align: center;
    padding: ${props => props.padding ? props.padding : "0"};

    ${(props) => (props.absolute) && `
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    `};

`;

export const MiddleDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const VerticalAlign = styled.span`
    text-align: center;
    position: relative;
    top: 50%;
    -ms-transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
`;

export const Div = styled.div`
    transition: all 1s linear;
    margin: ${props => props.margin ? props.margin : "0"};
    visibility: ${props => props.hidden ? "hidden" : "visible"};
    display: ${props => props.hidden ? "none" : "block"};
    position: ${props => props.position ? props.position : "static"};
    height: ${props => props.height ? props.height : "auto"};
    background-color: ${props => props.bgColor ? props.bgColor : "none"};
`;

export const Hr = styled.div`
    border-bottom: ${props => props.height ? props.height : "2px"} solid ${props => props.color ? props.color : (props.theme?.color?.primary || "black")};
    margin: ${props => props.margin ? props.margin : "15px 0"};
    width: ${props => props.width ? props.width : "100%"};
    float: ${props => props.selected ? props.selected : "none"};
`;

export const Spacer = styled.div`
    margin: ${props => props.margin ? props.margin : "15px 0"};
    width: ${props => props.width ? props.width : "100%"};
    float: ${props => props.selected ? props.selected : "none"};
`;

export const FullWidthLine = styled.div`
    background-color: ${props => props.color ? props.color : props.theme.color.primary};
    height: ${props => props.height ? props.height : "5px"};
    padding: ${props => props.padding ? props.padding : "0"};
`;

export const FullWidthHeader = styled.div`
    width: 100%;
    height: 200px;
    margin-bottom: 50px;
    background-image: url(${props => props.src});
    background-position: 50% 50%; // change me around to move up and down!
    background-size: cover;
`;

export const Recaptcha = styled.div`
    position: relative;
    max-width: 304px;
    margin: 10px auto;
`;

export const OverflowXAuto = styled.div`
    overflow-x: auto;
`;

export const DevAlert = styled.div`
    position: fixed;
    width: 100%;
    z-index: 10;
    top: 0;
    background-color: ${props => rgba(props.theme?.color?.red, 0.7) || rgba("darkred", 0.7)};
    text-align: center;
    padding: 5px 0;
    color: white;
    font-size: 8px;
    font-family: "Body";
    letter-spacing: 2px;
    opacity: 1;
    transition: opacity 0.5s;
    &:hover {
        opacity: 0;
    }
`

export const ColorBlock = styled.div`
    vertical-align: middle;
    display: inline-block;
    height: ${props => props.size ? props.size : "1em"};
    width: ${props => props.size ? props.size : "1em"};
    background-color: ${props => props.color ? props.color : "grey"};
`;
