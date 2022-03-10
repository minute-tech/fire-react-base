"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import sgMail = require("@sendgrid/mail");
import {DocumentSnapshot, FieldValue} from "firebase-admin/firestore";
import {DEFAULT_SITE} from "./constants";

admin.initializeApp(functions.config().firebase);
sgMail.setApiKey(functions.config().sendgrid_api.key);

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
                    publicSiteData = DEFAULT_SITE;
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
                    sensitiveSiteData.emails.messages = DEFAULT_SITE.EMAILS.MESSAGES;
                }
            }).catch((error) => {
                console.log("Error getting site sensitive document:", error);
            });


            const htmlEmail =
            `
            <div style="width: 100%; font-family: Arial, Helvetica, sans-serif" color: black !important;>
                <div style="text-align: center;">
                        <img 
                            alt="${publicSiteData.name} logo"
                            src="${publicSiteData.logo.url}"
                            width="${publicSiteData.logo.width}" 
                            height="auto"
                        />
                </div>
                <h1 style="margin: 20px 0 0 0; text-align: center; color: ${publicSiteData.theme.schemes.light.colors.primary} !important;">${publicSiteData.name}</h1>
                <div style="margin: auto; width: 70%; padding: 1%;">
                    <h2>New Website Contact Message!</h2>
                    <div style="font-size:2px; line-height:2px; height:2px; margin-top: 2px; background:${publicSiteData.theme.schemes.light.colors.primary};" role="separator">&#8202;</div>
                    <h3>Message Details:</h3>
                    <p><b>Name</b>: ${newValues.name}</p>
                    <p><b>Email</b>: ${newValues.email}</p>
                    <p>
                        <b>Message</b>:
                        <br/>
                        ${newValues.message}
                    </p>
                    <div style="font-size:2px; line-height:2px; height:2px; margin-top: 2px; background:${publicSiteData.theme.schemes.light.colors.primary};" role="separator">&#8202;</div>
                    <p>
                        You can reply directly to this email to continue the email thread with the user who sent the message.
                    </p>
                    <p>
                        Feel free to reach out to <a href="mailto:${publicSiteData.emails.support}">${publicSiteData.emails.support}</a> if you have any questions!
                    </p>
                    <p style="text-align: center; margin: 50px 0;"><a href="https://camposjames.com">Powered by Campos James LLC</a></p>
                </div>
            </div>
            `;

            // Pack It
            const msg = {
                to: sensitiveSiteData.emails.messages,
                from: `${publicSiteData.name} <${publicSiteData.emails.noreply}>`,
                replyTo: `${newValues.email}`,
                cc: "",
                bcc: [],
                subject: `New "${publicSiteData.name}" Contact Message`,
                text: `${newValues.name} <${newValues.email}>: ${newValues.message}`,
                html: htmlEmail,
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
            //     message: increment(1)
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
                    // TODO Test for sure that this is the first user!
                    console.error("Site doc doesn't exists, so setting the default stuff we need for now!");

                    // Set default site public data like theme, logo, etc
                    allPromises.push(
                        admin.firestore().collection("site").doc("public").set({
                            name: DEFAULT_SITE.NAME,
                            // projectId: process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID, // TODO: get this from firebase somehow
                            logo: {
                                width: DEFAULT_SITE.LOGO.WIDTH,
                                url: DEFAULT_SITE.LOGO.URL,
                                showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
                            },
                            hero: {
                                banners: DEFAULT_SITE.HERO.BANNERS,
                            },
                            emails: {
                                support: DEFAULT_SITE.EMAILS.SUPPORT,
                                noreply: DEFAULT_SITE.EMAILS.NOREPLY,
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
                            emails: {
                                messages: DEFAULT_SITE.EMAILS.MESSAGES,
                            },
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

            // TODO: send user an email for record and instructing them where to visit!
            return Promise.all(allPromises);
        } catch (error) {
            console.error(error);
            return;
        }
});
