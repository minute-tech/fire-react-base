import React, { Component } from 'react';
import { Wrapper } from '../../utils/styles/misc';
import { ALink, Body, H1, Li, Ul } from '../../utils/styles/text';

export default class Credits extends Component {
    render() {
        return (
            <Wrapper>
                <H1>Credits</H1>
                <Body>Taking a moment to appreciate those who helped make this happen.</Body>
                <Ul>
                    <Li>Icons</Li>
                    <Ul>
                        <Li><ALink href="https://fontawesome.com/" target="_blank">Font Awesome</ALink></Li>
                    </Ul>
                    <Li>Mom &amp; Dad</Li>
                </Ul>
            </Wrapper>
        );
    }
}
