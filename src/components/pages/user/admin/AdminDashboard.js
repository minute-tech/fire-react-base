import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { BiMessageCheck } from "react-icons/bi"
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaUserAlt } from 'react-icons/fa'

import { Button } from '../../../../utils/styles/buttons'
import { Hr, Wrapper } from '../../../../utils/styles/misc'
import { H1, LLink } from '../../../../utils/styles/text'
import { BTYPES, DEFAULT_SITE } from '../../../../utils/constants'
import { firestore } from '../../../../Fire'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

class AdminDashboard extends Component {
    createDefaultCustomSite = async () => {
        const publicRef = doc(firestore, "site", "public");
        const publicDocSnap = await getDoc(publicRef);

        if (publicDocSnap.exists()) {
            toast.error(`Public doc exists, please delete existing store on Firebase console to recreate.`);
            console.log("Public doc exists, please delete existing store on Firebase console to recreate.");
        } else {
            console.log("Public doc doesn't exist, go ahead and create default!");
            await setDoc(publicRef, {
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
                toast.success(`Created public doc.`);
                console.log("Successful write of site public doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding public document: ", error);
                toast.error(`Error setting public doc: ${error}`);
            });
    
            await setDoc(doc(firestore, "site", "counts"), {
                messages: 0,
                users: 0
            }).then(() => {
                console.log("Successful write of counts doc to Firestore.");
                toast.success(`Created counts doc.`);
            }).catch((error) => {
                console.error("Error adding counts document: ", error);
                toast.error(`Error setting counts doc: ${error}`);
            });
        }
    }

    render() {
        return (
            <Wrapper>
                <Helmet>
                    <title>Admin Dashboard {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <Link to="/dashboard">
                    <Button>
                        <FaChevronLeft />
                        &nbsp; Back to User Dashboard
                    </Button>
                </Link>
                <H1>Admin Dashboard</H1>
                <LLink to={`/admin/users`}> 
                    <Button color={this.props.theme.colors.primary}>
                        Manage Users <FaUserAlt />
                    </Button>
                </LLink>
                <LLink to={`/admin/messages`}> 
                    <Button color={this.props.theme.colors.green}>
                        View Contact Messages <BiMessageCheck size={18} />
                    </Button>
                </LLink>
                <Hr />
                {this.props.site.name !== DEFAULT_SITE.NAME && (
                    <Button color={this.props.theme.colors.yellow} btype={BTYPES.INVERTED} onClick={() => this.createDefaultCustomSite()}>
                        Create Default Site <FaPlus />
                    </Button>
                )}
                
            </Wrapper>
        )
    }
}

export default withTheme(AdminDashboard)