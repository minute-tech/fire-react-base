import React from 'react'
import { useTheme } from 'styled-components'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaTrash } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'

import { Button } from '../../../../utils/styles/buttons'
import { BTYPES, DEFAULT_SITE } from '../../../../utils/constants.js'
import { firestore } from '../../../../Fire'
import { H1, LLink } from '../../../../utils/styles/text'
import ConfirmAlert from '../../../misc/ConfirmAlert'

export default function ManageSite(props) {
    const theme = useTheme();
    const navigate = useNavigate();
    const createCustomSite = async () => {
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

    const createDefaultCustomSite = async () => {
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

    const deleteSite = async () => {
        await deleteDoc(doc(firestore, "site", "public")).then(() => {
            console.log("Successful delete of doc on firestore");
            toast.success("Deleting site");
            navigate(0);
        }).catch((error) => {
            console.error("Error deleting site: ", error);
            toast.error(`Error deleting site: ${error}`);
        });;
    }

    return (
        <>
            <Helmet>
                <title>Manage Site {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <LLink to="/dashboard/admin">
                <Button type="button">
                    <FaChevronLeft />
                    &nbsp; Back to Admin Dashboard
                </Button>
            </LLink>
            <H1>Manage Site</H1>
            {props.site.unset && (
                <>
                    <Button type="button" color="#4FBFE0" btype={BTYPES.INVERTED} onClick={() => createCustomSite()}>
                        Create Minute.tech Site <FaPlus />
                    </Button>
                
                    <Button type="button" color={theme.colors.green} btype={BTYPES.INVERTED} onClick={() => createDefaultCustomSite()}>
                        Create Default Site <FaPlus />
                    </Button>
                </>
            )}
            {!props.site.unset && (
                <>    
                    <Button 
                        type="button" 
                        color={theme.colors.red} 
                        btype={BTYPES.INVERTED} 
                        onClick={() =>         
                            confirmAlert({
                                customUI: ({ onClose }) => {
                                    return (
                                        <ConfirmAlert
                                            theme={theme}
                                            onClose={onClose} 
                                            headingText={`Revert to default site`}
                                            body={`Are you sure you want to delete site "${props.site.name}" from the database? This action will revert all front-end changes (like color, logo, etc uploads.) to their default values and you will have to set them again. Other data like messages, users, etc will NOT be deleted with this process, so don't stress!`}
                                            yesFunc={() => deleteSite()} 
                                            yesText={`Yes`} 
                                            noFunc={function () {}} 
                                            noText={`No`}   
                                        />
                                    );
                                }
                        })} 
                    >
                       <FaTrash />&nbsp; Delete site public document 
                    </Button>
                </>
            )}
        </>
    )
}