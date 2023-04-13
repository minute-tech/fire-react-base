import React, { useCallback, useEffect, useRef, useState } from 'react'
import { collection, onSnapshot, doc, updateDoc, deleteDoc, addDoc, setDoc, getDoc } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { confirmAlert } from 'react-confirm-alert';
import { BiCheck, BiDownload, BiExport, } from 'react-icons/bi';
import { CSVLink } from 'react-csv';
import { useSearchParams, useNavigate } from 'react-router-dom';
import algoliasearch from "algoliasearch";
import { transparentize } from 'polished';
import _ from "lodash";

import { Hr, Spacer, OverflowXAuto, Table, Tbody, Td, Th, Thead, Tr, Grid, Column, Row } from '../../utils/styles/misc';
import { Spinner } from '../../utils/styles/images';
import { Body, H1, H2, H3, LLink } from '../../utils/styles/text';
import { firestore, functions } from '../../Fire';
import { checkUserAdminPermission, countChangedValues, fillArrayWithValues, getDefaultBreakpointValue, readTimestamp, searchRoleArraysForUserRole, ucFirst, ucFirstLetterEachWord } from '../../utils/misc';
import { BTYPES, SIZES, PAGE_SIZES, DATA_TYPE, CRUD, ITEMS, RESERVED_ROLES, ADMIN } from '../../utils/constants.js';
import { PageSelectInput, SearchContainer, TextInput, Button } from '../../utils/styles/forms';
import { ColChevron, FormError } from '../misc/Misc';
import ConfirmAlert from '../misc/ConfirmAlert';
import { renderEmotion } from '../misc/Feedback';
import CustomInput from './CustomInput';
import CustomArrayInput from './CustomArrayInput';
import CustomObjectInput from './CustomObjectInput';
import DetailModal from './DetailModal';
import { httpsCallable } from 'firebase/functions';

// Places needing to be changed for each new item collection:
// - FFunctions
// - FRules
// - Views.js page
// - ManageItem.js file

