"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import algoliasearch from "algoliasearch";

import {
    DocumentSnapshot,
    FieldValue,
} from "firebase-admin/firestore";

import {
    addUpdatesDoc,
    genAlgoliaSearchKey,
    editAlgoliaObject,
    increment,
    splitArrayToArraysOf10,
    updateUserCustomClaims,
} from "../utils/misc";

import {
    ITEMS,
    CRUD,
} from "../utils/constants";

const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "");
const projectId = adminConfig.projectId ?? "fire-react-base";

const algoliaAdmin = algoliasearch(
    functions.config().algolia_api.app_id,
    functions.config().algolia_api.admin_key,
);

/**
 * Updating visible_by on Algolia DB depending on action needed.
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
async function updateVisibleBy(opType: string, roleId: any, currentValues: any = "", prevValues: any = "") {
    const allPromises: Array<Promise<any>> = [];

    try {
        if (opType === CRUD.CREATE) {
            console.log("Adding Unique all indices matching roleId of " + roleId);
            currentValues.permissions.forEach((permission: any) => {
                const itemAdminIndex = algoliaAdmin.initIndex((projectId.includes("test") ? `test_${permission.itemKey}` : permission.itemKey));

                if ((currentValues.filter?.applyFilter ?? false) && (currentValues.filter.filterKey === permission.itemKey || currentValues.filter.depKeys.includes(permission.itemKey))) {
                    // Filter applied and applicable to the main filter or dependent key
                    console.log("Filter found for this permission collection in question.");

                    // Choose the main filter key or the dependent column key depending on what permission.itemKey we are currently on
                    const filterFieldKey = ((currentValues.filter.depKeys.some((depKey: string) => (depKey === permission.itemKey)) && currentValues.filter.filterKey !== permission.itemKey) ? currentValues.filter.depColKey : currentValues.filter.columnKey);
                    console.log("filterFieldKey in question: " + filterFieldKey);

                    // TODO: we may not need to test if > 10 because the splitArrayToArraysOf10 might already do that!
                    if (currentValues.filter.columnValues > 10) {
                        const batchedColumnValues = splitArrayToArraysOf10(currentValues.filter.columnValues);
                        console.log("batchedColumnValues: ");
                        console.log(batchedColumnValues);
                        batchedColumnValues.forEach((batch) => {
                            allPromises.push(
                                admin.firestore().collection(permission.itemKey).where(filterFieldKey, "in", batch).get().then((querySnapshot) => {
                                    querySnapshot.forEach((doc) => {
                                        console.log("Updating " + doc.id + " on Algolia...");
                                        allPromises.push(
                                            itemAdminIndex.partialUpdateObject({
                                                visible_by: {
                                                    _operation: "AddUnique",
                                                    value: roleId, // TODO: this use to be enclosed in brackets, but I removed them, so check if this is correct
                                                },
                                                objectID: doc.id,
                                            })
                                        );
                                    });
                                }).catch((error) => {
                                    console.log("Error getting documents: ", error);
                                })
                            );
                        });
                    } else {
                        console.log("Less than 10 items in columnValues, so no need to batch.");
                        allPromises.push(
                            admin.firestore().collection(permission.itemKey).where(filterFieldKey, "in", currentValues.filter.columnValues).get().then((querySnapshot) => {
                                querySnapshot.forEach((doc) => {
                                    console.log("Updating " + doc.id + " on Algolia...");
                                    allPromises.push(
                                        itemAdminIndex.partialUpdateObject({
                                            visible_by: {
                                                _operation: "AddUnique",
                                                value: roleId,
                                            },
                                            objectID: doc.id,
                                        })
                                    );
                                });
                            }).catch((error) => {
                                console.log("Error getting documents: ", error);
                            })
                        );
                    }
                } else {
                    // No filter needed so just apply role to all items in collection
                    allPromises.push(
                        admin.firestore().collection(permission.itemKey).get().then((querySnapshot) => {
                            querySnapshot.forEach((doc) => {
                                console.log("Updating " + doc.id + " on Algolia...");
                                allPromises.push(
                                    itemAdminIndex.partialUpdateObject({
                                        visible_by: {
                                            _operation: "AddUnique",
                                            value: roleId,
                                        },
                                        objectID: doc.id,
                                    }).then(() => {
                                        console.log("Successfully updated objectID " + doc.id);
                                    }).catch((error) => {
                                        console.error(`Error updating objectID ${doc.id} with error: `);
                                        console.error(error);
                                    })
                                );
                            });
                        }).catch((error) => {
                            console.log("Error getting itemKey documents: ", error);
                            console.error(error);
                        })
                    );
                }
            });
        } else if (opType === CRUD.UPDATE && prevValues) {
            // ** reference attempts in Documents -> Old code -> "Attempts at Updating Role Algolia VisibleBy"
            // The flaw of this is that for every change we are running the delete AND create
            console.error("Currently cannot update only a role, we need to delete then recreate.");
        } else if (opType === CRUD.DELETE) {
            console.log("Removing all indices matching roleId of " + roleId);
            // Go through all existing Algolia records, and update the visible_by attribute
            for (const permission of currentValues.permissions) {
                console.log("Filter found for this permission collection in question.");

                // Get a search key so we can filter out only the objects that have this visible_by role value
                const roleBasedSearchKey = algoliaAdmin.generateSecuredApiKey(
                    functions.config().algolia_api.search_key, // A search key that you keep private
                    {
                        filters: `visible_by:"${roleId}"`,
                    },
                );

                let objectsToUpdate: any[] = [];

                const algoliaClient = algoliasearch(
                    functions.config().algolia_api.app_id,
                    roleBasedSearchKey,
                );

                const itemClientIndex = algoliaClient.initIndex((projectId.includes("test") ? `test_${permission.itemKey}` : permission.itemKey));
                const itemAdminIndex = algoliaAdmin.initIndex((projectId.includes("test") ? `test_${permission.itemKey}` : permission.itemKey));

                await itemClientIndex.search("").then((response) => {
                    console.log("Algolia Query results:");
                    console.log(response);
                    objectsToUpdate = response.hits;
                }).catch((error) => {
                    console.error("Error with Algolia search: " + error.message);
                });

                console.log("objectsToUpdate.length: " + objectsToUpdate.length);

                // Loop through those found objects and update their visible_by accordingly
                for (const item of objectsToUpdate) {
                    allPromises.push(
                        itemAdminIndex.partialUpdateObject({
                            visible_by: {
                                _operation: "Remove",
                                value: roleId,
                            },
                            objectID: item.objectID,
                        }).then(() => {
                            console.log("Successfully removed objectID " + item.objectID);
                        }).catch((error) => {
                            console.error(`Error removing objectID ${item.objectID} with error: `);
                            console.error(error);
                        })
                    );
                }
            }
        } else {
            console.error("opType for role update visible_by is not valid.");
        }

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "role" document is CREATED on the "roles" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function roleCreatedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
    const newValues = snap.data();
    const allPromises: Array<Promise<any>> = [];

    if (!newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.ROLES.COLLECTION,
                context.params.docId,
                newValues,
            )
        );
    }

    try {
        await editAlgoliaObject(
            CRUD.CREATE,
            ITEMS.ROLES.COLLECTION,
            context.params.docId,
            newValues,
        );

        // Increment count
        allPromises.push(increment(ITEMS.ROLES.COLLECTION, 1));

        allPromises.push(updateVisibleBy(CRUD.CREATE, context.params.docId, newValues));

        let defaultRoleUsers: any = [];

        if (newValues?.flags?.recreated ?? false) {
            let oldRoleUsers: any = [];
            // Get superDoc corresponding with this recreation so we know what oldRoleUsers to flip
            await admin.firestore().collection(ITEMS.USERS.COLLECTION).doc(newValues.flags.recreated.userId).collection("superDocs").doc(newValues.flags.recreated.superDocId).get().then((doc) => {
                if (doc.exists) {
                    oldRoleUsers = doc.data()?.oldRoleUsers ?? [];
                } else {
                    console.log("Super doc doesnt exist");
                }
            }).catch((error) => {
                console.error(`Error deleting role field: ${error}`);
            });

            defaultRoleUsers = [...oldRoleUsers];

            // If any old role users, go to each of these user documents and re-set associated role data
            // flip any existing users customClaims
            console.log("oldRoleUsers need to have their flags flipped back: ");
            console.log(oldRoleUsers);
            if (oldRoleUsers) {
                oldRoleUsers.forEach((user: any) => {
                    allPromises.push(updateUserCustomClaims(user.id, "role", context.params.docId));
                });
            }
        }

        // Create an array for this role with the users that may have been in it previous PR just have it be empty
        allPromises.push(
            admin.firestore().collection("site").doc("private").set({
                [context.params.docId]: defaultRoleUsers,
            }, {merge: true}).then(() => {
                console.log("Updated role collection permissions.");
            }).catch((error) => {
                console.error(`Error updating role collection permissions: ${error}`);
            })
        );

        if (newValues.permissions) {
            // Loop through new permissions and see if CC or BCC or read/write set, then add to private doc!
            newValues.permissions.forEach((permit: any) => {
                if (permit.itemActions) {
                    if (permit.itemActions.some((action: any) => action === CRUD.CC_ON_CREATE)) {
                        // CC found, now add [collection]: docId to ccEmailGroups
                        allPromises.push(
                            admin.firestore().collection("site").doc("private").set({
                                ccEmailGroups: {
                                    [permit.itemKey]: FieldValue.arrayUnion(context.params.docId),
                                },
                            }, {merge: true}).then(() => {
                                console.log(context.params.docId + " set in ccEmailGroups for " + permit.itemKey);
                            }).catch((error) => {
                                console.error(`Failed setting in ccEmailGroups for ${permit.itemKey}: ${error}`);
                            })
                        );
                    }

                    if (permit.itemActions.some((action: any) => action === CRUD.BCC_ON_CREATE)) {
                        // BCC found, now add [collection]: docId to bccEmailGroups
                        allPromises.push(
                            admin.firestore().collection("site").doc("private").set({
                                bccEmailGroups: {
                                    [permit.itemKey]: FieldValue.arrayUnion(context.params.docId),
                                },
                            }, {merge: true}).then(() => {
                                console.log(context.params.docId + " set in bccEmailGroups for " + permit.itemKey);
                            }).catch((error) => {
                                console.error(`Failed setting in bccEmailGroups for ${permit.itemKey}: ${error}`);
                            })
                        );
                    }

                    // Update each read, create, update, or delete arrays within each collection permit key so firestore.rules can easily check if user permitted
                    // ** Do we need to be removing from array? Why dont we do it for ccGroups above? I think we need to be doing something if collection can be update or NOT
                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            [permit.itemKey]: {
                                read: permit.itemActions.some((action: any) => action === CRUD.READ) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                create: permit.itemActions.some((action: any) => action === CRUD.CREATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                update: permit.itemActions.some((action: any) => action === CRUD.UPDATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                delete: permit.itemActions.some((action: any) => action === CRUD.DELETE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log("Updated role collection permissions.");
                        }).catch((error) => {
                            console.error(`Error updating role collection permissions: ${error}`);
                        })
                    );
                }
            });
        } else {
            console.error("No newValues.permissions.");
        }

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "role" document is UPDATED on the "roles" collection
 * @param change Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function roleUpdatedHandler(change: functions.Change<DocumentSnapshot>, context: functions.EventContext) {
    const newValues = change.after.data();
    const previousValues = change.before.data();
    const allPromises: Array<Promise<any>> = [];

    if (!previousValues || !newValues) {
        return Promise.all(allPromises);
    } else {
        allPromises.push(
            addUpdatesDoc(
                ITEMS.ROLES.COLLECTION,
                context.params.docId,
                newValues,
                previousValues,
            )
        );
    }

    try {
        console.log("All updating of roles has been removed, so this should never run.");
        allPromises.push(
            editAlgoliaObject(
                CRUD.UPDATE,
                ITEMS.ROLES.COLLECTION,
                context.params.docId,
                newValues,
                previousValues,
            )
        );

        await updateVisibleBy(CRUD.DELETE, context.params.docId, previousValues);

        allPromises.push(updateVisibleBy(CRUD.CREATE, context.params.docId, newValues));

        // why were we just running this once for the role? what is changing with the key? genAlgoliaSearchKey is just running again but maintaining the same genKey so prolly dont need to run this at all
        // allPromises.push(genAlgoliaSearchKey(newValues.role));
        if (newValues.permissions && previousValues.permissions !== newValues.permissions && !newValues.flags.recreated) {
            console.log("Previous permission values NOT equal to new permissions values, but newValues IS set, so making adjustments!");
            // If permissions changed, update on private doc
            // Loop through new permissions and see if CC or BCC set, then add to private doc!
            newValues.permissions.forEach((permit: any) => {
                if (permit.itemActions) {
                    // ** this will be running each set function to union or remove every time any permissions change... not going to be changed too often tho
                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            ccEmailGroups: {
                                [permit.itemKey]: permit.itemActions.some((action: any) => action === CRUD.CC_ON_CREATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log(context.params.docId + " set in ccEmailGroups for " + permit.itemKey);
                        }).catch((error) => {
                            console.error(`Failed setting in ccEmailGroups for ${permit.itemKey}: ${error}`);
                        })
                    );

                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            bccEmailGroups: {
                                [permit.itemKey]: permit.itemActions.some((action: any) => action === CRUD.BCC_ON_CREATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log(context.params.docId + " set in bccEmailGroups for " + permit.itemKey);
                        }).catch((error) => {
                            console.error(`Failed setting in bccEmailGroups for ${permit.itemKey}: ${error}`);
                        })
                    );

                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            [permit.itemKey]: {
                                read: permit.itemActions.some((action: any) => action === CRUD.READ) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                create: permit.itemActions.some((action: any) => action === CRUD.CREATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                update: permit.itemActions.some((action: any) => action === CRUD.UPDATE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                                delete: permit.itemActions.some((action: any) => action === CRUD.DELETE) ? FieldValue.arrayUnion(context.params.docId) : FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log("Updated role collection permissions.");
                        }).catch((error) => {
                            console.error(`Error updating role collection permissions: ${error}`);
                        })
                    );
                }
            });

            // Check if new permission value is missing from previous permissions, so we can remove that role name from that collection key object
            previousValues.permissions.forEach((oldPermit: any) => {
                if (!newValues.permissions.some((newPermit: any) => newPermit.itemKey === oldPermit.itemKey)) {
                    // oldPermit doesnt exist in newPermissions, so lets remove it
                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            ccEmailGroups: {
                                [oldPermit.itemKey]: FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log(context.params.docId + " set in ccEmailGroups for " + oldPermit.itemKey);
                        }).catch((error) => {
                            console.error(`Failed setting in ccEmailGroups for ${oldPermit.itemKey}: ${error}`);
                        })
                    );

                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            bccEmailGroups: {
                                [oldPermit.itemKey]: FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log(context.params.docId + " set in bccEmailGroups for " + oldPermit.itemKey);
                        }).catch((error) => {
                            console.error(`Failed setting in bccEmailGroups for ${oldPermit.itemKey}: ${error}`);
                        })
                    );

                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            [oldPermit.itemKey]: {
                                read: FieldValue.arrayRemove(context.params.docId),
                                create: FieldValue.arrayRemove(context.params.docId),
                                update: FieldValue.arrayRemove(context.params.docId),
                                delete: FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log("Updated role collection permissions.");
                        }).catch((error) => {
                            console.error(`Error updating role collection permissions: ${error}`);
                        })
                    );
                }
            });
        } else if (newValues.flags.recreated) {
            // Delete recreated field now that we are done working with it
            allPromises.push(
                admin.firestore().collection(ITEMS.ROLES.COLLECTION).doc(context.params.docId).set({
                    flags: {
                        recreated: FieldValue.delete(),
                    },
                }, {merge: true}).then(() => {
                    console.log("Deleted recreated field for role.");
                }).catch((error) => {
                    console.error("Failed to delete recreated field on role: "+ error);
                })
            );
        }

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Handles when a "role" document is DELETED on the "roles" collection
 * @param snap Reference to the document snapshot returned from Firebase Firestore Functions
 * @return Returns promise(s) on if actions have been resolved.
 *
 */
