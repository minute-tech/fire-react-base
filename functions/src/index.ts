"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import {
    siteCreatedHandler,
    siteDeletedHandler,
    siteUpdatedHandler,
} from "./listeners/site";

import {
    pageCreatedHandler,
    pageDeletedHandler,
    pageUpdatedHandler,
} from "./listeners/pages";

import {
    userCreatedHandler,
    userDeletedHandler,
    userSuperDocCreatedHandler,
    userUpdatedHandler,
} from "./listeners/users";

import {
    roleCreatedHandler,
    roleDeletedHandler,
    roleUpdatedHandler,
} from "./listeners/roles";

import {
    feedbackCreatedHandler,
    feedbackDeletedHandler,
    feedbackUpdatedHandler,
} from "./listeners/feedback";

import {
    messageCreatedHandler,
    messageDeletedHandler,
    messageUpdatedHandler,
} from "./listeners/messages";

import {
    CRUD,
} from "./utils/constants";

export const onSiteCreated = functions.firestore.document("site/{docId}").onCreate(siteCreatedHandler);
export const onSiteUpdated = functions.firestore.document("site/{docId}").onUpdate(siteUpdatedHandler);
export const onSiteDeleted = functions.firestore.document("site/{docId}").onDelete(siteDeletedHandler);

export const onPageCreated = functions.firestore.document("pages/{docId}").onCreate(pageCreatedHandler);
export const onPageUpdated = functions.firestore.document("pages/{docId}").onUpdate(pageUpdatedHandler);
export const onPageDeleted = functions.firestore.document("pages/{docId}").onDelete(pageDeletedHandler);

export const onUserCreated = functions.firestore.document("users/{docId}").onCreate(userCreatedHandler);
export const onUserUpdated = functions.firestore.document("users/{docId}").onUpdate(userUpdatedHandler);
export const onUserDeleted = functions.firestore.document("users/{docId}").onDelete(userDeletedHandler);
export const onUserSuperDocCreated = functions.firestore.document("users/{userId}/superDocs/{docId}").onCreate(userSuperDocCreatedHandler);

export const onRoleCreated = functions.firestore.document("roles/{docId}").onCreate(roleCreatedHandler);
export const onRoleUpdated = functions.firestore.document("roles/{docId}").onUpdate(roleUpdatedHandler);
export const onRoleDeleted = functions.firestore.document("roles/{docId}").onDelete(roleDeletedHandler);

export const onMessageCreated = functions.firestore.document("messages/{docId}").onCreate(messageCreatedHandler);
export const onMessageUpdated = functions.firestore.document("messages/{docId}").onUpdate(messageUpdatedHandler);
export const onMessageDeleted = functions.firestore.document("messages/{docId}").onDelete(messageDeletedHandler);

export const onFeedbackCreated = functions.firestore.document("feedback/{docId}").onCreate(feedbackCreatedHandler);
export const onFeedbackUpdated = functions.firestore.document("feedback/{docId}").onUpdate(feedbackUpdatedHandler);
export const onFeedbackDeleted = functions.firestore.document("feedback/{docId}").onDelete(feedbackDeletedHandler);

/**
 * Pass in user context and data, data includes the itemKey for the collection we wish to check, and the value we wish to check for uniqueness.
 * @param data Object with itemKey and value
 * @param context additional context from request mainly the user id
 * @return Returns an object with a boolean value for allowCreate, if true, the item can be created, if false, the item cannot be created. A message string will also be returned.
 *
 */
export const checkItemValueUnique = functions.https.onCall(async (data, context) => {
    try {
        const uid = context?.auth?.uid ?? "";
        console.log("uid: ", uid);
        let permissionPass = false;

        // check if UID is admin and is allowed to at least read/write to this collection
        await admin.auth().getUser(uid).then(async (userRecord: any) => {
            const userRole = userRecord.customClaims?.role ?? "";
            console.log("userRole: ", userRole);
            if (userRole !== "super") {
                await admin.firestore().collection("roles").doc(userRole).get().then((roleDoc) => {
                    if (roleDoc.exists) {
                        console.log("roleDoc exists, check permissions...");
                        const roleData = roleDoc.data();
                        roleData?.permissions.forEach((permission: any) => {
                            if (permission.itemKey === data.itemKey) {
                                // Now check if user has permission to create
                                const foundCreatePermission = permission.itemActions.find((action: string) => (action === CRUD.CREATE));
                                const foundReadPermission = permission.itemActions.find((action: string) => (action === CRUD.READ));
                                if (foundCreatePermission && foundReadPermission) {
                                    console.log("User passed 'create' and 'read' permission check!");
                                    permissionPass = true;
                                } else {
                                    console.log("User did NOT pass 'create' and 'read' permission check!");
                                }
                            }
                        });
                    } else {
                        console.error("Role doc does not exist.");
                    }
                }).catch((error) => {
                    console.error("Error getting role document:", error);
                });
            } else {
                console.log("User is a super, so they have permission to check if unique.");
                permissionPass = true;
            }
        }).catch((error) => {
            console.error("Error getting user record: ", error);
        });

        if (!permissionPass) {
            // Not allowed to check if unique
            return {
                allowCreate: false,
                message: "Permission denied.",
            };
        } else {
            console.log(`Permission passed, now checking itemKey: '${data.itemKey}' and value: '${data.value}'...`);
            // Allowed to check if unique
            const docRef = admin.firestore().collection(data.itemKey).doc(data.value);
            let docRefMessage = "";
            let decRefAllowCreate = false;
            await docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());
                    docRefMessage = "Document already exists!";
                    decRefAllowCreate = false;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                    docRefMessage = "No such document yet!";
                    decRefAllowCreate = true;
                }
            }).catch((error) => {
                console.error("Error getting document:", error);
                docRefMessage = "Error getting document!";
                decRefAllowCreate = false;
            });

            return {
                allowCreate: decRefAllowCreate,
                message: docRefMessage,
            };
        }
    } catch (error) {
        return {
            allowCreate: false,
            message: "Error caught.",
        };
    }
});
