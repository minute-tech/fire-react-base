"use strict";
import functions = require("firebase-functions");

import {
    DocumentSnapshot,
} from "firebase-admin/firestore";

import {
    ITEMS, CRUD,
} from "../utils/constants";

import {
    addUpdatesDoc,
    editAlgoliaObject,
    emailSends,
    renderDetails,
    increment,
} from "../utils/misc";

/**
 * Handles when a "message" document is CREATED on the "messages" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function messageCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.MESSAGES.COLLECTION,
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        // Awaiting here onCreate because we need time for the first record in a set to be checked before incrementing to 1 below so we can set Algolia settings
        await editAlgoliaObject(
            CRUD.CREATE,
            ITEMS.MESSAGES.COLLECTION,
            context.params.docId,
            newValues,
        );

        const renderedData = renderDetails(newValues, ITEMS.MESSAGES.STRUCTURE);
        const toEmails: Array<string> = [];
        toEmails.push(newValues.email);

        await emailSends(
            ITEMS.MESSAGES.COLLECTION,
            ITEMS.MESSAGES.NAME,
            newValues.name,
            renderedData,
            toEmails,
            true,
        );

        // Increment messages
        allPromises.push(increment(ITEMS.MESSAGES.COLLECTION, 1));

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "message" document is UPDATED on the "messages" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function messageUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.MESSAGES.COLLECTION,
                context.params.docId,
                newValues,
                previousValues,
            )
        );
    }

    try {
        allPromises.push(
            editAlgoliaObject(
                CRUD.UPDATE,
                ITEMS.MESSAGES.COLLECTION,
                context.params.docId,
                newValues,
                previousValues,
            )
        );

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "message" document is DELETED on the "messages" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function messageDeletedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const deletedValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!deletedValues) {
        return Promise.all(allPromises);
    } else {
        console.log("deletedValues: " + JSON.stringify(deletedValues));
    }

    try {
        allPromises.push(
            editAlgoliaObject(
                CRUD.DELETE,
                ITEMS.MESSAGES.COLLECTION,
                context.params.docId,
            )
        );

        // Decrement
        allPromises.push(increment(ITEMS.MESSAGES.COLLECTION, -1));

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