export async function roleDeletedHandler(snap: DocumentSnapshot, context: functions.EventContext) {
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
                ITEMS.ROLES.COLLECTION,
                context.params.docId,
            )
        );

        allPromises.push(genAlgoliaSearchKey("", context.params.docId, true));

        allPromises.push(updateVisibleBy(CRUD.DELETE, context.params.docId, deletedValues));

        // First let's get the private array for this role so we know what users to unset their values!
        const currentRoleUsers: any = [];
        await admin.firestore().collection("site").doc("private").get().then((doc) => {
            if (doc.exists) {
                if (doc.data()?.[context.params.docId] ?? "") {
                    doc.data()?.[context.params.docId].forEach((user: any) => {
                        currentRoleUsers.push(user);
                    });
                } else {
                    console.error("No current users for this role: " + context.params.docId);
                }
            } else {
                console.error("Private doc doesnt exist?");
            }
        }).catch((error) => {
            console.error(`Error getting private doc: ${error}`);
        });

        // Go to each of these user documents and delete associated role data
        // unflip any existing user's customClaim for role
        console.log("currentRoleUsers to delete role data for: ");
        console.log(currentRoleUsers);
        if (currentRoleUsers) {
            currentRoleUsers.forEach((user: any) => {
                allPromises.push(updateUserCustomClaims(user.id, "role", null));
            });
        } else {
            console.error("No currentRoleUsers.");
        }

        // Decrement
        allPromises.push(increment(ITEMS.ROLES.COLLECTION, -1));

        // Delete role field on private
        allPromises.push(
            admin.firestore().collection("site").doc("private").update({
                [context.params.docId]: FieldValue.delete(),
            }).then(() => {
                console.log("Delete role field.");
            }).catch((error) => {
                console.error(`Error deleting role field: ${error}`);
            })
        );

        if (deletedValues.permissions) {
            // Loop through deleted permissions and see if CC or BCC set, then remove from private doc!
            deletedValues.permissions.forEach((permit: any) => {
                if (permit.itemActions) {
                    if (permit.itemActions.some((action: any) => action === CRUD.CC_ON_CREATE)) {
                        // CC found, now REMOVE [collection]: docId to ccEmailGroups
                        allPromises.push(
                            admin.firestore().collection("site").doc("private").set({
                                ccEmailGroups: {
                                    [permit.itemKey]: FieldValue.arrayRemove(context.params.docId),
                                },
                            }, {merge: true}).then(() => {
                                console.log(context.params.docId + " unset in ccEmailGroups for " + permit.itemKey);
                            }).catch((error) => {
                                console.error(`Failed unsetting in ccEmailGroups for ${permit.itemKey}: ${error}`);
                            })
                        );
                    }

                    if (permit.itemActions.some((action: any) => action === CRUD.BCC_ON_CREATE)) {
                        // CC found, now REMOVE [collection]: docId to ccEmailGroups
                        allPromises.push(
                            admin.firestore().collection("site").doc("private").set({
                                bccEmailGroups: {
                                    [permit.itemKey]: FieldValue.arrayRemove(context.params.docId),
                                },
                            }, {merge: true}).then(() => {
                                console.log(context.params.docId + " unset in bccEmailGroups for " + permit.itemKey);
                            }).catch((error) => {
                                console.error(`Failed unsetting in bccEmailGroups for ${permit.itemKey}: ${error}`);
                            })
                        );
                    }

                    // Remove role name from collection read, writes
                    allPromises.push(
                        admin.firestore().collection("site").doc("private").set({
                            [permit.itemKey]: {
                                read: FieldValue.arrayRemove(context.params.docId),
                                create: FieldValue.arrayRemove(context.params.docId),
                                update: FieldValue.arrayRemove(context.params.docId),
                                delete: FieldValue.arrayRemove(context.params.docId),
                            },
                        }, {merge: true}).then(() => {
                            console.log("Updated role collection permissions.");
                        }).catch((error) => {
                            console.error(`Error updating role collection permissions: ${error}`);
                        })
                    );
                }
            });
        } else {
            console.error("deletedValues.permissions not set.");
        }

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}
