import { NavLink } from 'react-router-dom';
import styled  from 'styled-components';
import { BodyFont, HeadingFont } from './text';

export const HeaderContainer = styled.header`
    display: block;
    height: 200px; // TODO: prolly have to use this height and line height together?
`;

// Branding
export const BrandContainer = styled.span`
    display: inline;
`;

export const NavLogo = styled.img`
    width: 100%;
    height: auto;
    min-height: 100px;
    max-width: ${props => props.width ? props.width : "150px"}; 
    margin: 15px 10px;
    @media (max-width: 901px) {
        max-width: ${props => props.width ? props.width : "125px"}; 
    }
`;

export const NavTitle = styled.span`
    ${HeadingFont}
    font-size: ${props => props.size ? props.size : "2.5em"}; 
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.15s linear;

    &:hover {
        opacity: 0.6;
        text-decoration: none;
    }
    
    @media (max-width: 901px) {
        font-size: 1.8em;
    }
`;

// Nav Menu
export const NavMenuContainer = styled.nav`
    display: inline;
    
    @media (max-width: 901px) {
        display: none;
    }
`;

export const NavLinks = styled.span`
    ${BodyFont}
    float: right;
    padding-right: 30px;
`;

const activeClassName = "active";
export const NavLLink = styled(NavLink)`
    transition: color 0.15s linear, border-bottom 0.15s linear;
    border-bottom: 7px solid transparent;
    text-decoration: none;
    color: ${props => props.theme.colors.primary};
    font-size: 18px;
    margin: 0 18px;
    padding: 14px 0;

    &.${activeClassName} {
        border-bottom: 7px solid white;
    }

    &:hover {
        border-bottom: 7px solid white;
        font-weight: 700;
    };

    @media (max-width: 901px) {
        font-size: 14px;
    }

`;

// Burger Menu 
export const BurgerMenuContainer = styled.span`
    display: none;

    @media (max-width: 901px) {
        display: inline;
    }
`;

export const Burger = styled.button`
    position: absolute;
    top: 5%;
    right: 2rem;
    z-index: 9;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;

    &:focus {
        outline: none;
    }

    div {
        width: 2rem;
        height: 0.25rem;
        background: ${({ open }) => open ? '#0D0C1D' : '#EFFFFA'};
        border-radius: 10px;
        transition: all 0.3s linear;
        position: relative;
        transform-origin: 1px;

        :first-child {
            transform: ${({ open }) => open ? 'rotate(45deg)' : 'rotate(0)'};
        }

        :nth-child(2) {
            opacity: ${({ open }) => open ? '0' : '1'};
            transform: ${({ open }) => open ? 'translateX(20px)' : 'translateX(0)'};
        }

        :nth-child(3) {
            transform: ${({ open }) => open ? 'rotate(-45deg)' : 'rotate(0)'};
        }
    }
`

export const BurgerMenu = styled.nav`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: #EFFFFA;
    transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(100%)'};
    height: 100vh;
    text-align: center;
    max-width: 500px;
    width: 100%;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 8;
    transition: transform 0.3s ease-in-out;

    @media (max-width: 901px) {
        width: 100%;
    }
`

export const BurgerMenuLink = styled(NavLink)`
    ${BodyFont}
    font-size: 2rem;
    text-transform: uppercase;
    padding: 2rem 0;
    font-weight: bold;
    letter-spacing: 0.5rem;
    color: #0D0C1D;
    text-decoration: none;
    transition: color 0.3s linear;

    @media (max-width: 576px) {
        font-size: 1.5rem;
        text-align: center;
    }

    &:hover {
        color: #343078;
    }

    &.${activeClassName} {
        border-bottom: 7px solid white;
    }

`;
