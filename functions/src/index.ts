"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import sgMail = require("@sendgrid/mail");
import {DocumentSnapshot, FieldValue} from "firebase-admin/firestore";
import {DEFAULT_SITE} from "./constants";

admin.initializeApp(functions.config().firebase);
sgMail.setApiKey(functions.config().sendgrid_api.key);
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "");
const projectId = adminConfig.projectId ?? "fire-react-base";

export const onMessageCreated = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snap: DocumentSnapshot, context: functions.EventContext) => {
        const newValues = snap.data();
        if (!newValues) {
            return;
        } else {
            console.log("newValues: ");
            console.log(newValues);
        }

        try {
            const allPromises: Array<Promise<any>> = [];
            let publicSiteData: FirebaseFirestore.DocumentData | any = null;
            let sensitiveSiteData: FirebaseFirestore.DocumentData | any = null;
            await admin.firestore().collection("site").doc("public").get().then((publicSiteDoc) => {
                if (publicSiteDoc.exists) {
                    const docWithMore = Object.assign({}, publicSiteDoc.data());
                    docWithMore.id = publicSiteDoc.id;
                    publicSiteData = docWithMore;
                } else {
                    console.error("Site doc doesn't exists, so setting the default stuff we need for now!");
                    publicSiteData = {
                        name: DEFAULT_SITE.NAME,
                        projectId: projectId,
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
                                            body: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.BODY,
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
                                            body: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.BODY,
                                            link: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.LINK,
                                        },
                                        background: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.BACKGROUND,
                                    },
                                },
                            },
                            fonts: {
                                heading: DEFAULT_SITE.THEME.FONTS.HEADING,
                                body: DEFAULT_SITE.THEME.FONTS.BODY,
                            },
                        },
                    };
                }
            }).catch((error) => {
                console.log("Error getting site public document:", error);
            });

            await admin.firestore().collection("site").doc("sensitive").get().then((sensitiveSiteDoc) => {
                if (sensitiveSiteDoc.exists) {
                    const docWithMore = Object.assign({}, sensitiveSiteDoc.data());
                    docWithMore.id = sensitiveSiteDoc.id;
                    sensitiveSiteData = docWithMore;
                } else {
                    console.error("Site doc doesn't exists, so setting the default stuff we need for now!");
                    sensitiveSiteData.messengers = DEFAULT_SITE.EMAILS.MESSENGERS;
                }
            }).catch((error) => {
                console.log("Error getting site sensitive document:", error);
            });

            const heading = "New Website Contact Message!";
            const body =
            `
                <div>
                    <h3>Message Details:</h3>
                    <p><b>Name</b>: ${newValues.name}</p>
                    <p><b>Email</b>: ${newValues.email}</p>
                    <p>
                        <b>Message</b>:
                        <br/>
                        ${newValues.body}
                    </p>
                    <div style="font-size:2px; line-height:2px; height:2px; margin-top: 2px; background:${publicSiteData?.theme?.schemes?.light?.colors?.primary ?? "black"};" role="separator">&#8202;</div>
                    <p>
                        You can reply directly to this email to continue the email thread with the user who sent the message.
                    </p>
                </div>
            `;

            // Pack It
            const msg = {
                to: sensitiveSiteData.messengers,
                from: `${publicSiteData.name} <${publicSiteData.emails.noreply}>`,
                replyTo: `${newValues.email}`,
                cc: "",
                bcc: [],
                // Create this template on SendGrid: https://mc.sendgrid.com/dynamic-templates
                templateId: "d-3ce711fad081476c91fdad7cf33deb49",
                dynamicTemplateData: {
                    subject: `New "${publicSiteData.name}" Contact Message`,
                    siteName: publicSiteData.name,
                    logoUrl: publicSiteData.logo.url,
                    logoWidth: publicSiteData.logo.width,
                    heading: heading,
                    body: body,
                    colors: publicSiteData?.theme?.schemes?.light?.colors ?? "black",
                    emails: publicSiteData.emails,
                    ppUrl: `${publicSiteData.projectId}.web.app/privacy-policy`,
                    termsUrl: `${publicSiteData.projectId}.web.app/terms`,
                },
                text: `${newValues.name} <${newValues.email}>: ${newValues.body}`,
            };

            // Send it
            allPromises.push(
                sgMail.send(msg).then(() => {
                        console.log("Email sent");
                    }).catch((error: any) => {
                        console.error(error);
                    })
            );

            // Increment messages
            allPromises.push(
                admin.firestore().collection("site").doc("counts").update({
                    messages: FieldValue.increment(1),
                }).then(() => {
                    console.log("Incremented messages.");
                }).catch((error) => {
                    console.error(`Error incrementing messages: ${error}`);
                })
            );

            // // **v9 not ready it seems
            // await updateDoc(doc(admin, "site", "sensitive"), {
            //     body: increment(1)
            // }).then(() => {
            //     console.log(`Incremented messageCount`)
            // }).catch(error => {
            //     console.error(`Error incrementing messageCount: ${error}`)
            // })

            return Promise.all(allPromises);
        } catch (error) {
            console.error(error);
            return;
        }
});

