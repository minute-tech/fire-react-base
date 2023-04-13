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
 * Handles when a "page" document is CREATED on the "pages" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function pageCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.PAGES.COLLECTION,
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        // Awaiting here onCreate because we need time for the first record in a set to be checked before incrementing to 1 below so we can set Algolia settings
        await editAlgoliaObject(
            CRUD.CREATE,
            ITEMS.PAGES.COLLECTION,
            context.params.docId,
            newValues,
        );

        const renderedData = renderDetails(newValues, ITEMS.PAGES.STRUCTURE);

        await emailSends(
            ITEMS.PAGES.COLLECTION,
            ITEMS.PAGES.NAME,
            newValues.name,
            renderedData,
        );

        // Increment pages
        allPromises.push(increment(ITEMS.PAGES.COLLECTION, 1));

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "page" document is UPDATED on the "pages" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function pageUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.PAGES.COLLECTION,
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
                ITEMS.PAGES.COLLECTION,
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
 * Handles when a "page" document is DELETED on the "pages" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function pageDeletedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
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
                ITEMS.PAGES.COLLECTION,
                context.params.docId,
            )
        );

        // Decrement
        allPromises.push(increment(ITEMS.PAGES.COLLECTION, -1));

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
