"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

import sgMail = require("@sendgrid/mail");
sgMail.setApiKey(functions.config().sendgrid_api.key);

export const onMessageCreated = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snap: { data: () => any; }) => {
        const newValues = snap.data();
        if (!newValues) {
            return;
        } else {
            console.log("newValues: ");
            console.log(newValues);
        }

        try {
            const allPromises: Array<Promise<any>> = [];
            const appName = "Fire React Base";
            const logoWidth = 200;
            const logoUrl = "https://firebasestorage.googleapis.com/v0/b/fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=a3f0ea8f-b612-48ce-b452-d58fe61ec88a";
            const adminEmails =["doug@camposjames.com"];

            const htmlEmail =
            `
            <div style="width: 100%; font-family: Arial, Helvetica, sans-serif" color: black !important;>
                <div style="text-align: center;">
                        <img 
                            alt="company logo"
                            src="${logoUrl}"
                            width="${logoWidth}px" height="auto"
                        />
                </div>
                <h1 style="margin: 20px 0 0 0; text-align: center;">${appName}</h1>
                <div style="margin: auto; width: 70%; padding: 1%;">
                    <h2>New Website Contact Message!</h2>
                    <div style="font-size:2px; line-height:2px; height:2px; margin-top: 2px; background:#000;" role="separator">&#8202;</div>
                    <h3>Message Details:</h3>
                    <p><b>Name</b>: ${newValues.name}</p>
                    <p><b>Email</b>: ${newValues.email}</p>
                    <p>
                        <b>Message</b>:
                        <br/>
                        ${newValues.message}
                    </p>
                    <div style="font-size:2px; line-height:2px; height:2px; margin-top: 2px; background:#000;" role="separator" >&#8202;</div>
                    <p>
                        You can reply directly to this email to continue the email thread with the user who sent the message.
                    </p>
                    <p>
                        Feel free to reach out to <a href="mailto:doug@camposjames.com">doug@camposjames.com</a> if you have any questions!
                    </p>
                    <p style="text-align: center; margin: 50px 0;"><a href="https://www.camposjames.com">Powered by Campos James LLC</a></p>
                </div>
            </div>
            `;

            // Pack It
            const msg = {
                to: adminEmails,
                from: `${appName} <noreply@camposjames.com>`,
                replyTo: `${newValues.email}`,
                cc: "",
                bcc: [],
                subject: `New "${appName}" Contact Message`,
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

            return Promise.all(allPromises);
        } catch (error) {
            console.error(error);
            return;
        }
});
