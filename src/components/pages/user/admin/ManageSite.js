import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import { doc, getDoc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { FaChevronLeft, FaPlus, FaTrash } from 'react-icons/fa'
import { BiInfoCircle, BiPlus } from 'react-icons/bi';
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CgCheck, CgClose } from 'react-icons/cg'
import { AiOutlineArrowDown, AiOutlineArrowRight } from 'react-icons/ai'

import { Button, RadioInput, SelectInput, TextAreaInput, TextInput } from '../../../../utils/styles/forms'
import { BTYPES, DEFAULT_SITE, INPUT, SCHEMES, SIZES } from '../../../../utils/constants.js'
import { firestore } from '../../../../Fire'
import { ALink, Body, H1, H3, H4, Label, LLink } from '../../../../utils/styles/text'
import ConfirmAlert from '../../../misc/ConfirmAlert'
import { Column, Grid, Hr, ColorBlock, ModalCard, ModalContainer, Row, Centered } from '../../../../utils/styles/misc'
import { FormError, Tooltip } from '../../../misc/Misc'
import FileUpload from '../../../items-manager/FileUpload'
import { Img } from '../../../../utils/styles/images'
import { Hidden, Visible } from 'react-grid-system'
import { countChangedValues, isColor, readTimestamp } from '../../../../utils/misc'
import { Tabs } from '../../../misc/Tabs'
import ManageAssets from './ManageAssets'
import { FiFeather } from 'react-icons/fi'

