import styled, { createGlobalStyle }  from 'styled-components';
import { lighten } from 'polished'
import { FaSpinner } from 'react-icons/fa';

// Importing font into CSS global for use around app
import RobotoRegular from '../../assets/fonts/roboto/Roboto-Regular.ttf';
import RobotoBold from '../../assets/fonts/roboto/Roboto-Bold.ttf';
import { DEFAULT_THEME } from '../constants';
import { BodyFont } from './text';
import { keyframes } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        position: relative;
        min-height: 100vh;
        padding-bottom: 5rem;    
        background-color: ${props => props.theme.colors.background};
    }

    @font-face {
        font-family: ${DEFAULT_THEME.FONTS.ROBOTO_REGULAR};
        src: url(${RobotoRegular}) format("truetype"); // truetype/opentype might change based on ttf or otf etc
    }

    @font-face {
        font-family: ${DEFAULT_THEME.FONTS.ROBOTO_BOLD};
        src: url(${RobotoBold}) format("truetype"); // truetype/opentype might change based on ttf or otf etc
    }

    /* CSS for lightbox */
    .my-masonry-grid {
        display: -webkit-box; /* Not needed if autoprefixing */
        display: -ms-flexbox; /* Not needed if autoprefixing */
        display: flex;
        margin-left: -30px; /* gutter size offset */
        width: auto;
    }

    /* .my-masonry-grid img {
        width: 100%;
        height: auto;
        max-width: 300px;
        cursor: pointer;
    } */

    .my-masonry-grid_column {
        padding-left: 30px; /* gutter size */
        background-clip: padding-box;
    }
    
    /* Style your items */
    .my-masonry-grid_column > div { /* change div to reference your elements you put in <Masonry> */
        margin-bottom: 30px;
    }

    @media (max-width: 800px) {
        .my-masonry-grid {
        margin-left: -15px; /* gutter size offset */
        }
        .my-masonry-grid_column {
        padding-left: 15px; /* gutter size offset */
        }
        .my-masonry-grid_column > div {
        margin-bottom: 15px; /* space between items */
        }
    }

    .ril-next-button, .ril-prev-button {
        background-color: rgba(0, 0, 0, 0.6) !important;
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

    .icon-spin {
        
    }
`;

const spin = keyframes`
    0% {
        -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
                transform: rotate(359deg);
    }
`

export const Spinner = styled(FaSpinner)`
    animation-name: ${spin};
    animation-duration: 3s;
    animation-iteration-count: infinite;
`;




// Alignment //
export const Wrapper = styled.div`
    @media screen and (min-width: 1181px) {
        margin: 0 auto;
        width: 75%;
        padding: 3% 0;
    }

    @media screen and (min-width: 561px) and (max-width: 1180px) {
        margin: 0 auto;
        width: 80%;
        padding: 2% 0;
    }

    @media screen and (max-width: 560px) {
        margin: 0 auto;
        width: 90%;
        padding: 2% 0%;
    }
`;

// Containers
export const SmContainer = styled.div`
    @media screen and (min-width: 1181px) {
        margin: auto;
        width: 25%;
        padding: 1%;
    }

    @media screen and (min-width: 561px) and (max-width: 1180px) {
        margin: auto;
        width: 70%;
        padding: 1%;
    }

    @media screen and (max-width: 560px) {
        margin: auto;
        width: 85%;
        padding: 1%;
    }
`;

export const MdContainer = styled.div`
    @media screen and (min-width: 1181px) {
        margin: auto;
        width: 50%;
        padding: 1%;
    }

    @media screen and (min-width: 561px) and (max-width: 1180px) {
        margin: auto;
        width: 80%;
        padding: 1%;
    }

    @media screen and (max-width: 560px) {
        margin: auto;
        width: 90%;
        padding: 1%;
    }
`;

export const LgContainer = styled.div`
    @media screen and (min-width: 1181px) {
        margin: auto;
        width: 70%;
        padding: 1%;
    }

    @media screen and (min-width: 561px) and (max-width: 1180px) {
        margin: auto;
        width: 90%;
        padding: 1%;
    }

    @media screen and (max-width: 560px) {
        margin: auto;
        width: 95%;
        padding: 1%;
    }
`;


// Widths
export const SmWidth = styled.div`
    @media screen and (min-width: 901px) {
        width: 50% !important;
    }

    @media screen and (max-width: 900px) {
        width: 70% !important;
    }
`;

export const MdWidth = styled.div`
    @media screen and (min-width: 901px) {
        width: 75% !important;
    }

    @media screen and (max-width: 900px) {
        width: 80% !important;
    }
`;

export const LgWidth = styled.div`
    @media screen and (min-width: 901px) {
        width: 80% !important;
    }

    @media screen and (max-width: 900px) {
        width: 90% !important;
    }
`;

// Images //
export const ResponsiveImg = styled.img`
    width: 100%;
    height: auto;
    max-width: ${props => props.size || "100px"};
`;

export const InlineImg = styled.span`
    font-size: ${props => props.size || "1 em"};
    display: ${props => props.display || "inline"};
    margin: ${props => props.margin || "0"};
`;

// Table
export const Table = styled.table`
    border-collapse: collapse;
    width: 100%;
    ${BodyFont}
`;

export const Thead = styled.thead`
    background-color: ${props => props.theme.colors.primary};
    color: white;
`;

export const Th = styled.th`
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.lightGrey};
`;

export const Tr = styled.tr`
    /* empty rn */
