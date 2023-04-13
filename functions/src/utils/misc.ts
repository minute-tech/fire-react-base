"use strict";
import functions = require("firebase-functions");
import admin = require("firebase-admin");
import sgMail = require("@sendgrid/mail");
import algoliasearch from "algoliasearch";
import {cloneDeep} from "lodash";

import {
    defaultPublicSiteData,
    ITEMS,
    CRUD,
    DATA_TYPE,
    USER_STRUCTURE,
    ORDER_PRODUCT_STRUCTURE,
    ADMIN,
} from "../utils/constants";

import {
    FieldValue,
} from "firebase-admin/firestore";
import _ = require("lodash");

admin.initializeApp(functions.config().firebase);
sgMail.setApiKey(functions.config().sendgrid_api.key);
const adminConfig = JSON.parse(process.env.FIREBASE_CONFIG ?? "");
const projectId = adminConfig.projectId ?? "fire-react-base";

const algoliaAdmin = algoliasearch(
    functions.config().algolia_api.app_id,
    functions.config().algolia_api.admin_key,
);

/**
 * Splits an array of more than 10 into batches of arrays of only 10
 * @param arr Array of items to be batched
 * @return Split arrays batched into sets of 10
 *
 */
export const splitArrayToArraysOf10 = (arr: any) => {
    // Create an empty array to store the split arrays
    const splitArrays: Array<Array<any>> = [[]];

    // Loop through the input array
    for (let i = 0; i < arr.length; i++) {
        // Get the last array in the splitArrays array
        const lastArray = splitArrays[splitArrays.length - 1];

        // Check if the last array has 10 items in it
        if (lastArray && lastArray.length === 10) {
            // If it does, create a new array and push the current item into it
            splitArrays.push([arr[i]]);
        } else {
            // If it doesn't, push the current item into the last array
            lastArray.push(arr[i]);
        }
    }

    // Return the split arrays
    return splitArrays;
};


/**
 * Creates HTML string for objects and nested objects
 * @param item Incoming item
 * @param heading Heading for section
 * @param useStructure Boolean for formatting item to display in structure order
 * @param structure Structure order to display
 * @return HTML output
 *
 */
