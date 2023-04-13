import { DATA_TYPE, SIZES, ADMIN, USER_STRUCTURE, ORDER_PRODUCT_STRUCTURE } from "./constants";

// Turns string into a URL friendly string
export function urlify(string) {
    return string.replace(/[^a-z0-9_]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
}
// Function that takes a dash-separated string, replaces the dashes with spaces, and capitalizes the first letter of each word.
export function reverseUrlify(string) {
    return string.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}  

// First letter is uppercase
export function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// First Letter Of Every Word In A String Is Uppercase
export function ucFirstLetterEachWord(string) {
    return string.split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');
}

// UC on first letters, combine words (no space)
export function PascalCase(string) {
    return string.split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join('');
}

// Generate random ID
export function genId(length) {
    var result = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

// Date and Time //
export function readTimestamp(timestamp) {
    const dateObject = new Date(timestamp);
    let dd = dateObject.getDate();
    let mm = dateObject.getMonth() + 1; // January is 0!
    const yyyy = dateObject.getFullYear();
    let hrs = dateObject.getHours();
    let mins = dateObject.getMinutes();

    if (dd < 10) {
        dd = `0${dd}`;
    }
    if (mm < 10) {
        mm = `0${mm}`;
    }
    if (hrs < 10) {
        hrs = `0${hrs}`;
    }
    if (mins < 10) {
        mins = `0${mins}`;
    }
    const date = `${mm}/${dd}/${yyyy}`;
    const time = `${hrs}:${mins}`;

    return {
        time,
        date
    };
}

// Fills array with values
export function fillArrayWithValues(size, value) {
    let result = [];
    for (let i = 0; i < size; i++) {
        result.push(value);
    }
    return result;
}

// Counts unchanged values in an object
export function countChangedValues(obj, originalObj, exceptionProps = []) {
    let count = 0;
    let propKeys = [];
    for (const prop in obj) {
        if (
            !exceptionProps.includes(prop) &&
            typeof obj[prop] === "object" &&
            obj[prop] !== null
        ) {
            if (Array.isArray(obj[prop])) {
                let arrayChanged = false;
                for (let i = 0; i < obj[prop].length; i++) {
                    if (
                        originalObj[prop] &&
                        i < originalObj[prop].length &&
                        countChangedValues(obj[prop][i], originalObj[prop][i], exceptionProps)
                            .count > 0
                    ) {
                        arrayChanged = true;
                        break;
                    } else if (i >= (originalObj[prop]?.length || 0)) {
                        arrayChanged = true;
                        break;
                    }
                }
                if (arrayChanged) {
                    propKeys.push(prop);
                    count++;
                }
            } else {
                if (originalObj[prop]) {
                    const result = countChangedValues(
                        obj[prop],
                        originalObj[prop],
                        exceptionProps
                    );
                    count += result.count;
                    result.propKeys.forEach((key) => {
                        propKeys.push(`${prop}.${key}`);
                    });
                } else {
                    propKeys.push(prop);
                    count++;
                }
            }
        } else if (
            !exceptionProps.includes(prop) &&
            obj[prop] !== originalObj[prop]
        ) {
            propKeys.push(prop);
            count++;
        }
    }
    return { count, propKeys };
}

export function renderObjectGroup(item, heading, useStructure, structure, setSearchParams, setSearch) {
    let outputString = "";
    if (heading !== "") {
        outputString = `<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(heading)}: </b></p>`;
    };
    if (useStructure && (typeof structure === "object") && Array.isArray(item)) {
        const displayedValues = [];
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
        const displayedValues = [];
        Object.values(structure).forEach((structureKey) => {
            Object.keys(item).forEach((key) => {
                if (!displayedValues.includes(`${key}: ${item[key]}`)) {
                    if (key === structureKey.key) {
                        displayedValues.push(`${key}: ${item[key]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[key]}</p>`);
                    } else if (key === structureKey) {
                        displayedValues.push(`${key}: ${item[key]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[key]}</p>`);
                    };
                };
            });
        });
    } else if (useStructure) {
        const displayedValues = [];
        structure.forEach((subColumn) => {
            Object.keys(item).forEach((subKey) => {
                if (!displayedValues.includes(`${subKey}: ${item[subKey]}`)) {
                    if (subKey === subColumn.key) {
                        displayedValues.push(`${subKey}: ${item[subKey]}`);
                        outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${subColumn.label}</b>: ${item[subKey]}</p>`);
                    };
                };
            });
        });
    } else {
        Object.keys(item).forEach((subKey) => {
            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(subKey)}</b>: ${item[subKey]}</p>`);
        });
    };
    return outputString;
};

export function renderArrayAsList(array, heading, useStructure, structure, setSearchParams, setSearch) {
    let list = "";
    if (heading !== "") {
        list = `<b style="margin: 0 0 0 10px;">${ucFirstLetterEachWord(heading)}: </b>`;
    };
    if (array.length === 0) {
        list = list.concat(("Not Provided"));
        return list;
    } else {
        list = list.concat("<ul style='margin: 0;'>"); // TODO: I tried to add a style='margin: 0;' to remove that 16px default top/bottom margin, but it isn't showing in the emails.
        if (useStructure && Array.isArray(structure)) {
            array.forEach((item) => {
                if (typeof item === "object") {
                    structure.forEach((subColumn) => {
                        Object.keys(item).forEach((subKey) => {
                            if (subKey === subColumn.key && subKey === "images") {
                                list = list.concat(`<img style="margin: 0 0 0 10px;" src=${item[subKey]}; width="200">`);
                            } else if (subKey === subColumn.key) {
                                list = list.concat(`<li><b>${subColumn.label}</b>: ${item[subKey]}</li>`);
                            };
                        });
                    });
                    list = list.concat("<br/>");
                } else {
                    list = list.concat(`<li>${item}</li>`);
                };
            });
        } else if (useStructure && (typeof structure === "object")) {
            array.forEach((item) => {
                Object.values(structure).forEach((structureKey) => {
                    if (typeof item === "object") {
                        Object.keys(item).forEach((subKey) => {
                            if (subKey === structureKey && subKey === "images") {
                                if (Array.isArray(item[subKey])) {
                                    item[subKey].forEach((image) => {
                                        list = list.concat(`<img style="margin: 0 0 0 10px;" src=${image}; height="200">`);
                                    });
                                } else {
                                    list = list.concat(`<img style="margin: 0 0 0 10px;" src=${item[subKey]}; height="200">`);
                                };
                            } else if (subKey === structureKey && structureKey === "optionChoices") {
                                if (item[subKey].length) {
                                    list = list.concat(`<li><b>Choice</b>: </li>`);
                                    list = list.concat("<ul>");
                                    item[subKey].forEach((option) => {
                                        list = list.concat(`<li><b>Name</b>: ${option.name}</li>`)
                                        list = list.concat(`<li><b>Choice</b>: ${option.choice}</li>`)
                                        list = list.concat(`<li><b>SubSku</b>: ${option.subSku}</li>`)
                                    });
                                    list = list.concat(`</ul>`)
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
                    };
                });
                list = list.concat("<br/>");
            });
        } else {
            array.forEach((item) => {
                if (typeof item === "object" && item !== null) {
                    list = list.concat("<li>");
                    for (const [key, value] of Object.entries(item)) {
                        // Make the camelCased key human readable by uppercasing it for the label
                        const replaced = key.replace(/([A-Z])/g, " $1");
                        const sentenceCaseKey = replaced.charAt(0).toUpperCase() + replaced.slice(1);
                        list = list.concat(`<b
                                        >${sentenceCaseKey}:</b> ${value}  <br/>  `);
                    };
                    list = list.concat("</li>");
                } else {
                    list = list.concat(`<li>${item}</li>`);
                };
            });
        };
        list = list.concat("</ul>");
        return list;
    };
};

export function renderDetails(item, itemStructure, isFrontEnd, setSearchParams, setSearch) {
    let outputString = "";
    let boolDisplay = "";
    itemStructure.filter(itemColumn => (itemColumn?.hideInModal !== true)).forEach((data) => {
        outputString = outputString.concat(`<b style="font-size: 16px; display: block; margin-top: 10px;">${ucFirstLetterEachWord(data.label)}:</b>`);
        if (data.type === DATA_TYPE.RADIO && data.isBool === true) {
            // Bool check needs to be first because we are storing booleans
            if (item[data.key]) {
                boolDisplay = "Yes";
            } else {
                boolDisplay = "No";
            };
            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${boolDisplay}</p>`);
        } else if (data.type === DATA_TYPE.IMAGES) {
            if (Array.isArray(item[data.key])) {
                item[data.key].forEach((image) => {
                    outputString = outputString.concat(`<img style="margin: 0 0 0 10px;" src=${image}; height="200">`);
                });
            } else {
                outputString = outputString.concat(`<img style="margin: 0 0 0 10px;" src=${item[data.key]}; height="200">`);
            };

        } else if (item[data.key]) {
            // Check to see if a subColumn
            if (data.userLookup) {
                outputString = outputString.concat(renderObjectGroup(item[data.key], "", true, USER_STRUCTURE, setSearchParams, setSearch));
            } else if (data.subColumns) {
                const displayedValues = [];
                // Loop through Structure for Labels
                // Render contents
                data.subColumns.forEach((subColumn) => {
                    if (subColumn.key !== "quantity") {
                        if (subColumn.userLookup) {
                            outputString = outputString.concat(renderObjectGroup(item[data.key], "", true, USER_STRUCTURE, setSearchParams, setSearch));
                        } else if (subColumn.productLookup) {
                            outputString = outputString.concat(renderArrayAsList(item[data.key], "", true, ORDER_PRODUCT_STRUCTURE, setSearchParams, setSearch));
                        } else if (Array.isArray(item[data.key])) {
                            item[data.key].forEach((obj) => {
                                Object.keys(obj).forEach((subKey) => {
                                    if (!displayedValues.includes((obj.itemKey ? obj.itemKey : subKey) + obj[subKey])) {
                                        displayedValues.push((obj.itemKey ? obj.itemKey : subKey) + obj[subKey]);
                                        if (Array.isArray(obj[subKey])) {
                                            outputString = outputString.concat(renderArrayAsList(obj[subKey], (obj.itemKey ? obj.itemKey : subKey), true, data.subColumns, setSearchParams, setSearch));
                                        } else if ((typeof obj) === "object" && data.key !== "internalContacts") {
                                            if (subKey !== "itemKey") {
                                                const objectString = (renderObjectGroup(obj, "", true, data.subColumns, setSearchParams, setSearch));
                                                if (!displayedValues.includes(objectString)) {
                                                    displayedValues.push(objectString);
                                                    outputString = outputString.concat(objectString);
                                                    outputString = outputString.concat("<br/>");
                                                };
                                            };
                                        } else {
                                            if (subKey !== "itemKey" && subKey !== "id") {
                                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(subKey)}:</b> ${obj[subKey]}</p>`);
                                            };
                                        };
                                    };
                                });
                            });
                        } else {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${subColumn.label}: ${item[data.key]}</p>`);
                        };
                    };
                });
            } else if (data.type === DATA_TYPE.TEXTAREA) {
                // Check to see if textarea
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px; white-space: pre-line; ">${item[data.key]}</p>`);
            } else if (Array.isArray(item[data.key])) {
                // Check to see if array
                outputString = outputString.concat(renderArrayAsList(item[data.key], "", false, itemStructure, setSearchParams, setSearch));
            } else if (data.type === DATA_TYPE.TIMESTAMP) {
                // Check to see if timestamp
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${new Date(item[data.key])}</p>`);
            } else if ((typeof item[data.key]) === "object") {
                // Check to see if object 
                if (data.nestedColumns) {
                    data.nestedColumns.forEach((nestedColumn) => {
                        if (nestedColumn.isBool === true) {
                            if (item[data.key][nestedColumn.key] === true) {
                                boolDisplay = "Yes";
                            } else {
                                boolDisplay = "No";
                            };
                            outputString = outputString.concat(`<p style='margin: 0 0 0 10px;'><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${boolDisplay}</p>`);
                        } else if (nestedColumn.subColumns) {
                            if (Array.isArray(item[data.key][nestedColumn.key])) {
                                outputString = outputString.concat(renderArrayAsList(item[data.key][nestedColumn.key], nestedColumn.label, true, nestedColumn.subColumns, setSearchParams, setSearch));
                                // } else {
                                //   if ((typeof item[data.key][nestedColumn.key]) === "object") {
                                //     // TODO: Do we need logic here?
                                //   }
                            } else if (item[data.key][nestedColumn.key]) {
                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${item[data.key][nestedColumn.key]}</p>`);
                            } else {
                                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: Not Provided</p>`);
                            };
                        } else if (item[data.key][nestedColumn.key]) {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: ${item[data.key][nestedColumn.key]}</p>`);
                        } else {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(nestedColumn.label)}</b>: Not Provided</p>`);
                        };
                    });
                } else {
                    Object.keys(item[data.key]).forEach((key) => {
                        if (item[data.key][key]) {
                            outputString = outputString.concat(`<p style="margin: 0 0 0 10px;"><b>${ucFirstLetterEachWord(key)}</b>: ${item[data.key][key]}</p>`);
                        } else {
                            outputString = outputString.concat(("<p style='margin: 0 0 0 10px;'>Not Provided</p>"));
                        };
                    });
                };
            } else if (data.key === "emotionSymbol") {
                // feedback emotion
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">&#${item[data.key].substring(1)};</p>`);
            } else if (data.isUrl) {
                // display URLs
                outputString = outputString.concat(`
                        <p style="margin: 0 0 0 10px;">
                          <a 
                            href=${(item[data.key]).startsWith("https://") || (item[data.key]).startsWith("http://")
                        ?
                        item[data.key]
                        :
                        `https://${item[data.key]}`
                    }
                            target="_blank">
                          ${item[data.key]}<a/>
                          </p>`);
            } else {
                // display normal data string
                outputString = outputString.concat(`<p style="margin: 0 0 0 10px;">${item[data.key]}</p>`);
            };
        } else {
            // no data
            outputString = outputString.concat(("<p style='margin: 0 0 0 10px;'>Not Provided</p>"));
        };
    });
    return outputString;
};

export const splitArrayToArraysOf10 = (arr) => {
    // Create an empty array to store the split arrays
    const splitArrays = [[]];

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
}
// Default breakpoints to the to lower value if higher value is not set... so if "xxxl" nor "xxl" is set, but "xl" is set, then the functon should default to "xl", and take in the other set values such as "lg", "md", and "sm".
export function getDefaultBreakpointValue(breakpoints, size) {
    const sizesOrder = Object.values(SIZES);
    const sizeIndex = sizesOrder.indexOf(size);
    for (let i = sizeIndex; i >= 0; i--) {
        const currentSize = sizesOrder[i];
        if (breakpoints?.[currentSize] !== undefined) {
            return breakpoints[currentSize];
        }
    }
    return null;
}

// ROLE and USER checking functions //

// Returns true or false if the user is permitted to perform the actionType on the itemKey based on their customClaim role
export const checkUserAdminPermission = (itemKey, actionType, roles, customClaims) => {
    // console.log("roles: ")
    // console.log(roles)
    // console.log("itemKey: ")
    // console.log(itemKey)
    if (roles && customClaims.role && (customClaims.role !== ADMIN.SUPER)) {
        const currentUserRolePermissions = roles.filter(role => role.name === customClaims.role);
        // console.log("currentUserRolePermissions: ");
        // console.log(currentUserRolePermissions);
        const foundPermission = currentUserRolePermissions[0]?.permissions.find(permission => permission.itemKey === itemKey && permission.itemActions.some(action => action === actionType));
        if (foundPermission) {
            // console.log("foundPermission: " )
            // console.log(foundPermission);
            return foundPermission;
        } else {
            // console.log("foundPermission: " + false)
            return false;
        }
    } else if (customClaims.role === ADMIN.SUPER) {
        // Super admins can do all
        return true;
    } else {
        // console.log("Role not set on database or user.")
        return false;
    }
}

// Check to see if the role ID given is flagged as isAdmin
export const checkIfRoleIsAdmin = (roleId, roles) => {
    if (roles && roleId) {
        const roleIsAdmin = roles.some(role => (role.name === roleId && role.isAdmin));
        if (roleIsAdmin || roleId === ADMIN.SUPER) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
// Searches for a specific string (stringId) in all arrays of strings in an object:
export function searchRoleArraysForUserRole(object, stringId) {
    for (let key in object) { // Loop through all keys in the object
        if (Array.isArray(object[key])) { // Check if the value of the key is an array
            for (let i = 0; i < object[key].length; i++) { // Loop through the array
                if (typeof object[key][i] === "object") { // Check if the current element is an object
                    const values = Object.values(object[key][i]); // Get an array of values from the current object
                    for (let j = 0; j < values.length; j++) { // Loop through the values
                        if (values[j].toString().includes(stringId)) { // Check if the value contains the stringId
                            return key; // Return the key if the string is found
                        }
                    }
                }
            }
        }
    }
    return null; // Return null if the string is not found
}

export const isColor = (strColor) => {
    const s = new Option().style;
    s.color = strColor;
    return s.color !== "";
}