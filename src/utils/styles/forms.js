import styled, { css }  from 'styled-components';
import { Field } from "formik";
import { BodyFont } from './text';

export const FField = styled(Field)`
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

const sliderThumb = (props) => (`
  width: 25px;
  height: 25px;
  background: ${props.color};
  cursor: pointer;
  outline: 5px solid ${props.color};
  -webkit-transition: .2s;
  transition: opacity .2s;
`);

export const Slider = styled.div`
  align-items: center;
  color: black;
  margin-top: 2rem;
  margin-bottom: 2rem;

  .range-value {
    font-size: 2rem;
    margin-top: 25px;
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 15px;
    border-radius: 5px;
    background: lightgrey;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      ${props => sliderThumb(props)}
    }

    &::-moz-range-thumb {
      ${props => sliderThumb(props)}
    }
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