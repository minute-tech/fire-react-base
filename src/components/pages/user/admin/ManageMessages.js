import React, { useEffect, useState} from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, endAt, limitToLast } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight,  } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Col, Grid, Row } from 'react-flexbox-grid';

import { ModalCard, Hr, OverflowXAuto, Spinner, Table, Tbody, Td, Th, Thead, Tr, ModalContainer } from '../../../../utils/styles/misc'
import { ALink, Body, H1, H2, Label, LLink } from '../../../../utils/styles/text'
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { readTimestamp } from '../../../../utils/misc';
import { BTYPES, SIZES, PAGE_SIZES } from '../../../../utils/constants.js';
import { PageSelect } from '../../../../utils/styles/forms';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';

function ManageMessages(props) {
    const theme = useTheme();
    const [loading, setLoading] = useState({ 
        counts: true,
        items: true
    }); 
    const [itemCount, setItemCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0].value);
    const [items, setItems] = useState([]);
    const [beginCursor, setBeginCursor] = useState("");
    const [finalCursor, setFinalCursor] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [shownModals, setShownModals] = useState([false]); 

    const [tableCols, setTableCols] = useState([
        {
            label: "Timestamp",
            value: "timestamp",
            direction: "desc",
            active: true
        },
        {
            label: "Name",
            value: "name",
            direction: "",
            active: false
        },
        {
            label: "Email",
            value: "email",
            direction: "",
            active: false
        },
    ]);

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "counts"), (countsDoc) => {
            if(countsDoc.exists()){
                let countsData = countsDoc.data();
                setLoading(prevState => ({
                    ...prevState,
                    counts: false
                }));
                setItemCount(countsData.messages);
            } else {
                console.log("No custom site set, can't properly count messages.");
                setLoading(prevState => ({
                    ...prevState,
                    counts: false
                }));
            }
        });
    }, [])

    useEffect(() => {
        // Get first page of messages
        const currentPageQuery = query(
            collection(firestore, "messages"), 
            orderBy(
                tableCols.find(column => {return column.active;}).value, 
                tableCols.find(column => {return column.active;}).direction
            ),
            limit(itemsPerPage)
        );

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
    }, [itemsPerPage, tableCols]);

    const getPrevPage = async () => {
        if(currentPage !== 1){
            setLoading(prevState => ({
                ...prevState,
                items: true
            }));
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "messages"), 
                orderBy(
                    tableCols.find(column => {return column.active;}).value, 
                    tableCols.find(column => {return column.active;}).direction
                ),
                endAt(beginCursor),
                limitToLast(itemsPerPage) // Adding this seemed to solve the going abck issue, but now everything is jumbled when going back
            );
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
                tempShownModals.push(false)
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
                items: false
            }));
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "messages"), 
                orderBy(
                    tableCols.find(column => {return column.active;}).value, 
                    tableCols.find(column => {return column.active;}).direction
                ),
                startAfter(finalCursor),
                limit(itemsPerPage)
            );
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

    const toggleCol = (column, index) => {
        
        let tempCol = column;
        let tempTableCols = [...tableCols];
        const prevActiveColIndex = tableCols.findIndex(column => {return column.active;});
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
        setTableCols(tempTableCols);
    }
        
    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals]
        tempShownModals[index] = newStatus
        setShownModals(tempShownModals);
    };

    const renderColChevron = (column) => {
        if(column.direction === "desc"){
            return (
                <BiChevronDown style={{paddingBottom: "0%"}} />
            )
        } else if(column.direction === "asc") {
            return (
                <BiChevronUp style={{paddingBottom: "0%"}} />
            )
        } else {
            return (<></>)
        }

    }

    if(loading.items && loading.counts){
        return (
            <>
                <H2>Loading... <Spinner /> </H2> 
            </>
        )
    } else {
        return (
            <>
                <Helmet>
                    <title>Contact Messages {props.site.name ? `| ${props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/dashboard/admin">
                    <Button type="button">
                        <FaChevronLeft />
                        &nbsp; Back to Admin Dashboard
                    </Button>
                </LLink>
                <H1>Contact Messages: {itemCount}</H1>
                {itemCount === 0 && (
                    <Body color={theme.colors.red} bold size={SIZES.LG}>No messages yet!</Body>
                )}
                {itemCount !== 0 && (
                    <>
                    <OverflowXAuto>
                        <Table>
                            <Thead>
                                <Tr>
                                    {
                                        tableCols.map((column, c) => {
                                            return (
                                                <Th 
                                                    key={c} 
                                                    onClick={() => toggleCol(column, c)}
                                                    active={column.active}
                                                >
                                                    {column.label} {renderColChevron(column)}
                                                </Th>
                                            )
                                        })
                                    }
                                    <Th>Actions</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                { items.length !== 0 && items.map((item, i) => {
                                    return (
                                        <Tr key={i}>
                                            <Td>
                                                {readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}
                                            </Td>
                                            <Td>
                                                {item.name}
                                            </Td>
                                            <Td>
                                                {item.email}
                                            </Td>
                                            <Td>
                                                <Button
                                                    type="button"
                                                    btype={BTYPES.TEXTED} 
                                                    size={SIZES.SM}
                                                    onClick={() => toggleModal(true, i)}         
                                                >
                                                    View message
                                                </Button>
                                                {shownModals[i] && (
                                                    <ModalContainer onClick={() => toggleModal(false, i)}>
                                                        <ModalCard onClick={(e) => e.stopPropagation()}>
                                                            <Label>{item.name}</Label> <ALink href={`mailto:${item.email}`}>&lt;{item.email}&gt;</ALink>
                                                            <Body margin="0" size={SIZES.SM}><i>{readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}</i></Body>
                                                            <Body>{item.body}</Body>
                                                            <Button 
                                                                type="button"
                                                                size={SIZES.SM} 
                                                                onClick={() => toggleModal(false, i)}
                                                            >
                                                                <CgClose /> Close 
                                                            </Button>
                                                        </ModalCard>
                                                    </ModalContainer>
                                                    
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
                        <Row center="xs" middle="xs">
                            <Col xs={12} sm={4}>
                                {currentPage !== 1 && (
                                    <Button 
                                        size={SIZES.SM}
                                        type="button" 
                                        onClick={() => getPrevPage()}
                                    >
                                        <FaChevronLeft /> Previous page    
                                    </Button>
                                )}
                            </Col>
                            <Col xs={12} sm={4}>
                                <Body margin="0" size={SIZES.SM}>Page {currentPage} of {Math.ceil(itemCount/itemsPerPage)}</Body>
                                
                                    <Body margin="10px 0" size={SIZES.SM}>
                                        
                                        {/* Don't show page size selector if itemCount is less than the second page size selection */}
                                        {itemCount > PAGE_SIZES[1].value && (
                                            <>
                                            <PageSelect
                                                value={itemsPerPage}
                                                onChange={(e) => setItemsPerPage(e.target.value)} 
                                            >
                                                { 
                                                    PAGE_SIZES.map((size) => {
                                                        return (
                                                            <option key={size.value} value={size.value}>{size.label}</option>
                                                        )
                                                    })
                                                }
                                            </PageSelect>
                                            &nbsp; items per page
                                            </>
                                        )}
                                    </Body>
                            </Col>
                            <Col xs={12} sm={4}>
                                {currentPage !== Math.ceil(itemCount/itemsPerPage) && (
                                    <Button 
                                        size={SIZES.SM}
                                        type="button" 
                                        onClick={() => getNextPage()}
                                    >
                                        Next page <FaChevronRight /> 
                                    </Button>
                                )}
                            
                            </Col>
                        </Row>
                    </Grid>
                    </>
                )}
            </>
        ) 
    }
}

export default ManageMessages;