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
    createCustomSite = async () => {
        const publicRef = doc(firestore, "site", "public");
        const publicDocSnap = await getDoc(publicRef);

        if (publicDocSnap.exists()) {
            toast.error(`Public site doc exists, please delete existing site on Firebase console to recreate.`);
            console.log("Public site doc exists, please delete existing site on Firebase console to recreate.");
        } else {
            console.log("Public doc doesn't exist, go ahead and create default!");
            await setDoc(publicRef, {
                name: "Clik Clak",
                // projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID,
                logo: {
                    width: "400px",
                    url: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fclikclak%2Flogo.png?alt=media&token=d6ba49f1-057d-4ab4-8bb2-ef0588327ce0",
                    showTitle: false,
                },
                hero: {
                    banners: [
                        "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fclikclak%2Fbanner.png?alt=media&token=ac52851d-0ee8-4f2e-b1c3-d169daff6545"
                    ]
                },
                emails: {
                    support: "help@clikclak.com",
                    noreply: DEFAULT_SITE.EMAILS.NOREPLY,
                },
                theme: { 
                    schemes: {
                        light: {
                            value: DEFAULT_SITE.THEME.SCHEMES.LIGHT.VALUE,
                            colors: {
                                primary: "#470A68",
                                secondary: "#000",
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
                                background: "#FAF6FF",
                            },
                        },
                        dark: {
                            value: DEFAULT_SITE.THEME.SCHEMES.DARK.VALUE,
                            colors: {
                                primary: "#470A68",
                                secondary: "#000",
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

            await setDoc(doc(firestore, "site", "sensitive"), {
                emails: {
                    messages: ["douglasrcjames@gmail.com"]
                }
            }).then(() => {
                console.log("Successful write of sensitive doc to Firestore.");
                toast.success(`Created sensitive doc.`);
            }).catch((error) => {
                console.error("Error adding sensitive document: ", error);
                toast.error(`Error setting sensitive doc: ${error}`);
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
                        Manage Messages <BiMessageCheck size={18} />
                    </Button>
                </LLink>
                <Hr />
                {this.props.site.name === DEFAULT_SITE.NAME && (
                    <Button color={this.props.theme.colors.yellow} btype={BTYPES.INVERTED} onClick={() => this.createCustomSite()}>
                        Create Custom Site <FaPlus />
                    </Button>
                )}
                
            </Wrapper>
        )
    }
}

export default withTheme(AdminDashboard)