export default function ManageSite(props) {
    const theme = useTheme();
    const navigate = useNavigate();

    const siteForm = useForm({
        // Only data that needs to be declared here should be data that can be edited! (I think lol!)
        defaultValues: {
            name: props.site.name,
            // projectId: props.site.projectId, // not quite setting the projectId manually. Created alongside firebase project from Fire.js > .env
            description: props.site.description,
            customUrl: props.site.customUrl,
            emails: {
                support: props.site.emails.support,
                noreply: props.site.emails.noreply, // Currently this is not change-able, there are logistics to changing this, but eventually we will!
            },
            logo: {
                width: props.site.logo.width,
                height: props.site.logo.height,
                lightUrl: props.site.logo.lightUrl,
                darkUrl: props.site.logo.darkUrl,
                showTitle: props.site.logo.showTitle,
                favicon: props.site.logo.favicon,
                appleTouchIcon: props.site.logo.appleTouchIcon,
            },
            theme: {
                font: {
                    heading: {
                        name: props.site.theme.font.heading.name,
                        url: props.site.theme.font.heading.url,
                    },
                    subheading: {
                        name: props.site.theme.font.subheading.name,
                        url: props.site.theme.font.subheading.url,
                    },
                    body: {
                        name: props.site.theme.font.body.name,
                        url: props.site.theme.font.body.url,
                    },
                },
                color: {
                    light: {
                        enabled: props.site.theme.color.light.enabled,
                        primary: props.site.theme.color.light.primary,
                        secondary: props.site.theme.color.light.secondary,
                        tertiary: props.site.theme.color.light.tertiary,
                        green: props.site.theme.color.light.green,
                        red: props.site.theme.color.light.red,
                        yellow: props.site.theme.color.light.yellow,
                        blue: props.site.theme.color.light.blue,
                        grey: props.site.theme.color.light.grey,
                        lightGrey: props.site.theme.color.light.lightGrey,
                        background: props.site.theme.color.light.background,
                        font: {
                            heading: props.site.theme.color.light.font.heading,
                            body: props.site.theme.color.light.font.body,
                            link: props.site.theme.color.light.font.link,
                            solid: props.site.theme.color.light.font.solid,
                            inverted: props.site.theme.color.light.font.inverted,
                        },
                    },
                    dark: {
                        enabled: props.site.theme.color.dark.enabled,
                        primary: props.site.theme.color.dark.primary,
                        secondary: props.site.theme.color.dark.secondary,
                        tertiary: props.site.theme.color.dark.tertiary,
                        green: props.site.theme.color.dark.green,
                        red: props.site.theme.color.dark.red,
                        yellow: props.site.theme.color.dark.yellow,
                        blue: props.site.theme.color.dark.blue,
                        grey: props.site.theme.color.dark.grey,
                        lightGrey: props.site.theme.color.dark.lightGrey,
                        background: props.site.theme.color.dark.background,
                        font: {
                            heading: props.site.theme.color.dark.font.heading,
                            body: props.site.theme.color.dark.font.body,
                            link: props.site.theme.color.dark.font.link,
                            solid: props.site.theme.color.dark.font.solid,
                            inverted: props.site.theme.color.dark.font.inverted,
                        },
                    },
                },
                
            },
            hero: {
                heading: props.site.hero.heading,
                body: props.site.hero.body,
                banner: props.site.hero.banner,
                cta: {
                    text: props.site.hero.cta.text,
                    link: props.site.hero.cta.link,
                    color: props.site.hero.cta.color,
                    size: props.site.hero.cta.size,
                },
            },
            alert: {
                text: props.site.alert.text,
                background: props.site.alert.background,
                link: props.site.alert.link,
                isHidden: props.site.alert.isHidden,
            },
            menus: {
                header: props.site.menus.header,
                quickTabs: props.site.menus.quickTabs,
                quickLinks: props.site.menus.quickLinks,
                footer: props.site.menus.footer,
            },
        }
    });


    const headerFieldArray = useFieldArray({
        control: siteForm.control,
        name: "menus.header",
    });
    const quickTabsFieldArray = useFieldArray({
        control: siteForm.control,
        name: "menus.quickTabs",
    });
    const quickLinksFieldArray = useFieldArray({
        control: siteForm.control,
        name: "menus.quickLinks",
    });
    const footerFieldArray = useFieldArray({
        control: siteForm.control,
        name: "menus.footer",
    });

    const [submitting, setSubmitting] = useState({ 
        site: false,
    });
    
    const [shownModals, setShownModals] = useState([]); 

    const [quickTabNames, setQuickTabNames] = useState([]);
    useEffect(() => {
        let tempTabNames = [];
        props.site.menus.quickTabs.forEach((tab, index) => {
            tempTabNames.push(tab.name);
        });
        setQuickTabNames(tempTabNames);
    }, [props.site.menus.quickTabs]);

    useEffect(() => {
        function onUnload(e) {
            e.preventDefault();
            e.returnValue = "";
        }

        if (siteForm.formState.isDirty) {
            window.addEventListener("beforeunload", onUnload);
        } else {
            window.removeEventListener('beforeunload', onUnload); 
        }
    
        return () => {
          window.removeEventListener('beforeunload', onUnload);
        };
    }, [siteForm.formState.isDirty]);

    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals];
        tempShownModals[index] = newStatus;
        setShownModals(tempShownModals);
    };

    const updateSite = (data) => { 
        // Creating finalItem set of data from form plus any generated or empty values based on itemStructure 
        const finalItem = Object.assign({}, data);

        // Create these items by default on any create //
        finalItem.logo.showTitle = (data.logo.showTitle === "true" || data.logo.showTitle === true); //** value from react-hook-form is passed as string "false", so we need to "parseBoolean" */
        finalItem.theme.color.light.enabled = (data.theme.color.light.enabled === "true" || data.theme.color.light.enabled === true);
        finalItem.theme.color.dark.enabled = (data.theme.color.dark.enabled === "true" || data.theme.color.dark.enabled === true);
        finalItem.alert.isHidden = (data.alert.isHidden=== "true" || data.alert.isHidden === true);

        console.log("finalItem: ")
        console.log(finalItem)
        console.log("props.site: ")
        console.log(props.site)

        const changedValues = countChangedValues(finalItem, props.site, ["created", "updated", "projectId"]);
        
        finalItem.updated = {
            timestamp: Date.now(),
            id: props.fireUser.uid,
            email: props.fireUser.email,
            name: props.fireUser.displayName,
            summary: `Updated ${changedValues.count} values with keys of [${(changedValues.propKeys).toString()}].`,
        };

        updateDoc(doc(firestore, "site", "public"), finalItem).then(() => {
            setSubmitting(prevState => ({
                ...prevState,
                site: false
            }));
            toast.success("Site updated!");
            siteForm.reset(data);
        }).catch(error => {
            toast.error(`Error updating site. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
            console.error("Error updating site: " + error);
            setSubmitting(prevState => ({
                ...prevState,
                site: false
            }));
        });
        
    }

    const createDefaultSite = async () => {
        const publicRef = doc(firestore, "site", "public");
        const publicDocSnap = await getDoc(publicRef);

        if (publicDocSnap.exists()) {
            toast.error(`Public site doc exists, please delete existing site on Firebase console to recreate.`);
            console.log("Public site doc exists, please delete existing site on Firebase console to recreate.");
        } else {
            console.log("Public doc doesn't exist, go ahead and create default!");
            let currentTime = Date.now();
            await setDoc(publicRef, {
                name: DEFAULT_SITE.NAME,
                projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID,
                description: DEFAULT_SITE.DESCRIPTION,
                emails: {
                    support: DEFAULT_SITE.EMAILS.SUPPORT,
                    noreply: DEFAULT_SITE.EMAILS.NOREPLY,
                },
                logo: {
                    width: DEFAULT_SITE.LOGO.WIDTH,
                    height: DEFAULT_SITE.LOGO.HEIGHT,
                    lightUrl: DEFAULT_SITE.LOGO.LIGHT_URL,
                    darkUrl: DEFAULT_SITE.LOGO.DARK_URL,
                    favicon: DEFAULT_SITE.LOGO.FAVICON,
                    appleTouchIcon: DEFAULT_SITE.LOGO.APPLE_TOUCH_ICON,
                    showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
                },
                theme: {
                    font: {
                        heading: {
                            name: DEFAULT_SITE.THEME.FONT.HEADING.NAME,
                            url: DEFAULT_SITE.THEME.FONT.HEADING.URL,
                        },
                        subheading: {
                            name: DEFAULT_SITE.THEME.FONT.SUBHEADING.NAME,
                            url: DEFAULT_SITE.THEME.FONT.SUBHEADING.URL,
                        },
                        body: {
                            name: DEFAULT_SITE.THEME.FONT.BODY.NAME,
                            url: DEFAULT_SITE.THEME.FONT.BODY.URL,
                        },
                    },
                    color: {
                        light:{
                            enabled: DEFAULT_SITE.THEME.COLOR.LIGHT.ENABLED,
                            primary: DEFAULT_SITE.THEME.COLOR.LIGHT.PRIMARY,
                            secondary: DEFAULT_SITE.THEME.COLOR.LIGHT.SECONDARY,
                            tertiary: DEFAULT_SITE.THEME.COLOR.LIGHT.TERTIARY,
                            red: DEFAULT_SITE.THEME.COLOR.LIGHT.RED,
                            green: DEFAULT_SITE.THEME.COLOR.LIGHT.GREEN,
                            yellow: DEFAULT_SITE.THEME.COLOR.LIGHT.YELLOW,
                            blue: DEFAULT_SITE.THEME.COLOR.LIGHT.BLUE,
                            grey: DEFAULT_SITE.THEME.COLOR.LIGHT.GREY,
                            lightGrey: DEFAULT_SITE.THEME.COLOR.LIGHT.LIGHT_GREY,
                            background: DEFAULT_SITE.THEME.COLOR.LIGHT.BACKGROUND,
                            font: {
                                heading: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.HEADING,
                                body: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.BODY,
                                link: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.LINK,
                                solid: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.SOLID,
                                inverted: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.INVERTED,
                            },
                        },
                        dark:{
                            enabled: DEFAULT_SITE.THEME.COLOR.DARK.ENABLED,
                            primary: DEFAULT_SITE.THEME.COLOR.DARK.PRIMARY,
                            secondary: DEFAULT_SITE.THEME.COLOR.DARK.SECONDARY,
                            tertiary: DEFAULT_SITE.THEME.COLOR.DARK.TERTIARY,
                            red: DEFAULT_SITE.THEME.COLOR.DARK.RED,
                            green: DEFAULT_SITE.THEME.COLOR.DARK.GREEN,
                            yellow: DEFAULT_SITE.THEME.COLOR.DARK.YELLOW,
                            blue: DEFAULT_SITE.THEME.COLOR.DARK.BLUE,
                            grey: DEFAULT_SITE.THEME.COLOR.DARK.GREY,
                            lightGrey: DEFAULT_SITE.THEME.COLOR.DARK.LIGHT_GREY,
                            background: DEFAULT_SITE.THEME.COLOR.DARK.BACKGROUND,
                            font: {
                                heading: DEFAULT_SITE.THEME.COLOR.DARK.FONT.HEADING,
                                body: DEFAULT_SITE.THEME.COLOR.DARK.FONT.BODY,
                                link: DEFAULT_SITE.THEME.COLOR.DARK.FONT.LINK,
                                solid: DEFAULT_SITE.THEME.COLOR.DARK.FONT.SOLID,
                                inverted: DEFAULT_SITE.THEME.COLOR.DARK.FONT.INVERTED,
                            },
                        },
                            
                    },
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
                alert: {
                    text: DEFAULT_SITE.ALERT.TEXT,
                    background: DEFAULT_SITE.ALERT.BACKGROUND,
                    link: DEFAULT_SITE.ALERT.LINK,
                    isHidden: DEFAULT_SITE.ALERT.IS_HIDDEN,
                },
                menus: {
                    header: DEFAULT_SITE.MENUS.HEADER,
                    quickTabs: DEFAULT_SITE.MENUS.QUICK_TABS,
                    quickLinks: DEFAULT_SITE.MENUS.QUICK_LINKS,
                    footer: DEFAULT_SITE.MENUS.FOOTER,
                },
                created: {
                    timestamp: currentTime,
                    id: props.fireUser.uid,
                    email: props.fireUser.email,
                    name: props.fireUser.displayName,
                },
                updated: {
                    timestamp: currentTime,
                    id: props.fireUser.uid,
                    email: props.fireUser.email,
                    name: props.fireUser.displayName,
                    summary: "Created site based on defaults.",
                },
            }).then(() => {
                toast.success("Created public document.");
                console.log("Successful write of site public doc to Firestore.");
            }).catch((error) => {
                console.error("Error adding public document: ", error);
                toast.error(`Error setting public document. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
            });
        }
    };

    const deleteSite = async () => {
        await deleteDoc(doc(firestore, "site", "public")).then(() => {
            console.log("Successful delete of doc on firestore");
            toast.success("Deleting site");
            navigate(0);
        }).catch((error) => {
            console.error("Error deleting site: " + error);
            toast.error(`Error deleting site. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
        });
    }

    const setFileUrl = (urls, valueName) => {
        siteForm.setValue(valueName, urls[0], { shouldValidate: true, shouldDirty: true })
        toggleModal(false, valueName)
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
            <Body color={theme.color.yellow}>No site doc set yet.</Body>
            <H3>Templates</H3>
            <Button type="button" btype={BTYPES.INVERTED} onClick={() => createDefaultSite()}>
                Create Fire React Base default site <FaPlus />
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
                <H1 margin="0">Manage Site</H1>
                {props.site.updated && (
                    <Body size={SIZES.SM} display="inline-block" margin="0 0 25px 0">Last updated by {props.site.updated.name} @ {readTimestamp(props.site.updated.timestamp).date} @ {readTimestamp(props.site.updated.timestamp).time}</Body>
                )}
                <form onSubmit={ siteForm.handleSubmit(updateSite) }>
                    <Tabs>
                        <div label="General">
                            <Grid fluid>
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"name"} br>Site Name:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.name ?? ""}
                                            placeholder={`My Awesome Site`} 
                                            { 
                                                ...siteForm.register("name", {
                                                    required: "A site name is required!",
                                                    maxLength: {
                                                        value: 50,
                                                        message: "The site name can be at most 50 characters long."
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "The site name must be at least 3 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.name ?? ""} /> 
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
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"description"} br>Description:</Label>
                                        <TextAreaInput
                                            error={siteForm.formState.errors?.description ?? ""}
                                            placeholder={"This description will be used for SEO purposes, such as the small body text below the main link in a Google Search results page."}
                                            { 
                                                ...siteForm.register("description", {
                                                    required: "A site description is required!",
                                                    maxLength: {
                                                        value: 160,
                                                        message: "The site description can be at most 160 characters long."
                                                    },
                                                    minLength: {
                                                        value: 20,
                                                        message: "The site description must be at least 20 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.description ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"emails.support"} br>Support Email:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.emails?.support ?? ""}
                                            placeholder={`help@minute.tech`} 
                                            { 
                                                ...siteForm.register("emails.support", {
                                                    required: "A support email is required!",
                                                    maxLength: {
                                                        value: 50,
                                                        message: "The support email can be at most 50 characters long."
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "The support email must be at least 3 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.emails?.support ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"emails.noreply"} br>No Reply Email:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.emails?.noreply ?? ""}
                                            placeholder={`noreply@minute.tech`} 
                                            { 
                                                ...siteForm.register("emails.noreply", {
                                                    required: "A noreply email is required!",
                                                    maxLength: {
                                                        value: 50,
                                                        message: "The noreply email can be at most 50 characters long."
                                                    },
                                                    minLength: {
                                                        value: 3,
                                                        message: "The noreply email must be at least 3 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.emails?.noreply ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"customUrl"} br>Custom Domain:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.customUrl ?? ""}
                                            placeholder={INPUT.URL.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("customUrl", {
                                                    maxLength: {
                                                        value: INPUT.URL.ERRORS.MAX.KEY,
                                                        message: INPUT.URL.ERRORS.MAX.MESSAGE,
                                                    },
                                                    minLength: {
                                                        value: INPUT.URL.ERRORS.MIN.KEY,
                                                        message: INPUT.URL.ERRORS.MIN.MESSAGE,
                                                    },
                                                    pattern: {
                                                        value: INPUT.URL.ERRORS.PATTERN.KEY,
                                                        message: INPUT.URL.ERRORS.PATTERN.MESSAGE,
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.customUrl ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={12} margin="20px 0" textalign="center">
                                        <Button 
                                            type="button" 
                                            color={theme.color.red} 
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
                                    </Column>
                                </Row>
                            </Grid>
                        </div>
                        <div label="Branding Files">
                            <Grid fluid>                                
                                <H3>Fonts</H3>
                                <Row>
                                    <Column md={12} lg={4}>
                                        <Label htmlFor={"theme.font.heading.name"} br>Heading Font Name:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.font?.heading?.name ?? ""}
                                            placeholder={"Times New Roman"}
                                            { 
                                                ...siteForm.register("theme.font.heading.name", {
                                                    required: "A hero heading font name is required!",
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.font?.heading?.name ?? ""} /> 
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "theme.font.heading.url")}
                                            hidden={(siteForm.getValues("theme.font.heading.url") && (siteForm.getValues("theme.font.heading.url") !== props.site.theme.font.heading.url))}
                                        >
                                                Update heading font file
                                        </Button>
                                        {(siteForm.getValues("theme.font.heading.url") && (siteForm.getValues("theme.font.heading.url") !== props.site.theme.font.heading.url)) && (
                                            <Body color={theme.color.green}><CgCheck size={40}/>Heading font file uploaded successfully. Don't forget to change the font name above to match, then save this form above!</Body>
                                        )}
                                    </Column>
                                </Row>
                                <Row>
                                    <Column md={12} lg={4}>
                                        <Label htmlFor={"theme.font.subheading.name"} br>Subheading Font Name:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.font?.subheading?.name ?? ""}
                                            placeholder={"Times New Roman"}
                                            { 
                                                ...siteForm.register("theme.font.subheading.name", {
                                                    required: "A hero subheading font name is required!",
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.font?.subheading?.name ?? ""} /> 
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "theme.font.subheading.url")}
                                            hidden={(siteForm.getValues("theme.font.subheading.url") && (siteForm.getValues("theme.font.subheading.url") !== props.site.theme.font.subheading.url))}
                                        >
                                                Update subheading font file
                                        </Button>
                                        {(siteForm.getValues("theme.font.subheading.url") && (siteForm.getValues("theme.font.subheading.url") !== props.site.theme.font.subheading.url)) && (
                                            <Body color={theme.color.green}><CgCheck size={40}/>Subheading font file uploaded successfully. Don't forget to change the font name above to match, then save this form above!</Body>
                                        )}
                                    </Column>
                                </Row>
                                <Row>
                                    <Column md={12} lg={4}>
                                        <Label htmlFor={"theme.font.body.name"} br>Body Font Name:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.font?.body?.name ?? ""}
                                            placeholder={"Times New Roman"}
                                            { 
                                                ...siteForm.register("theme.font.body.name", {
                                                    required: "A hero body is required!",
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.font?.body?.name ?? ""} />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "theme.font.body.url")}
                                            hidden={(siteForm.getValues("theme.font.body.url") && (siteForm.getValues("theme.font.body.url") !== props.site.theme.font.body.url))}
                                        >
                                            Update body font file
                                        </Button>
                                        {(siteForm.getValues("theme.font.body.url") && (siteForm.getValues("theme.font.body.url") !== props.site.theme.font.body.url)) && (
                                            <Body color={theme.color.green}><CgCheck size={40}/>Body font file uploaded successfully. Don't forget to change the font name above to match, then save this form above!</Body>
                                        )}
                                    </Column>
                                </Row>
                                <H3>Logos</H3>
                                <Row align="center">
                                    <Column sm={12} md={4} textalign="center">
                                        <Label br>Current Light Logo</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={props.site.logo.lightUrl}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`site logo`}
                                            width={`${props.site.logo.width}px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            hidden={siteForm.getValues("logo.lightUrl") !== props.site.logo.lightUrl ? true : false}
                                            onClick={() => toggleModal(true, "logo.lightUrl")}
                                        >
                                                Update logo
                                        </Button>
                                    </Column>
                                    <Hidden xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.lightUrl") === props.site.logo.lightUrl ? true : false}
                                        >
                                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Hidden>
                                    <Visible xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.lightUrl") === props.site.logo.lightUrl ? true : false}
                                        >
                                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Visible>
                                    <Column 
                                        sm={12} 
                                        md={4} 
                                        textalign="center" 
                                        hidden={siteForm.getValues("logo.lightUrl") === props.site.logo.lightUrl ? true : false}
                                    >
                                        <Label br>Incoming Logo</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={siteForm.getValues("logo.lightUrl")}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`incoming site logo`}
                                            width={`${props.site.logo.width}px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.TEXTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "logo.lightUrl")}
                                        >
                                                Update selection
                                        </Button>
                                        {/* <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.red}
                                            onClick={() => siteForm.setValue("logo.lightUrl", props.site.logo.lightUrl)}
                                        >
                                            {/* TODO: why is this not working? only works if i try click this then  select a new photo and then back out 
                                            <FaTrash />
                                        </Button> */}
                                    </Column>
                                </Row>
                                <Row align="center">
                                    <Column sm={12} md={4} textalign="center">
                                        <Label br>Current Dark Logo</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={props.site.logo.darkUrl}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`site logo`}
                                            width={`${props.site.logo.width}px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            hidden={siteForm.getValues("logo.darkUrl") !== props.site.logo.darkUrl ? true : false}
                                            onClick={() => toggleModal(true, "logo.darkUrl")}
                                        >
                                                Update logo
                                        </Button>
                                    </Column>
                                    <Hidden xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.darkUrl") === props.site.logo.darkUrl ? true : false}
                                        >
                                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Hidden>
                                    <Visible xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.darkUrl") === props.site.logo.darkUrl ? true : false}
                                        >
                                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Visible>
                                    <Column 
                                        sm={12} 
                                        md={4} 
                                        textalign="center" 
                                        hidden={siteForm.getValues("logo.darkUrl") === props.site.logo.darkUrl ? true : false}
                                    >
                                        <Label br>Incoming Logo</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={siteForm.getValues("logo.darkUrl")}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`incoming site logo`}
                                            width={`${props.site.logo.width}px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.TEXTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "logo.darkUrl")}
                                        >
                                                Update selection
                                        </Button>
                                    </Column>
                                </Row>
                                <Row center="xs">
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"logo.width"} br>Main logo width:</Label>
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
                                                    setValueAs: v => parseInt(v),
                                                    // valueAsNumber: true, //** this was not working, triggering field on another tab when dirtied, so just going to convert before we submit */
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.logo?.width ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"logo.height"} br>Main logo height:</Label>
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
                                                    setValueAs: v => parseInt(v),
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.logo?.height ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row align="center">
                                    <Column sm={12} md={4} textalign="center">
                                        <Label br>Current Favicon</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={props.site.logo.favicon}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`site logo`}
                                            width={`50px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            hidden={siteForm.getValues("logo.favicon") !== props.site.logo.favicon ? true : false}
                                            onClick={() => toggleModal(true, "logo.favicon")}
                                        >
                                                Update favicon
                                        </Button>
                                    </Column>
                                    <Hidden xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.favicon") === props.site.logo.favicon ? true : false}
                                        >
                                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Hidden>
                                    <Visible xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.favicon") === props.site.logo.favicon ? true : false}
                                        >
                                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Visible>
                                    <Column 
                                        sm={12} 
                                        md={4} 
                                        textalign="center" 
                                        hidden={siteForm.getValues("logo.favicon") === props.site.logo.favicon ? true : false}
                                    >
                                        <Label br>Incoming Logo</Label>
                                        <Img
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={siteForm.getValues("logo.favicon")}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`incoming site logo`}
                                            width={`50px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.TEXTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "logo.favicon")}
                                        >
                                                Update selection
                                        </Button>
                                    </Column>
                                </Row>
                                <Row align="center">
                                    <Column sm={12} md={4} textalign="center">
                                        <Label br>Current Apple Touch Icon</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={props.site.logo.appleTouchIcon}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`site logo`}
                                            width={`192px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            hidden={siteForm.getValues("logo.appleTouchIcon") !== props.site.logo.appleTouchIcon ? true : false}
                                            onClick={() => toggleModal(true, "logo.appleTouchIcon")}
                                        >
                                                Update logo
                                        </Button>
                                    </Column>
                                    <Hidden xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.appleTouchIcon") === props.site.logo.appleTouchIcon ? true : false}
                                        >
                                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Hidden>
                                    <Visible xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("logo.appleTouchIcon") === props.site.logo.appleTouchIcon ? true : false}
                                        >
                                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Visible>
                                    <Column 
                                        sm={12} 
                                        md={4} 
                                        textalign="center" 
                                        hidden={siteForm.getValues("logo.appleTouchIcon") === props.site.logo.appleTouchIcon ? true : false}
                                    >
                                        <Label br>Incoming Logo</Label>
                                        <Img
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background} 
                                            bgColor={theme.color.lightGrey}
                                            src={siteForm.getValues("logo.appleTouchIcon")}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`incoming site logo`}
                                            width={`192px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.TEXTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "logo.appleTouchIcon")}
                                        >
                                                Update selection
                                        </Button>
                                    </Column>
                                </Row>
                            </Grid>
                        </div>
                        <div label="Colors">
                            <Grid fluid>
                                <H3>Light Mode <Tooltip text="All HTML color allowed, including hex values (#FFFFF)."><BiInfoCircle size={20}/></Tooltip></H3>
                                <Row>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.light.enabled"} br>Light Mode Enabled?</Label>
                                        <RadioInput
                                            name="theme.color.light.enabled"
                                            defaultChecked={props.site.theme.color.light.enabled}
                                            value={true}
                                            error={siteForm.formState.errors?.theme?.color?.light?.enabled ?? ""}
                                            {
                                                ...siteForm.register("theme.color.light.enabled")
                                            } 
                                        />
                                        <Body display="inline" margin="0">Yes</Body>
                                        <RadioInput
                                            name="theme.color.light.enabled"
                                            defaultChecked={!props.site.theme.color.light.enabled}
                                            value={false}
                                            error={siteForm.formState.errors?.theme?.color?.light?.enabled ?? ""}
                                            {
                                                ...siteForm.register("theme.color.light.enabled")
                                            } 
                                        />
                                        <Body display="inline" margin="0">No</Body>
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.enabled ?? ""} />
                                    </Column>
                                </Row>

                                <H4>Base</H4>
                                <Row>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.light.primary"} br>Primary: <ColorBlock color={props.site.theme.color.light.primary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.primary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.primary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.primary ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.light.secondary"} br>Secondary: <ColorBlock color={props.site.theme.color.light.secondary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.secondary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.secondary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.secondary ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.light.tertiary"} br>Tertiary: <ColorBlock color={props.site.theme.color.light.tertiary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.tertiary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.tertiary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.tertiary ?? ""} /> 
                                    </Column>
                                    <Column md={6} lg={3}>
                                        <Label htmlFor={"theme.color.light.background"} br>Background: <ColorBlock color={props.site.theme.color.light.background} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.background ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.background", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.background ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.green"} br>Green: <ColorBlock color={props.site.theme.color.light.green} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.green ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.green", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.green ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.red"} br>Red: <ColorBlock color={props.site.theme.color.light.red} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.red ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.red", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.red ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.yellow"} br>Yellow: <ColorBlock color={props.site.theme.color.light.yellow} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.yellow ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.yellow", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.yellow ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.blue"} br>Blue: <ColorBlock color={props.site.theme.color.light.blue} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.blue ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.blue", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.blue ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.grey"} br>Grey: <ColorBlock color={props.site.theme.color.light.grey} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.grey ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.grey", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.grey ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.light.lightGrey"} br>Light Grey: <ColorBlock color={props.site.theme.color.light.lightGrey} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.lightGrey ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.lightGrey", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.lightGrey ?? ""} /> 
                                    </Column>
                                </Row>
                                <H4>Fonts</H4>
                                <Row>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.light.font.heading"} br>Heading: <ColorBlock color={props.site.theme.color.light.font.heading} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.font?.heading ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            {
                                                ...siteForm.register("theme.color.light.font.heading", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.font?.heading ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.light.font.body"} br>Body: <ColorBlock color={props.site.theme.color.light.font.body} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.font?.body ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.font.body", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.font?.body ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.light.font.link"} br>Link: <ColorBlock color={props.site.theme.color.light.font.link} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.font?.link ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.font.link", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.font?.link ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.light.font.solid"} br>Solid Button: <ColorBlock color={props.site.theme.color.light.font.solid} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.font?.solid ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.font.solid", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.font?.solid ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.light.font.inverted"} br>Inverted Button: <ColorBlock color={props.site.theme.color.light.font.inverted} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.font?.inverted ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.light.font.inverted", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.light?.font?.inverted ?? ""} /> 
                                    </Column>
                                </Row>

                                <H3>Dark Mode <Tooltip text="All HTML color allowed, including hex values (#FFFFF)."><BiInfoCircle size={20}/></Tooltip></H3>
                                <Row>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.dark.enabled"} br>Dark Mode Enabled?</Label>
                                        <RadioInput
                                            name="theme.color.dark.enabled"
                                            defaultChecked={props.site.theme.color.dark.enabled}
                                            value={true}
                                            error={siteForm.formState.errors?.theme?.color?.dark?.enabled ?? ""}
                                            {
                                                ...siteForm.register("theme.color.dark.enabled")
                                            } 
                                        />
                                        <Body display="inline" margin="0">Yes</Body>
                                        <RadioInput
                                            name="theme.color.dark.enabled"
                                            defaultChecked={!props.site.theme.color.dark.enabled}
                                            value={false}
                                            error={siteForm.formState.errors?.theme?.color?.dark?.enabled ?? ""}
                                            {
                                                ...siteForm.register("theme.color.dark.enabled")
                                            } 
                                        />
                                        <Body display="inline" margin="0">No</Body>
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.enabled ?? ""} />
                                    </Column>
                                </Row>
                                <H4>Base</H4>
                                <Row>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.dark.primary"} br>Primary: <ColorBlock color={props.site.theme.color.dark.primary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.primary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.primary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.primary ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.dark.secondary"} br>Secondary: <ColorBlock color={props.site.theme.color.dark.secondary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.secondary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.secondary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.secondary ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"theme.color.dark.tertiary"} br>Tertiary: <ColorBlock color={props.site.theme.color.dark.tertiary} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.tertiary ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.tertiary", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.tertiary ?? ""} /> 
                                    </Column>
                                    <Column md={6} lg={3}>
                                        <Label htmlFor={"theme.color.dark.background"} br>Background: <ColorBlock color={props.site.theme.color.dark.background} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.background ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.background", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.background ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.green"} br>Green: <ColorBlock color={props.site.theme.color.dark.green} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.green ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.green", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.green ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.red"} br>Red: <ColorBlock color={props.site.theme.color.dark.red} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.red ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.red", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.red ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.yellow"} br>Yellow: <ColorBlock color={props.site.theme.color.dark.yellow} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.yellow ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.yellow", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.yellow ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.blue"} br>Blue: <ColorBlock color={props.site.theme.color.dark.blue} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.light?.blue ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.blue", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.blue ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.grey"} br>Grey: <ColorBlock color={props.site.theme.color.dark.grey} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.grey ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.grey", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.grey ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={3} lg={2}>
                                        <Label htmlFor={"theme.color.dark.lightGrey"} br>Light Grey: <ColorBlock color={props.site.theme.color.dark.lightGrey} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.lightGrey ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.lightGrey", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.lightGrey ?? ""} /> 
                                    </Column>
                                </Row>
                                <H4>Fonts</H4>
                                <Row>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.dark.font.heading"} br>Heading: <ColorBlock color={props.site.theme.color.dark.font.heading} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.font?.heading ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            {
                                                ...siteForm.register("theme.color.dark.font.heading", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.font?.heading ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.dark.font.body"} br>Body: <ColorBlock color={props.site.theme.color.dark.font.body} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.font?.body ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.font.body", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.font?.body ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.dark.font.link"} br>Link: <ColorBlock color={props.site.theme.color.dark.font.link} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.font?.link ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.font.link", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.font?.link ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.dark.font.solid"} br>Solid Button: <ColorBlock color={props.site.theme.color.dark.font.solid} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.font?.solid ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.font.solid", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.font?.solid ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={6} lg={4}>
                                        <Label htmlFor={"theme.color.dark.font.inverted"} br>Inverted Button: <ColorBlock color={props.site.theme.color.dark.font.inverted} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.theme?.color?.dark?.font?.inverted ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER} 
                                            { 
                                                ...siteForm.register("theme.color.dark.font.inverted", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.theme?.color?.dark?.font?.inverted ?? ""} /> 
                                    </Column>
                                </Row>
                            </Grid>
                        </div>
                        <div label="Content">
                            <Grid fluid>
                                <H3>Hero</H3>
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"hero.heading"} br>Heading:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.hero?.heading ?? ""}
                                            placeholder={"Best Site Ever"}
                                            { 
                                                ...siteForm.register("hero.heading", {
                                                    maxLength: {
                                                        value: 100,
                                                        message: "The heading can be at most 30,000 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.hero?.heading ?? ""} /> 
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={12} md={6}>
                                        <Label htmlFor={"hero.body"} br>Body:</Label>
                                        <TextAreaInput
                                            error={siteForm.formState.errors?.hero?.body ?? ""}
                                            placeholder={"Explain the reason visitors are at the site here!"}
                                            { 
                                                ...siteForm.register("hero.body", {
                                                    maxLength: {
                                                        value: 30000,
                                                        message: "The body text can be at most 30,000 characters long."
                                                    },
                                                })
                                            } 
                                        />
                                        <FormError error={siteForm.formState.errors?.hero?.body ?? ""} /> 
                                    </Column>
                                </Row>

                                <Row align="center">
                                    <Column sm={12} md={4} textalign="center">
                                        <Label br>Current Banner</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={props.site.hero.banner}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`site banner`}
                                            width={`300px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED} 
                                            color={theme.color.yellow}
                                            hidden={siteForm.getValues("hero.banner") !== props.site.hero.banner ? true : false}
                                            onClick={() => toggleModal(true, "hero.banner")}
                                        >
                                            Update banner
                                        </Button>
                                    </Column>
                                    <Hidden xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("hero.banner") === props.site.hero.banner ? true : false}
                                        >
                                            <AiOutlineArrowRight style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Hidden>
                                    <Visible xs sm>
                                        <Column 
                                            sm={12} md={4} 
                                            textalign="center" 
                                            hidden={siteForm.getValues("hero.banner") === props.site.hero.banner ? true : false}
                                        >
                                            <AiOutlineArrowDown style={{color: theme.color.primary}} size={100} />
                                            <Body margin="0">Ready to save changes!</Body>
                                        </Column>
                                    </Visible>
                                    <Column 
                                        sm={12} 
                                        md={4} 
                                        textalign="center" 
                                        hidden={siteForm.getValues("hero.banner") === props.site.hero.banner ? true : false}
                                    >
                                        <Label br>Incoming Banner</Label>
                                        <Img 
                                            hoverBgColor={theme.value === SCHEMES.DARK ? props.site.theme.color.light.background : props.site.theme.color.dark.background}
                                            bgColor={theme.color.lightGrey}
                                            src={siteForm.getValues("hero.banner")}
                                            border={`2px solid ${theme.color.primary}`}
                                            alt={`incoming site banner`}
                                            width={`300px`}
                                        />
                                        <br/>
                                        <Button 
                                            type="button"
                                            btype={BTYPES.TEXTED} 
                                            color={theme.color.yellow}
                                            onClick={() => toggleModal(true, "hero.banner")}
                                        >
                                                Update selection
                                        </Button>
                                    </Column>
                                </Row>
                                <Row>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"hero.cta.text"} br>Button text:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.hero?.cta?.text ?? ""}
                                            placeholder={"Explain the reason visitors are at the site here!"}
                                            {
                                                ...siteForm.register("hero.cta.text", {
                                                    maxLength: {
                                                        value: 50,
                                                        message: "The button text can be at most 50 characters long."
                                                    },
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.hero?.cta?.text ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"hero.cta.link"} br>Button link:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.hero?.cta?.link ?? ""}
                                            placeholder={"/about"}
                                            {
                                                ...siteForm.register("hero.cta.link")
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.hero?.cta?.link ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"hero.cta.color"} br>Button color: <ColorBlock color={props.site.hero.cta.color} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.hero?.cta?.color ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER}
                                            {
                                                ...siteForm.register("hero.cta.color", {
                                                    required: INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.hero?.cta?.color ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"hero.cta.size"} br>Button size:</Label>
                                        <SelectInput defaultValue={props.site.hero.cta.size} {...siteForm.register("hero.cta.size")}>
                                            {
                                                Object.entries(SIZES).map(([key, size]) => {
                                                    return (
                                                        <option key={key} value={size}>{size.toUpperCase()}</option>
                                                    )
                                                })
                                            }
                                        </SelectInput>
                                        <FormError error={siteForm.formState.errors?.hero?.cta?.size ?? ""} /> 
                                    </Column>
                                </Row>
                                <H3>Site Alert</H3>
                                <Row>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"alert.text"} br>Alert text:</Label>
                                        <TextInput
                                            type="text"
                                            error={siteForm.formState.errors?.alert?.text ?? ""}
                                            placeholder={"What would you like to alert visitors about on the site?"}
                                            {
                                                ...siteForm.register("alert.text", {
                                                    maxLength: {
                                                        value: 500,
                                                        message: "The alert can be at most 500 characters long."
                                                    },
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.alert?.text ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"alert.background"} br>Background color: <ColorBlock color={props.site?.alert?.background ?? "white"} /></Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.alert?.background ?? ""}
                                            placeholder={INPUT.COLOR.PLACEHOLDER}
                                            {
                                                ...siteForm.register("alert.background", {
                                                    validate: value => isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE,
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.alert?.background ?? ""} /> 
                                    </Column>
                                    <Column sm={12} md={6} lg={3}>
                                        <Label htmlFor={"alert.link"} br>Button link:</Label>
                                        <TextInput
                                            type="text" 
                                            error={siteForm.formState.errors?.alert?.link ?? ""}
                                            placeholder={INPUT.URL.PLACEHOLDER}
                                            {
                                                ...siteForm.register("alert.link", {
                                                    maxLength: {
                                                        value: INPUT.URL.ERRORS.MAX.KEY,
                                                        message: INPUT.URL.ERRORS.MAX.MESSAGE,
                                                    },
                                                    minLength: {
                                                        value: INPUT.URL.ERRORS.MIN.KEY,
                                                        message: INPUT.URL.ERRORS.MIN.MESSAGE,
                                                    },
                                                    pattern: {
                                                        value: INPUT.URL.ERRORS.PATTERN.KEY,
                                                        message: INPUT.URL.ERRORS.PATTERN.MESSAGE,
                                                    },
                                                })
                                            }
                                        />
                                        <FormError error={siteForm.formState.errors?.alert?.link ?? ""} /> 
                                    </Column>
                                    <Column sm={6} md={4} lg={3}>
                                        <Label htmlFor={"alert.isHidden"} br>Is hidden?</Label>
                                        <RadioInput
                                            name="alert.isHidden"
                                            defaultChecked={props.site.alert.isHidden}
                                            value={true}
                                            error={siteForm.formState.errors?.alert?.isHidden ?? ""}
                                            {
                                                ...siteForm.register("alert.isHidden")
                                            } 
                                        />
                                        <Body display="inline" margin="0">Yes</Body>
                                        <RadioInput
                                            name="alert.isHidden"
                                            defaultChecked={!props.site.alert.isHidden}
                                            value={false}
                                            error={siteForm.formState.errors?.alert?.isHidden ?? ""}
                                            {
                                                ...siteForm.register("alert.isHidden")
                                            } 
                                        />
                                        <Body display="inline" margin="0">No</Body>
                                        <FormError error={siteForm.formState.errors?.alert?.isHidden ?? ""} />
                                    </Column>
                                </Row>
                            </Grid>
                        </div>
                        <div label="Menus">
                            <Grid fluid>
                                <Row>
                                    <Column sm={12}>
                                        <Label htmlFor={"menus.header"} br>Header: <Tooltip text="Menu at the top of every page."><BiInfoCircle size={20}/></Tooltip></Label>
                                        {
                                            headerFieldArray.fields.map((field, f) => {
                                                const nameError = siteForm.formState?.errors?.["menus"]?.["header"]?.[f]?.["name"] ?? "";
                                                const linkError = siteForm.formState?.errors?.["menus"]?.["header"]?.[f]?.["link"] ?? "";
                                                return (
                                                    <Row key={f}>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.header.${f}.name`} br>Name:</Label>
                                                            <Controller
                                                                name={`menus.header.${f}.name`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    required: "A name is required.",
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={"About"}
                                                                        key={`${field.id} name`}
                                                                        error={nameError}
                                                                        {...siteForm.register(`menus.header.${f}.name`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={nameError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.header.${f}.link`} br>Link:</Label>
                                                            <Controller
                                                                name={`menus.header.${f}.link`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    maxLength: {
                                                                        value: INPUT.URL.ERRORS.MAX.KEY,
                                                                        message: INPUT.URL.ERRORS.MAX.MESSAGE,
                                                                    },
                                                                    minLength: {
                                                                        value: INPUT.URL.ERRORS.MIN.KEY,
                                                                        message: INPUT.URL.ERRORS.MIN.MESSAGE,
                                                                    },
                                                                    // TODO: pattern 
                                                                    // pattern: {
                                                                    //     value: INPUT.URL.ERRORS.PATTERN.KEY,
                                                                    //     message: INPUT.URL.ERRORS.PATTERN.MESSAGE,
                                                                    // },
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={INPUT.URL.PLACEHOLDER}
                                                                        key={`${field.id} link`}
                                                                        error={linkError}
                                                                        {...siteForm.register(`menus.header.${f}.link`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={linkError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                color={theme.color.red} 
                                                                onClick={() => [headerFieldArray.remove(f), headerFieldArray.update()]}
                                                            >
                                                                <FaTrash /> Remove menu item<sup>{f ? f+1 : 1}</sup>
                                                            </Button>
                                                        </Column>
                                                    </Row>
                                                )
                                            })
                                        }
                                        <FormError error={siteForm.formState.errors?.menus?.header} />
                                        <Button 
                                            size={SIZES.SM} 
                                            color={theme.color.green} 
                                            type="button"
                                            onClick={() => [headerFieldArray.append({name: "", link: ""}), headerFieldArray.update()]}
                                        >
                                            <BiPlus /> Add new menu item
                                        </Button>
                                    </Column>
                                    <Column sm={12}>
                                        <Label htmlFor={"menus.quickTabs"} br>Quick Tabs: <Tooltip text="List of internal links on the admin dashboard."><BiInfoCircle size={20}/></Tooltip></Label>
                                        {
                                            quickTabsFieldArray.fields.map((field, f) => {
                                                const nameError = siteForm.formState?.errors?.["menus"]?.["quickTabs"]?.[f]?.["name"] ?? "";
                                                return (
                                                    <Row key={f}>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickTabs.${f}.name`} br>Name:</Label>
                                                            <Controller
                                                                name={`menus.quickTabs.${f}.name`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    required: "A name is required.",
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={"About"}
                                                                        key={`${field.id} name`}
                                                                        error={nameError}
                                                                        {...siteForm.register(`menus.quickTabs.${f}.name`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={nameError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                color={theme.color.red} 
                                                                onClick={() => [quickTabsFieldArray.remove(f), quickTabsFieldArray.update()]}
                                                            >
                                                                <FaTrash /> Remove menu item<sup>{f ? f+1 : 1}</sup>
                                                            </Button>
                                                        </Column>
                                                    </Row>
                                                )
                                            })
                                        }
                                        <FormError error={siteForm.formState.errors?.menus?.quickTabs} />
                                        <Button 
                                            size={SIZES.SM} 
                                            color={theme.color.green} 
                                            type="button"
                                            onClick={() => [quickTabsFieldArray.append({name: ""}), quickTabsFieldArray.update()]}
                                        >
                                            <BiPlus /> Add new menu item
                                        </Button>
                                    </Column>
                                    <Column sm={12}>
                                        <Label htmlFor={"menus.quickLinks"} br>Quick Links: <Tooltip text="List of internal links on the admin dashboard. If the icon field is blank, we will just use the favicon from the URL."><BiInfoCircle size={20}/></Tooltip></Label>
                                        {
                                            quickLinksFieldArray.fields.map((field, f) => {
                                                const nameError = siteForm.formState?.errors?.["menus"]?.["quickLinks"]?.[f]?.["name"] ?? "";
                                                const linkError = siteForm.formState?.errors?.["menus"]?.["quickLinks"]?.[f]?.["link"] ?? "";
                                                const tabError = siteForm.formState?.errors?.["menus"]?.["quickLinks"]?.[f]?.["tab"] ?? "";
                                                const iconError = siteForm.formState?.errors?.["menus"]?.["quickLinks"]?.[f]?.["icon"] ?? "";
                                                const colorError = siteForm.formState?.errors?.["menus"]?.["quickLinks"]?.[f]?.["color"] ?? "";
                                                return (
                                                    <Row key={f}>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickLinks.${f}.name`} br>Name:</Label>
                                                            <Controller
                                                                name={`menus.quickLinks.${f}.name`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    required: "A name is required.",
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={"About"}
                                                                        key={`${field.id} name`}
                                                                        error={nameError}
                                                                        {...siteForm.register(`menus.quickLinks.${f}.name`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={nameError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickLinks.${f}.link`} br>Link:</Label>
                                                            <Controller
                                                                name={`menus.quickLinks.${f}.link`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    maxLength: {
                                                                        value: INPUT.URL.ERRORS.MAX.KEY,
                                                                        message: INPUT.URL.ERRORS.MAX.MESSAGE,
                                                                    },
                                                                    minLength: {
                                                                        value: INPUT.URL.ERRORS.MIN.KEY,
                                                                        message: INPUT.URL.ERRORS.MIN.MESSAGE,
                                                                    },
                                                                    // TODO: pattern 
                                                                    // pattern: {
                                                                    //     value: INPUT.URL.ERRORS.PATTERN.KEY,
                                                                    //     message: INPUT.URL.ERRORS.PATTERN.MESSAGE,
                                                                    // },
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={INPUT.URL.PLACEHOLDER}
                                                                        key={`${field.id} link`}
                                                                        error={linkError}
                                                                        {...siteForm.register(`menus.quickLinks.${f}.link`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={linkError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickLinks.${f}.color`} br>Color: <ColorBlock color={props.site?.menus?.quickLinks?.[f]?.color ?? theme.color.primary} /></Label>
                                                            <Controller
                                                                name={`menus.quickLinks.${f}.color`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    validate: (value) => (value === "" || isColor(value) || INPUT.COLOR.ERRORS.VALIDATE.MESSAGE),
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={INPUT.COLOR.PLACEHOLDER}
                                                                        key={`${field.id} color`}
                                                                        error={colorError}
                                                                        {...siteForm.register(`menus.quickLinks.${f}.color`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={colorError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickLinks.${f}.icon`} br>
                                                                Icon:&nbsp;
                                                                <ALink href="https://react-icons.github.io/react-icons/icons?name=fi" target="_blank" rel="noopener noreferrer">
                                                                    <Body 
                                                                        display="inline" 
                                                                        margin="0" 
                                                                        size={SIZES.SM} 
                                                                        color={theme.color.green}
                                                                    >
                                                                        <FiFeather /> Feather icons 
                                                                    </Body>
                                                                </ALink>
                                                            </Label>
                                                            <Controller
                                                                name={`menus.quickLinks.${f}.icon`}
                                                                control={siteForm.control}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={"FiHeart"}
                                                                        key={`${field.id} icon`}
                                                                        error={iconError}
                                                                        {...siteForm.register(`menus.quickLinks.${f}.icon`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={iconError} />
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.quickLinks.${f}.tab`} br>Tab:</Label>
                                                            <Controller
                                                                name={`menus.quickLinks.${f}.tab`}
                                                                control={siteForm.control}
                                                                render={({ field: onChange }) => (
                                                                    <SelectInput
                                                                        key={`${field.id} tab`}
                                                                        width={"100%"}
                                                                        error={tabError} 
                                                                        onClick={() => quickTabsFieldArray.update()}
                                                                        onChange={() => quickTabsFieldArray.update()}
                                                                        {...siteForm.register(`menus.quickLinks.${f}.tab`, {required: "A tab is required."})}
                                                                    >
                                                                        <option key={""} value={""}>No selection</option>
                                                                        {
                                                                            quickTabNames.map((option) => {
                                                                                return (
                                                                                    <option key={option} value={option}>
                                                                                        {option}
                                                                                    </option>
                                                                                )
                                                                            })                                                               
                                                                        }
                                                                    </SelectInput>
                                                                )}
                                                            />
                                                            <FormError error={tabError} />
                                                        </Column>
                                                        <Column sm={12}>
                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                color={theme.color.red} 
                                                                margin="10px 0 0 0"
                                                                onClick={() => [quickLinksFieldArray.remove(f), quickLinksFieldArray.update()]}
                                                            >
                                                                <FaTrash /> Remove menu item<sup>{f ? f+1 : 1}</sup>
                                                            </Button>
                                                        </Column>
                                                    </Row>
                                                )
                                            })
                                        }
                                        <FormError error={siteForm.formState.errors?.menus?.quickLinks} />
                                        <Button 
                                            size={SIZES.SM}
                                            color={theme.color.green}
                                            type="button"
                                            onClick={() => [quickLinksFieldArray.append({name: "", link: ""}), quickLinksFieldArray.update()]}
                                        >
                                            <BiPlus /> Add new menu item
                                        </Button>
                                    </Column>
                                    <Column sm={12}>
                                        <Label htmlFor={"menus.footer"} br>Footer:<Tooltip text="Menu at the bottom of every page"><BiInfoCircle size={20}/></Tooltip></Label>
                                        {
                                            footerFieldArray.fields.map((field, f) => {
                                                const nameError = siteForm.formState?.errors?.["menus"]?.["footer"]?.[f]?.["name"] ?? "";
                                                const linkError = siteForm.formState?.errors?.["menus"]?.["footer"]?.[f]?.["link"] ?? "";
                                                return (
                                                    <Row key={f}>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.footer.${f}.name`} br>Name:</Label>
                                                            <Controller
                                                                name={`menus.footer.${f}.name`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    required: "A name is required.",
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={"About"}
                                                                        key={`${field.id} name`}
                                                                        error={nameError}
                                                                        {...siteForm.register(`menus.footer.${f}.name`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={nameError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Label htmlFor={`menus.footer.${f}.link`} br>Link:</Label>
                                                            <Controller
                                                                name={`menus.footer.${f}.link`}
                                                                control={siteForm.control}
                                                                rules={{
                                                                    maxLength: {
                                                                        value: INPUT.URL.ERRORS.MAX.KEY,
                                                                        message: INPUT.URL.ERRORS.MAX.MESSAGE,
                                                                    },
                                                                    minLength: {
                                                                        value: INPUT.URL.ERRORS.MIN.KEY,
                                                                        message: INPUT.URL.ERRORS.MIN.MESSAGE,
                                                                    },
                                                                    // TODO: pattern 
                                                                    // pattern: {
                                                                    //     value: INPUT.URL.ERRORS.PATTERN.KEY,
                                                                    //     message: INPUT.URL.ERRORS.PATTERN.MESSAGE,
                                                                    // },
                                                                }}
                                                                render={({ field }) => (
                                                                    <TextInput
                                                                        type="text"
                                                                        placeholder={INPUT.URL.PLACEHOLDER}
                                                                        key={`${field.id} link`}
                                                                        error={linkError}
                                                                        {...siteForm.register(`menus.footer.${f}.link`)}
                                                                    />
                                                                )}
                                                            />
                                                            <FormError error={linkError} /> 
                                                        </Column>
                                                        <Column sm={12} md={6} lg={4}>
                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                color={theme.color.red} 
                                                                onClick={() => [footerFieldArray.remove(f), footerFieldArray.update()]}
                                                            >
                                                                <FaTrash /> Remove menu item<sup>{f ? f+1 : 1}</sup>
                                                            </Button>
                                                        </Column>
                                                    </Row>
                                                )
                                            })
                                        }
                                        <FormError error={siteForm.formState.errors?.menus?.footer} />
                                        <Button 
                                            size={SIZES.SM} 
                                            color={theme.color.green} 
                                            type="button"
                                            onClick={() => [footerFieldArray.append({name: "", link: ""}), footerFieldArray.update()]}
                                        >
                                            <BiPlus /> Add new menu item
                                        </Button>
                                    </Column>
                                </Row>
                            </Grid>
                        </div>
                        <div label="Web Assets">
                                <ManageAssets {...props} />
                        </div>
                    </Tabs>
                    <Centered padding="20px 0 0 0">
                        {siteForm.formState.isDirty && 
                            <Button 
                                size={SIZES.XL}
                                type="submit"
                                disabled={submitting.site}
                            >
                                Save Changes
                            </Button>
                        }
                    </Centered>
                </form>
    
                {shownModals["logo.lightUrl"] && (
                    <ModalContainer onClick={() => toggleModal(false, "logo.lightUrl")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update logo:</H3>
                            <FileUpload
                                name="logo.lightUrl"
                                path={`public/site/logos/`}
                                accepts="image/*" 
                                onUploadSuccess={setFileUrl}
                                setSubmitting={setSubmitting}
                                submitting={submitting}
                                setError={siteForm.setError}
                                clearError={siteForm.clearErrors}
                                error={siteForm.formState?.errors?.logo?.lightUrl ?? ""}
                            />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "logo.lightUrl")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["logo.darkUrl"] && (
                    <ModalContainer onClick={() => toggleModal(false, "logo.darkUrl")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update logo:</H3>
                            <FileUpload
                                    name="logo.darkUrl"
                                    path={`public/site/logos/`}
                                    accepts="image/*" 
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.logo?.darkUrl ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "logo.darkUrl")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["logo.favicon"] && (
                    <ModalContainer onClick={() => toggleModal(false, "logo.favicon")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update Favicon:</H3>
                            <FileUpload
                                    name="logo.favicon"
                                    path={`public/site/logos/`}
                                    accepts="image/*"
                                    pixelDims={{
                                        width: 48,
                                        height: 48,
                                    }}
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.logo?.favicon ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "logo.favicon")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["logo.appleTouchIcon"] && (
                    <ModalContainer onClick={() => toggleModal(false, "logo.appleTouchIcon")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update Apple Touch Icon:</H3>
                            <FileUpload
                                    name="logo.appleTouchIcon"
                                    path={`public/site/logos/`}
                                    accepts="image/*"
                                    pixelDims={{
                                        width: 180,
                                        height: 180,
                                    }}
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.logo?.appleTouchIcon ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "logo.appleTouchIcon")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["theme.font.heading.url"] && (
                    <ModalContainer onClick={() => toggleModal(false, "theme.font.heading.url")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update heading font:</H3>
                            <FileUpload
                                    name="theme.font.heading.url"
                                    path={`public/site/fonts/`}
                                    accepts="*"
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.font?.heading?.url ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "theme.font.heading.url")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}


                {shownModals["theme.font.subheading.url"] && (
                    <ModalContainer onClick={() => toggleModal(false, "theme.font.subheading.url")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update subheading font:</H3>
                            <FileUpload
                                    name="theme.font.subheading.url"
                                    path={`public/site/fonts/`}
                                    accepts="*"
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.font?.subheading?.url ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "theme.font.subheading.url")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["theme.font.body.url"] && (
                    <ModalContainer onClick={() => toggleModal(false, "theme.font.body.url")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update body font:</H3>
                            <FileUpload
                                    name="theme.font.body.url"
                                    path={`public/site/fonts/`}
                                    accepts="*"
                                    onUploadSuccess={setFileUrl}
                                    setSubmitting={setSubmitting}
                                    submitting={submitting}
                                    setError={siteForm.setError}
                                    clearError={siteForm.clearErrors}
                                    error={siteForm.formState?.errors?.font?.body?.url ?? ""}
                                />
                            
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "theme.font.body.url")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}

                {shownModals["hero.banner"] && (
                    <ModalContainer onClick={() => toggleModal(false, "hero.banner")}>
                        <ModalCard onClick={(e) => e.stopPropagation()}>
                            <H3>Update hero banner:</H3>
                            <FileUpload
                                name="hero.banner"
                                path={`public/site/banners/`}
                                accepts="*"
                                // aspectRatio={{
                                //     numer: 16,
                                //     denom: 9,
                                // }}
                                onUploadSuccess={setFileUrl}
                                setSubmitting={setSubmitting}
                                submitting={submitting}
                                setError={siteForm.setError}
                                clearError={siteForm.clearErrors}
                                error={siteForm.formState?.errors?.hero?.banner ?? ""}
                            />
                            <Hr />
                            <Button 
                                type="button"
                                size={SIZES.SM} 
                                onClick={() => toggleModal(false, "hero.banner")}
                            >
                                <CgClose /> Close 
                            </Button>
                        </ModalCard>
                    </ModalContainer>
                )}
            </>
        )
    }
   
}