import React from 'react'
import { Helmet } from 'react-helmet-async'
import { DEFAULT_SITE } from '../../utils/constants'

export default function DynamicHeadTags(props) {
  return (
    <>
        <Helmet>
            {/* ** These meta tags work half the time. For a more consistent behavior, make these changes in the `public > index.html` file */}
            <meta name="title" content={props.site.name || DEFAULT_SITE.NAME} />
            <meta name="description" content={props.site.description || DEFAULT_SITE.DESCRIPTION} />
            <meta name="theme-color" content={props.theme.colors.primary || DEFAULT_SITE.THEME.COLORS.PRIMARY }/>
            <link rel="shortcut icon" href={props.site.logo.favicon || DEFAULT_SITE.LOGO.FAVICON} /> {/* ** if you delete public > favicon.ico locally, then this will seem like it loads instantly dynamically! */}
            <link rel="apple-touch-icon" href={props.site.logo.appleTouchIcon || DEFAULT_SITE.LOGO.APPLE_TOUCH_ICON} />
            
            {/* Google / Search Engine Tags */}
            <meta itemprop="name" content={props.site.name || DEFAULT_SITE.NAME} />
            <meta itemprop="description" content={props.site.description || DEFAULT_SITE.DESCRIPTION} />
            <meta itemprop="image" content={props.site.hero.banner || DEFAULT_SITE.HERO.BANNER} />

            {/* Facebook/OpenGraph Meta Tags */}
            <meta property="og:site_name " content={props.site.name || DEFAULT_SITE.NAME} />
            <meta property="og:url" content={props.site.projectId ? `https://${props.site.projectId}.web.app` : `https://${DEFAULT_SITE.PROJECT_ID}.web.app`} />
            <meta property="og:title" content={props.site.name || DEFAULT_SITE.NAME} />
            <meta property="og:description" content={props.site.description || DEFAULT_SITE.DESCRIPTION} />
            {/* Suggested dimensions for og:image is 1200×630 pixels */}
            <meta property="og:image" content={props.site.hero.banner || DEFAULT_SITE.HERO.BANNER} /> 

            {/* Twitter Meta Tags */}
            <meta name="twitter:title" content={props.site.name || DEFAULT_SITE.NAME} />
            <meta name="twitter:description" content={props.site.description || DEFAULT_SITE.DESCRIPTION} />
            {/* must be less than 5MB in size */}
            <meta name="twitter:image" content={props.site.logo.lightUrl || DEFAULT_SITE.LOGO.LIGHT_URL} />
        </Helmet>
    </>
  )
}
