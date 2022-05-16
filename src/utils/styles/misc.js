import styled, { createGlobalStyle }  from 'styled-components';
import { rgb, rgba } from 'polished'
import { FaSpinner } from 'react-icons/fa';

// Importing font into CSS global for use around app
// import RobotoRegular from '../../assets/fonts/roboto/Roboto-Regular.ttf';
// import RobotoBold from '../../assets/fonts/roboto/Roboto-Bold.ttf';
import { Body, BodyFont, HeadingFont } from './text';
import { spin } from './animations';


export const GlobalStyle = createGlobalStyle`
    // Try to stay away from using this Global Styling mainly for load times 
    // See: https://github.com/styled-components/styled-components/issues/2900
    body {
        margin: 0;
    }

     // ** Loading the font from the file is where the font-face was taking to long to load and flashing times new roman issue is arising from
    // Maybe try and use this lib to load in fonts from Google, etc: https://thabo-ambrose.medium.com/prevent-text-font-flickering-caused-by-using-a-custom-font-family-983c4b8d548d
    // SOLUTION: For now, we will just have to manually load them instead of from the site public doc
`;

export const BodyWrapper = styled.div`
    position: relative;
    z-index: 1;
    min-height: 100vh;
    padding-bottom: 5rem;    
    background-color: ${props => props.theme.colors.background};

    /* Overflow hidden so side nav can stay hidden, but transition-able */
    overflow-x: hidden;
    
    @media (max-width: 900px) {
        padding-bottom: 10rem; 
    }

    /* Change notification colors */
    :root{
        --toastify-color-dark: ${props => props.theme?.colors?.background ?? "black"};
        --toastify-color-light: ${props => props.theme?.colors?.background ?? "white"};
        --toastify-color-info: ${props => props?.theme?.colors?.primary};
        --toastify-color-success: ${props => props?.theme?.colors?.green};
        --toastify-color-warning: ${props => props?.theme?.colors?.yellow};
        --toastify-color-error: ${props => props?.theme?.colors?.red};
        --toastify-color-transparent: rgba(255, 255, 255, 0.7);
        --toastify-icon-color-info: var(--toastify-color-info);
        --toastify-icon-color-success: var(--toastify-color-success);
        --toastify-icon-color-warning: var(--toastify-color-warning);
        --toastify-icon-color-error: var(--toastify-color-error);
        --toastify-toast-width: 320px;
        --toastify-toast-background: #fff;
        --toastify-toast-min-height: 64px;
        --toastify-toast-max-height: 800px;
        --toastify-font-family: ${props => props.theme?.fonts?.body ?? "Arial, Helvetica, sans-serif"} !important;
        --toastify-z-index: 9999;
        --toastify-text-color-dark: ${props => props.theme?.colors?.font?.body ?? "white"};
        --toastify-text-color-light: ${props => props.theme?.colors?.font?.body ?? "black"};
        --toastify-text-color-info: ${props => props.theme?.colors?.font?.body ?? "black"};
        --toastify-text-color-success: ${props => props.theme?.colors?.font?.body ?? "black"};
        --toastify-text-color-warning: ${props => props.theme?.colors?.font?.body ?? "black"};
        --toastify-text-color-error: ${props => props.theme?.colors?.font?.body ?? "black"};
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

export const Spinner = styled(FaSpinner)`
    animation-name: ${spin};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    transform-origin: center;
    padding: 0 !important;
    animation-timing-function: ease-in-out;
`;

// Alignment //
export const Wrapper = styled.div`

    margin: 0 auto;
    width: 75%;
    padding: 3% 0;

    @media (max-width: 900px) {
        width: 85%;
    }
`;

// Containers
export const SmContainer = styled.div`
    margin: auto;
    width: 25%;
    padding: 1%;

    @media (max-width: 900px) {
        width: 70%;
    }
`;

export const MdContainer = styled.div`
    margin: auto;
    width: 50%;
    padding: 1%;

    @media (max-width: 900px) {
        width: 80%;
    }
`;

export const LgContainer = styled.div`
    margin: auto;
    width: 90%;
    padding: 1%;

    @media (max-width: 900px) {
        margin: auto;
        width: 90%;
        padding: 1%;
    }
`;


// Widths
export const SmWidth = styled.div`
    width: 50%;

    @media (max-width: 900px) {
        width: 70%;
    }
`;

export const MdWidth = styled.div`
    width: 75%;

    @media (max-width: 900px) {
        width: 80%;
    }
`;

export const LgWidth = styled.div`
    width: 80%;

    @media (max-width: 900px) {
        width: 90% !important;
    }
`;

// Images (always responsive) //
export const Img = styled.img`
    width: 100%;
    margin: ${props => props.margin ? props.margin : "0"};
    height: auto;
    border-radius: ${props => props.rounded ? "50%" : "0"};
    float: ${props => props.float || "none"};
    max-width: ${props => props.width || "100px"};