export const onUserCreated = functions.firestore
    .document("users/{userId}")
    .onCreate(async (snap: DocumentSnapshot, context: functions.EventContext) => {
        const newValues = snap.data();
        if (!newValues) {
            return;
        } else {
            console.log("newValues: ");
            console.log(newValues);
        }

        try {
            const allPromises: Array<Promise<any>> = [];
            let sensitiveSiteData: FirebaseFirestore.DocumentData | any = null;
            await admin.firestore().collection("site").doc("sensitive").get().then((sensitiveSiteDoc) => {
                if (sensitiveSiteDoc.exists) {
                    console.log("sensitiveSiteDoc exists, so let's increment user count!");
                    const docWithMore = Object.assign({}, sensitiveSiteDoc.data());
                    docWithMore.id = sensitiveSiteDoc.id;
                    sensitiveSiteData = docWithMore;

                    console.log("sensitiveSiteData: ");
                    console.log(sensitiveSiteData);

                    // Increment users
                    allPromises.push(
                        admin.firestore().collection("site").doc("counts").update({
                            users: FieldValue.increment(1),
                        }).then(() => {
                            console.log("Incremented users.");
                        }).catch((error) => {
                            console.error(`Error incrementing users: ${error}`);
                        })
                    );
                } else {
                    console.error("Site doc doesn't exists, so setting the default stuff we need for now!");
                    // Set default site public data like theme, logo, etc
                    allPromises.push(
                        admin.firestore().collection("site").doc("public").set({
                            name: DEFAULT_SITE.NAME,
                            projectId: projectId,
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
                                    heading: DEFAULT_SITE.THEME.FONTS.HEADING,
                                    body: DEFAULT_SITE.THEME.FONTS.BODY,
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
                                    font: {
                                        heading: {
                                            light: DEFAULT_SITE.THEME.COLORS.FONT.HEADING.LIGHT,
                                            dark: DEFAULT_SITE.THEME.COLORS.FONT.HEADING.DARK,
                                        },
                                        body: {
                                            light: DEFAULT_SITE.THEME.COLORS.FONT.BODY.LIGHT,
                                            dark: DEFAULT_SITE.THEME.COLORS.FONT.BODY.DARK,
                                        },
                                        link: {
                                            light: DEFAULT_SITE.THEME.COLORS.FONT.LINK.LIGHT,
                                            dark: DEFAULT_SITE.THEME.COLORS.FONT.LINK.DARK,
                                        },
                                    },
                                    background: {
                                        light: DEFAULT_SITE.THEME.COLORS.BACKGROUND.LIGHT,
                                        dark: DEFAULT_SITE.THEME.COLORS.BACKGROUND.DARK,
                                    },
                                },
                            },
                        }, {merge: true}).then(() => {
                            console.log("Successful write of site public doc to Firestore.");
                        }).catch((error) => {
                            console.error("Error adding public document: ", error);
                        })
                    );

                    // Set default counts, users to 1!
                    allPromises.push(
                        admin.firestore().collection("site").doc("counts").set({
                            messages: 0,
                            users: 1,
                        }, {merge: true}).then(() => {
                            console.log("Successful write of counts doc to Firestore.");
                        }).catch((error) => {
                            console.error("Error adding counts document: ", error);
                        })
                    );

                    // Set default email recipient for contact messages
                    allPromises.push(
                        admin.firestore().collection("site").doc("sensitive").set({
                            messengers: DEFAULT_SITE.EMAILS.MESSENGERS,
                            // ** Not 100% sure if I should be setting this here or by passing firstUser: true to the newAdmins instead?
                            admins: [{
                                id: context.params.userId,
                                email: newValues.email,
                                name: `${newValues.firstName} ${newValues.lastName}`,
                            }],
                            superAdmins: [{
                                id: context.params.userId,
                                email: newValues.email,
                                name: `${newValues.firstName} ${newValues.lastName}`,
                            }],
                        }, {merge: true}).then(() => {
                            console.log("Successful write of sensitive doc to Firestore.");
                        }).catch((error) => {
                            console.error("Error adding sensitive document: ", error);
                        })
                    );

                    // Since only user, set them as the super admin
                    admin.firestore().collection("users").doc(context.params.userId).collection("newAdmins").add({
                        id: context.params.userId,
                        email: newValues.email,
                        name: `${newValues.firstName} ${newValues.lastName}`,
                        superAdmin: true,
                        timestamp: Date.now(),
                    }).then(() => {
                        console.log("Successful add of new super admin doc to Firestore.");
                    }).catch((error: any) => {
                        console.error("Error adding document: ", error);
                    });
                }
            }).catch((error) => {
                console.log("Error getting site document:", error);
            });


            return Promise.all(allPromises);
        } catch (error) {
            console.error(error);
            return;
        }
});

