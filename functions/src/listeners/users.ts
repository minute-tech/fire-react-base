"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import algoliasearch from "algoliasearch";

import {
    DocumentSnapshot,
    FieldValue,
} from "firebase-admin/firestore";

import {
    defaultPublicSiteData,
    ITEMS,
    CRUD,
    ADMIN,
} from "../utils/constants";

import {
    addUpdatesDoc,
    genAlgoliaSearchKey,
    editAlgoliaObject,
    increment,
    updateUserCustomClaims,
    setAlgoliaSettings,
} from "../utils/misc";

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "");
const projectId = adminConfig.projectId ?? "fire-react-base";

const algoliaAdmin = algoliasearch(
    functions.config().algolia_api.app_id,
    functions.config().algolia_api.admin_key,
);

/**
 * Handles when a "user" document is CREATED on the "users" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function userCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.USERS.COLLECTION,
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        await editAlgoliaObject(
            CRUD.CREATE,
            ITEMS.USERS.COLLECTION,
            context.params.docId,
            newValues,
        );

        await admin.firestore().collection("site").doc("private").get().then(async (privateSiteDoc) => {
            if (privateSiteDoc.exists) {
                console.log("Default user create case! Since privateSiteDoc already exists, let's just increment user count!");
                // Increment users
                allPromises.push(increment(ITEMS.USERS.COLLECTION, 1));
            } else {
                console.error("privateDoc doc doesn't exists, so setting the default stuff we need for now!");
                // Check to see if public site doc already exists before overwriting
                // such as default super admin user, Messenger role, counts, default public site data, etc
                await admin.firestore().collection("site").doc("public").get().then((publicSiteDoc) => {
                    if (publicSiteDoc.exists) {
                        console.log("publicSiteDoc already exists.");
                    } else {
                        console.log("publicSiteDoc doesn't exist, so let's create default site stuff too!");
                        const currentTime = Date.now();
                        const finalItem = Object.assign({
                            created: {
                                timestamp: currentTime,
                                id: context.params.docId,
                                email: newValues.email,
                                name: `${newValues.firstName} ${newValues.lastName}`,
                            },
                            updated: {
                                timestamp: currentTime,
                                id: context.params.docId,
                                email: newValues.email,
                                name: `${newValues.firstName} ${newValues.lastName}`,
                                summary: "Initial site creation on server side based on default template and created only on first user sign up.",
                            },
                        }, defaultPublicSiteData);

                        // Set default site public data like theme, logo, etc
                        allPromises.push(
                            admin.firestore().collection("site").doc("public").set(finalItem, {merge: true}).then(() => {
                                console.log("Successful write of site public doc to Firestore.");
                            }).catch((error) => {
                                console.error("Error adding public document: ", error);
                            })
                        );
                    }
                }).catch((error) => {
                    console.log("Error getting public site document:", error);
                });

                allPromises.push(
                    admin.firestore().collection(ITEMS.USERS.COLLECTION).limit(2).get().then(async (usersQuerySnap) => {
                        // Verify only 1 user on firestore right now!
                        if (usersQuerySnap.size === 1) {
                            // ** I use to set the superDoc here, but since we are changing the role AND the admin type, doing both using a superDoc may cause race condition
                            // Set default counts users to 1!
                            await admin.firestore().collection("site").doc("counts").set({
                                users: 1,
                            }, {merge: true}).then(() => {
                                console.log("Successful write of counts doc to Firestore.");
                            }).catch((error) => {
                                console.error("Error adding counts document: ", error);
                            });

                            // Set default user for super admins role
                            await admin.firestore().collection("site").doc("private").set({
                                super: [{
                                    id: context.params.docId,
                                    email: newValues.email,
                                    name: `${newValues.firstName} ${newValues.lastName}`,
                                }],
                            }, {merge: true}).then(() => {
                                console.log("Successful write of private doc to Firestore.");
                            }).catch((error) => {
                                console.error("Error adding private document: ", error);
                            });

                            // Creating default Messenger role, which isnt used initially anyways since initial user is a super role
                            allPromises.push(
                                admin.firestore().collection(ITEMS.ROLES.COLLECTION).doc("Messenger").set({
                                    name: "Messenger",
                                    isAdmin: true,
                                    permissions: [
                                        {
                                            itemActions: [
                                                CRUD.READ,
                                                CRUD.BCC_ON_CREATE,
                                            ],
                                            itemKey: ITEMS.MESSAGES.COLLECTION,
                                        },
                                        {
                                            itemActions: [
                                                CRUD.READ,
                                                CRUD.CC_ON_CREATE,
                                            ],
                                            itemKey: ITEMS.FEEDBACK.COLLECTION,
                                        },
                                    ],
                                    filter: {
                                        applyFilter: false,
                                    },
                                    created: {
                                        id: context.params.docId,
                                        email: newValues.email,
                                        name: `${newValues.firstName} ${newValues.lastName}`,
                                        timestamp: Date.now(),
                                    },
                                    updated: {
                                        id: context.params.docId,
                                        email: newValues.email,
                                        name: `${newValues.firstName} ${newValues.lastName}`,
                                        timestamp: Date.now(),
                                    },
                                }, {merge: true}).then(() => {
                                    console.log("Successful write of default Messenger role to Firestore.");
                                }).catch((error) => {
                                    console.error("Error adding default Messenger role: ", error);
                                })
                            );

                            // Just need to set rolesIndex default setSettings, for some reason the onRoleCreated listener is not triggering with Messenger role creation
                            const rolesIndex = algoliaAdmin.initIndex((projectId.includes("test") ? `test_${ITEMS.ROLES.COLLECTION}` : ITEMS.ROLES.COLLECTION));
                            await setAlgoliaSettings(ITEMS.ROLES.COLLECTION, rolesIndex);
                            // Set users search key for their new role
                            await genAlgoliaSearchKey(context.params.docId, ADMIN.SUPER);
                            await updateUserCustomClaims(context.params.docId, "role", ADMIN.SUPER);
                        } else {
                            console.error("Uh oh... might be a nefarious action... userQuery size !== 1.");
                        }
                    }).catch((error) => {
                        console.log("Error getting users collection:", error);
                    })
                );
            }
        }).catch((error) => {
            console.log("Error getting private site document:", error);
        });

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "user" document is UPDATED on the "users" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function userUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.USERS.COLLECTION,
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
                ITEMS.USERS.COLLECTION,
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
 * Handles when a "user" document is DELETED on the "users" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function userDeletedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const deletedValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!deletedValues) {
        return;
    } else {
        console.log("deletedValues: " + JSON.stringify(deletedValues));
    }

    try {
        allPromises.push(
            editAlgoliaObject(
                CRUD.DELETE,
                ITEMS.USERS.COLLECTION,
                context.params.docId,
            )
        );

        // Decrement
        allPromises.push(increment(ITEMS.USERS.COLLECTION, -1));

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "superDoc" document is CREATED on the "superDocs" collection under "users" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function userSuperDocCreatedHandler(snap: DocumentSnapshot) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        console.log("newValues: " + JSON.stringify(newValues));
    }

    try {
        if (newValues.superType === ADMIN.ROLE) {
            // Type is role, so we need to see what kinda role we are doing
            if (newValues.role && !newValues.prevRole) {
                // ROLE SET
                // Initially no role, so just setting new role
                console.log("New role DOES exist and DOES NOT prevRole exist, so this is a new role creation; no need to remove old role, only add new role.");
                allPromises.push(
                    admin.firestore().collection("site").doc("private").update({
                        [newValues.role]: FieldValue.arrayUnion({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                        }),
                    }).then(async () => {
                        console.log("Successful write of site private doc for role to Firestore.");
                        await genAlgoliaSearchKey(newValues.id, newValues.role);
                        await updateUserCustomClaims(newValues.id, "role", newValues.role);
                        allPromises.push(
                            admin.firestore().collection(ITEMS.USERS.COLLECTION).doc(newValues.id).set({
                                updated: {
                                    id: newValues.updatedBy.id,
                                    email: newValues.updatedBy.email,
                                    name: newValues.updatedBy.name,
                                    timestamp: Date.now(),
                                    summary: `Updated user's role from no role to '${newValues.role}'.`,
                                },
                            }, {merge: true}).then(() => {
                                console.log("Successful write of updated users doc.");
                            }).catch((error) => {
                                console.error("Error updating updated users doc: ", error);
                            })
                        );
                    }).catch((error) => {
                        console.error("Error adding private document for role: ", error);
                    })
                );
            } else if (newValues.role && newValues.prevRole) {
                // ROLE UPDATE
                console.log("New role DOES exist and prevRole DOES exist, so this is a role deletion AND add (add + delete = update); remove old role, then add new role.");
                await admin.firestore().collection("site").doc("private").update({
                        [newValues.role]: FieldValue.arrayUnion({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                        }),
                }).then(async () => {
                    console.log("Successful write of site private doc for role to Firestore.");
                }).catch((error) => {
                    console.error(`Error adding private document value for role (${newValues.role}): `, error);
                });

                await admin.firestore().collection("site").doc("private").update({
                    [newValues.prevRole]: FieldValue.arrayRemove({
                        id: newValues.id,
                        email: newValues.email,
                        name: newValues.name,
                    }),
                }).then(async () => {
                    console.log("Successful write of site private doc for role to Firestore.");
                }).catch((error) => {
                    console.error(`Error removing private document value for role (${newValues.prevRole}): `, error);
                });

                await genAlgoliaSearchKey(newValues.id, newValues.role);
                await updateUserCustomClaims(newValues.id, "role", newValues.role);
                allPromises.push(
                    admin.firestore().collection(ITEMS.USERS.COLLECTION).doc(newValues.id).set({
                        updated: {
                            id: newValues.updatedBy.id,
                            email: newValues.updatedBy.email,
                            name: newValues.updatedBy.name,
                            timestamp: Date.now(),
                            summary: `Updated user's role from '${newValues.prevRole}' to '${newValues.role}'.`,
                        },
                    }, {merge: true}).then(() => {
                        console.log("Successful write of updated users doc.");
                    }).catch((error) => {
                        console.error("Error updating updated users doc: ", error);
                    })
                );
            } else if (!newValues.role && newValues.prevRole) {
                // ROLE DELETE
                console.log("New role DOES NOT exist and prevRole DOES exist, so this is a role deletion; remove old role only, don't add new role.");
                allPromises.push(
                    admin.firestore().collection("site").doc("private").update({
                        [newValues.prevRole]: FieldValue.arrayRemove({
                            id: newValues.id,
                            email: newValues.email,
                            name: newValues.name,
                        }),
                    }).then(async () => {
                        console.log("Successful write of site private doc for role to Firestore.");
                        await genAlgoliaSearchKey(newValues.id, newValues.prevRole, true);
                        await updateUserCustomClaims(newValues.id, "role", null);
                        allPromises.push(
                            admin.firestore().collection(ITEMS.USERS.COLLECTION).doc(newValues.id).set({
                                updated: {
                                    id: newValues.updatedBy.id,
                                    email: newValues.updatedBy.email,
                                    name: newValues.updatedBy.name,
                                    timestamp: Date.now(),
                                    summary: `Deleted user's role as '${newValues.prevRole}'.`,
                                },
                            }, {merge: true}).then(() => {
                                console.log("Successful write of updated users doc.");
                            }).catch((error) => {
                                console.error("Error updating updated users doc: ", error);
                            })
                        );
                    }).catch((error) => {
                        console.error("Error adding private document for role: ", error);
                    })
                );
            } else if (!newValues.role && !newValues.prevRole) {
                console.error("New role DOES NOT exist and prevRole DOES NOT exist. This currently shouldn't ever happen...");
            } else {
                console.error("Odd default case... shouldn't of been hit.");
            }
        } else if (newValues.superType === ADMIN.RECREATED) {
            console.log("Super Doc Type is RECREATED, so likely just grabbing oldRoleUsers.");
        } else {
            console.log("Defaulted case for superDoc created... this shouldn't really happen.");
        }

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
