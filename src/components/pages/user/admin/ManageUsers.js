import React, { Component } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FaChevronLeft } from 'react-icons/fa';
import { Button } from '../../../../utils/styles/buttons'
import { Wrapper } from '../../../../utils/styles/misc'
import { H1 } from '../../../../utils/styles/text';

export default class ManageUsers extends Component {
  render() {
    return (
        <Wrapper>
            <Helmet>
                <title>Manage Users {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
            </Helmet>
            <Link to="/admin/dashboard">
                <Button>
                    <FaChevronLeft />
                    &nbsp; Back to Admin Dashboard
                </Button>
            </Link>
            <H1>Manage Users</H1>
        </Wrapper>
    )
  }
}
