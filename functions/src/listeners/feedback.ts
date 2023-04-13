"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");

import {
    DocumentSnapshot,
    FieldValue,
} from "firebase-admin/firestore";

import {
    ITEMS,
    CRUD,
} from "../utils/constants";

import {
    addUpdatesDoc,
    editAlgoliaObject,
    emailSends,
    renderDetails,
} from "../utils/misc";

/**
 * Handles when a "feedback" document is CREATED on the "feedback" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function feedbackCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.FEEDBACK.COLLECTION,
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        await editAlgoliaObject(
            CRUD.CREATE,
            ITEMS.FEEDBACK.COLLECTION,
            context.params.docId,
            newValues,
        );

        // Unique count setup in which we need to find the sum, then average!
        let countsDocData: FirebaseFirestore.DocumentData | any = null;
        await admin.firestore().collection("site").doc("counts").get().then((countsDoc) => {
            if (countsDoc.exists) {
                countsDocData = countsDoc.data();
            } else {
                console.error("Counts doc doesn't exists, so setting the default stuff... ths shouldnt really happen.");
                countsDocData = {
                    feedback: {
                        sum: 0,
                        count: 0,
                    },
                };
            }
        }).catch((error) => {
            console.log("Error getting site public document:", error);
        });

        const newSum = (countsDocData?.feedback?.sum ?? 0) + parseInt(newValues.rangeValue);
        const newCount = (countsDocData?.feedback?.count ?? 0) + 1;
        const newAverage = newSum/newCount;

        const renderedData = renderDetails(newValues, ITEMS.FEEDBACK.STRUCTURE);

        await emailSends(
            ITEMS.FEEDBACK.COLLECTION,
            ITEMS.FEEDBACK.NAME,
            newValues.emotionLabel,
            renderedData,
        );

        // Increment feedback
        allPromises.push(
            admin.firestore().collection("site").doc("counts").set({
                feedback: {
                    count: FieldValue.increment(1),
                    average: newAverage,
                    sum: newSum,
                },
            }, {merge: true}).then(() => {
                console.log("Incremented feedback.");
            }).catch((error) => {
                console.error(`Error incrementing feedback: ${error}`);
            })
        );

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "feedback" document is UPDATED on the "feedback" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function feedbackUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.FEEDBACK.COLLECTION,
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
                ITEMS.FEEDBACK.COLLECTION,
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
 * Handles when a "feedback" document is DELETED on the "feedbacks" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function feedbackDeletedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
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
                ITEMS.FEEDBACK.COLLECTION,
                context.params.docId,
            )
        );

        // TODO: logic for decrementing feedback...
        // allPromises.push(
        //     admin.firestore().collection("site").doc("counts").set({
        //         feedback: {
        //             count: FieldValue.increment(1),
        //             average: newAverage,
        //             sum: newSum,
        //         },
        //     }, {merge: true}).then(() => {
        //         console.log("Incremented feedback.");
        //     }).catch((error) => {
        //         console.error(`Error incrementing feedback: ${error}`);
        //     })
        // );
        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
