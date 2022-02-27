import React, { Component } from 'react';
import { Wrapper } from '../../utils/styles/misc';
import { ALink, Body, H1, Li, Ul } from '../../utils/styles/text';

export default class Credits extends Component {
    render() {
        return (
            <Wrapper>
                <H1>Credits</H1>
                <Body>Attributions to those who helped make this website happen.</Body>
                <Ul>
                    <Li>Designed and built by <ALink href="https://camposjames.com/" target="_blank" rel="noopener">Campos James LLC</ALink></Li>
                    <Li>Support from Mom &amp; Dad</Li>
                </Ul>
            </Wrapper>
        );
    }
}
