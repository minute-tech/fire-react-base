import styled  from 'styled-components';
import { Col } from 'react-flexbox-grid';

export const FooterContainer = styled.footer`
    position: absolute;
    bottom: 0;
    padding: 20px 0;
    width: 100%;
    margin: auto;
    text-align: center;
    display: flex; 
    flex-direction: column;
    font-size: 14px;
`;

export const ColA = styled(Col)`
    margin: 5px 0;
    // Change order of elements on mobile
    order: ${props => props.$deviceWidth >= 768 ? 1 : 1};
`

export const ColB = styled(Col)`
    margin: 5px 0;
    order: ${props => props.$deviceWidth >= 768 ? 2 : 2};
`

export const ColC = styled(Col)`
    margin: 5px 0;
    order: ${props => props.$deviceWidth >= 768 ? 3 : 3};
`