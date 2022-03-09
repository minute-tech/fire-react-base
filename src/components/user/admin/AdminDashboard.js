import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { BiMessageCheck } from "react-icons/bi"

import { Button } from '../../../utils/styles/buttons'
import { Wrapper } from '../../../utils/styles/misc'
import { H1, LLink } from '../../../utils/styles/text'
import { DEFAULT_SITE } from '../../../utils/constants'
import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '../../../Fire'
import { toast } from 'react-toastify'
import { FaPlus } from 'react-icons/fa'
class AdminDashboard extends Component {
    
    createDefaultCustomSite = async () => {
        await setDoc(doc(firestore, "site", "public"), {
            name: DEFAULT_SITE.NAME,
            logo: {
                width: DEFAULT_SITE.LOGO.WIDTH,
                url: DEFAULT_SITE.LOGO.URL
            },
            emails: {
                admin: DEFAULT_SITE.EMAILS.ADMIN
            },
            theme: { 
                schemes: {
                    light: {
                        value: DEFAULT_SITE.THEME.SCHEMES.LIGHT.VALUE,
                        colors: {
                            primary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.PRIMARY,
                            secondary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.SECONDARY,
                            tertiary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.TERTIARY,
                            red: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.RED,
                            green: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREEN,
                            yellow: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.YELLOW,
                            blue: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BLUE,
                            grey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREY,
                            lightGrey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.LIGHT_GREY,
                            font: {
                                heading: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.HEADING,
                                body:DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.BODY,
                                link: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.LINK,
                            },
                            background: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BACKGROUND,
                        },
                    },
                    dark: {
                        value: DEFAULT_SITE.THEME.SCHEMES.DARK.VALUE,
                        colors: {
                            primary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.PRIMARY,
                            secondary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.SECONDARY,
                            tertiary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.TERTIARY,
                            red: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.RED,
                            green: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.GREEN,
                            yellow: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.YELLOW,
                            blue: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.BLUE,
                            grey: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.GREY,
                            lightGrey: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.LIGHT_GREY,
                            font: {
                                heading: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.HEADING,
                                body:DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.BODY,
                                link: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.LINK,
                            },
                            background: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.BACKGROUND,
                        },
                    }
                },
                fonts: {
                    heading: DEFAULT_SITE.THEME.FONTS.HEADING,
                    body: DEFAULT_SITE.THEME.FONTS.BODY
                },
            }
        }).then(() => {
            console.log("Successful write of site public doc to Firestore.");
        }).catch((error) => {
            console.error("Error adding site public document: ", error);
            toast.error(`Error setting site public doc: ${error}`);
        });

        await setDoc(doc(firestore, "site", "count"), {
            messages: 0,
            users: 0
        }).then(() => {
            console.log("Successful write of site count doc to Firestore.");
        }).catch((error) => {
            console.error("Error adding site count document: ", error);
            toast.error(`Error setting site count doc: ${error}`);
        });
    }

    render() {
        return (
            <Wrapper>
                <H1>Admin Dashboard</H1>
                <LLink to={`/admin/messages`}> 
                    <Button color={this.props.theme.colors.green}>
                        View Contact Messages <BiMessageCheck size={18} />
                    </Button>
                </LLink>
                <Button color="black" onClick={() => this.createDefaultCustomSite()}>
                    Create Default Site <FaPlus />
                </Button>
            </Wrapper>
        )
    }
}

export default withTheme(AdminDashboard)