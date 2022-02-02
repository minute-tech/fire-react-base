"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

export const onMessageCreated = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snap: { data: () => any; }) => {
        const newValues = snap.data();
        try {
            console.log("newValues: ");
            return console.log(newValues);
        } catch (error) {
            console.error(error);
            return;
        }
});