export default function ItemsManager(props) {
    const theme = useTheme();
    const navigate = useNavigate();

    // Flags
    const [loading, setLoading] = useState({
        feedbackAverage: true,
        items: true,
        allItems: false,
    }); 
    const [submitting, setSubmitting] = useState({ 
        search: false,
        itemWrite: false,
    }); 
    const [submitted, setSubmitted] = useState({  // not sure if this is used by anything anymore after no longer requiring reload
        itemWrite: "", // Using this to hold the ID of the updated item to just render a reload button instead of open modal button after the user updates that item
    });
    const [fetched, setFetched] = useState({ 
        itemWrite: false,
        items: false,
        searchParams: false,
    });
    // Refs //
    const editorRef = useRef(null);
    const scrollTimer = useRef(null);
    
    const [feedbackAverage, setFeedbackAverage] = useState(0);

    // Editing
    const [shownModals, setShownModals] = useState([]); 
    const [isEditorShown, setIsEditorShown] = useState("")
    const [updatingItem, setUpdatingItem] = useState("");

    // Forms
    const searchForm = useForm({
        defaultValues: {
            term: "",
        }
    });
   
    const [columnHover, setColumnHover] = useState();
    const handleColumnHover = (c) => {
        setColumnHover(c);
      };


    const setItemForm = useForm();
    const watchForm = setItemForm.watch;

    // Item 
    // ( Need to add these various item columns that aren't in the default itemStructure! )
    let tempItemStructure = [...props.itemStructure];
    tempItemStructure.unshift({
        key: "updated",
        label: "Updated",
        hideInModal: true,
        active: true,
        direction: "desc",
        shown: true,
    });
    tempItemStructure.unshift({
        key: "created",
        label: "Created",
        hideInModal: true,
        active: false,
        shown: true,
    });

    const [localItemStructure, setLocalItemStructure] = useState(tempItemStructure);

    // Search //
    const [search, setSearch] = useState({
        term: "",
    }); 
    const [items, setItems] = useState([]);

    // Grab specific item index for searching (test or live)
    const [currentPage, setCurrentPage] = useState(0); // first page is page 1, but algolia wants to see page 0
    const [totalPages, setTotalPages] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0]);
    const nonSearchable = [ "rangeValue" ]; // ** if search and shown combine, then remove this
    const [allItems, setAllItem] = useState([]);
    const [allItemHeaders, setAllItemHeaders] = useState([]);
    const [downloadedItems, setDownloadedItems] = useState(false);
    // Look to see if search present in URL
    const [searchParams, setSearchParams] = useSearchParams();
    const currentParams = Object.fromEntries([...searchParams]);

    const queryAlgolia = useCallback(async (getPage = 1) => {
        // Get API key based on user's permissions
        const algoliaClient = algoliasearch(
            process.env.REACT_APP_ALGOLIA_APP_ID,
            props?.customClaims?.algoliaSecuredKey ?? "",
        );

        // Get sorting selections
        const activeColumnKey = localItemStructure.find(itemColumn => {return itemColumn.active;})?.key ?? "updated.timestamp";
        const activeColumnDirection = localItemStructure.find(itemColumn => {return itemColumn.active;})?.direction ?? "desc";
        const activeColumnKeyFormatted = activeColumnKey.split('.')[0]; // updated.timestamp to updated or create. to just created
        const replicaBase = `${props.itemCollection}_${activeColumnKeyFormatted}_${activeColumnDirection}`;
        const trueReplica = process.env.NODE_ENV === 'development' ? `test_${replicaBase}` : (replicaBase);
        const baseIndex = process.env.NODE_ENV === 'development' ? `test_${props.itemCollection}` : props.itemCollection;
        let doesBaseIndexExist = false;
        let doesReplicaIndexExist = false;
        await algoliaClient.initIndex(baseIndex).exists().then(response => {
            doesBaseIndexExist = response;
        });
        await algoliaClient.initIndex(trueReplica).exists().then(response => {
            doesReplicaIndexExist = response;
        });
        
        if (!doesBaseIndexExist && !doesReplicaIndexExist) {
            setLoading(prevState => ({
                ...prevState,
                items: false,
            }));
        } else {
            // Check if replica index exists, if it does then use replica, if not use the no-replica standard index
            const itemIndex = doesReplicaIndexExist ? algoliaClient.initIndex(trueReplica) : algoliaClient.initIndex(baseIndex);
            // If 0 is passed for getPage, then we don't want to paginate, but rather get all data and will return the hits because this case is mainly used for exporting items to CSV
            setLoading(prevState => ({
                ...prevState,
                items: true,
            }));
            let returnedItems = [];
            await itemIndex.search((search.term), {
                page: (getPage === 0 ? "" : getPage-1), // Subtract 1 so it matches page "1" is actually page "0" that algolia wants 
                hitsPerPage: (getPage === 0 ? "" : itemsPerPage),
            }).then((response) => {
                console.log("Algolia Query results:");
                console.log(response);
                let tempHits = response.hits;
                if (props.itemCollection === ITEMS.USERS.COLLECTION) {
                    response.hits.forEach((user, index) => {
                        // TODO: do we need to await forEach (aka for of) loop?
                        tempHits[index].role = searchRoleArraysForUserRole(props.rolesAndUsers, user.objectID);
                    });
                }
                if (getPage === 0) {
                    returnedItems = response.hits;
                } else {
                    
                    setItems(response.hits);
                    setCurrentPage(response.page+1);
                    setTotalItems(response.nbHits);
                    setTotalPages(response.nbPages);
                    // Need to fill shownModals with false so we can toggle them on and off as needed
                    setShownModals(fillArrayWithValues(response.hits.length, false));
                }
            }).catch((error) => {
                console.error("Error with Algolia search: " + error.message);
                toast.error("Error with search: " + error.message);
            });
            setLoading(prevState => ({
                ...prevState,
                items: false,
            }));

            if (getPage === 0) {
                return returnedItems;
            } else {
                return null;
            }
        }
        

    }, [itemsPerPage, search.term, props.itemCollection, props.customClaims.algoliaSecuredKey, localItemStructure, props.rolesAndUsers]);

    useEffect(() => {
        // Just need to grab the average for all feedback to display at top
        // Only super admins can see feedback averages cuz firestore rules only allow super admins to see counts doc
        if (props.itemCollection === "feedback" && props.customClaims.role === ADMIN.SUPER) {
            return onSnapshot(doc(firestore, "site", "counts"), (countsDoc) => {
                if(countsDoc.exists()){
                    let countsData = countsDoc.data();
                    setFeedbackAverage((countsData?.feedback?.average ?? null) ? countsData.feedback.average : 0);
                    
                    setLoading(prevState => ({
                        ...prevState,
                        feedbackAverage: false
                    }));
                } else {
                    console.log(`No custom site set, can't properly count ${props.itemCollection}.`);
                    setLoading(prevState => ({
                        ...prevState,
                        feedbackAverage: false
                    }));
                }
            });
        } else {
            setLoading(prevState => ({
                ...prevState,
                feedbackAverage: false
            }));
        }
        
    }, [props.itemCollection, props.customClaims]);

    useEffect(() => {
        if (
            // ** this ensures the items will fetch first, then searchParams will be checked, not efficient so probably a better way to not grab the algolia items twice...
            !fetched.searchParams && fetched.items
        ) {
            if (currentParams.term
                // && currentParams.column
                ) {
                console.log("URL has current search params: ");
                console.log("term: " + currentParams.term);

                queryAlgolia();

                setSearch({
                    term: currentParams?.term ?? "",
                });

                setDownloadedItems(false);
                setAllItem([]);
                
                searchForm.reset({
                    term: currentParams?.term ?? "",
                });
                setFetched(prevState => ({
                    ...prevState,
                    searchParams: true,
                }));
            } 
            // else {
            //     // This else code is run constantly 
            //     // but has to in order to listen for changes on currentParams but may have some overhead
            //     console.log("currentParams not set.")
            // }
            
            
        }
    }, [currentParams.term, searchForm, queryAlgolia, fetched]);
    
    useEffect(() => {
        // Listen for changes on itemsPerPage selector change
        // Only fetches once...
        queryAlgolia();
    }, [itemsPerPage, queryAlgolia])
    
    // Get initial page
    useEffect(() => {
        async function fetchItems() {
            try {
                await queryAlgolia();
            } catch (error) {
                console.error("Item Manager error.code: " + error.code);
                console.error("Item Manager error.message: " + error.message);
            }
        };
        if (!fetched.items) {
            fetchItems();
            setFetched(prevState => ({
                ...prevState,
                items: true,
            }));
        }
    }, [queryAlgolia, fetched.items]);

    const getPrevPage = async () => {
        if(currentPage !== 1){

            // const activeColumnKey = localItemStructure.find(itemColumn => {return itemColumn.active;})?.key ?? "created.timestamp";
            // const activeColumnDirection = localItemStructure.find(itemColumn => {return itemColumn.active;})?.direction ?? "desc";

            const prevPage = currentPage - 1;
            await queryAlgolia(prevPage);
            console.log("prevPage: " + prevPage);
        }
    }

    const getNextPage = async () => {
        if(currentPage !== totalPages){
            
            // const activeColumnKey = localItemStructure.find(itemColumn => {return itemColumn.active;})?.key ?? "created.timestamp";
            // const activeColumnDirection = localItemStructure.find(itemColumn => {return itemColumn.active;})?.direction ?? "desc";
           
            const nextPage = currentPage + 1;
            await queryAlgolia(nextPage);
            console.log("nextPage: " + nextPage);
        }
    };

    const submitSearch = async (data) => {
        setSubmitting(prevState => ({
            ...prevState,
            search: true,
        }));
        
        await queryAlgolia();

        setSearch({
            term: data.term,
        });

        setDownloadedItems(false);
        setAllItem([]);
        setSubmitting(prevState => ({
            ...prevState,
            search: false,
        }));
    };

    const clearSearch = () => {
        searchForm.reset({term: ""});
        setSearch({
            term: "",
        });

        // Set search to null in URL too
        navigate(".", { replace: true });


        setFetched(prevState => ({
            ...prevState,
            items: false,
        }));

        setDownloadedItems(false);
        setAllItem([]);

        setFetched(prevState => ({
            ...prevState,
            searchParams: false,
        }));

        // TODO: is this the best way to be doing this? Needing to re query the whole set again?
        queryAlgolia();
    };

    const toggleCol = (incColumn) => {
        // TODO: when we allow for more sorting methods, this conditional will change to include more than created.dec and updated.desc
        let tempItemColumn = incColumn;
        let tempItemStructure = [...localItemStructure];
        // Before we toggle the active itemColumn, we want to check if the new itemColumn clicked is different than the previous itemColumn active, 
        // so we can toggle OFF the previous itemColumn
        const prevActiveColObj = localItemStructure.find(itemColumn => (itemColumn.active));
        const prevActiveColIndex = localItemStructure.findIndex(itemColumn => (itemColumn.key === prevActiveColObj.key))
        if (((incColumn.key === "created") || (incColumn.key === "updated")) && (prevActiveColObj.key !== incColumn.key)) {
            if(prevActiveColObj.key !== incColumn.key){
                // De-active the old itemColumn if not same as before
                tempItemStructure[prevActiveColIndex].active = false;
                tempItemStructure[prevActiveColIndex].direction = "";
            }
    
            // Set new itemColumn stuff
            tempItemColumn.active = true;
            if(!tempItemColumn.direction || tempItemColumn.direction === "asc"){
                tempItemColumn.direction = "desc";
            } 
            // TODO: no asc replicas yet, so commenting this out
            // else {
            //     tempItemColumn.direction = "asc";
            // }

            // Get index of new active itemColumn
            const newActiveColIndex = localItemStructure.findIndex(itemColumn => (itemColumn.key === incColumn.key))
            tempItemStructure[newActiveColIndex] = tempItemColumn;
            setLocalItemStructure(tempItemStructure);
        } else {
            toast.warn("Sorry, but you currently can only sort by the 'created' or 'updated' fields in descending order.");
        }
    };

    const getAllItems = async () => {
        setLoading(prevState => ({
            ...prevState,
            allItems: true
        }));

        // Loop through data, check if:
        // - any types are field arrays, if found, add to list so we can convert those when grabbing each doc from firestore! 
        // - for select fields that also pull user data object
        // - for timestamps to convert
        let arrayKeysToConvert = [];
        let selectKeysToConvert = [];
        let timestampKeysToConvert = [];
        localItemStructure.forEach((itemColumn, i) => {
            if (itemColumn.type === DATA_TYPE.ARRAY) {
                arrayKeysToConvert.push(itemColumn.key);
            }
            
            if (itemColumn.type === DATA_TYPE.SELECT && itemColumn.userLookup) {
                selectKeysToConvert.push(itemColumn.key)
            }

            if (itemColumn.type === DATA_TYPE.TIMESTAMP) {
                timestampKeysToConvert.push(itemColumn.key);
            }
        });

        const allItemsTemp = [];
        const allItemsInc = await queryAlgolia(0);
        await allItemsInc.forEach((item) => {
            // TODO: is this a deep copy?
            const itemWithMore = Object.assign({}, item);
            itemWithMore.id = item.objectID;
            itemWithMore.createdString = `${readTimestamp(itemWithMore.created.timestamp).date} @ ${readTimestamp(itemWithMore.created.timestamp).time} by ${itemWithMore.created.name}`;
            itemWithMore.updatedString = `${readTimestamp(itemWithMore.updated.timestamp).date} @ ${readTimestamp(itemWithMore.updated.timestamp).time} by ${itemWithMore.updated.name}`;
            
            if (arrayKeysToConvert.length > 0) {
                arrayKeysToConvert.forEach(async (arrayKey, a) => {
                    let arrayOfObjectsString = "";
                    itemWithMore[arrayKey]?.forEach((arrayObject, o) => {
                        // Create string with each object in this array
                        for (const [key, value] of Object.entries(arrayObject)) {
                            arrayOfObjectsString = arrayOfObjectsString.concat(`${ucFirst(key)}: ${value}, `)
                        }
                        arrayOfObjectsString = arrayOfObjectsString.concat("  |  ");
                        itemWithMore[arrayKey] = arrayOfObjectsString;
                    })
                })
            }

            if (selectKeysToConvert.length > 0) {
                selectKeysToConvert.forEach(async (selectKey, a) => {
                    let objectString = "";
                    let array = [];
                        // Create an array with a string for each key/value pair
                        for (const [key, value] of Object.entries(itemWithMore[selectKey])) {
                            array.push(`${ucFirstLetterEachWord(key)}: ${value}, `)
                        }
                        // Sort the array for consistent output
                        array = array.sort();
                        //Convert to string for output
                        array.forEach(i => {
                            objectString = objectString.concat(i)
                        })
                        objectString = objectString.concat("  |  ");
                        itemWithMore[selectKey] = objectString;
                })
            }

            if (timestampKeysToConvert.length > 0) {
                timestampKeysToConvert.forEach((timestampKey, a) => {
                    if (itemWithMore?.[timestampKey]) {
                        itemWithMore[timestampKey] = `${readTimestamp(itemWithMore[timestampKey]).date} @ ${readTimestamp(itemWithMore[timestampKey]).time}`;
                    }
                })
            }

            allItemsTemp.push(itemWithMore);
        });

        // We need to remove the timestamps we use for sorting, since they aren't human readable and we have the strings created above
        let tempItemStructure = [...localItemStructure];
        const indexOfCreated = tempItemStructure.findIndex(itemColumn => (itemColumn.key === "created"));
        if (indexOfCreated > -1) { 
            tempItemStructure.splice(indexOfCreated, 1); 
        }

        const indexOfUpdated = tempItemStructure.findIndex(itemColumn => (itemColumn.key === "updated"));
        if (indexOfUpdated > -1) { 
            tempItemStructure.splice(indexOfUpdated, 1); 
        }
    
        // Now add in the string headers so we know to show these that we converted when we grabbed data from Firestore doc
        tempItemStructure.unshift({
            key: "createdString",
            label: "Created"
        });
        
        tempItemStructure.unshift({
            key: "updatedString",
            label: "Updated"
        });

        console.log("tempItemStructure: ")
        console.log(tempItemStructure)
        console.log("allItemsTemp: ")
        console.log(allItemsTemp)
        
        setAllItemHeaders(tempItemStructure);
        setAllItem(allItemsTemp);

        setLoading(prevState => ({
            ...prevState,
            allItems: false
        }));
    };

    // Item Writing // 
    useEffect(() => {
        // if update item edit, we want to grab the values from the database to populate in the form
        console.log("updatingItem useEffect triggered!");
        if (updatingItem && !fetched.itemWrite) {
            // console.log("We truly are updating an item and this is the first fetched updateItem!")
            let tempValues = setItemForm.getValues();

            localItemStructure.forEach((itemColumn, d) => {
                if (!itemColumn.uneditable) {
                    // Creating, so just grab the initialArrayField from itemStructure declaration, dont want overwritten values pulled from database
                    if (itemColumn.userLookup) {
                        // User lookup needed at top level
                        tempValues[itemColumn.key] = updatingItem[itemColumn.key]?.id ?? "";
                    } else if (itemColumn.subColumns) {
                        // User lookup needed at lower level
                        // Loop through each column in the structure and see if we have any with userLookup flag
                        itemColumn.subColumns.forEach((subColumn, s) => {
                            if (subColumn.userLookup) {
                                // Found flag, so lets now loop through each entry and replace the user object with the ID instead
                                updatingItem[itemColumn.key].forEach((entry, e) => {
                                    tempValues[itemColumn.key][e][subColumn.key] = entry.id;
                                })
                            } else if (subColumn.productLookup) {
                                // Found flag, so lets now loop through each entry and replace the product object with the ID instead
                                updatingItem[itemColumn.key].forEach((entry, e) => {
                                    tempValues[itemColumn.key][e][subColumn.key] = entry.name;
                                })
                            }
                        })
                    } else if (props.itemCollection === ITEMS.ROLES.COLLECTION && itemColumn.key === "filter") {
                        if (updatingItem[itemColumn.key].columnValues) {
                            const expandedColumnValues = [];
                            updatingItem[itemColumn.key].columnValues.forEach((entry) => {
                                expandedColumnValues.push({
                                    columnValue: entry,
                                });
                            })
        
                            // console.log("expandedColumnValues: ");
                            // console.log(expandedColumnValues);
        
                            tempValues[itemColumn.key].columnValues = expandedColumnValues;
                        }
    
                        if (updatingItem[itemColumn.key].depKeys) {
                            const expandedDepKeys = [];
                            updatingItem[itemColumn.key].depKeys.forEach((entry) => {
                                expandedDepKeys.push({
                                    depKey: entry,
                                });
                            })
        
                            // console.log("expandedDepKeys: ")
                            // console.log(expandedDepKeys)
        
                            tempValues[itemColumn.key].depKeys = expandedDepKeys;
                        }
                            
                    } else if (props.itemCollection === ITEMS.USERS.COLLECTION) {
                        // Update role and admin dropdown to populate with current user role
                        if (itemColumn.key === "role") {
                            // Lookup user by ID in roles array and put as selected option
                            let usersRole = null;
                            for (const [key, value] of Object.entries(props.rolesAndUsers)) {
                                // console.log(`Checking Role "${key}": with array of users: `);
                                // console.log(value);
                                // console.log("Looking for objectID of " + updatingItem.objectID);
                                const foundUserInARole = value.find(user => user.id === updatingItem.objectID);
                                if (foundUserInARole) {
                                    // Found a user in a role, so break from loop
                                    // console.log("User found in role: " + usersRole);
                                    usersRole = key;
                                    break;
                                }
                            }
                            tempValues[itemColumn.key] = usersRole;
                        } else {
                            console.log("Defaulted role grab for editing user, this shouldn't really happen...")
                        }
                    } else {
                        // No conversion needed before pushing to form values
                        tempValues[itemColumn.key] = updatingItem[itemColumn.key];
                    }

                    // Check if itemCol has dependency and that dependency is filled out, then need to set initial options
                    if (itemColumn.dependency && tempValues[itemColumn.dependency]) {
                        // Below logic is copied from watchSub section
                        const dependentOptions = [];
                        
                        const dependent = props.dependents.filter(dep => dep.childKey === itemColumn.key)[0];
                        // Find the parent object by user's selection
                        dependent.parentArray.forEach((obj, o) => {
                            if (obj.name === tempValues[itemColumn.dependency] && obj?.[dependent.parentArrayOptionArrayKey]){
                                // Usually an array of objects, like contacts, so search thru and only grab the label we need, can't use an object as the option label
                                obj?.[dependent.parentArrayOptionArrayKey].forEach((optionObj, op) => {
                                    dependentOptions.push(optionObj[dependent.parentArrayOptionLabelKey]);
                                })
                            }
                        })
                        // console.log("dependentOptions: ");
                        // console.log(dependentOptions);
                        // Now we want to fill the child with these specific options that the user selected for the parent 
                        let tempItemStructure = [...localItemStructure];
                        const indexOfChildToUpdate = localItemStructure.findIndex(itemColumn => (itemColumn.key === dependent.childKey));
                        tempItemStructure[indexOfChildToUpdate].options = dependentOptions;
                        setLocalItemStructure(tempItemStructure);
                    }
                }
            })
            
            setItemForm.reset(tempValues);
            setUpdatingItem(tempValues);
            setFetched(prevState => ({
                ...prevState,
                itemWrite: true
            }));
        }
    }, [setItemForm, localItemStructure, updatingItem, props.dependents, fetched.itemWrite, props.itemCollection, props.rolesAndUsers]);

    useEffect(() => {
        // This effect should only trigger if any fields become dirty
        const watchSub = watchForm((value, { name, type }) => {
            if (props.dependents) {
                props.dependents.forEach((dependent, d) => {
                    // ** if there is multiple dependents and just 1 dependent input changes, what will happen to the other dependents?
                    // Only fill if the parent key is dirty
                    if (name === dependent.parentKey) {
                        // Lets get the current value selected by parent
                        const currentValueOfParent = setItemForm.getValues(dependent.parentKey); // ** what happens if this field by key doesnt exist?
                        // console.log("currentValueOfParent: " + currentValueOfParent);
                        const dependentOptions = [];
                        // Find the parent object by user's selection
                        dependent.parentArray.forEach((obj, o) => {
                            if (obj.name === currentValueOfParent && obj?.[dependent.parentArrayOptionArrayKey]){
                                // Usually an array of objects, like contacts, so search thru and only grab the label we need, can't use an object as the option label
                                obj?.[dependent.parentArrayOptionArrayKey].forEach((optionObj, op) => {
                                    dependentOptions.push(optionObj[dependent.parentArrayOptionLabelKey]);
                                })
                            }
                        })
                        // console.log("dependentOptions: ");
                        // console.log(dependentOptions);
                        // Now we want to fill the child with these specific options that the user selected for the parent 
                        let tempItemStructure = [...localItemStructure];
                        const indexOfChildToUpdate = localItemStructure.findIndex(itemColumn => (itemColumn.key === dependent.childKey));
                        tempItemStructure[indexOfChildToUpdate].options = dependentOptions;
                        setLocalItemStructure(tempItemStructure);
                    }
                })
            }
        });

        return () => watchSub.unsubscribe();
    }, [watchForm, setItemForm, localItemStructure, props.dependents]);
    
    const submitItemWrite = async (incItem, writeType) => {
        setSubmitting(prevState => ({
            ...prevState,
            itemWrite: true
        }));

        console.log("Submitting incoming write item...");
        console.log(incItem);

        const defaultItemProperties = { flags: { recreated: false } }
        // Creating finalItem set of item from form plus any generated or empty values based on itemStructure 
        const finalItem = await _.merge(incItem, defaultItemProperties);
        finalItem.flags.recreated = false;

        // Get current time to use in this function
        const currentTime = Date.now();

        // Remove whitespace from name, then check if anything was removed so we can alert user that the name had whitespace in it
        const whitespaceTrimmedName = finalItem.name ? finalItem.name.trim() : "";

        // Check if user collection "role" update so we can push to superDocs AND don't do anything else on itemWrite since we currently CANNOT update a user as an admin yet
        // Write to the current superDocs collection to be verified on the backend.
        if (writeType === CRUD.UPDATE && props.itemCollection === ITEMS.USERS.COLLECTION) {
            // If its the users collection and we are updating the role field, take a whole different route than a normal itemManager update.
            if (updatingItem.role !== incItem.role) {
                // Custom role change
                addDoc(collection(firestore, ITEMS.USERS.COLLECTION, props.user.id, "superDocs"), {
                    superType: ADMIN.ROLE,
                    id: incItem.objectID,
                    email: incItem.email,
                    name: `${incItem.firstName} ${incItem.lastName}`,
                    role: incItem.role,
                    prevRole: updatingItem?.role ?? "",
                    timestamp: Date.now(),
                    updatedBy: {
                        id: props.fireUser.uid,
                        email: props.fireUser.email,
                        name: props.fireUser.displayName,
                    },
                }).then(async () => {
                    console.log("Successful add of new role to super doc to Firestore.");
                    // Reset editor stuffies
                    setSubmitted(prevState => ({
                        ...prevState,
                        itemWrite: true
                    }));
                    toast.success(`Item ${ucFirst(props.itemName)} written successfully!`);
                    toggleEditor("");
                    setItemForm.reset();

                    // Remove previous ID from list so we only have the new one added in to table
                    let tempItems = [...items];
                    tempItems = tempItems.filter(item => item.objectID !== updatingItem.objectID);
                    await setItems(tempItems);
                    let newItem = Object.assign({}, incItem);
                    newItem.new = true;
                    newItem.update = {
                        timestamp: currentTime,
                        id: props.fireUser.uid,
                        email: props.fireUser.email,
                        name: props.fireUser.displayName,
                        summary: "N/A",
                    };
                    // Add new item to existing table
                    setItems(prevArray => [newItem, ...prevArray]);
                    setSubmitting(prevState => ({
                        ...prevState,
                        itemWrite: false
                    }));
                }).catch((error) => {
                    console.error("Error adding superDocs doc role: ", error);
                });
            }
        } else if (whitespaceTrimmedName && whitespaceTrimmedName !== finalItem.name) {
            toast.error("Looks like you left some white space behind or in front of the name string, please remove the whitespace to submit.")
            setSubmitting(prevState => ({
                ...prevState,
                itemWrite: false
            }));
        } else {
            // Created needs to conditionally check if update write type cuz then we are just setting to itself again
            // **not sure why we can't just do NOTHING here, but worth removing later, and seeing if breaks
            finalItem.created = {
                timestamp: (writeType === CRUD.UPDATE && updatingItem ? updatingItem.created.timestamp : currentTime),
                id: (writeType === CRUD.UPDATE && updatingItem ? updatingItem.created.id : props.fireUser.uid),
                email: (writeType === CRUD.UPDATE && updatingItem ? updatingItem.created.email : props.fireUser.email),
                name: (writeType === CRUD.UPDATE && updatingItem ? updatingItem.created.name : props.fireUser.displayName),
            };

            // "reserved words"
            // Delete these filter keys from the finalItem object before writing to Firestore because we are flattening and reading them
            if (finalItem["filter.columnValues"]) {
                delete finalItem["filter.columnValues"];
            }

            if (finalItem["filter.depKeys"]) {
                delete finalItem["filter.depKeys"];
            }

            if (finalItem["_highlightResult"]) {
                delete finalItem["_highlightResult"];
            }

            if (finalItem["new"]) {
                delete finalItem["new"];
            }

            // Delete in fields iwth a period in them which was popping up from an array within an object.
            for (let key in finalItem) {
                if (key.includes(".")) {
                  delete finalItem[key];
                }
            }

            // For recording summary of changed values
            const exceptionChangedProps = ["updated", "created", "flags"];

            console.log("localItemStructure: ")
            console.log(localItemStructure)
            // Loop through itemStructure to check for keys that may already exist in the incoming item object from the form.
            // If they don't exist, we want to put a base value in that key-value
            localItemStructure.forEach((itemColumn, c) => {
                if (((itemColumn.key in incItem) && incItem[itemColumn.key]) || itemColumn.key === "updated" || itemColumn.key === "created" || itemColumn.isBool) {
                    // Dont need to generate a base value if it already existed in item from form, but may need to change some base values
                    // created and updated values are changed a few lines up manually
                    // console.log(itemColumn.key + " filled with item value already");

                    // TODO: eventually transition this to lookup any collection values passed in from structure
                    if (itemColumn.userLookup) {
                        exceptionChangedProps.push(itemColumn.key); // since these will always change cuz they are updated, dont count them as a change
                        // If user lookup in upper level, we want to push the user object to database instead of just the userId
                        const foundUser = props.users.find(user => user.id === finalItem[itemColumn.key]);
                        finalItem[itemColumn.key] = foundUser;
                        console.log(itemColumn.key + " needed userLookup at top level!");
                    } 
                    // else if (itemColumn.productLookup) {
                    //     exceptionChangedProps.push(itemColumn.key); // since these will always change cuz they are updated, dont count them as a change
                    //     let foundProducts = [];
                    //     finalItem[itemColumn.key].forEach((product, p) => {
                    //         let foundProduct = props.products.find(prod => prod.objectID === product);
                    //         foundProduct.quantity = product.quantity;
                    //         foundProducts.push(foundProduct);
                    //     });
                    //     finalItem[itemColumn.key] = foundProducts;
                    // }

                    if (itemColumn.subColumns && itemColumn.subColumns.some(subColumn => subColumn.userLookup)) {
                        console.log(itemColumn.key + " needed userLookup at subColumn level!");
                        // If userLookup exists in any subColumns, we need to change those too!
                        itemColumn?.subColumns.forEach((subColumn, s) => {
                            // loop through subColumns, only change those with a userLookup flag
                            if (subColumn.userLookup) {
                                console.log("userLookup flag found on subColumn: " + subColumn.key);
                                // Now loop through user entries
                                finalItem[itemColumn.key].forEach((entry, e) => {
                                    console.log("entry[subColumn.key]: " + entry[subColumn.key]);
                                    const foundSubColUser = props.users.find(user => user.id === entry[subColumn.key]);
                                    
                                    console.log("foundSubColUser: ");
                                    console.log(foundSubColUser)
                                    finalItem[itemColumn.key][e] = foundSubColUser;
                                })
                            }
                        })
                    } else if (itemColumn.subColumns && itemColumn.subColumns.some(subColumn => subColumn.productLookup)) {
                        console.log(itemColumn.key + " needed productLookup at subColumn level!");
                        // If productLookup exists in any subColumns, we need to change those too!
                        itemColumn?.subColumns.forEach((subColumn, s) => {
                            // loop through subColumns, only change those with a productLookup flag
                            if (subColumn.productLookup) {
                                console.log("productLookup flag found on subColumn: " + subColumn.key);
                                // Now loop through user entries
                                finalItem[itemColumn.key].forEach((entry, e) => {
                                    console.log("entry[subColumn.key]: " + entry[subColumn.key]);
                                    let foundSubColProduct = props.products.find(product => product.name === entry[subColumn.key]);
                                    foundSubColProduct.quantity = entry.quantity;
                                    console.log("foundSubColProduct: ");
                                    console.log(foundSubColProduct)
                                    finalItem[itemColumn.key][e] = foundSubColProduct;
                                })
                            }
                        })
                    }

                    // This converts "boolean strings" from react-hook-form into booleans for fstorage
                    if (itemColumn.isBool) {
                        const convertedBool = (incItem[itemColumn.key] === "true" || incItem[itemColumn.key] === true);
                        finalItem[itemColumn.key] = convertedBool;
                    }

                    if (itemColumn.nestedColumns) {
                        itemColumn.nestedColumns.forEach((nestedColumn) => {
                            if (nestedColumn.isBool) {
                                finalItem[itemColumn.key][nestedColumn.key] = (incItem[itemColumn.key][nestedColumn.key] === "true" || incItem[itemColumn.key][nestedColumn.key] === true);
                            }
                        })
                    }

                    // We need to flatten the flatten the object array into a string array on export to firebase and on import from firebase expand from string array to object array
                    // This is because firestore.rules needs to see a flat array of strings, not objects, but RHF fieldArray only pushes an array of objects not strings. 
                    // https://github.com/react-hook-form/react-hook-form/discussions/9481#discussioncomment-4279101
                    if (props.itemCollection === ITEMS.ROLES.COLLECTION && itemColumn.key === "filter") {
                        if (finalItem[itemColumn.key].columnValues) {
                            const flattenedColumnValues = [];
                            finalItem[itemColumn.key].columnValues.forEach((entry) => {
                                flattenedColumnValues.push(entry.columnValue);
                            })
        
                            console.log("flattenedColumnValues: ")
                            console.log(flattenedColumnValues)
        
                            finalItem[itemColumn.key].columnValues = flattenedColumnValues;
                        }

                        if (finalItem[itemColumn.key].depKeys) {
                            const flattenedDepKeys = [];
                            finalItem[itemColumn.key].depKeys.forEach((entry) => {
                                flattenedDepKeys.push(entry.depKey);
                            })
        
                            console.log("flattenedDepKeys: ")
                            console.log(flattenedDepKeys)
        
                            finalItem[itemColumn.key].depKeys = flattenedDepKeys;
                        }
                    }
                } else if (!(itemColumn.key in incItem) || incItem[itemColumn.key] === undefined || !incItem[itemColumn.key]) {
                    // If that itemStructure key doesnt exist in the item from the form OR if undefined then we need to set it to empty for now
                    // Note that this may be able to be bypassed, but I like to generate the values I will use initially, so I explicitly know they are empty, vs just undefined.
                    console.log(itemColumn.key + " filled with empty value.");
                    finalItem[itemColumn.key] = "";

                    if ((writeType === CRUD.UPDATE) && props.isUnique && (finalItem.name !== updatingItem.name)) {
                        // We are recreating this doc with new ID, so if that itemStructure key doesnt exist in the item from the form, then we need to set it to the non-editable value from the existing doc
                        // console.log(itemColumn.key + " filled with previous value of " + updatingItem[itemColumn.key]);
                        finalItem[itemColumn.key] = updatingItem[itemColumn.key];
                    } else {
                        // Value was not added to finalItem to update on Firestore, because it already exists on Firestore and won't be overwritten!
                        // console.log(itemColumn.key + " doesn't need to be updated!");
                    }
                } else {
                    console.error(itemColumn.key + " has default key-value finalItem on item create: " + incItem[itemColumn.key] + ". This usually shouldnt happen.")
                }
            });
            
            let changedValues = {};
            if (writeType === CRUD.UPDATE) {
                // If item is being updated, lets count all changed values to add count to summary
                changedValues = countChangedValues(finalItem, updatingItem, exceptionChangedProps);
                console.log("changedValues: ");
                console.log(changedValues);
            }

            // Last update timestamp is always the currentTime this change is made
            finalItem.updated = {
                timestamp: currentTime,
                id: props.fireUser.uid,
                email: props.fireUser.email,
                name: props.fireUser.displayName,
                summary: writeType === CRUD.CREATE ? `Created new ${props.itemName}.` : `Updated ${changedValues.count} values for this ${props.itemName} with keys of [${(changedValues.propKeys).toString()}].`
            };

            console.log("finalItem: ");
            console.log(finalItem);

            // itemWrite that IS unique
            // Checking if isUnique and if update, if name is being changed, then pushing to firestore
            if ((writeType === CRUD.CREATE && props.isUnique) || (writeType === CRUD.UPDATE && props.isUnique && finalItem.name !== updatingItem.name)) {
                if (props.itemCollection === ITEMS.ROLES.COLLECTION && RESERVED_ROLES.some(role => finalItem.name === role) && finalItem.name.includes("'")) {
                    toast.error("Sorry, but that role name is a reserved name and/or cannot contain an apostrophe. Try a new name to continue.");
                    setSubmitting(prevState => ({
                        ...prevState,
                        itemWrite: false
                    }));
                } else {
                    const newItemDocRef = doc(firestore, props.itemCollection, finalItem.name);
                    let oldItemDocRef = "";
                    if (writeType === CRUD.UPDATE) {
                        // We will need to reference the old document 
                        oldItemDocRef = doc(firestore, props.itemCollection, updatingItem.name);
                    }

                    // We need to make an authenticated called to check if value is unique. This call also checks if the user has permission to write to this collection.
                    const checkIsUnique = httpsCallable(functions, "checkItemValueUnique");
                    const uniqueResponse = await checkIsUnique({ itemKey: props.itemCollection, value: finalItem.name });
                    console.log("uniqueResponse: ");
                    console.log(uniqueResponse.data);
                    if(!uniqueResponse.data.allowCreate){
                        console.error("Response message: " + uniqueResponse.data.message);
                        toast.error(`It is likely that another '${props.itemName}' item with this name already exists, but these item names must be unique. Please try another name.`);
                        setSubmitting(prevState => ({
                            ...prevState,
                            itemWrite: false
                        }));
                    } else {
                        if (writeType === CRUD.UPDATE) {
                            // let reFinalData = { ...finalItem, flags: { recreated: updatingItem.objectID } };
                            // ** Does the below work if flags OR recreated doesnt exist yet?
                            finalItem.flags.recreated = updatingItem.objectID;
        
                            // Need old role users so we can replace them on the new creation!
                            if (props.itemCollection === ITEMS.ROLES.COLLECTION) {
                                const privateDocRef = doc(firestore, "site", "private");
                                const privateDocSnap = await getDoc(privateDocRef);
                                if (privateDocSnap.exists()) {
                                    console.log("Super doc for data on roles recreated changes like old users, etc: ", privateDocSnap.data());
        
                                    // Create doc ref for ID
                                    const superDocRef = doc(collection(firestore, ITEMS.USERS.COLLECTION, props.user.id, "superDocs"));
        
                                    // Set ID as recreated to be read on backend to lookup which superDoc to reference for this OLD ROLE USERS to replace
                                    finalItem.flags.recreated = {
                                        superDocId: superDocRef.id,
                                        userId: props.user.id,
                                        oldDocId: updatingItem.objectID, // currently unused, but good to store for record
                                    }
        
                                    // Add super doc for this so we can remember what the changes were
                                    await setDoc(superDocRef, {
                                        superType: ADMIN.RECREATED,
                                        id: props.user.id,
                                        email: props.user.email,
                                        name: `${props.user.firstName} ${props.user.lastName}`,
                                        oldRoleUsers: [...privateDocSnap.data()?.[updatingItem.objectID]],
                                        role: incItem.name,
                                        timestamp: Date.now(),
                                    }).then(() => {
                                        console.log("Successful add of old role users to super doc to Firestore.");
                                    }).catch((error) => {
                                        console.error("Error adding old role users superDocs doc: ", error);
                                    });
                                } else {
                                    // doc.data() will be undefined in this case
                                    console.log("No such document for private!");
                                }
                            }
        
                            // We need to set "recreating" for these docs so we can use this flag to catch race conditions of changes that doc ID/name passed
                            // Needed this for the role being deleted AFTER resetting the new role for the user, the timing was off because we are unsetting that in onDeleted server listener
                            await updateDoc(oldItemDocRef, {
                                recreating: finalItem.name,
                            }).then(() => {
                                console.log("Successful write of recreating to old item doc.");
                            }).catch((error) => {
                                console.error("Error write of recreating to old item doc: " + error);
                                toast.error(`Error setting old item document recreating value. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                            });
                        }
        
                        setDoc(newItemDocRef, finalItem).then(async (doc) => {
                            setSubmitting(prevState => ({
                                ...prevState,
                                itemWrite: false
                            }));
                            setSubmitted(prevState => ({
                                ...prevState,
                                itemWrite: true,
                                files: false
                            }));
                            toast.success(`Item ${ucFirst(props.itemName)} written successfully!`);
                            toggleEditor("");
                            setItemForm.reset();
                            if (writeType === CRUD.UPDATE) {
                                // On updating doc, we need to delete the old doc
                                // backend will decrement then increment again
                                deleteDoc(oldItemDocRef).then(() => {
                                    console.log("Successful delete of doc on firestore");
                                }).catch((error) => {
                                    console.error("Error deleting item: ", error);
                                    toast.error(`Error deleting item. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                                });

                                // Remove previous ID from list so we only have the new one added in below if its an update
                                let tempItems = [...items];
                                tempItems = tempItems.filter(item => item.objectID !== updatingItem.objectID);
                                await setItems(tempItems);
                            } else {
                                // Create, so lets add 1 to list shown
                                setTotalItems(totalItems+1);
                            }

                            finalItem.objectID = newItemDocRef.id;
                            finalItem.new = true;
                            console.log("newItemDocRef.id:" + newItemDocRef.id)
                            // Add new item to existing table
                            setItems(prevArray => [finalItem, ...prevArray]);
                            
                        }, {merge: true}).catch(error => {
                            toast.error(`Error writing ${props.itemName}. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                            console.error("Error writing item: " + error);
                            setSubmitting(prevState => ({
                                ...prevState,
                                itemWrite: false
                            }));
                        });
                    }
                }
            } else {
                // itemWrite that is NOT unique
                let writeRef = "";
                if (writeType === CRUD.CREATE) {
                    writeRef = doc(collection(firestore, props.itemCollection));
                    setTotalItems(totalItems+1);
                } else if (writeType === CRUD.UPDATE) {
                    writeRef = doc(firestore, props.itemCollection, updatingItem.objectID);
                } else {
                    console.error("Invalid writeRef!");
                }
                
                setDoc(writeRef, finalItem).then(async (doc) => {
                    setSubmitting(prevState => ({
                        ...prevState,
                        itemWrite: false
                    }));
                    setSubmitted(prevState => ({
                        ...prevState,
                        itemWrite: true,
                        files: false
                    }));
                    toast.success(`Item ${ucFirst(props.itemName)} written successfully!`);
                    toggleEditor("");
                    setItemForm.reset();

                    // Remove previous ID from list so we only have the new one added in to table
                    let tempItems = [...items];
                    tempItems = tempItems.filter(item => item.objectID !== updatingItem.objectID);
                    await setItems(tempItems);
                    finalItem.objectID = writeRef.id;
                    finalItem.new = true;
                    // Add new item to existing table
                    setItems(prevArray => [finalItem, ...prevArray]);
                }, {merge: true}).catch(error => {
                    toast.error(`Error writing ${props.itemName}. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
                    console.error("Error writing item: " + error);
                    setSubmitting(prevState => ({
                        ...prevState,
                        itemWrite: false
                    }));
                });
            }

            console.log("Submitted: "); // Only putting this here so submitted var doesnt throw warning for being unused.
            console.log(submitted)
        }
    }

    const submitDeleteItem = async (index) => {
        const itemId = items[index].objectID;
        let tempItems = [...items];
        const splicedValue = tempItems.splice(index, 1);
        console.log("Deleting " + splicedValue.objectID);
        await deleteDoc(doc(firestore, props.itemCollection, itemId)).then(() => {
            toast.success("Item deleted!");
            console.log("Successful delete of doc on firestore");
            setItems(tempItems);
            setTotalItems(totalItems-1);
        }).catch((error) => {
            console.error("Error deleting item: ", error);
            toast.error(`Error deleting item. Please try again or if the problem persists, contact ${props?.site?.emails?.support ?? "help@minute.tech"}.`);
        });
    }

    const toggleEditor = (type = "", item = "", i = 0) => {
        // Reset values first
        if (type === "update") {
            setItemForm.reset({});
            toggleModal(false, i); 
            setUpdatingItem(item); // ** this doesnt seem to be doing anything
            setItemForm.reset(item);
            
            // setFetched to false again so we can reget dependents, timestamp conversions, etc
            setFetched(prevState => ({
                ...prevState,
                updateItem: false,
                itemWrite: false,
            }));
            
        } else if (!type || (type === "create" && isEditorShown === "update")) {
            // if unsetting OR if going from updating to creating, make sure we reset
            setUpdatingItem("");
            setItemForm.reset({});
        } 

        setIsEditorShown(type);

        if ((type === "update" || type === "create") && editorRef.current) {
            // Slight delay is needed since the editor section isn't in the document flow initially.
            scrollTimer.current = setTimeout(() => {
                editorRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        }
    }

    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals];
        tempShownModals[index] = newStatus;
        setShownModals(tempShownModals);
    };

    useEffect(() => {
        // unsubbing from timer ref
        return () => {clearTimeout(scrollTimer.current)};
    }, [scrollTimer]);

    if (props.itemCollection === "feedback" && loading.feedbackAverage) {
        return (
            <>
            <Helmet>
                <title>{props.pageTitle} {props.site.name ? `| ${props.site.name}` : ""}</title>
            </Helmet>
            <H2>Loading feedback average... <Spinner /> </H2> 
            </>
        )
    } else {
        let rowCount = 0;
        return (
            <>
                <Helmet>
                    <title>{props.pageTitle} {props.site.name ? `| ${props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/dashboard/admin">
                    <Button type="button">
                        <FaChevronLeft />
                        &nbsp; Back to Admin Dashboard
                    </Button>
                </LLink>
                <H1 margin="10px 0">{props.pageTitle}: {totalItems || 0}</H1>
                {!(totalItems === 0 && search.term === "") && (
                    <form onSubmit={ searchForm.handleSubmit(submitSearch) }>
                        <Grid fluid>
                            <Row justify="center" align="center">
                                <Column md={12} lg={8}>
                                    <SearchContainer>
                                        <FaSearch />
                                        <TextInput
                                            type="text"
                                            error={searchForm.formState.errors.term}
                                            placeholder={`Search by item keywords here`}
                                            {
                                                ...searchForm.register("term", { 
                                                        required: "Please enter a search term!",
                                                        maxLength: {
                                                            value: 50,
                                                            message: "The search term can only be 50 characters long."
                                                        },
                                                        minLength: {
                                                            value: 2,
                                                            message: "The search term must be at least 2 characters long."
                                                        },
                                                    }
                                                )
                                            } 
                                        />
                                    </SearchContainer>
                                </Column>
                                <Column md={12} lg={4}>
                                    <Button 
                                        type="submit" 
                                        disabled={submitting.search}
                                    >
                                        Search 
                                    </Button>
                                    {search.term && (
                                        <Button 
                                            type="button"
                                            btype={BTYPES.INVERTED}
                                            color={theme.color.yellow}
                                            onClick={() => clearSearch()}
                                        >
                                            Clear
                                        </Button>
                                    )}
                                </Column>
                            </Row>
                            <Row>
                                <Column sm={12} textalign="center">
                                    <FormError error={searchForm.formState.errors.term} /> 
                                </Column>
                            </Row>
                        </Grid>
                    </form>
                ) }
                {(totalItems === 0 && !loading.items) && <Body color={theme.color.red} bold size={SIZES.LG}>No results found!</Body>}
                {(loading.items) && (<Body>Loading items... <Spinner /></Body>)}
                {(totalItems !== 0) && (
                    <>
                    <OverflowXAuto>
                        <Table columnHover={columnHover}>
                            <Thead>
                                <Tr>
                                    <Th onMouseOver={()=> handleColumnHover(1)}
                                        onMouseLeave={() => handleColumnHover(0)}
                                    >
                                        ID
                                    </Th>
                                    
                                    {localItemStructure.filter(itemColumn => (itemColumn.shown === true)).map((itemColumn, c) => {
                                        if (itemColumn.key === "updated" || itemColumn.key === "created") {
                                            // Sortable columns
                                            return (
                                                <Th
                                                    key={c} 
                                                    onClick={() => toggleCol(itemColumn)}
                                                    active={itemColumn.active}
                                                    sortable={true}
                                                    onMouseOver={() => handleColumnHover(c + 2)}
                                                    onMouseLeave={() => handleColumnHover(0)}
                                                >
                                                    {itemColumn.label} <ColChevron itemColumn={itemColumn} />
                                                </Th>
                                            )
                                        } else {
                                            // Not sortable columns
                                            return (
                                                <Th 
                                                    key={c}
                                                    onMouseOver={() => handleColumnHover(c + 2)}
                                                    onMouseLeave={() => handleColumnHover(0)}
                                                >
                                                    {itemColumn.label} <ColChevron itemColumn={itemColumn} />
                                                </Th>
                                            )
                                        }
                                            
                                        })
                                    }
                                    <Th
                                        noTop={true}
                                    >Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                { (items.length === 0) && (
                                    <Tr>
                                        <Td colSpan={localItemStructure.length + 1} style={{textAlign:"center"}}>
                                            <Body color={theme.color.red}>No results</Body>
                                        </Td>
                                    </Tr>
                                )}
                                { (loading.items) && (
                                    <Tr>
                                        <Td colSpan={localItemStructure.length + 1} style={{textAlign:"center"}}>
                                            <Body color={theme.color.green}>Loading... <Spinner /></Body>
                                        </Td>
                                    </Tr>
                                )}
                                { !loading.items && items.length !== 0 && items.map((item, i) => {
                                    rowCount++;
                                    return (
                                        <Tr key={i} color={item.new ? transparentize(0.7, theme.color.green) : ""}>
                                            <Td
                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                            >
                                                {item.objectID}
                                            </Td>
                                            {
                                                localItemStructure.filter(itemColumn => (itemColumn.shown === true)).map((itemColumn, c) => {
                                                    // ** You may need to edit these conditionals below if you want to render something custom in a cell!
                                                    if (itemColumn.userLookup) {
                                                        const foundUser = props.users.find(user => user.id === item[itemColumn.key]?.id ?? "");
                                                        if(foundUser){
                                                            return (
                                                                <Td key={`${c}-${i}`}
                                                                    className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                                >
                                                                    {foundUser.name}
                                                                </Td>
                                                            )
                                                        } else {
                                                            return (
                                                                <Td key={`${c}-${i}`}
                                                                    className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                                >
                                                                    Not found
                                                                </Td>
                                                            )
                                                        }
                                                    } else if (itemColumn.key === "created") {
                                                        return (
                                                            <Td key={`${c}-${i}`}
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                            >
                                                                {readTimestamp(item.created?.timestamp ?? "").date} @&nbsp;
                                                                {readTimestamp(item.created?.timestamp ?? "").time}
                                                            </Td>
                                                        )
                                                    } else if (itemColumn.key === "updated") {
                                                        return (
                                                            <Td key={`${c}-${i}`}
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                            >
                                                                {readTimestamp(item.updated?.timestamp ?? "").date} @&nbsp;
                                                                {readTimestamp(item.updated?.timestamp ?? "").time}
                                                            </Td>
                                                        )
                                                    } else if (itemColumn.key === "emotionSymbol") {
                                                        // Feedback data
                                                        return (
                                                            <Td key={`${c}-${i}`}
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                            >
                                                                {renderEmotion(item.rangeValue)}
                                                            </Td>
                                                        )
                                                    } else if (itemColumn.key === "body" || itemColumn.key === "description") {
                                                        // Longer text sections, just show if these exist or not
                                                        return (
                                                            <Td key={`${c}-${i}`}
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}>
                                                                {item.body ? <Body color={theme.color.green}>Yes</Body> : <Body color={theme.color.red}>No</Body>}
                                                            </Td>
                                                        )
                                                    } else if (itemColumn.isBool) {
                                                        return (
                                                            <Td key={`${c}-${i}`}
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                                            >
                                                                {item[itemColumn.key] ? <Body color={theme.color.green}>Yes</Body> : <Body color={theme.color.red}>No</Body>}
                                                            </Td>
                                                        )
                                                    } else {
                                                        // Normal value 
                                                        // Adding an onclick to sort collection by value of clicked field
                                                        return (
                                                            <Td 
                                                                key={`${c}-${i}`}
                                                                onClick={(item[itemColumn.key] && !nonSearchable.includes(itemColumn.key)) ?
                                                                    () => [setSearchParams({term: item[itemColumn.key]}), setSearch({term: item[itemColumn.key]})]
                                                                    :
                                                                    undefined 
                                                                }
                                                                style={(item[itemColumn.key] && !nonSearchable.includes(itemColumn.key)) ?
                                                                    {cursor: 'pointer'}
                                                                    :
                                                                    undefined
                                                                }
                                                                className={(items.length === (rowCount)? "bottom-cell" : null)}

                                                            >
                                                                {item[itemColumn.key]}
                                                            </Td>
                                                        )
                                                    }
                                                })
                                            }
                                            <Td
                                                className={(items.length === (rowCount)? "bottom-cell" : null)}
                                            >
                                                {isEditorShown === "" &&
                                                    <Button
                                                        type="button"
                                                        size={SIZES.SM}
                                                        onClick={() => toggleModal(true, i)}         
                                                    >
                                                        View details
                                                    </Button>
                                                }

                                                {isEditorShown !== "" && updatingItem.objectID === item.objectID &&
                                                    <Body size={SIZES.SM} color={theme.color.green}>Updating...</Body>
                                                }

                                                {isEditorShown === "create" &&
                                                    <Body size={SIZES.SM} color={theme.color.green}>Creating...</Body>
                                                }
                                                   
                                                {shownModals[i] && (
                                                    <DetailModal
                                                        i={i}
                                                        item={item}
                                                        itemType={props.pageTitle.toLowerCase()}
                                                        toggleModal={toggleModal}
                                                        toggleEditor={toggleEditor}
                                                        localItemStructure={localItemStructure}
                                                        setSearch={setSearch}
                                                        searchParams={searchParams}
                                                        setSearchParams={setSearchParams}
                                                        {...props}
                                                    />
                                                )}

                                                {(updatingItem.objectID !== item.objectID && (isEditorShown === "") && (props.itemCollection === ITEMS.ROLES.COLLECTION || (props.itemCollection !== ITEMS.USERS.COLLECTION && checkUserAdminPermission(props.itemCollection, CRUD.DELETE, props.roles, props.customClaims)))) && (
                                                    <Button
                                                        type="button"
                                                        btype={BTYPES.INVERTED} 
                                                        color={theme.color.red}
                                                        size={SIZES.SM}
                                                        onClick={() =>         
                                                            confirmAlert({
                                                                customUI: ({ onClose }) => {
                                                                    return (
                                                                        <ConfirmAlert
                                                                            theme={theme}
                                                                            onClose={onClose} 
                                                                            headingText={`Delete item`}
                                                                            body={`Are you sure you want to delete item with ID of "${item.objectID}" from the database? This action cannot be reverse and is permanent loss of data!`}
                                                                            yesFunc={() => {submitDeleteItem(i)}} 
                                                                            yesText={`Yes`} 
                                                                            noFunc={function () {}} 
                                                                            noText={`No`}   
                                                                        />
                                                                    );
                                                                }
                                                            })}           
                                                    >
                                                        <FaTrash />
                                                    </Button>
                                                )}
                                            </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </OverflowXAuto>
                    <Spacer/>
                    <Grid fluid>
                        <Row align="center" justify="center">
                            <Column sm={12} md={4} textalign="center">
                                {currentPage !== 1 && (
                                    <Button 
                                        size={SIZES.SM}
                                        type="button" 
                                        onClick={() => getPrevPage()}
                                    >
                                        <FaChevronLeft /> Previous page    
                                    </Button>
                                )}
                            </Column>
                            <Column sm={12} md={4} textalign="center">
                                <Body margin="0" size={SIZES.SM}>Showing {items.length} of {totalItems}</Body>
                                {<Body margin="0" size={SIZES.SM}>Page {currentPage} of {totalPages}</Body>}
                                <Body margin="10px 0" size={SIZES.SM}>
                                    {/* Don't show page size selector if totalItems is less than the second page size selection */}
                                    {(!search.term && totalItems > PAGE_SIZES[0]) && (
                                        <>
                                        <PageSelectInput
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(e.target.value)} 
                                        >
                                            { 
                                                PAGE_SIZES.map((size) => {
                                                    return (
                                                        <option key={size} value={size}>{size}</option>
                                                    )
                                                })
                                            }
                                        </PageSelectInput>
                                        &nbsp; items per page
                                        </>
                                    )}
                                </Body>
                            </Column>
                            <Column sm={12} md={4} textalign="center">
                                {(currentPage !== totalPages) && (
                                    <Button 
                                        size={SIZES.SM}
                                        type="button" 
                                        onClick={() => getNextPage()}
                                    >
                                        Next page <FaChevronRight /> 
                                    </Button>
                                )}
                            
                            </Column>
                        </Row>
                        <Row justify={"center"} align={"center"}>
                            <Column sm={12} md={4} textalign="center">
                                { (allItems.length === 0 && !loading.allItems) && (<Button type="button" onClick={() => getAllItems()}>Export all data <BiExport /></Button>) }
                                { loading.allItems && (<Body>Exporting items... <Spinner /> </Body>) }
                                { allItems.length > 0 && !downloadedItems && (
                                    <CSVLink
                                        data={allItems} 
                                        headers={allItemHeaders}
                                        filename={`${process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID}_${allItems.length}_${props.itemCollection}.csv`}
                                        onClick={() => {toast.success("Downloading your items..."); setDownloadedItems(true);}}
                                        style={{textDecoration: "none"}}
                                    >
                                        <Button type="button">Download {allItems.length} items <BiDownload /></Button>
                                    </CSVLink>
                                ) }
                                { downloadedItems && (<Body color={theme.color.green}>Downloaded {allItems.length} items, check downloads folder! <BiCheck /></Body>)}
                            </Column>
                        </Row>
                    </Grid>
                    </>
                )}

                {(totalItems > 0 && feedbackAverage > 0 && !search.term) && (
                    <Row>
                        <Column sm={12} textalign="center">
                            <H3 margin="0">Total Average Rating: <Body margin="0" display="inline"size={SIZES.XS}>(TAR)</Body> {renderEmotion(feedbackAverage, "4em")}</H3>
                            <Body margin="0">{Math.trunc(feedbackAverage)}/100</Body>
                        </Column>
                    </Row>
                )}

                {/* // TODO: Split here into new component? */}
                {/* TODO: What to do if type doesnt really allow for creating, aka no values are editable? */}
                {((!isEditorShown && (props.itemCollection === ITEMS.ROLES.COLLECTION || checkUserAdminPermission(props.itemCollection, CRUD.CREATE, props.roles, props.customClaims)) && !props.noCreate)) && (
                    <Button 
                        type="button" 
                        color={theme.color.green} 
                        onClick={() => toggleEditor("create")}
                    >
                            Create new {props.itemName} &nbsp;<FaPlus />
                    </Button>
                )}

                {isEditorShown && (
                    <>
                    <Button
                        type="button"
                        btype={BTYPES.INVERTED}
                        color={theme.color.red}
                        onClick={() => toggleEditor("")}
                    >
                        Never mind, don't {isEditorShown} {props.itemName}&nbsp;<CgClose />
                    </Button>
                    <Hr />
                    <H1 ref={editorRef}>{ucFirst(isEditorShown)} {props.itemName}</H1>
                    <form onSubmit={ setItemForm.handleSubmit((item) => submitItemWrite(item, isEditorShown)) }>
                        <Grid fluid>
                            <Row>
                                {
                                    localItemStructure.filter(itemColumn => (!itemColumn.uneditable)).map((itemColumn) => {
                                        if ((!itemColumn.dependency || (setItemForm.formState.dirtyFields[itemColumn.dependency]) || isEditorShown === "update") && itemColumn.key !== "updated" && itemColumn.key !== "created") {
                                            if (itemColumn.type === DATA_TYPE.ARRAY && itemColumn.subColumns && itemColumn.defaultArrayFieldStruct) {
                                                // Reasons for a separate input component detailed within!
                                                return (
                                                    <Column
                                                        key={itemColumn.key}
                                                        xs={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XS)}
                                                        sm={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.SM)}
                                                        md={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.MD)}
                                                        lg={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.LG)}
                                                        xl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XL)}
                                                        xxl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XXL)}
                                                        xxxl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XXXL)}
                                                    >
                                                        <CustomArrayInput
                                                            itemColumn={itemColumn}
                                                            setItemForm={setItemForm}
                                                            updatingItem={updatingItem}
                                                            {...props}
                                                        />
                                                    </Column>
                                                )
                                            } else if (itemColumn.type === DATA_TYPE.OBJECT) {
                                                return (
                                                    <CustomObjectInput
                                                        key={itemColumn.key}
                                                        itemColumn={itemColumn}
                                                        setItemForm={setItemForm}
                                                        updatingItem={updatingItem}
                                                        {...props}
                                                    />
                                                )
                                            } else {
                                                return (
                                                    <Column
                                                        key={itemColumn.key}
                                                        xs={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XS)}
                                                        sm={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.SM)}
                                                        md={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.MD)}
                                                        lg={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.LG)}
                                                        xl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XL)}
                                                        xxl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XXL)}
                                                        xxxl={getDefaultBreakpointValue(itemColumn.breakpoints, SIZES.XXXL)}
                                                    >
                                                        <CustomInput 
                                                            key={itemColumn.key}
                                                            itemColumn={itemColumn}
                                                            setItemForm={setItemForm}  
                                                            updatingItem={updatingItem}
                                                            submitting={submitting}
                                                            setSubmitting={setSubmitting}
                                                            submitted={submitted}
                                                            setSubmitted={setSubmitted}
                                                            isEditorShown={isEditorShown}
                                                            {...props}
                                                        />
                                                    </Column>
                                                )
                                            }
                                        } else {
                                            return null;
                                        }
                                    })
                                }
                            </Row>
                            {/* {
                                props.itemCollection === ITEMS.ROLES.COLLECTION && (
                                    <OverflowXAuto>
                                        <Table>
                                            <Thead>
                                                <Tr>
                                                    <Th>
                                                        ID
                                                    </Th>
                                                    { localItemStructure.filter(itemColumn => (itemColumn.shown === true)).map((itemColumn, c) => {
                                                            return (
                                                                <Th 
                                                                    key={c} 
                                                                    onClick={() => toggleCol(itemColumn)}
                                                                    active={itemColumn.active}
                                                                >
                                                                    {itemColumn.label} <ColChevron itemColumn={itemColumn} />
                                                                </Th>
                                                            )
                                                        })
                                                    }
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                    <Tr>
                                                        <Td>
                                                            <Body color={theme.color.red}>Coming soon</Body>
                                                        </Td>
                                                    </Tr>
                                
                                            </Tbody>
                                        </Table>
                                    </OverflowXAuto>
                                )
                            } */}
                            <Hr/>
                            <Row>
                                <Column sm={12} textalign="center">
                                    {/* TODO: this can be refactored to be one button */}
                                    {(!submitting.itemWrite && setItemForm.formState.isDirty) && 
                                        <Button 
                                            type="submit" 
                                            size={SIZES.LG}
                                            disabled={submitting.itemWrite}
                                        >
                                            Submit {isEditorShown === "create" ? "new" : "changes to"} {props.itemName}
                                        </Button>
                                    }
                                    {(!submitting.itemWrite && !setItemForm.formState.isDirty) &&
                                        <Button
                                            type="button"
                                            size={SIZES.LG}
                                            onClick={() => toast.error("There are no form changes to submit.")}
                                        >
                                            Submit {isEditorShown === "create" ? "new" : "changes to"} {props.itemName}
                                        </Button>
                                    }
                                    {submitting.itemWrite && (
                                        <>
                                            <Button
                                                type="button"
                                                size={SIZES.LG}
                                                btype={BTYPES.INVERTED}
                                                color={theme.color.yellow}
                                            >
                                                Submitting... <Spinner />
                                            </Button>
                                        </>
                                    )}
                                </Column>
                            </Row>
                        </Grid>
                    </form>
                    </>
                )}
            </>
        ) 
    }
}