`;

export const Td = styled.td`
    padding: 8px;
    text-align: left;
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
        background-color: ${props => lighten(0.7, props.theme.colors.primary)};
        border-color: ${props => lighten(0.7, props.theme.colors.primary)};
    }

    ${Tr}:hover {
        background-color: ${props => lighten(0.9, props.theme.colors.primary)};
        border-color: ${props => lighten(0.9, props.theme.colors.primary)};
    }
`;

// Background with text
export const BgMediaContainer = styled.div`
    height: 100%;
    width: 100%;
    margin-top: -5px;
    overflow: hidden;
    ${BodyFont} ; // ** if this isnt working, reference back ship-form-template, i did something different with ||
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
    @media (max-width: 1200px), (max-height: 900px) {
        height: ${props => props.bodyLength > 900 ? "120vh" : "100vh"};
    }
`;

export const BgColor = styled.div`
    position: relative;
    z-index: -2;
    width: 100vw;
    height: 70vh;
    background-color: ${props => props.bgColor ? props.bgColor : props.theme.colors.primary};
    @media (max-width: 1200px), (max-height: 900px) {
        height: ${props => props.bodyLength > 900 ? "120vh" : "100vh"};
    }
`;

export const BgMediaModal = styled.div`
    ${BodyFont}
    text-align: center;
    background-color: rgb(255, 255, 255, 0.95);
    border-radius: 5px;
    max-width: 60%;
    padding: 3rem 7rem;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
    @media (max-width: 1200px), (max-height: 900px) {
        max-width: 80%;
        padding: 10px 25px 25px 25px;
    }
`;

export const BgMediaHeading = styled.h1`
    font-size: 35px;
    font-weight: 900;
    margin-bottom: 1%;
    @media (max-width: 1200px), (max-height: 900px) {
        font-size: 30px
    }
`;

export const BgMediaBody = styled.div`
    font-size: 18px;
    line-height: 1.6;
    text-align: left;
    margin: 20px;
    @media (max-width: 1200px), (max-height: 900px) {
        font-size: 16px;
        margin: 5px;
    }
`;

// Misc Misc //
export const CenteredDiv = styled.div`
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

export const Recaptcha = styled.div`
    position: relative;
    max-width: 304px;
    margin: 10px auto;
    
`;

export const OverflowXAuto = styled.div`
    overflow-x: auto;
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
    background-color: ${props => props.theme?.colors?.red || "darkred"};
    text-align: center;
    padding: 3px 0;
    color: white;
    font-size: 0.6rem;
    font-family: ${props => props.theme?.fonts?.body || 'Arial'};
    letter-spacing: 2px;
`
export const ConfirmCard = styled.div`
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
    background-color: white;
    border-radius: 5px;
    transition: 0.3s;
    padding: 30px 60px;
    position: relative;
    z-index: 10;
    @media (max-width: 1180px) {
        padding: 15px 30px;
    }
`