`;

export const InlineIcon = styled.span`
    font-size: ${props => props.size || "1 em"};
    display: ${props => props.display || "inline"};
    margin: ${props => props.margin || "0"};
`;

export const GalleryImg = styled(Img)`
    position: relative;
    cursor: pointer;
    &:hover {
        opacity: .6;
    }
`;

// Table
export const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    ${BodyFont}
`;

export const Thead = styled.thead`
    background-color: ${props => props.theme.colors.primary};
`;

export const Th = styled.th`
    padding: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.lightGrey};
    /* border-right: 1px solid ${props => props.theme.colors.lightGrey}; */
    text-align: center;
    color: ${props => props.active ? props.theme.colors.yellow : "white"};

    &:hover {
        cursor: pointer;
        color: ${props => props.theme.colors.yellow};
    }
`;

export const Tr = styled.tr`
    color: ${props => props.theme.colors.font.body};
`;

export const Td = styled.td`
    text-align: center;
    padding: 8px;
    border-bottom: 1px solid ${props => props.theme.colors.lightGrey};
`;

export const TColumnHead = styled.td`
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-top: 2px solid ${props => props.theme.colors.primary};
    font-weight: bolder;
    padding-left: 15px;
`;

export const Tbody = styled.tbody`
    ${Td}:hover {
        background-color: ${props => rgba(props.theme.colors.primary, 0.15)};
        border-top: 2px solid ${props => props.theme.colors.primary};
        border-bottom: 2px solid ${props => props.theme.colors.primary};
    }

    ${Tr}:hover {
        border-top: 2px solid ${props => props.theme.colors.secondary};
        border-bottom: 2px solid ${props => props.theme.colors.secondary};
    }
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
    @media (max-width: 900px), (max-height: 900px) {
        height: ${props => props.bodyLength > 900 ? "120vh" : "100vh"};
    }
`;

export const BgColor = styled.div`
    position: relative;
    z-index: -2;
    width: 100vw;
    height: 70vh;
    background-color: ${props => props.bgColor ? props.bgColor : props.theme.colors.primary};
    @media (max-width: 900px), (max-height: 900px) {
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
    @media (max-width: 900px), (max-height: 900px) {
        max-width: 80%;
        padding: 10px 25px 25px 25px;
    }
`;

export const BgMediaHeading = styled.h1`
    font-size: 35px;
    ${HeadingFont}
    margin-bottom: 1%;
    @media (max-width: 900px), (max-height: 900px) {
        font-size: 30px
    }
`;

export const BgMediaBody = styled.div`
    font-size: 18px;
    line-height: 1.6;
    text-align: left;
    margin: 20px;
    @media (max-width: 900px), (max-height: 900px) {
        font-size: 16px;
        margin: 5px;
    }
`;

// Misc Misc //
export const Centered = styled.div`
    width: 100%;
    margin: auto;
    text-align: center;
`;

export const MiddleDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const Hr = styled.div`
    border-bottom: 2px solid ${props => props.theme?.colors?.primary || "black"};
    margin: ${props => props.margin ? props.margin : "15px 0"};
    width: ${props => props.width ? props.width : "100%"};
    float: ${props => props.selected ? props.selected : "none"};
`;

export const FullWidthLine = styled.div`
    background-color: ${props => props.color ? props.color : props.theme.colors.primary};
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

export const Div = styled.div`
    margin: ${props => props.margin ? props.margin : "0"};
`;

export const VerticalAlign = styled.span`
    text-align: center;
    position: relative;
    top: 50%;
    -ms-transform: translateY(-50%);
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
`;

export const DevAlert = styled.div`
    position: fixed;
    width: 100%;
    z-index: 10;
    top: 0;
    background-color: ${props => rgba(props.theme?.colors?.red, 0.7) || rgba("darkred", 0.7)};
    text-align: center;
    padding: 5px 0;
    color: white;
    font-size: 8px;
    font-family: ${props => props.theme?.fonts?.body || 'Arial'};
    letter-spacing: 2px;
    opacity: 1;
    transition: opacity 0.5s;
    &:hover {
        opacity: 0;
    }
`

// Modal
export const ModalCard = styled.div`
    text-align: left;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: ${props => props.theme?.colors?.background ?? "white"};
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

    @media (max-width: 900px) {
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
    position: absolute;
    z-index: 9;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${props => rgba(props.theme.colors.grey, 0.7)};
`;

// Progress bar
export const Progress = styled.div`
    margin: 20px auto;
    padding: 0;
    width: 90%;
    height: 30px;
    overflow: hidden;
    background: ${props => props.theme.colors.lightGrey};
    border-radius: 4px;

    div {
        transition: all 0.5s linear;
        position: relative;
        float: left;
        min-width: 1%;
        width: ${props => `${props.uploadProgress}%`};
        height: 100%;
        background: ${props => props.uploadProgress !== 100 ? props.theme.colors.primary : props.theme.colors.green};
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


