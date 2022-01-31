import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Helmet } from 'react-helmet-async';
import { Button } from '../../utils/styles/buttons';

import { Wrapper } from '../../utils/styles/misc';
import { Body, H1, H3 } from '../../utils/styles/text';


export default class Home extends Component {
  render() {
    return (
        <Wrapper>
            <Helmet>
                <title>Home | Ez Firebase React Boiler</title>
            </Helmet>
            <H1>Home</H1>
            <Body>This is the homepage, customize it as you please, please.</Body>
            <Button color='primary' size='sm'>Button 1</Button>
            {/* TODO: Add the BgMedia section from the ship-form-template here in misc styles */}
            <Grid fluid>
                <Row center="xs">
                    <Col xs={12} sm={3}>
                        <H3>First Column</H3>
                        <Body>More information below</Body>
                    </Col>
                    <Col xs={12} sm={3}>
                        <H3>Second Column</H3>
                        <Body>More information below</Body>
                    </Col>
                    <Col xs={12} sm={3}>
                        <H3>Third Column</H3>
                        <Body>More information below</Body>
                    </Col>
                </Row>
            </Grid>
        </Wrapper>
    );
  }
}
