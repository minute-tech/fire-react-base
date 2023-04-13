"use strict";
import functions = require("firebase-functions");

import {
    DocumentSnapshot,
} from "firebase-admin/firestore";

import {
    addUpdatesDoc,
} from "../utils/misc";

/**
 * Handles when a "site" document is CREATED on the "site" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function siteCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                "site",
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        // Logic here

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "site" document is UPDATED on the "site" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function siteUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                "site",
                context.params.docId,
                newValues,
                previousValues,
            )
        );
    }

    try {
        // Logic here

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "site" document is DELETED on the "site" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function siteDeletedHandler(snap: DocumentSnapshot) {
    const deletedValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!deletedValues) {
        return Promise.all(allPromises);
    } else {
        console.log("deletedValues: " + JSON.stringify(deletedValues));
    }

    try {
        // Logic here

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
