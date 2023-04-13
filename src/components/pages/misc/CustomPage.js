import React from 'react'
import { Wrapper } from '../../../utils/styles/misc'
import { Helmet } from 'react-helmet-async'
import { BodyFontColor, H1 } from '../../../utils/styles/text'

function CustomPage(props) {
    // const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>{props.page.name} {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <Wrapper>
                <H1>{props.page.name}</H1>
                <BodyFontColor dangerouslySetInnerHTML={{__html: props.page.body}}></BodyFontColor>
            </Wrapper>
        </>
    )
}

export default CustomPage;
