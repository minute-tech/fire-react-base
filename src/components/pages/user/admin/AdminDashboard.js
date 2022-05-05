import React, { Component } from 'react'
import { withTheme } from 'styled-components'
import { BiMessageCheck } from "react-icons/bi"
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaUserAlt } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

import { Button } from '../../../../utils/styles/buttons'
import { Hr } from '../../../../utils/styles/misc'
import { H1, LLink } from '../../../../utils/styles/text'
import { BTYPES, DEFAULT_SITE } from '../../../../utils/constants.js'
import { firestore } from '../../../../Fire'

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
                name: "Minute.tech",
                projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID,
                logo: {
                    width: 100,
                    url: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fminute.tech%2Ficon-color-lg.png?alt=media&token=a2d63bf2-4787-4bdc-b29f-48502328c00e",
                    showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
                },
                emails: {
                    support: DEFAULT_SITE.EMAILS.SUPPORT,
                    noreply: DEFAULT_SITE.EMAILS.NOREPLY,
                },
                hero: {
                    heading: "Welcome to Minute.tech",
                    body: DEFAULT_SITE.HERO.BODY,
                    cta: {
                        link: DEFAULT_SITE.HERO.CTA.LINK,
                        text: "Ask a question",
                        size: DEFAULT_SITE.HERO.CTA.SIZE,
                        color: DEFAULT_SITE.HERO.CTA.COLOR,
                    },                    
                    banner: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fminute.tech%2Fdesk-clutter.jpg?alt=media&token=ce6d3f14-744b-4a24-8a98-55a2fdb7803f",
                },
                theme: { 
                    schemes: {
                        light: {
                            value: DEFAULT_SITE.THEME.SCHEMES.LIGHT.VALUE,
                            colors: {
                                primary: "#4FBFE0",
                                secondary: "#FDBB30",
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
                                primary: "#4FBFE0",
                                secondary: "#FDBB30",
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
                        heading: "Lato Black",
                        body: "Lato Regular"
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
                messengers: ["douglasrcjames@gmail.com"]
            }, {merge: true}).then(() => {
                console.log("Successful write of sensitive doc to Firestore.");
                toast.success(`Created sensitive doc.`);
            }).catch((error) => {
                console.error("Error adding sensitive document: ", error);
                toast.error(`Error setting sensitive doc: ${error}`);
            });
        }
    }

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
                projectId: DEFAULT_SITE.PROJECT_ID,
                logo: {
                    width: DEFAULT_SITE.LOGO.WIDTH,
                    url: DEFAULT_SITE.LOGO.URL,
                    showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
                },
                emails: {
                    support: DEFAULT_SITE.EMAILS.SUPPORT,
                    noreply: DEFAULT_SITE.EMAILS.NOREPLY,
                },
                hero: {
                    heading: DEFAULT_SITE.HERO.HEADING,
                    body: DEFAULT_SITE.HERO.BODY,
                    cta: {
                        link: DEFAULT_SITE.HERO.CTA.LINK,
                        text: DEFAULT_SITE.HERO.CTA.TEXT,
                        size: DEFAULT_SITE.HERO.CTA.SIZE,
                        color: DEFAULT_SITE.HERO.CTA.COLOR,
                    },                    
                    banner: DEFAULT_SITE.HERO.BANNER,
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

            // Set sensitive doc
            await setDoc(doc(firestore, "site", "sensitive"), {
                messengers: DEFAULT_SITE.EMAILS.MESSENGERS
            }, {merge: true}).then(() => {
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
            <>
                <Helmet>
                    <title>Admin Dashboard {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/dashboard">
                    <Button>
                        <FaChevronLeft />
                        &nbsp; Back to User Dashboard
                    </Button>
                </LLink>
                <H1>Admin Dashboard</H1>
                <LLink to={`/dashboard/admin/users`}> 
                    <Button>
                        Manage Users <FaUserAlt />
                    </Button>
                </LLink>
                <LLink to={`/dashboard/admin/messages`}> 
                    <Button color={this.props.theme.colors.green}>
                        Manage Messages <BiMessageCheck size={18} />
                    </Button>
                </LLink>
                <Hr />
                {this.props.site.unset && (
                    <>
                        <Button color="#4FBFE0" btype={BTYPES.INVERTED} onClick={() => this.createCustomSite()}>
                            Create Minute.tech Site <FaPlus />
                        </Button>
                    
                        <Button color={this.props.theme.colors.green} btype={BTYPES.INVERTED} onClick={() => this.createDefaultCustomSite()}>
                            Create Default Site <FaPlus />
                        </Button>
                    </>
                )}
                
            </>
        )
    }
}

export default withTheme(AdminDashboard)