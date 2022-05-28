import React, { useState } from 'react'
import { useTheme } from 'styled-components'
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaTrash } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'
import { useForm } from "react-hook-form";
import { CgClose } from 'react-icons/cg'
import { AiOutlineArrowDown, AiOutlineArrowRight } from 'react-icons/ai'

import { Button, RadioInput, TextInput } from '../../../../utils/styles/forms'
import { BTYPES, DEFAULT_SITE, SIZES } from '../../../../utils/constants.js'
import { firestore } from '../../../../Fire'
import { Body, H1, H2, H3, Label, LLink } from '../../../../utils/styles/text'
import ConfirmAlert from '../../../misc/ConfirmAlert'
import { Column, Grid, Hr, ModalCard, ModalContainer, Row } from '../../../../utils/styles/misc'
import { FormError } from '../../../misc/Misc'
import FileUpload from '../../../misc/FileUpload'
import { Img } from '../../../../utils/styles/images'
import { Hidden, Visible } from 'react-grid-system'

export default function ManageSite(props) {
    const theme = useTheme();
    const navigate = useNavigate();

    const siteForm = useForm({
        defaultValues: {
            name: props.site.name,
            // projectId: props.site.projectId,// dont think we need to set this yet...
            logo: {
                width: props.site.logo.width,
                height: props.site.logo.height,
                url: props.site.logo.url,
                showTitle: props.site.logo.showTitle
            }
        }
    });

    const [submitting, setSubmitting] = useState({ 
        site: false,
        logoUrl: false,
    });
    
    const [shownModals, setShownModals] = useState([false, false]); 

    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals]
        tempShownModals[index] = newStatus
        setShownModals(tempShownModals);
    };

    const updateSite = (data) => {   
        setSubmitting(prevState => ({
            ...prevState,
            site: true
        }));
        console.log("data.logo.showTitle: " + data.logo.showTitle)
        updateDoc(doc(firestore, "site", "public"), {
            name: data.name,
            logo: {
                width: data.logo.width,
                height: data.logo.height,
                url: data.logo.url,
                showTitle: (data.logo.showTitle === "true"), //** value from react-hook-form is passed as string "false", so we need to "parseBoolean" */
            },
            updated: {
                timestamp: Date.now(),
                userId: props.user.id,
                name: `${props.user.firstName} ${props.user.lastName}`,
                email: props.user.email,
            },
        }).then(() => {
            setSubmitting(prevState => ({
                ...prevState,
                site: false
            }));
            toast.success(`Site updated!`);
        }).catch(error => {
            toast.error(`Error updating site: ${error}`);
            setSubmitting(prevState => ({
                ...prevState,
                site: false
            }));
        });
    }

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
                    height: 100,
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
                    height: DEFAULT_SITE.LOGO.HEIGHT,
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

    const setUrl = (urls, valueName) => {
        siteForm.setValue(valueName, urls[0], { shouldValidate: true, shouldDirty: true })
        toggleModal(false, 0)
        setSubmitting(prevState => ({
            ...prevState,
            files: false
        }));
    };

    if (props.site.unset) {
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
            <Body color={theme.colors.yellow}>No site doc set yet.</Body>
            <H3>Templates</H3>
            <Button type="button" btype={BTYPES.INVERTED} onClick={() => createDefaultSite()}>
                Create Fire React Base default site <FaPlus />
            </Button>
            <Button type="button" color="#4FBFE0" btype={BTYPES.INVERTED} onClick={() => createCustomSite()}>
                Create Minute.tech example site <FaPlus />
            </Button>
            </>
        )
        
    } else {
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
                <form onSubmit={ siteForm.handleSubmit(updateSite) }>
                    <Grid fluid>
                        <Row>
                            <Column sm={12} md={6}>
                                <Label htmlFor={"name"} br>Site Name:</Label>
                                <TextInput
                                    type="text" 
                                    error={siteForm.formState.errors.name}
                                    placeholder={`My Awesome Site`} 
                                    { 
                                        ...siteForm.register("name", {
                                            required: "A site name is required!",
                                            maxLength: {
                                                value: 50,
                                                message: "The site name must be at most 50 characters long."
                                            },
                                            minLength: {
                                                value: 3,
                                                message: "The site name must be at least 3 characters long."
                                            },
                                        })
                                    } 
                                />
                                <FormError error={siteForm.formState.errors.name} /> 
                            </Column>
                            <Column sm={12} md={6}>
                                <Label htmlFor={"logo.showTitle"} br>Show name as title?</Label>
                                <RadioInput
                                    name="logo.showTitle"
                                    defaultChecked={props.site.logo.showTitle}
                                    value={true}
                                    error={siteForm.formState.errors?.logo?.showTitle ?? ""}
                                    {
                                    ...siteForm.register("logo.showTitle")
                                    } 
                                />
                                <Body display="inline" margin="0">Yes</Body>
                                <RadioInput
                                    name="logo.showTitle"
                                    defaultChecked={!props.site.logo.showTitle}
                                    value={false}
                                    error={siteForm.formState.errors?.logo?.showTitle ?? ""}
                                    {
                                    ...siteForm.register("logo.showTitle")
                                    } 
                                />
                                <Body display="inline" margin="0">No</Body>
                                <FormError error={siteForm.formState.errors?.logo?.showTitle ?? ""} /> 
                            </Column>
                        </Row>
                        <H2>Logo</H2>
                        <Row align="center">
                            <Column sm={12} md={4} textalign="center">
                                <Label br>Current Logo</Label>
                                <Img 
                                    src={props.site.logo.url}
                                    border={`2px solid ${theme.colors.primary}`}
                                    alt={`site logo`}
                                    width={`${props.site.logo.width}px`}
                                />
                                <br/>
                                <Button 
                                    type="button"
                                    btype={BTYPES.TEXTED} 
                                    color={theme.colors.yellow}
                                    hidden={siteForm.getValues("logo.url") !== props.site.logo.url ? true : false}
                                    onClick={() => toggleModal(true, 0)}>
                                        update logo
                                </Button>
                            </Column>
                            <Hidden xs sm>
                                <Column 
                                    sm={12} md={4} 
                                    textalign="center" 
                                    hidden={siteForm.getValues("logo.url") === props.site.logo.url ? true : false}
                                >
                                    <AiOutlineArrowRight style={{color: theme.colors.primary}} size={100} />
                                </Column>
                            </Hidden>
                            <Visible xs sm>
                                <Column 
                                    sm={12} md={4} 
                                    textalign="center" 
                                    hidden={siteForm.getValues("logo.url") === props.site.logo.url ? true : false}
                                >
                                    <AiOutlineArrowDown style={{color: theme.colors.primary}} size={100} />
                                </Column>
                            </Visible>
                            <Column 
                                sm={12} 
                                md={4} 
                                textalign="center" 
                                hidden={siteForm.getValues("logo.url") === props.site.logo.url ? true : false}
                            >
                                <Label br>Incoming Logo</Label>
                                <Img 
                                    src={siteForm.getValues("logo.url")}
                                    border={`2px solid ${theme.colors.primary}`}
                                    alt={`incoming site logo`}
                                    width={`${props.site.logo.width}px`}
                                />
                                <br/>
                                <Button 
                                    type="button"
                                    btype={BTYPES.INVERTED} 
                                    color={theme.colors.yellow}
                                    onClick={() => toggleModal(true, 0)}>
                                        update selection
                                </Button>
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={6} md={3} lg={2}>
                                <Label htmlFor={"logo.width"} br>Logo width:</Label>
                                <TextInput
                                    type="number" 
                                    error={siteForm.formState.errors?.logo?.width ?? ""}
                                    placeholder={100} 
                                    { 
                                        ...siteForm.register("logo.width", {
                                            required: "A logo width is required!",
                                            max: {
                                                value: 1000,
                                                message: "1000px wide is too large!"
                                            },
                                            min: {
                                                value: 50,
                                                message: "50px wide is too small!"
                                            },
                                            valueAsNumber: true,
                                        })
                                    } 
                                />
                                <FormError error={siteForm.formState.errors?.logo?.width ?? ""} /> 
                            </Column>
                            <Column sm={6} md={3} lg={2}>
                                <Label htmlFor={"logo.height"} br>Logo height:</Label>
                                <TextInput
                                    type="number" 
                                    error={siteForm.formState.errors?.logo?.height ?? ""}
                                    placeholder={100} 
                                    { 
                                        ...siteForm.register("logo.height", {
                                            required: "A logo height is required!",
                                            max: {
                                                value: 1000,
                                                message: "1000px high is too large!"
                                            },
                                            min: {
                                                value: 50,
                                                message: "50px high is too small!"
                                            },
                                            valueAsNumber: true,
                                        })
                                    } 
                                />
                                <FormError error={siteForm.formState.errors?.logo?.height ?? ""} /> 
                            </Column>
                        </Row>
                        <Row>
                            <Column sm={12} textalign="center">
                                {siteForm.formState.isDirty && (
                                    <Button 
                                        type="submit"
                                        disabled={submitting.site}
                                    >
                                        Save changes
                                    </Button>
                                )}
                            </Column>
                        </Row>
                    </Grid>
                </form>
    
                {shownModals[0] && (
                    <ModalContainer onClick={() => toggleModal(false, 0)}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <Label>Update logo url</Label>
                            <FileUpload
                                    name="logo.url"
                                    path={`public/site/logos/`}
                                    accepts="image/png, image/jpg, image/jpeg" 
                                    onUploadSuccess={setUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.logo?.url ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, 0)}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}
                <Hr/>
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
        )
    }
   
}
