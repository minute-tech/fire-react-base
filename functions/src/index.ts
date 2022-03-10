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
                console.log("Error getting shop document:", error);
            });

            await admin.firestore().collection("site").doc("public").get().then((sensitiveSiteDoc) => {
                if (sensitiveSiteDoc.exists) {
                    const docWithMore = Object.assign({}, sensitiveSiteDoc.data());
                    docWithMore.id = sensitiveSiteDoc.id;
                    sensitiveSiteData = docWithMore;
                } else {
                    console.error("Site doc doesn't exists, so setting the default stuff we need for now!");
                    sensitiveSiteData.emails.messages = DEFAULT_SITE.EMAILS.MESSAGES;
                }
            }).catch((error) => {
                console.log("Error getting shop document:", error);
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
                    <p style="text-align: center; margin: 50px 0;"><a href="https://${publicSiteData.projectId}.web.app">Powered by ${publicSiteData.name}</a></p>
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
                    }).then(() => {
                        console.log("Successful write of user flags doc to Firestore.");
                        allPromises.push(
                            admin.firestore().collection("users").doc(newValues.id).collection("readOnly").doc("flags").set({
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
                            // timestamp: newValues.timestamp, // Not including the timestamp in the array so the union func will only add only if doesn't exist!
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
