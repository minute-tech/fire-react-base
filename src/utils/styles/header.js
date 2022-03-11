import { NavLink } from 'react-router-dom';
import styled  from 'styled-components';
import { HeadingFont } from './text';

export const BrandContainer = styled.div`
    width: 100%;
    margin: auto;
    text-align: center;
    padding: 15px 0;
    /* margin: 15px 0; */
`;

export const NavTitle = styled.div`
    font-size: ${props => props.size ? props.size : "2.5em"}; 
    color: ${props => props.theme.colors.primary};
    ${HeadingFont}
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

export const NavLogo = styled.img`
    width: 100%;
    height: auto;
    min-height: 100px;
    max-width: ${props => props.width ? props.width : "150px"}; 
    @media (max-width: 901px) {
        max-width: ${props => props.width ? props.width : "125px"}; 
    }
`;

export const NavLinks = styled.div`
    font-family: ${props => props.theme.fonts.body};
    text-align: center;
    padding: 20px 0;
    background-color: ${props => props.theme.colors.primary};
`;

const activeClassName = "active";
export const NavLLink = styled(NavLink)`
    transition: color 0.15s linear, border-bottom 0.15s linear;
    border-bottom: 7px solid transparent;
    text-decoration: none;
    color: white;
    font-size: 18px;
    margin: 0 15px;
    padding: 14px 0;

    &.${activeClassName} {
        border-bottom: 7px solid white;
    }

`;

// TODO: combine hovertext and navlink... I dont think we need it now with styled-components
export const NavHoverText = styled.span`
    transition: color 0.15s linear, border 0.15s linear;
    border-bottom: 7px solid transparent;
    &:hover {
        border-bottom: 7px solid white;
        font-weight: 700;
    };
    margin: 0 18px;
    padding: 14px 0;
    @media (max-width: 900px) {
        display: ${props => props.categoriesLength && props.categoriesLength > 1 ? "block" : "inline"}; // TODO: pass this param!
        font-size: 14px;
    }
`;
