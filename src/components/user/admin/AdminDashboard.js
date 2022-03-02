import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { BiMessageCheck } from "react-icons/bi"

import { Button } from '../../../utils/styles/buttons'
import { Wrapper } from '../../../utils/styles/misc'
import { H1, LLink } from '../../../utils/styles/text'
class AdminDashboard extends Component {
    render() {
        return (
            <Wrapper>
                <H1>Admin Dashboard</H1>
                <LLink to={`/admin/messages`}> 
                    <Button color="green">
                        View Contact Messages <BiMessageCheck size={18} />
                    </Button>
                </LLink>
            </Wrapper>
        )
    }
}

export default withTheme(AdminDashboard)