import styled  from 'styled-components';
import { BodyFont } from './text';

export const Button = styled.button`
    ${BodyFont}
    transition: background-color 0.15s linear, color 0.15s linear, border 0.15s linear;
    margin: 5px;
    border: transparent solid 2px; 
    cursor: pointer;
    a {
        text-decoration: none; 
        color: ${props => props.inverted ? props.margin : '1em 0'};
    }

    // Sizing
    ${(props) => (props.size === 'sm') && `
        font-size: 12px;
        padding: 5px 25px;
        font-weight: 600;
    `}

    ${(props) => (props.size === 'md') && `
        font-size: 14px;
        padding: 10px 35px;
        font-weight: 700;
    `}

    ${(props) => (props.size === 'lg') && `
        font-size: 16px;
        padding: 15px 45px;
        font-weight: 700;
    `}

    // Coloring
    ${(props) => (props.color === 'primary' && !props.inverted) && `
        background-color: ${props.theme.colors.primary};
        color: white;
    `}

    ${(props) => (props.color === 'secondary' && !props.inverted) && `
        background-color: ${props.theme.colors.secondary};
        color: white;
    `}

    ${(props) => (props.color === 'tertiary' && !props.inverted) && `
        background-color: ${props.theme.colors.tertiary};
        color: white;
    `}
    
    ${(props) => (props.color === 'green' && !props.inverted) && `
        background-color: ${props.theme.colors.tertiary};
        color: white;
    `}

    ${(props) => (props.color === 'red' && !props.inverted) && `
        background-color: ${props.theme.colors.red};
        color: white;
    `}

    ${(props) => (props.color === 'yellow' && !props.inverted) && `
        background-color: ${props.theme.colors.yellow};
        color: white;
    `}
    
    ${(props) => (props.color === 'blue' && !props.inverted) && `
        background-color: ${props.theme.colors.blue};
        color: white;
        
    `}

    /* TODO: primary button will work for below, but no other colors, fix this */
    &:hover {
        background-color: transparent;
        color: ${props => props.theme.colors.primary};
        border: ${props => props.theme.colors.primary} solid 2px;
        a {
            color: ${props => props.theme.colors.primary};
        }
    }


    // TODO: inverted

    // TODO: text to color

    // TODO: black to primary?


    // Psuedo-classes
    &:focus {
        border: none;
    }
    &:hover {
        text-decoration: none;
        cursor: pointer;
    }
`;

// transparent background, text to color
/* // Text to Primary */
/* const textToPrimaryBtn = css`
    border: transparent solid 2px; 
    color: black;
    background-color: transparent;
    a {
        color: black;
    }
    &:hover {
        background-color: ${props => props.theme.colors.primary};
        color: white;
        border: ${props => props.theme.colors.primary} solid 2px;
        a {
            color: white;
        }
    }
`; */

// Primary //
// Primary to Inverted
// const primaryToInvertedBtn = css`
//     border: transparent solid 2px; 
//     color: white;
//     background-color: ${props => props.theme.colors.primary};
//     a {
//         color: white;
//     }
//     &:hover {
//         background-color: transparent;
//         color: ${props => props.theme.colors.primary};
//         border: ${props => props.theme.colors.primary} solid 2px;
//         a {
//             color: ${props => props.theme.colors.primary};
//         }
//     }
// `;

// export const SmPrimaryToInvBtn = styled.button`
//     ${baseBtn}
//     ${smallBtn}
//     ${primaryToInvertedBtn}
// `;

// export const MdPrimaryToInvBtn = styled.button`
//     ${baseBtn}
//     ${mediumBtn}
//     ${primaryToInvertedBtn}
// `;

// export const LgPrimaryToInvBtn = styled.button`
//     ${baseBtn}
//     ${largeBtn}
//     ${primaryToInvertedBtn}
// `;

// // Inverted to Primary
// const invertedToPrimaryBtn = css`
//     border: ${props => props.theme.colors.primary} solid 2px; 
//     color: ${props => props.theme.colors.primary};
//     background-color: transparent;
//     a {
//         color: ${props => props.theme.colors.primary};
//     }
//     &:hover {
//         background-color: ${props => props.theme.colors.primary};
//         color: white;
//         border: ${props => props.theme.colors.primary} solid 2px;
//         a {
//             color: white;
//         }
//     }
// `;

// export const SmInvToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${smallBtn}
//     ${invertedToPrimaryBtn}
// `;

// export const MdInvToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${mediumBtn}
//     ${invertedToPrimaryBtn}
// `;

// export const LgInvToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${largeBtn}
//     ${invertedToPrimaryBtn}
// `;

// // Black to Primary
// const blackToPrimaryBtn = css`
//     border: transparent solid 2px; 
//     color: white;
//     background-color: black;
//     a {
//         color: white;
//     }
//     &:hover {
//         background-color: ${props => props.theme.colors.primary};
//         color: white;
//         border: ${props => props.theme.colors.primary} solid 2px;
//         a {
//             color: white;
//         }
//     }
// `;

// export const SmBlackToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${smallBtn}
//     ${blackToPrimaryBtn}
// `;

// export const MdBlackToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${mediumBtn}
//     ${blackToPrimaryBtn}
// `;

// export const LgBlackToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${largeBtn}
//     ${blackToPrimaryBtn}
// `;

// // Text to Primary
// const textToPrimaryBtn = css`
//     border: transparent solid 2px; 
//     color: black;
//     background-color: transparent;
//     a {
//         color: black;
//     }
//     &:hover {
//         background-color: ${props => props.theme.colors.primary};
//         color: white;
//         border: ${props => props.theme.colors.primary} solid 2px;
//         a {
//             color: white;
//         }
//     }
// `;

// export const SmTextToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${smallBtn}
//     ${textToPrimaryBtn}
// `;

// export const MdTextToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${mediumBtn}
//     ${textToPrimaryBtn}
// `;

// export const LgTextToPrimaryBtn = styled.button`
//     ${baseBtn}
//     ${largeBtn}
//     ${textToPrimaryBtn}
// `;

