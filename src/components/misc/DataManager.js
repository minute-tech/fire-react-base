import React, { useEffect, useState} from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, limitToLast, where, updateDoc, deleteDoc, increment, endBefore } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight, FaSearch, FaTrash,  } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useForm } from "react-hook-form";
import { confirmAlert } from 'react-confirm-alert';

import { ModalCard, Hr, OverflowXAuto, Table, Tbody, Td, Th, Thead, Tr, ModalContainer, Grid, Column, Row } from '../../utils/styles/misc';
import { Spinner } from '../../utils/styles/images';
import { Body, H1, H2, H3, LLink } from '../../utils/styles/text';
import { firestore } from '../../Fire';
import { readTimestamp } from '../../utils/misc';
import { BTYPES, SIZES, PAGE_SIZES } from '../../utils/constants.js';
import { PageSelectInput, SearchContainer, SelectInput, TextInput, Button} from '../../utils/styles/forms';
import { ColChevron, FormError } from '../misc/Misc';
import ConfirmAlert from './ConfirmAlert';
import { renderEmotion } from './Feedback';
import { BiDownload, BiExport } from 'react-icons/bi';
import { CSVLink } from 'react-csv';

export default function DataManager(props) {
    const theme = useTheme();
    const [loading, setLoading] = useState({ 
        counts: true,
        items: true,
        allData: false,
    }); 
    const [submitting, setSubmitting] = useState({ 
        search: false,
    }); 
    const searchForm = useForm({
        defaultValues: {
            term: "",
            column: "id"
        }
    });

    const [itemCount, setItemCount] = useState(0);
    const [allData, setAllData] = useState([]);
    const [feedbackAverage, setFeedbackAverage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0]);
    const [items, setItems] = useState([]);
    const [beginCursor, setBeginCursor] = useState("");
    const [finalCursor, setFinalCursor] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [shownModals, setShownModals] = useState([]); 
    const [search, setSearch] = useState({
        column: "",
        term: "",
    }); 

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "counts"), (countsDoc) => {
            if(countsDoc.exists()){
                let countsData = countsDoc.data();
                setLoading(prevState => ({
                    ...prevState,
                    counts: false
                }));
                // Quick check to see if the countsData is an object or a single value
                setItemCount(countsData[props.dataName]?.count ? countsData[props.dataName].count : countsData[props.dataName]);
                setFeedbackAverage(countsData[props.dataName]?.average ? countsData[props.dataName].average : 0);
            } else {
                console.log(`No custom site set, can't properly count ${props.dataName}.`);
                setLoading(prevState => ({
                    ...prevState,
                    counts: false
                }));
            }
        });
    }, [props.dataName]);

    useEffect(() => {
        let currentPageQuery = query(
            collection(firestore, props.dataName),
        );
        if(search.term){
            // __name__ is synonymous with the doc.id we need to query for
            // No limit set on items per page
            currentPageQuery = query(
                currentPageQuery, 
                where(search.column === "id" ? "__name__" : search.column, "==", search.term),
            );
        } else {
            currentPageQuery = query(
                currentPageQuery,  
                orderBy(
                    props.tableCols.find(column => {return column.active;}).key, 
                    props.tableCols.find(column => {return column.active;}).direction
                ),
                limit(itemsPerPage)
            );
        }
        async function fetchItems() {
            const pageDocSnaps = await getDocs(currentPageQuery);
            // Get the last visible document cursor so we can reference it for the next page
            const tempFinalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            
            // Get content from each doc on this page 
            let tempItems = [];
            let tempShownModals = [];
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                tempItems.push(docWithMore);
                tempShownModals.push(false)
            });
    
            setItems(tempItems);
            setFinalCursor(tempFinalCursor);
            setCurrentPage(1);
            setShownModals(tempShownModals);
            setLoading(prevState => ({
                ...prevState,
                items: false
            }));
        };

        fetchItems();
    }, [itemsPerPage, props.tableCols, search, props.dataName]);

    const getAllData = async () => {
        setLoading(prevState => ({
            ...prevState,
            allData: true
        }));
        const q = query(collection(firestore, props.dataName));
        const querySnapshot = await getDocs(q);
        console.log("querySnapshot: ")
        console.log(querySnapshot)
        const allDataTemp = [];
        await querySnapshot.forEach((doc) => {
            const docWithMore = Object.assign({}, doc.data());
            docWithMore.id = doc.id;
            docWithMore.dateTime = `${readTimestamp(docWithMore.timestamp).date} @ ${readTimestamp(docWithMore.timestamp).time}`;
            allDataTemp.push(docWithMore);
        });
        setAllData(allDataTemp);
        setLoading(prevState => ({
            ...prevState,
            allData: false
        }));
    };

    const getPrevPage = async () => {
        if(currentPage !== 1){
            setLoading(prevState => ({
                ...prevState,
                items: true
            }));
            // Construct a new query starting at this document depending if the user is searching or not
            let currentPageQuery = query(
                collection(firestore, props.dataName)
            );
            if(search.term){
                // __name__ is synonymous with the doc.id we need to query for
                currentPageQuery = query(
                    currentPageQuery, 
                    where(search.column === "id" ? "__name__" : search.column, "==", search.term),
                    endBefore(beginCursor),
                );
            } else {
                currentPageQuery = query(
                    currentPageQuery,  
                    orderBy(
                        props.tableCols.find(column => {return column.active;}).key, 
                        props.tableCols.find(column => {return column.active;}).direction
                    ),
                    endBefore(beginCursor),
                    limitToLast(itemsPerPage)
                );
            }
            const pageDocSnaps = await getDocs(currentPageQuery);
            const tempBeginCursor = pageDocSnaps.docs[ 0 ];
            const tempFinalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const prevPage = currentPage - 1;

            // Set data in docs to state
            let tempItems = [];
            let tempShownModals = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                tempItems.push(docWithMore);
                tempShownModals.push(false);
            });

            setItems(tempItems);
            setFinalCursor(tempFinalCursor);
            setBeginCursor(tempBeginCursor);
            setCurrentPage(prevPage);
            setShownModals(tempShownModals);
            setLoading(prevState => ({
                ...prevState,
                items: false
            }));
        }
    }

    const getNextPage = async () => {
        if(currentPage !== Math.ceil(itemCount/itemsPerPage)){
            setLoading(prevState => ({
                ...prevState,
                items: true
            }));
            // Construct a new query starting at this document depending if the user is searching or not
            let currentPageQuery = query(
                collection(firestore, props.dataName),
            );
            if(search.term){
                // __name__ is synonymous with the doc.id we need to query for
                currentPageQuery = query(
                    currentPageQuery, 
                    where(search.column === "id" ? "__name__" : search.column, "==", search.term),
                    startAfter(finalCursor),
                );
            } else {
                currentPageQuery = query(
                    currentPageQuery,  
                    orderBy(
                        props.tableCols.find(column => {return column.active;}).key, 
                        props.tableCols.find(column => {return column.active;}).direction
                    ),
                    startAfter(finalCursor), 
                    limit(itemsPerPage),
                );
            }

            const pageDocSnaps = await getDocs(currentPageQuery);
            const tempBeginCursor = pageDocSnaps.docs[ 0 ];
            const tempFinalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const nextPage = currentPage + 1;

            // Set data in docs to state
            let tempItems = [];
            let tempShownModals = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                tempItems.push(docWithMore);
                tempShownModals.push(false)
            });

            setItems(tempItems);
            setFinalCursor(tempFinalCursor);
            setBeginCursor(tempBeginCursor);
            setCurrentPage(nextPage);
            setShownModals(tempShownModals);
            setLoading(prevState => ({
                ...prevState,
                items: false
            }));
        }
    };

    const submitSearch = (data) => {
        console.log("submit searching")
        console.log(data)
        setSubmitting(prevState => ({
            ...prevState,
            search: true
        }))
        setSearch({ 
            column: data.column,
            term: data.term,
        });
        setSubmitting(prevState => ({
            ...prevState,
            search: false
        }));
    };

    const clearSearch = () => {
        searchForm.reset();
        setSearch({ 
            column: "",
            term: "",
        });
    };

    const toggleCol = (column, index) => {
        if(search.term){
            toast.warn("Sorry, but you cannot search a term and sort by a specific column at the same time.")
        } else if(column.key === "id"){
            toast.warn("Sorry, but you cannot sort by the ID of items.")
        } else {
            let tempCol = column;
            let tempTableCols = [...props.tableCols];
            const prevActiveColIndex = props.tableCols.findIndex(column => {return column.active;});
            if(prevActiveColIndex !== index){
                // De-active the old column if not same as before
                tempTableCols[prevActiveColIndex].active = false;
                tempTableCols[prevActiveColIndex].direction = "";
            }
    
            // Set new column stuff
            tempCol.active = true;
            if(!tempCol.direction || tempCol.direction === "asc"){
                tempCol.direction = "desc";
            } else {
                tempCol.direction = "asc";
            }
            tempTableCols[index] = tempCol;
            props.setTableCols(tempTableCols);
        }
    }
        
    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals];
        tempShownModals[index] = newStatus;
        setShownModals(tempShownModals);
    };

    const deleteItem = async (index) => {
        const itemId = items[index].id;
        let tempItems = [...items];
        const splicedValue = tempItems.splice(index, 1);
        console.log("Deleting " + splicedValue.id);
        await deleteDoc(doc(firestore, props.dataName, itemId)).then(() => {
            console.log("Successful delete of doc on firestore");
            updateDoc(doc(firestore, "site", "counts"), {
                [props.dataName]: increment(-1),
            }).then(() => {
                console.log("Successful update of counts on firestore");
                toast.success("Item deleted!");
                setItemCount(itemCount-1);
                setItems(tempItems);
            }).catch((error) => {
                console.error("Error decrementing count: ", error);
                toast.error(`Error decrementing count. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
            });
        }).catch((error) => {
            console.error("Error deleting item: ", error);
            toast.error(`Error deleting item. Please try again or if the problem persists, contact ${props.site.emails.support}.`);
        });
    }


    if(loading.counts){
        return (
            <>
                <H2>Loading... <Spinner /> </H2> 
            </>
        )
    } else {
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
                <H1 margin="0">{props.pageTitle}: {itemCount}</H1>
                <form onSubmit={ searchForm.handleSubmit(submitSearch) }>
                    <Grid fluid>
                        {(feedbackAverage) && (
                            <Row>
                                <Column sm={12} textalign="center">
                                    <H3 margin="0">Average rating: {renderEmotion(feedbackAverage, "4em")}</H3>
                                    <Body margin="0">{Math.trunc(feedbackAverage)}/100</Body>
                                </Column>
                            </Row>
                        )}
                        <Row justify="center" align="center">
                            <Column md={12} lg={8}>
                                <SearchContainer>
                                    <FaSearch />
                                    <TextInput
                                        type="text"
                                        error={searchForm.formState.errors.term}
                                        placeholder={`Search by a column title in the table`}
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
                                <SelectInput {...searchForm.register("column", { required: true })}>
                                    {
                                        props.tableCols.filter(column => (column.key !== "timestamp" && column.key !== "body")).map((column) => {
                                            return (
                                                <option key={column.key} value={column.key}>{column.label}</option>
                                            )
                                        })
                                    }
                                </SelectInput>
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
                                        color={theme.colors.yellow}
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
                
                {itemCount === 0 && (
                    <Body color={theme.colors.red} bold size={SIZES.LG}>No items yet!</Body>
                )}
                {itemCount !== 0 && (
                    <>
                    <OverflowXAuto>
                        <Table>
                            <Thead>
                                <Tr>
                                    { props.tableCols.map((column, c) => {
                                            return (
                                                <Th 
                                                    key={c} 
                                                    onClick={() => toggleCol(column, c)}
                                                    active={column.active}
                                                >
                                                    {column.label} <ColChevron column={column} />
                                                </Th>
                                            )
                                        })
                                    }
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                { items.length === 0 && (
                                    <Tr>
                                        <Td colSpan={props.tableCols.length + 1} style={{textAlign:"center"}}>
                                            <Body color={theme.colors.red}>No results</Body>
                                        </Td>
                                    </Tr>
                                )}
                                { loading.items && (
                                    <Tr>
                                        <Td colSpan={props.tableCols.length + 1} style={{textAlign:"center"}}>
                                            <Body color={theme.colors.green}>Loading... <Spinner /></Body>
                                        </Td>
                                    </Tr>
                                )}
                                { !loading.items && items.length !== 0 && items.map((item, i) => {
                                    return (
                                        <Tr key={i}>
                                            {/* ** You may need to edit these conditionals below if you want to render something custom in a cell! */}
                                            {
                                                props.tableCols.map((column, c) => {
                                                    if(column.key === "timestamp"){
                                                        return (
                                                            <Td key={`${c}-${i}`}>
                                                                {readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}
                                                            </Td>
                                                        )
                                                    } else if(column.key === "emotionSymbol"){
                                                        return (
                                                            <Td key={`${c}-${i}`}>
                                                                {renderEmotion(item.rangeValue)}
                                                            </Td>
                                                        )
                                                    } else if(column.key === "body"){
                                                        return (
                                                            <Td key={`${c}-${i}`}>
                                                                {item.body ? <Body color={theme.colors.green}>Yes</Body> : <Body color={theme.colors.red}>No</Body>}
                                                            </Td>
                                                        )
                                                    } else {
                                                        return (
                                                            <Td key={`${c}-${i}`}>
                                                                {item[column.key]}
                                                            </Td>
                                                        )
                                                    }
                                                    
                                                })
                                            }
                                            <Td>
                                                <Button
                                                    type="button"
                                                    size={SIZES.SM}
                                                    onClick={() => toggleModal(true, i)}         
                                                >
                                                    View details
                                                </Button>
                                                {shownModals[i] && (
                                                    <ModalContainer onClick={() => toggleModal(false, i)}>
                                                        <ModalCard onClick={(e) => e.stopPropagation()}>
                                                            {props.renderDetailModal(item)}

                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                color={theme.colors.red}
                                                                onClick={() => toggleModal(false, i)}
                                                            >
                                                                <CgClose /> Close 
                                                            </Button>
                                                        </ModalCard>
                                                    </ModalContainer>
                                                )}
                                                {props.dataName !== "users" && (
                                                    <Button
                                                        type="button"
                                                        btype={BTYPES.INVERTED} 
                                                        color={theme.colors.red}
                                                        size={SIZES.SM}
                                                        onClick={() =>         
                                                            confirmAlert({
                                                                customUI: ({ onClose }) => {
                                                                    return (
                                                                        <ConfirmAlert
                                                                            theme={theme}
                                                                            onClose={onClose} 
                                                                            headingText={`Delete item`}
                                                                            body={`Are you sure you want to delete item with ID of "${item.id}" from the database? This action cannot be reverse and is permanent loss of data!`}
                                                                            yesFunc={() => deleteItem(i)} 
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
                    <Hr/>
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
                                <Body margin="0" size={SIZES.SM}>Showing {items.length} of {itemCount}</Body>
                                {!search.term && (<Body margin="0" size={SIZES.SM}>Page {currentPage} of {Math.ceil(itemCount/itemsPerPage)}</Body>)}
                                <Body margin="10px 0" size={SIZES.SM}>
                                    {/* Don't show page size selector if itemCount is less than the second page size selection */}
                                    {(!search.term && itemCount > PAGE_SIZES[1]) && (
                                        <>
                                        <PageSelectInput
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(e.target.key)} 
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
                                {(currentPage !== Math.ceil(itemCount/itemsPerPage) && !search.term) && (
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
                        <Row>
                            <Column sm={12} textalign="center">
                                { (allData.length === 0 && !loading.allData) && (<Button type="button" onClick={() => getAllData()}>Export all data <BiExport /></Button>) }
                                { loading.allData && (<Body>Exporting data... <Spinner /> </Body>) }
                                { allData.length > 0 && (
                                    <CSVLink
                                        data={allData} 
                                        headers={props.tableCols}
                                        filename={`${process.env.REACT_APP_FIREBASE_LIVE_PROJECT_ID}_${allData.length}_feedback.csv`}
                                        onClick={() => toast.success("Downloading your data...")}
                                    >
                                        <Button type="button">Download {allData.length} items <BiDownload /></Button>
                                    </CSVLink>
                                ) }
                                
                            </Column>
                        </Row>
                    </Grid>
                        
                    </>
                )}
            </>
        ) 
    }
}
