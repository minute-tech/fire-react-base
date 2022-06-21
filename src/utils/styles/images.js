import styled  from 'styled-components';
import { FaSpinner } from 'react-icons/fa';

import { spin } from './animations';

export const Img = styled.img`
    width: 100%;
    margin: ${props => props.margin ? props.margin : "0"};
    height: auto;
    border-radius: ${props => props.rounded ? "50%" : "0"};
    border: ${props => props.border ? props.border : "none"};
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

export const Spinner = styled(FaSpinner)`
    animation-name: ${spin};
    animation-duration: 3s;
    animation-iteration-count: infinite;
    transform-origin: center;
    padding: 0 !important;
    animation-timing-function: ease-in-out;
`;

export const Svg = styled.svg.attrs({ 
    version: "1.1", 
    xmlns: "http://www.w3.org/2000/svg", 
    xmlnsXlink: "http://www.w3.org/1999/xlink",
    xmlSpace: "preserve"
})`
    margin: ${props => props.margin ? props.margin : "0"};
    transform: ${props => props.flipHoriz ? "scaleY(-1)" : "none"};
    max-width: ${props => props.maxWidth ? props.maxWidth : "100%"};
`;

export const Path = styled.path`
    fill: ${props => props.fill ? props.fill : ""};
`;

// SVG image data
export const Squiggle = `M104.9,200.2c11.5,0.3,23.1,0.1,34.3-2.6c10.5-2.6,20.8-5.7,30.9-9.4c4.6-1.6,9.1-3.3,13.6-5.1
    c2.6-1,5.2-2.1,7.7-3.2c-0.9,0.4,7.3-3.1,4.4-1.9c-3.1,1.3,5.1-2.2,6.4-2.8c9.9-4.6,19.5-9.7,29.1-15c38.2-21,74.2-45.5,112.6-66
    c9.4-5,18.8-9.9,28.4-14.5c4.8-2.3,9.6-4.4,14.5-6.6c3.5-1.5-3.7,1.5-0.2,0.1c1-0.4,2-0.8,2.9-1.2c3-1.2,5.9-2.3,8.9-3.4
    c9.8-3.6,19.7-6.6,29.8-9c4.6-1.1,9.2-2,13.8-2.9c2-0.4,5.9-1.7,8-1.3c-0.6-0.1-5.9,0.7-0.8,0.1c1.3-0.1,2.7-0.3,4-0.4
    c10.3-1,20.6-1.3,30.9-0.8c2.3,0.1,4.6,0.3,6.9,0.5c1.5,0.1,9.9,0.4,3,0.2c5.1,0.1,10.6,1.8,15.5,3c4.5,1.1,8.9,2.4,13.2,3.9
    c2.3,0.8,5.3,1.4,7.4,2.7c-0.6-0.4-5.1-2.3-0.7-0.3c1.2,0.6,2.4,1.1,3.6,1.7c9.5,4.6,18.4,10.3,26.9,16.5c1.6,1.2,6.3,4.4,2.1,1.5
    c2.2,1.5,4.3,3.4,6.4,5.1c4.3,3.5,8.4,7,12.6,10.6c7.8,6.7,15.5,13.4,23.6,19.9c17.3,13.9,35.3,26.7,54.5,37.8
    c36.8,21.6,76.9,37.8,118,47.6c85.4,20.3,174,12.6,257.3-13.2c84.4-26.1,164.5-65.2,241.3-108.5c10.7-6,20.2-13.2,29.6-21.1
    c8.6-7.3,10.1-22.9,4.2-32.2c-6.1-9.5-18.6-16.1-30-12.2c-12,4.1-23.3,9.1-34.3,15.3c-9.2,5.2-18.4,10.4-27.7,15.6
    c-18.9,10.5-37.7,21.2-56.8,31.3c-19.3,10.3-38.9,20.2-58.7,29.4c-9.5,4.4-19.1,8.9-28.8,12.9c0.8-0.3,5.1-2.1,0.5-0.2
    c-1,0.4-1.9,0.8-2.9,1.2c-2.6,1.1-5.2,2.1-7.8,3.2c-4.9,1.9-9.8,3.7-14.7,5.5c-20.3,7.2-40.8,13.6-61.7,18.8
    c-10,2.5-20.1,4.7-30.3,6.6c-5.1,1-10.2,1.8-15.3,2.6c-2.4,0.4-4.8,0.7-7.1,1.1c-1.3,0.2-5,1,0.8-0.1c-1.7,0.3-3.4,0.4-5.1,0.6
    c-20.9,2.5-42.1,3.5-63.2,3c-10.1-0.3-20.2-0.9-30.2-1.9c-2.6-0.3-5.3-0.6-7.9-0.9c-0.6-0.1-4-0.6-0.5,0c3.7,0.6-0.5-0.1-1.5-0.2
    c-5.3-0.8-10.5-1.6-15.7-2.6c-19.9-3.7-39.6-8.9-58.7-15.5c-4.4-1.5-8.8-3.1-13.1-4.8c-2.5-0.9-5-1.9-7.4-2.9
    c-1.1-0.5-2.7-0.9-3.7-1.5c1.6,1,3.6,1.5,0.7,0.3c-9.4-4.1-18.7-8.5-27.9-13.3c-17.9-9.4-35.2-20.2-51.5-32.2
    c-1.9-1.4-3.7-2.8-5.6-4.2c-3-2.2,3.4,2.7,0.5,0.4c-1-0.8-2.1-1.6-3.1-2.5c-4-3.2-7.9-6.5-11.8-9.8c-8.1-6.9-16.1-13.9-24.4-20.6
    c-18.8-15.2-37.9-28.1-60.5-37c-20.1-7.9-42.2-11.5-63.7-12c-45.2-1.1-89.1,12.1-129.6,31.3c-39.1,18.6-74.4,44.4-110.4,68.2
    c-17.9,11.8-36,23.3-54.8,33.6c-18.9,10.3-36.1,19.5-55,26.1c-10.2,3.6-19.2,8-29.2,11.8C87.9,179.4,89.2,199.8,104.9,200.2
    L104.9,200.2z`;


export const HillSeparators = {
    one: `M0.5,104.5c-0.03-10.72-0.46-13.95-1-27c-0.78-18.76-1.17-28.13,0-30c8.44-13.43,34.31-4,73-14.68
    c34.04-9.39,34.13-23.39,56.61-23.16c26.12,0.27,45.63,23.27,69.21,34.52c31.75,15.14,70.74,8.57,102.11,24.49
    c15.93,8.08,29.32,21.71,46.75,25.65c21.01,4.75,42.53-5.91,59.36-19.37c16.84-13.45,31.33-30.08,50.11-40.65
    c7.44-4.19,15.78-7.41,24.32-6.93c21.39,1.2,36.88,24.58,58.3,24.95c16.34,0.29,29.91-12.99,46.02-15.73
    c23.28-3.97,43.72,14.26,65.48,23.44c28.79,12.14,63.95,7.64,88.75-11.36c11.55-8.85,20.82-20.44,32.55-29.06
    c11.72-8.62,27.47-14.06,40.85-8.33c23.73,10.18,24.68,46.79,47.13,59.54c15.13,8.59,34.83-2.98,72.35-22.32
    c43.96-22.65,63.35-42.42,72.1-36c4.02,2.95,1.27,8.79-1,34c-1.93,21.5-3.68,41-2,63c1.61,21.08,5.74,36.08-1,40
    c-2.03,1.18-3.65,0.54-11,0c0,0,0,0-23,0c-34.33,0-68.67,0-103,0c-102.67,0-205.33,0-308,0c-64.67,0-129.33,0-194,0
    c-37.33,0-74.67,0-112,0c-25.33,0-50.67,0-76,0c-36,0-72.01-1-108,0c-14.33,0.4-28.68-0.62-43,0c-1.48,0.06-4.66,0.04-11,0
    c-8.91-0.06-9.98,0.01-11-1c-2.25-2.24-0.33-5.59,0-18c0,0,0,0,0-7C0.5,110.84,0.5,104.51,0.5,104.5z`,
    two: `M-0.5,47.5c8.44-13.43,34.31-4,73-14.68c34.04-9.39,34.13-23.39,56.61-23.16
    c26.12,0.27,45.63,23.27,69.21,34.52c31.75,15.14,70.74,8.57,102.11,24.49c15.93,8.08,29.32,21.71,46.75,25.65
    c21.01,4.75,42.53-5.91,59.36-19.37c16.84-13.45,31.33-30.08,50.11-40.65c7.44-4.19,15.78-7.41,24.32-6.93
    c21.39,1.2,36.88,24.58,58.3,24.95c16.34,0.29,29.91-12.99,46.02-15.73c23.28-3.97,43.72,14.26,65.48,23.44
    c28.79,12.14,63.95,7.64,88.75-11.36c11.55-8.85,20.82-20.44,32.55-29.06c11.72-8.62,27.47-14.06,40.85-8.33
    c23.73,10.18,24.68,46.79,47.13,59.54c15.13,8.59,34.83-2.98,72.35-22.32c43.96-22.65,63.35-42.42,72.1-36
    c4.02,2.95,1.27,8.79-1,34c-1.93,21.5-3.68,41-2,63c1.61,21.08,5.74,36.08-1,40c-2.03,1.18-3.65,0.54-11,0c0,0,0,0-23,0
    c-34.33,0-68.67,0-103,0c-102.67,0-205.33,0-308,0c-64.67,0-129.33,0-194,0c-37.33,0-74.67,0-112,0c-25.33,0-50.67,0-76,0
    c-36,0-72.01-1-108,0c-14.33,0.4-28.68-0.62-43,0c-1.48,0.06-4.66,0.04-11,0c-8.91-0.06-9.98,0.01-11-1c-2.25-2.24-0.33-5.59,0-18
    c0,0,0,0,0-7c0-12.66,0-18.99,0-19c-0.03-10.72-0.46-13.95-1-27C-1.28,58.74-1.67,49.37-0.5,47.5z`
}

export const Emoji = styled.span`
    font-size: ${props => props.size || '1em'};
    display: ${props => props.display || 'inline'};
    margin: ${props => props.margin || '0'};
`;

// Responsive iframe
export const IframeContainer = styled.div`
	position: relative;
	padding-bottom: 56.25%; /* 16:9 */
	padding-top: 25px;
	height: 0;
`;

export const Iframe = styled.iframe.attrs({ 
    frameBorder:"0" ,
    allowFullScreen: true,
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
})`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
`;