export const onAdminCreated = functions.firestore
    .document("users/{userId}/newAdmins/{docId}")
    .onCreate(async (snap: DocumentSnapshot, context: functions.EventContext) => {
        const newValues = snap.data();

        if (!newValues) {
            return;
        }

        try {
            const allPromises: Array<Promise<any>> = [];
            if (newValues.superAdmin) {
                allPromises.push(
                    admin.firestore().collection("site").doc("sensitive").update({
                        superAdmins: FieldValue.arrayUnion({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                            // timestamp: newValues.timestamp, // Not including the timestamp in the array so the union func will only add only if doesn't exist!
                        }),
                        admins: FieldValue.arrayUnion({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                        }),
                    }).then(() => {
                        console.log("Successful write of user flags doc to Firestore.");
                        allPromises.push(
                            admin.firestore().collection("users").doc(newValues.id).collection("readOnly").doc("flags").set({
                                isAdmin: true,
                                isSuperAdmin: true,
                            }, {merge: true}).then(() => {
                                console.log("Successful write to readOnly isAdmin Firestore.");
                            }).catch((error) => {
                                console.error("Error adding isAdmin document: ", error);
                            })
                        );
                    }).catch((error) => {
                        console.error("Error adding sensitive document: ", error);
                    })
                );
            } else {
                allPromises.push(
                    admin.firestore().collection("site").doc("sensitive").update({
                        admins: FieldValue.arrayUnion({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                        }),
                    }).then(() => {
                        console.log("Successful write of user flags doc to Firestore.");
                        allPromises.push(
                            admin.firestore().collection("users").doc(newValues.id).collection("readOnly").doc("flags").set({
                                isAdmin: true,
                            }, {merge: true}).then(() => {
                                console.log("Successful write to readOnly isAdmin Firestore.");
                            }).catch((error) => {
                                console.error("Error adding isAdmin document: ", error);
                            })
                        );
                    }).catch((error) => {
                        console.error("Error adding sensitive document: ", error);
                    })
                );
            }

            return Promise.all(allPromises);
        } catch (error) {
            console.error(error);
            return;
        }
});