export function renderObjectGroup(item: any, heading: string, useStructure: boolean, structure: any) {
    let outputString = "";
    if (heading !== "") {
        outputString = `<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(heading)}: </b></p>`;
    }
    if (useStructure && (typeof structure === "object") && Array.isArray(item)) {
        const displayedValues: any[] = [];
        item.forEach((obj) => {
            Object.values(structure).forEach((structureKey) => {
                Object.keys(obj).forEach((key) => {
                    if (!displayedValues.includes(`${key}: ${obj[key]}`)) {
                        if (key === structureKey) {
                            displayedValues.push(`${key}: ${obj[key]}`);
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${obj[key]}</p>`);
                        }
                    }
                });
            });
            if ((item.length > 1) && (item.indexOf(obj) !== (item.length - 1))) { // prevents adding an extra line break at the end of object list (ex. Internal Contacts)
                outputString = outputString.concat("<br/>");
            }
        });
    } else if (useStructure && (typeof structure === "object")) {
        const displayedValues: any[] = [];
        Object.values(structure).forEach((structureKey: any) => {
            Object.keys(item).forEach((key) => {
                if (!displayedValues.includes(`${key}: ${item[key]}`)) {
                    if (key === structureKey.key) {
                        displayedValues.push(`${key}: ${item[key]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[key]}</p>`);
                    } else if (key === structureKey) {
                        displayedValues.push(`${key}: ${item[key]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[key]}</p>`);
                    }
                }
            });
        });
    } else if (useStructure) {
        const displayedValues: any[] = [];
        structure.forEach((subColumn: any) => {
            Object.keys(item).forEach((subKey) => {
                if (!displayedValues.includes(`${subKey}: ${item[subKey]}`)) {
                    if (subKey === subColumn.key) {
                        displayedValues.push(`${subKey}: ${item[subKey]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${subColumn.label}</b>: ${item[subKey]}</p>`);
                    }
                }
            });
        });
    } else {
        Object.keys(item).forEach((subKey) => {
            outputString = outputString.concat(`<b style="margin: 0 0 0 10px;">${ucFirstLetterEachWord(subKey)}</b>: ${item[subKey]}<br/>`);
        });
    }
    return outputString;
}

/**
 * Turns javascript array into an HTML list tag.
 * @param array Array of items to be joined into an HTML list
 * @param heading Heading for section
 * @param useStructure Boolean for formatting item to display in structure order
 * @param structure Structure order to display
 * @return Concatenated html list tags.
 *
 */
export function renderArrayAsList(array: any, heading: string, useStructure: boolean, structure: any) {
    let list = "";
    if (heading !== "") {
        list = `<b style="margin: 0 0 0 10px;">${ucFirstLetterEachWord(heading)}: </b>`;
    }
    if (array.length === 0) {
        list = list.concat(("Not Provided"));
        return list;
    } else {
        list = list.concat("<ul style='margin: 0;'>"); // TODO: I tried to add a style='margin: 0;' to remove that 16px default top/bottom margin, but it isn't showing in the emails.
        if (useStructure && Array.isArray(structure)) {
            array.forEach((item: any) => {
                if (typeof item === "object") {
                    structure.forEach((subColumn) => {
                        Object.keys(item).forEach((subKey) => {
                            if (subKey === subColumn.key && subKey === "images") {
                                list = list.concat(`<img style="margin: 0 0 0 10px;" src=${item[subKey]}; width="200">`);
                            } else if (subKey === subColumn.key) {
                                list = list.concat(`<li><b>${subColumn.label}</b>: ${item[subKey]}</li>`);
                            }
                        });
                    });
                    list = list.concat("<br/>");
                } else {
                    list = list.concat(`<li>${item}</li>`);
                }
            });
        } else if (useStructure && (typeof structure === "object")) {
            array.forEach((item: any) => {
                Object.keys(item).forEach((subKey) => {
                    if (typeof item === "object") {
                        Object.values(structure).forEach((structureKey) => {
                            if (subKey === structureKey && subKey === "images") {
                                if (Array.isArray(item[subKey])) {
                                    item[subKey].forEach((image: any) => {
                                        list = list.concat(`<img style="margin: 0 0 0 10px;" src=${image}; height="200">`);
                                    });
                                } else {
                                    list = list.concat(`<img style="margin: 0 0 0 10px;" src=${item[subKey]}; height="200">`);
                                }
                            } else if (subKey === structureKey && structureKey === "optionChoices") {
                                if (item[subKey].length) {
                                    list = list.concat("<li><b>Choice</b>: </li>");
                                    list = list.concat("<ul>");
                                    item[subKey].forEach((option: any) => {
                                        list = list.concat(`<li><b>Name</b>: ${option.name}</li>`);
                                        list = list.concat(`<li><b>Choice</b>: ${option.choice}</li>`);
                                        list = list.concat(`<li><b>SubSku</b>: ${option.subSku}</li>`);
                                    });
                                    list = list.concat("</ul>");
                                }
                            } else if (subKey === structureKey) {
                                if (item[subKey] === "") {
                                    list = list.concat(`<li><b>${ucFirstLetterEachWord(structureKey)}</b>: Not Provided</li>`);
                                } else {
                                    list = list.concat(`<li><b>${ucFirstLetterEachWord(structureKey)}</b>: ${item[subKey]}</li>`);
                                }
                            }
                        });
                    } else {
                        list = list.concat(`<li>${item}</li>`);
                    }
                });
                list = list.concat("<br/>");
            });
        } else {
            array.forEach((item: any) => {
                if (typeof item === "object" && item !== null) {
                    list = list.concat("<li>");
                    for (const [key, value] of Object.entries(item)) {
                        // Make the camelCased key human readable by uppercasing it for the label
                        const replaced = key.replace(/([A-Z])/g, " $1");
                        const sentenceCaseKey = replaced.charAt(0).toUpperCase() + replaced.slice(1);
                        list = list.concat(`<b>${sentenceCaseKey}:</b> ${value}  <br/>  `);
                    }
                    list = list.concat("</li>");
                } else {
                    list = list.concat(`<li>${item}</li>`);
                }
            });
        }
        list = list.concat("</ul>");
        return list;
    }
}

/**
 * First letter turned to uppercase
 * @param string Array of items to be joined into an HTML list
 * @return Concatenated html list tags.
 *
 */
export function ucFirst(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * First letter turned to uppercase
 * @param string Capitalize the first letter of each word in a string
 * @return String.
 *
 */
export function ucFirstLetterEachWord(string: string): string {
    return string.split(" ")
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
}

/**
 * Create the string for renderedData using the new values of the item and the relevant item structure
 * @param item Values for newly created site item to email out
 * @param itemStructure Structure of layout to determine order of email render
 * @return Concatenated html list tags
 *
 */
export function renderDetails(item: any, itemStructure: any) {
    let outputString = "";
    let boolDisplay = "";
    itemStructure.filter((itemColumn: any) => (itemColumn?.hideInModal !== true && itemColumn?.hideInEmail !== true)).forEach((data: any) => {
        outputString = outputString.concat(`<b style="font-size: 16px; display: block; margin-top: 10px;">${ucFirstLetterEachWord(data.label)}:</b>`);
        if (data.type === DATA_TYPE.RADIO && data.isBool === true) {
            // Bool check needs to be first because we are storing booleans
            if (item[data.key]) {
                boolDisplay = "Yes";
            } else {
                boolDisplay = "No";
            }
            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${boolDisplay}</p>`);
        } else if (data.type === DATA_TYPE.IMAGES) {
            if (Array.isArray(item[data.key])) {
                item[data.key].forEach((image: any) => {
                    outputString = outputString.concat(`<img style="margin: 0 0 0 10px;" src=${image}; height="200">`);
                });
            } else {
                outputString = outputString.concat(`<img style="margin: 0 0 0 10px;" src=${item[data.key]}; height="200">`);
            }
        } else if (item[data.key]) {
            // Check to see if a subColumn
            if (data.userLookup) {
                outputString = outputString.concat(renderObjectGroup(item[data.key], "", true, USER_STRUCTURE));
            } else if (data.subColumns) {
                const displayedValues: any[] = [];
                // Loop through Structure for Labels
                // Render contents
                data.subColumns.forEach((subColumn: any) => {
                    if (subColumn.key !== "quantity") {
                        if (subColumn.userLookup) {
                            outputString = outputString.concat(renderObjectGroup(item[data.key], "", true, USER_STRUCTURE));
                        } else if (subColumn.productLookup) {
                            outputString = outputString.concat(renderArrayAsList(item[data.key], "", true, ORDER_PRODUCT_STRUCTURE));
                        } else if (Array.isArray(item[data.key])) {
                            item[data.key].forEach((obj: any) => {
                                Object.keys(obj).forEach((subKey) => {
                                    if (!displayedValues.includes((obj.itemKey ? obj.itemKey : subKey) + obj[subKey])) {
                                        displayedValues.push((obj.itemKey ? obj.itemKey : subKey) + obj[subKey]);
                                        if (Array.isArray(obj[subKey])) {
                                            outputString = outputString.concat(renderArrayAsList(obj[subKey], (obj.itemKey ? obj.itemKey : subKey), true, data.subColumns));
                                        } else if ((typeof obj) === "object" && data.key !== "internalContacts") {
                                            if (subKey !== "itemKey") {
                                                const objectString = (renderObjectGroup(obj, "", true, data.subColumns));
                                                if (!displayedValues.includes(objectString)) {
                                                    displayedValues.push(objectString);
                                                    outputString = outputString.concat(objectString);
                                                    outputString = outputString.concat("<br/>");
                                                }
                                            }
                                        } else {
                                            if (subKey !== "itemKey" && subKey !== "id") {
                                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(subKey)}:</b> ${obj[subKey]}</p>`);
                                            }
                                        }
                                    }
                                });
                            });
                        } else {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${subColumn.label}: ${item[data.key]}</p>`);
                        }
                    }
                });
            } else if (data.type === DATA_TYPE.TEXTAREA) {
                // Check to see if textarea
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px; white-space: pre-line; ">${item[data.key]}</p>`);
            } else if (Array.isArray(item[data.key])) {
                // Check to see if array
                outputString = outputString.concat(renderArrayAsList(item[data.key], "", false, itemStructure));
            } else if (data.type === DATA_TYPE.TIMESTAMP) {
                // Check to see if timestamp
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${new Date(item[data.key])}</p>`);
            } else if ((typeof item[data.key]) === "object") {
                // Check to see if object
                if (data.nestedColumns) {
                    data.nestedColumns.forEach((nestedColumn: any) => {
                        if (nestedColumn.isBool === true) {
                            if (item[data.key][nestedColumn.key] === true) {
                                boolDisplay = "Yes";
                            } else {
                                boolDisplay = "No";
                            }
                            outputString = outputString.concat(`<p style='margin: 0 0 0 10px;'><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${boolDisplay}</p>`);
                        } else if (nestedColumn.subColumns) {
                            if (Array.isArray(item[data.key][nestedColumn.key])) {
                                outputString = outputString.concat(renderArrayAsList(item[data.key][nestedColumn.key], nestedColumn.label, true, nestedColumn.subColumns));
                                // } else {
                                //   if ((typeof item[data.key][nestedColumn.key]) === "object") {
                                //     // TODO: Do we need logic here?
                                //   }
                            } else if (item[data.key][nestedColumn.key]) {
                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${item[data.key][nestedColumn.key]}</p>`);
                            } else {
                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: Not Provided</p>`);
                            }
                        } else if (item[data.key][nestedColumn.key]) {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${item[data.key][nestedColumn.key]}</p>`);
                        } else {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: Not Provided</p>`);
                        }
                    });
                } else {
                    Object.keys(item[data.key]).forEach((key) => {
                        if (item[data.key][key]) {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[data.key][key]}</p>`);
                        } else {
                            outputString = outputString.concat(("<p style='margin: 0 0 0 10px;'>Not Provided</p>"));
                        }
                    });
                }
            } else if (data.key === "emotionSymbol") {
                // feedback emotion
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">&#${item[data.key].substring(1)};</p>`);
            } else if (data.isUrl) {
                // display URLs
                outputString = outputString.concat(`
                    <p style="margin: 0 0 0 10px;">
                        <a 
                            href=${(item[data.key]).startsWith("https://") || (item[data.key]).startsWith("http://") ? item[data.key] : `https://${item[data.key]}`}
                            target="_blank"
                        >
                            ${item[data.key]}<a/>
                        </p>
                `);
            } else {
                // display normal data string
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${item[data.key]}</p>`);
            }
        } else {
            // no data
            outputString = outputString.concat(("<p style='margin: 0 0 0 10px;'>Not Provided</p>"));
        }
    });
    return outputString;
}

/**
 * Removes overlapping emails to comply with email sendgrid rules
 * @param toEmails - array of to emails as strings
 * @param ccEmails - array of cc emails as strings
 * @param bccEmails - array of bcc emails as strings
 * @return Returns object with 3 arrays
 *
 */
function removeOverlappingEmails(toEmails: Array<string>, ccEmails: Array<string>, bccEmails: Array<string>) {
    // Create a Set of all emails in the toEmails array
    const toEmailsSet = new Set(toEmails);

    // Filter the ccEmails array to remove any emails that are also in the toEmails array
    const filteredCCEmails = ccEmails.filter((email) => !toEmailsSet.has(email));

    // Create a Set of all emails in the filteredCCEmails array
    const ccEmailsSet = new Set(filteredCCEmails);

    // Filter the bccEmails array to remove any emails that are also in the toEmails or ccEmails arrays
    const filteredBCCEmails = bccEmails.filter((email) => !toEmailsSet.has(email) && !ccEmailsSet.has(email));

    // Return the filtered arrays
    return {
        trueTo: toEmails,
        trueCc: filteredCCEmails,
        trueBcc: filteredBCCEmails,
    };
}

/**
 * Emails the To, CC, and BCC fields for a given item creation details
 * @param itemCollection - item collection name on database
 * @param itemName - item collection name on database
 * @param newValueName - the name value of the item to link directly to the item on the dashboard!
 * @param renderedData - item collection name on database
 * @param toEmails - item collection name on database
 * @return Returns array of promises
 *
 */
export async function emailSends(
    itemCollection: string,
    itemName: string,
    newValueName: string,
    renderedData: string,
    incToEmails: Array<string> = [],
    customerFacing = false,
) {
    let publicSiteData: FirebaseFirestore.DocumentData | any = null;
    const ccEmails: Array<string> = [];
    const bccEmails: Array<string> = [];
    const toEmails: Array<string> = incToEmails;

    // Grab public site data for stuff like logo, noreply email, support email, etc for email template
    await admin.firestore().collection("site").doc("public").get().then((publicSiteDoc) => {
        if (publicSiteDoc.exists) {
            const docWithMore = Object.assign({}, publicSiteDoc.data());
            docWithMore.id = publicSiteDoc.id;
            publicSiteData = docWithMore;
        } else {
            console.error("Site doc doesn't exists, so setting the default stuff we need for now!");
            publicSiteData = defaultPublicSiteData;
        }
    }).catch((error) => {
        console.log("Error getting site public document:", error);
    });

    await admin.firestore().collection("site").doc("private").get().then((privateSiteDoc) => {
        if (privateSiteDoc.exists) {
            const privateSiteData: FirebaseFirestore.DocumentData | any = privateSiteDoc.data();
            // Check if there were any roles created that want to get an email for each create item
            // so how could this check if a string is in an object, I would expect it to be an array of strings.
            if (privateSiteData.ccEmailGroups && (itemCollection in privateSiteData.ccEmailGroups)) {
                // Now loop through all the roles we need to email for this item creations
                privateSiteData.ccEmailGroups?.[itemCollection].forEach((group: any) => {
                    // Take the group name, and grab the array from the main privateDoc, then loop through for each user's email so we can email them
                    privateSiteData?.[group].forEach((user: any) => {
                        ccEmails.push(user.email);
                    });
                });
            }

            if (privateSiteData.bccEmailGroups && (itemCollection in privateSiteData.bccEmailGroups)) {
                // Now loop through all the roles we need to email for this item creations
                privateSiteData.bccEmailGroups?.[itemCollection].forEach((group: any) => {
                    // Take the group name, and grab the array from the main privateDoc, then loop through for each user's email so we can email them
                    privateSiteData?.[group].forEach((user: any) => {
                        bccEmails.push(user.email);
                    });
                });
            }
        } else {
            console.error("Site doc doesn't exists");
        }
    }).catch((error) => {
        console.log("Error getting site private document:", error);
    });

    console.log("toEmails: ");
    console.log(toEmails);
    console.log("ccEmails: ");
    console.log(ccEmails);
    console.log("bccEmails: ");
    console.log(bccEmails);

    const {trueTo, trueBcc, trueCc} = removeOverlappingEmails(toEmails, ccEmails, bccEmails);

    console.log("trueTo: ");
    console.log(trueTo);
    console.log("trueCc: ");
    console.log(trueCc);
    console.log("trueBcc: ");
    console.log(trueBcc);

    if (trueTo.length === 0 && trueCc.length === 0 && trueBcc.length === 0) {
        console.log("No one to send this item creation to, so not sending an email at all!");
        return null;
    } else {
        // For now lets just set the "to" email field to the noreply@ email so the email send doesnt fail if none provided!
        if (toEmails.length === 0) {
            toEmails.push(publicSiteData?.emails?.noreply ?? "help@minute.tech");
        }

        console.log("renderedData: " + renderedData);
        // Items like MESSAGES are going to customer facing so we don't want care about them visiting app. This could eventually be a prop like customerFacing.
        const viewOnAppLink = (customerFacing ? "" : (publicSiteData.customUrl ? `https://${publicSiteData.customUrl}/dashboard/admin/${itemCollection}?term=${newValueName}` : `https://${projectId}.web.app/dashboard/admin/${itemCollection}?term=${newValueName}`));
        const viewOnAppLabel = (customerFacing ? "" : "View record on web app");

        // Pack It
        const msg = {
            to: trueTo,
            from: `${publicSiteData.name} <${publicSiteData.emails.noreply}>`,
            replyTo: `${publicSiteData.emails.noreply}`,
            cc: trueCc,
            bcc: trueBcc,
            // Create a template on SendGrid and put the ID here: https://mc.sendgrid.com/dynamic-templates
            templateId: "d-d3b926023b1a48a5a70a97591bc02c33",
            dynamicTemplateData: {
                siteName: publicSiteData.name,
                logoUrl: publicSiteData.logo.lightUrl,
                logoWidth: publicSiteData.logo.width,
                color: publicSiteData?.theme?.color,
                emails: publicSiteData.emails,
                ppUrl: publicSiteData.customUrl ? `${publicSiteData.customUrl}/privacy-policy` : `${publicSiteData.projectId}.web.app/privacy-policy`,
                termsUrl: publicSiteData.customUrl ? `${publicSiteData.customUrl}/terms` : `${publicSiteData.projectId}.web.app/terms`,
                viewOnAppLink: viewOnAppLink,
                viewOnAppLabel: viewOnAppLabel,
                itemName: ucFirst(itemName),
                newValueName: ((newValueName) ? newValueName : `for ${publicSiteData.name}`),
                renderedData: renderedData,
            },
        };

        // Send it
        return sgMail.send(msg).then(() => {
            console.log(`Email sent successfully for ${itemCollection} to, cc, and bcc!`);
        }).catch((error: any) => {
            console.error(`Error with sgMail for sending ${itemCollection} to, cc, and bcc: `);
            console.error(error);
            console.error(error?.response?.body?.errors ?? "No response.body.errors..");
        });
    }
}


/**
 * Turns javascript array into an HTML list tag.
 * @param collectionName string for the firestore collection name so we know what to update
 * @param incrVal number so we know how much to increment (up or down)
 * @return Promise of result of firestore increment
 *
 */
export async function increment(collectionName: string, incrVal: number) {
    return admin.firestore().collection("site").doc("counts").update({
        [collectionName]: FieldValue.increment(incrVal),
    }).then(() => {
        console.log(`Incremented ${collectionName} count by ${incrVal}`);
    }).catch((error) => {
        console.error(`Error incrementing ${collectionName} count: ${error}`);
    });
}

/**
 * Formats and adds update document to updates sub-collection for any item collection on firestore. This is only called onUpdate.
 * @param collectionName string for the firestore collection name so we know what to update
 * @param docId ID of document being updated
 * @param newValues object for new values incoming
 * @param previousValues object for old values before update
 * @return Promise of result of firestore add document to updates sub-collection
 *
 */
export async function addUpdatesDoc(collectionName: string, docId: string, newValues: any, previousValues: any = "") {
    // if it's previousValues === "" then its an onCreate
    if (!_.isEqual(newValues, previousValues)) {
        // Only record if values are different

        // working with newValues...
        console.log("Recording newValues: " + JSON.stringify(newValues));
        const tempNewValues = await cloneDeep(newValues);
        let tempPreviousValues = {created: null};
        const lastUpdated = newValues?.updated ?? ""; // save updated object, will need that for top level not embedded in children
        const lastTimestamp = newValues?.updated?.timestamp ?? ""; // need main timestamp to sit on top level so we can properly sort docs
        // Delete unnecessary values
        delete lastUpdated.timestamp; // I was just deleting this timestamp cuz it was on parent level anyways, saving data
        delete tempNewValues.updated; // This too, since its repeated at top level too
        delete tempNewValues.created; // Created here and in tempPreviousValues wouldn't matter much either way, this shouldnt really ever change anyways


        if (previousValues) {
            // This case occurs onCreate
            console.log("Recording previousValues: " + JSON.stringify(previousValues));
            tempPreviousValues = await cloneDeep(previousValues);
            tempPreviousValues.created = null; // Setting to null instead of delete cuz getting optional error for TS
        }

        const updatedObj = {
            timestamp: lastTimestamp,
            updated: lastUpdated,
            newValues: tempNewValues,
            previousValues: tempPreviousValues ? tempPreviousValues : "",
        };

        return admin.firestore().collection(collectionName).doc(docId).collection("updates").add(updatedObj).then(() => {
            console.log("Successfully added doc to updates collection for: " + docId);
        }).catch((error) => {
            console.error("Error adding doc to updates collection: ", error);
        });
    } else {
        console.log("newValues and previousValues not different, skipping recording of update.");
        return null;
    }
}

/**
 * Setting settings for a given index based on the itemCollection working with
 * @param collectionName string for the firestore collection name so we know what to update
 * @param itemIndex Algolia index we will be working with
 * @return Promise of all settings set from Algolia
 *
 */
export async function setAlgoliaSettings(collectionName: string, itemIndex: any) {
    const allPromises: Array<Promise<any>> = [];
    console.log("Setting Algolia settings for collection " + collectionName);

    try {
        const replicaStructure = {
            created: {
                desc: {
                    name: `${collectionName}_created_desc`,
                    ranking: "desc(created.timestamp)",
                },
                asc: {
                    name: `${collectionName}_created_asc`,
                    ranking: "asc(created.timestamp)",
                },
            },
            updated: {
                desc: {
                    name: `${collectionName}_updated_desc`,
                    ranking: "desc(updated.timestamp)",
                },
                asc: {
                    name: `${collectionName}_updated_asc`,
                    ranking: "asc(updated.timestamp)",
                },
            },
            name: {
                desc: {
                    name: `${collectionName}_name_desc`,
                    ranking: "desc(name.timestamp)",
                },
                asc: {
                    name: `${collectionName}_name_asc`,
                    ranking: "asc(name.timestamp)",
                },
            },
        };

        // Just testing real quick if test goes in the front of normal and replica index names as a STRING
        const trueCreatedDescReplicaName = projectId.includes("test") ? `test_${replicaStructure.created.desc.name}` : `${replicaStructure.created.desc.name}`;
        const trueUpdatedDescReplicaName = projectId.includes("test") ? `test_${replicaStructure.updated.desc.name}` : `${replicaStructure.updated.desc.name}`;

        allPromises.push(
            itemIndex.setSettings({
                attributesForFaceting: [
                    "filterOnly(visible_by)",
                ],
                unretrievableAttributes: [
                    "visible_by",
                ],
                replicas: [
                    `virtual(${trueCreatedDescReplicaName})`,
                    `virtual(${trueUpdatedDescReplicaName})`,
                ],
            }, {
                forwardToReplicas: true,
            }).then((response: any) => {
                console.log(`Success setting normal ${collectionName} index settings:`);
                console.log(response);
            }).catch((error: any) => {
                console.error(`Error setting normal ${collectionName} index settings:`);
                console.error(error);
            })
        );

        // TODO: in the future, we could pass in a prop for an array of replica types to add instead of just created

        // Just creating the created desc replica for now
        const replicaIndexCreatedDesc = algoliaAdmin.initIndex(trueCreatedDescReplicaName);
        allPromises.push(
            replicaIndexCreatedDesc.setSettings({
                customRanking: [replicaStructure.created.desc.ranking],
            }).then((response: any) => {
                console.log(`Success setting desc(created.timestamp) ${collectionName} index settings:`);
                console.log(response);
            }).catch((error: any) => {
                console.error(`Error setting desc(created.timestamp)${collectionName} index settings:`);
                console.error(error);
            })
        );

        const replicaIndexUpdatedDesc = algoliaAdmin.initIndex(trueUpdatedDescReplicaName);
        allPromises.push(
            replicaIndexUpdatedDesc.setSettings({
                customRanking: [replicaStructure.updated.desc.ranking],
            }).then((response: any) => {
                console.log(`Success setting desc(updated.timestamp) ${collectionName} index settings:`);
                console.log(response);
            }).catch((error: any) => {
                console.error(`Error setting desc(updated.timestamp)${collectionName} index settings:`);
                console.error(error);
            })
        );

        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Creates, updates, or deletes object on Algolia
 * @param editType type of edit: create, update, or delete
 * @param collectionName string for the firestore collection name so we know what to update
 * @param docId ID of document being updated
 * @param newValues object for new values incoming
 * @param previousValues object for old values before update
 * @return Promise of result of firestore add document to updates sub-collection
 *
 */
export async function editAlgoliaObject(editType: string, collectionName: string, docId: string, newValues: any = null, previousValues: any = null) {
    const allPromises: Array<Promise<any>> = [];

    console.log("newValues: ");
    console.log(newValues);
    try {
        const itemIndex = algoliaAdmin.initIndex((projectId.includes("test") ? `test_${collectionName}` : collectionName));
        const visibleBy: any[] = [];
        let indexedValues = null;

        if (editType !== CRUD.DELETE) {
            indexedValues = await cloneDeep(newValues);
            indexedValues.objectID = docId;

            // Lookup to see if any roles apply to this collectionName, if so, then let this be visible by those roles by default
            // Get the roles in visibleBy filter permissions if applyFilter is true
            await admin.firestore().collection("roles").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    const roleData = doc.data();
                    if (roleData?.filter?.applyFilter) {
                        console.log("The role '" + roleData.name + "' has the applyFilter set to true. Now check if should be added to visibleBy...");
                        // See if newValue matches filter requirements, if so, add role to visibleBy
                        if (roleData?.filter.filterKey === collectionName) {
                            console.log("collectionName of " + collectionName + " matches main filterKey!");
                            // console.log("roleData.filter.columnValues.includes(newValues[roleData.filter.columnKey]): " + roleData.filter.columnValues.includes(newValues[roleData.filter.columnKey]));
                            // console.log("newValues[roleData.filter.columnKey]: " + newValues[roleData.filter.columnKey]);
                            if (editType === CRUD.UPDATE && previousValues && newValues[roleData.filter.columnKey] !== previousValues[roleData.filter.columnKey] && !roleData.filter.columnValues.includes(newValues[roleData.filter.columnKey])) {
                                // main filter value by role has changed and is not included anymore in the columnValues, so remove role from visibleBy
                                // i.e. if "name" is the columnKey for the role, and newValues.name !== previousValues.name, then we should update the role visible_By
                                console.log("Skipping this role because the MAIN filters arent matched anymore.");
                            } else if (roleData.filter.columnValues.includes(newValues[roleData.filter.columnKey])) {
                                visibleBy.push(roleData.name);
                            } else {
                                console.log("Defaulted else for main filter change... shouldnt of really been hit.");
                            }
                        } else if (roleData.filter.depKeys.includes(collectionName)) {
                            console.log("collectionName of " + collectionName + " matches a string in the dependent key array!");
                            // console.log("roleData.filter.depKeys.includes(newValues[roleData.filter.depColKey]): " + roleData.filter.depKeys.includes(newValues[roleData.filter.depColKey]));
                            // console.log("newValues[roleData.filter.columnKey]: " + newValues[roleData.filter.columnKey]);

                            if (editType === CRUD.UPDATE && previousValues && newValues[roleData.filter.depColKey] !== previousValues[roleData.filter.depColKey] && !roleData.filter.columnValues.includes(newValues[roleData.filter.depColKey])) {
                                // dependent filter value by role has changed and is not included anymore in the columnValues, so dont add role from visibleBy
                                console.log("Skipping this role because the DEPENDENT filters arent matched anymore.");
                            } else if (roleData.filter.columnValues.includes(newValues[roleData.filter.depColKey])) {
                                visibleBy.push(roleData.name);
                            } else {
                                console.log("Defaulted else for depKeys change... shouldnt of really been hit.");
                            }
                        }
                    }
                });
            }).catch((error) => {
                console.log("Error getting roles document snapshots:", error);
            });

            visibleBy.push(ADMIN.SUPER);
            console.log("visibleBy: ");
            console.log(visibleBy);
            indexedValues.visible_by = visibleBy;
        }

        if (editType === CRUD.CREATE) {
            console.log("Creating item on Algolia...");
            // Index the product with Algolia, but submit, then wait to finish so we can set the Settings on an existing index.
            await itemIndex.saveObject(indexedValues);

            // Setting Algolia Settings if first object: //
            // We want to set this index to be filtered by visible_by attribute if it's the first value in the set
            await admin.firestore().collection("site").doc("counts").get().then((doc) => {
                if (doc.exists) {
                    // If feedback collection, count is nested in an object, otherwise just grab main value
                    // Should only run once per index
                    if ((collectionName === ITEMS.FEEDBACK.COLLECTION && (doc.data()?.[collectionName]?.count ?? 0) === 0) || (collectionName !== ITEMS.FEEDBACK.COLLECTION && (doc.data()?.[collectionName] ?? 0) === 0)) {
                        // Only runs once usually if counts document doesnt exist
                        console.log("First record in index, so set algolia settings for index and replicas!");
                        setAlgoliaSettings(collectionName, itemIndex);
                    } else {
                        console.log("Not first record in index, so no need to set Algolia settings.");
                    }
                } else {
                    // Only runs once usually if counts document doesnt exist, but this is the default
                    console.log("No such counts document, so set algolia settings anyways!");
                    setAlgoliaSettings(collectionName, itemIndex);
                }
            }).catch((error) => {
                console.log("Error getting counts document:", error);
            });
        } else if (editType === CRUD.UPDATE) {
            console.log("Updating item on Algolia...");
            if (!_.isEqual(newValues, previousValues)) {
                itemIndex.partialUpdateObject(indexedValues).then(({objectID}) => {
                    console.log(`Successfully updated item ${objectID} on Algolia.`);
                });
            } else {
                console.log("newValues and previousValues not different, skipping updating Algolia object.");
            }
        } else if (editType === CRUD.DELETE) {
            console.log("Deleting item on Algolia...");
            itemIndex.deleteObject(docId).then(() => {
                console.log(`Successfully deleted item ${docId} on Algolia.`);
            });
        } else {
            console.error("Defaulted editAlgoliaObject.");
        }
        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Update user's custom claim object without overwriting everything on the object.
 * Used for adjusting a users algoliaSecuredKey, or admin custom claims typically.
 * Remember this is run within genAlgoliaSearchKey to set the customClaim "algoliaSearchKey" value, but will need to be run again anytime a user needs to have their "role" customClaim updated
 * @param userId userId of custom claim to be updated
 * @param claimKey key of custom claim to be updated
 * @param claimValue value for that key to be written
 * @return Promise of result of updating custom claim
 *
 */
export async function updateUserCustomClaims(userId: string, claimKey: string, claimValue: any = "") {
    const allPromises: Array<Promise<any>> = [];

    try {
        // Remember: customClaims object is always overwritten so we need to record any existing values if they need to be kept. Currently the setup only has role name and algoliaKey planned so they both are reset anyways.
        allPromises.push(
            admin.auth().getUser(userId).then((userRecord) => {
                const currentClaims = userRecord.customClaims;

                // Copy the current custom claims object
                const updatedClaims = currentClaims ? cloneDeep(currentClaims) : {};

                // Add a new key/value pair to the copied object
                updatedClaims[claimKey] = claimValue;

                // Update the user's custom claims with the modified object
                return admin.auth().setCustomUserClaims(userId, updatedClaims);
            }).then(() => {
                console.log(`Custom claim '${claimKey}' with value '${claimValue}' was updated for user with UID '${userId}'.`);
            }).catch((error) => {
                console.error("Error updating custom claims:");
                console.error(error);
            })
        );
        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Generate new or remove Algolia Secured Search API key so search is filtered by permissions.
 * Used for creating the algolia public key and then running updateUserCustomClaims to set that new value on the users auth object on firebase.
 * Remember: customClaims object is always overwritten so we need to record any existing values if they need to be kept. Currently the setup only has role name and algoliaKey planned so they both are reset anyways.
 * Only used for setting ROLE custom claim, and runs the updateUserCustomClaims function
 * @param singleUserId is this just a single update? If set, then we will NOT loop through every user to update them.
 * @param roleId type of edit: create, update, or delete
 * @param isDelete are we deleting aka overwriting the existing key?
 * @return Promise of result of firestore add document to updates sub-collection
 *
 */
export async function genAlgoliaSearchKey(singleUserId = "", roleId: string, isDelete = false) {
    const allPromises: Array<Promise<any>> = [];

    try {
        // TODO: we may want to restrict a user by an IP with restrictSources
        // TODO: or we can set an expiry date for the key with validUntil param
        // see other params here: https://www.algolia.com/doc/api-reference/api-methods/generate-secured-api-key/

        // TODO: if these DO differ user to user, you can put this logic back to generating for each looped user
        // If role changes, then let's add a new Algolia custom claim secured key
        // set to null if deleting role
        // If a role has a space, we need to enclose in quotes, if no space, i think its crashing the whole filter?
        // https://www.algolia.com/doc/api-reference/api-parameters/filters/?language=javascript#filters-syntax-validator
        // https://support.algolia.com/hc/en-us/articles/8620911710225-Why-am-I-getting-Unexpected-token-string-error-


        // lets regenerate a new fresh secured API key for all the users in this role group
        if (!singleUserId) {
            let roleUsers: any[] = [];
            await admin.firestore().collection("site").doc("private").get().then((doc) => {
                if (doc.exists) {
                    console.log("Grabbed array of users in role changed: " + doc.data()?.[roleId]);
                    roleUsers = doc.data()?.[roleId];
                } else {
                    console.log("Private doc doesnt exist.");
                }
            }).catch((error) => {
                console.error("Error getting private document: " + error);
            });

            roleUsers.forEach((user) => {
                // Loop through all users who are in this group
                const publicKey = algoliaAdmin.generateSecuredApiKey(
                    functions.config().algolia_api.search_key, // A search key that you keep private
                    {
                        filters: `visible_by:"${roleId}"`,
                        userToken: user.id,
                    },
                );
                console.log("generated algolia publicKey of: " + publicKey);
                allPromises.push(updateUserCustomClaims(user.id, "algoliaSecuredKey", (isDelete ? null : publicKey)));
            });
        } else {
            const publicKey = algoliaAdmin.generateSecuredApiKey(
                functions.config().algolia_api.search_key, // A search key that you keep private
                {
                    filters: `visible_by:"${roleId}"`,
                    userToken: singleUserId,
                },
            );
            console.log("generated algolia publicKey of: " + publicKey);
            // If just updating one user
            allPromises.push(updateUserCustomClaims(singleUserId, "algoliaSecuredKey", (isDelete ? null : publicKey)));
        }
        return Promise.all(allPromises);
    } catch (error) {
        console.error(error);
        return Promise.all(allPromises);
    }
}

/**
 * Valdiate if the color is an HTML color or not.
 * @param strColor String of color to be validated
 * @return Boolean of if the color is valid or not
 *
 */
export const isColor = (strColor: string) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== "";
};
