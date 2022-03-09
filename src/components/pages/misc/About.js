import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Wrapper } from '../../../utils/styles/misc';
import { Body, H1 } from '../../../utils/styles/text';

export default class About extends Component {
  render() {
    return (
        <Wrapper>
            <Helmet>
                <title>About {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
            </Helmet>
            <H1>About</H1>
            <Body>
                Culpa Lorem do nostrud nostrud in id laborum non do consectetur. Lorem ex aute velit consectetur quis aliquip adipisicing. Amet commodo fugiat id nisi proident. 
                In id proident magna nulla reprehenderit nulla et minim laboris culpa consequat ullamco. Exercitation et pariatur dolore ullamco est non irure ex occaecat sunt esse cupidatat exercitation. 
                Ullamco duis veniam magna reprehenderit deserunt proident nulla esse Lorem.
            </Body>
        </Wrapper>
    );
  }
}
