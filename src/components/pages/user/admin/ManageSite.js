import React from 'react'
import { useTheme } from 'styled-components'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaTrash } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'

import { Button } from '../../../../utils/styles/forms'
import { BTYPES, DEFAULT_SITE } from '../../../../utils/constants.js'
import { firestore } from '../../../../Fire'
import { Body, H1, LLink } from '../../../../utils/styles/text'
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
                    fonts: {
                        heading: {
                            name: "Lato Black",
                            url: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Ffonts%2FLato-Black.ttf?alt=media&token=cd887b00-055e-4a9d-a55b-3dda0ecd9e7b",
                            light: DEFAULT_SITE.THEME.FONTS.HEADING.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.HEADING.DARK,
                        },
                        body: {
                            name: "Lato Regular",
                            url: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Ffonts%2FLato-Regular.ttf?alt=media&token=f2f37502-4d69-4224-ba6b-c9426ea22c20",
                            light: DEFAULT_SITE.THEME.FONTS.BODY.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.BODY.DARK,
                        },
                        link: {
                            name: "",
                            url: "",
                            light: DEFAULT_SITE.THEME.FONTS.LINK.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.LINK.DARK,
                        },
                    },
                    colors: {
                        primary: "#4FBFE0",
                        secondary: "#FDBB30",
                        tertiary: DEFAULT_SITE.THEME.COLORS.TERTIARY,
                        red: DEFAULT_SITE.THEME.COLORS.RED,
                        green: DEFAULT_SITE.THEME.COLORS.GREEN,
                        yellow: DEFAULT_SITE.THEME.COLORS.YELLOW,
                        blue: DEFAULT_SITE.THEME.COLORS.BLUE,
                        grey: DEFAULT_SITE.THEME.COLORS.GREY,
                        lightGrey: DEFAULT_SITE.THEME.COLORS.LIGHT_GREY,
                        background: {
                            light: DEFAULT_SITE.THEME.COLORS.BACKGROUND.LIGHT,
                            dark: DEFAULT_SITE.THEME.COLORS.BACKGROUND.DARK,
                        },
                    },
                },
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
    };

    const createDefaultSite = async () => {
        const publicRef = doc(firestore, "site", "public");
        const publicDocSnap = await getDoc(publicRef);

        if (publicDocSnap.exists()) {
            toast.error(`Public site doc exists, please delete existing site on Firebase console to recreate.`);
            console.log("Public site doc exists, please delete existing site on Firebase console to recreate.");
        } else {
            console.log("Public doc doesn't exist, go ahead and create default!");
            
            await setDoc(publicRef, {
                name: DEFAULT_SITE.NAME,
                projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID,
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
                    fonts: {
                        heading: {
                            name: DEFAULT_SITE.THEME.FONTS.HEADING.NAME,
                            url: DEFAULT_SITE.THEME.FONTS.HEADING.URL,
                            light: DEFAULT_SITE.THEME.FONTS.HEADING.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.HEADING.DARK,
                        },
                        body: {
                            name: DEFAULT_SITE.THEME.FONTS.BODY.NAME,
                            url: DEFAULT_SITE.THEME.FONTS.BODY.URL,
                            light: DEFAULT_SITE.THEME.FONTS.BODY.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.BODY.DARK,
                        },
                        link: {
                            name: DEFAULT_SITE.THEME.FONTS.LINK.NAME,
                            url: DEFAULT_SITE.THEME.FONTS.LINK.URL,
                            light: DEFAULT_SITE.THEME.FONTS.LINK.LIGHT,
                            dark: DEFAULT_SITE.THEME.FONTS.LINK.DARK,
                        },
                    },
                    colors: {
                        primary: DEFAULT_SITE.THEME.COLORS.PRIMARY,
                        secondary: DEFAULT_SITE.THEME.COLORS.SECONDARY,
                        tertiary: DEFAULT_SITE.THEME.COLORS.TERTIARY,
                        red: DEFAULT_SITE.THEME.COLORS.RED,
                        green: DEFAULT_SITE.THEME.COLORS.GREEN,
                        yellow: DEFAULT_SITE.THEME.COLORS.YELLOW,
                        blue: DEFAULT_SITE.THEME.COLORS.BLUE,
                        grey: DEFAULT_SITE.THEME.COLORS.GREY,
                        lightGrey: DEFAULT_SITE.THEME.COLORS.LIGHT_GREY,
                        background: {
                            light: DEFAULT_SITE.THEME.COLORS.BACKGROUND.LIGHT,
                            dark: DEFAULT_SITE.THEME.COLORS.BACKGROUND.DARK,
                        },
                    },
                },
            }).then(() => {
                toast.success(`Created public doc.`);
                console.log("Successful write of site public doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding public document: ", error);
                toast.error(`Error setting public doc: ${error}`);
            });

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
    };

    const deleteSite = async () => {
        await deleteDoc(doc(firestore, "site", "public")).then(() => {
            console.log("Successful delete of doc on firestore");
            toast.success("Deleting site");
            navigate(0);
        }).catch((error) => {
            console.error("Error deleting site: ", error);
            toast.error(`Error deleting site: ${error}`);
        });
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
                <Body color={theme.colors.yellow}>No site doc set yet.</Body>
                <Button type="button" btype={BTYPES.INVERTED} onClick={() => createDefaultSite()}>
                    Create Fire React Base default site <FaPlus />
                </Button>
                <Button type="button" color="#4FBFE0" btype={BTYPES.INVERTED} onClick={() => createCustomSite()}>
                    Create Minute.tech example site <FaPlus />
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
