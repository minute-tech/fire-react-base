import React, { useEffect, useState} from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, endAt, limitToLast, where } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight, FaSearch,  } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Col, Grid, Row } from 'react-flexbox-grid';

import { ModalCard, Hr, OverflowXAuto, Spinner, Table, Tbody, Td, Th, Thead, Tr, ModalContainer } from '../../../../utils/styles/misc';
import { ALink, Body, H1, H2, Label, LLink } from '../../../../utils/styles/text';
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { FField, SearchContainer, SField } from '../../../../utils/styles/forms';
import { readTimestamp } from '../../../../utils/misc';
import { BTYPES, SIZES, PAGE_SIZES } from '../../../../utils/constants.js';
import { PageSelect } from '../../../../utils/styles/forms';
import { ColChevron, FormError } from '../../../misc/Misc';
import { searchSchema } from '../../../../utils/formSchemas';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';

function ManageMessages(props) {
    const theme = useTheme();
    const [loading, setLoading] = useState({ 
        counts: true,
        items: true
    }); 
    const [submitting, setSubmitting] = useState({ 
        search: false,
    }); 
    const [errors, setErrors] = useState({ 
        term: "",
    }); 
    const [itemCount, setItemCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0].value);
    const [items, setItems] = useState([]);
    const [beginCursor, setBeginCursor] = useState("");
    const [finalCursor, setFinalCursor] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [shownModals, setShownModals] = useState([false]); 
    const [search, setSearch] = useState({ 
        column: "",
        term: "",
    }); 
    const [tableCols, setTableCols] = useState([
        {
            label: "ID",
            value: "id",
            direction: "desc",
            active: false
        },
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
        let currentPageQuery = query(
            collection(firestore, "messages"),
            limit(itemsPerPage)
        );
        if(search.term){
            currentPageQuery = query(currentPageQuery, where(search.column === "id" ? "__name__" : search.column, "==", search.term));
        } else {
            currentPageQuery = query(currentPageQuery,  
                orderBy(
                    tableCols.find(column => {return column.active;}).value, 
                    tableCols.find(column => {return column.active;}).direction
                )
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
    }, [itemsPerPage, tableCols, search]);

    const getPrevPage = async () => {
        if(currentPage !== 1){
            setLoading(prevState => ({
                ...prevState,
                items: true
            }));
            // Construct a new query starting at this document,
            let currentPageQuery = query(
                collection(firestore, "messages"), 
                endAt(beginCursor),
                limitToLast(itemsPerPage) // Adding this seemed to solve the going abck issue, but now everything is jumbled when going back
            );
            if(search.term){
                currentPageQuery = query(currentPageQuery, where(search.column === "id" ? "__name__" : search.column, "==", search.term));
            } else {
                currentPageQuery = query(currentPageQuery,  
                    orderBy(
                        tableCols.find(column => {return column.active;}).value, 
                        tableCols.find(column => {return column.active;}).direction
                    )
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
            let currentPageQuery = query(
                collection(firestore, "messages"), 
                startAfter(finalCursor),
                limit(itemsPerPage)
            );
            if(search.term){
                currentPageQuery = query(currentPageQuery, where(search.column === "id" ? "__name__" : search.column, "==", search.term));
            } else {
                currentPageQuery = query(currentPageQuery,  
                    orderBy(
                        tableCols.find(column => {return column.active;}).value, 
                        tableCols.find(column => {return column.active;}).direction
                    )
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

    const submitSearch = (values) => {
        setSearch(prevState => ({
            ...prevState,
            column: values.column,
            term: values.term,
        }));
        setSubmitting(prevState => ({
            ...prevState,
            search: false
        }));
    };

    const clearSearch = (resetForm) => {
        resetForm();
        setSearch(prevState => ({
            ...prevState,
            column: "",
            term: "",
        }));
    };

    const toggleCol = (column, index) => {
        if(search.term){
            toast.warn("Sorry, but you cannot search a term and sort by a specific column at the same time.")
        } else {
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
    }
        
    const toggleModal = (newStatus, index) => {
        let tempShownModals = [...shownModals]
        tempShownModals[index] = newStatus
        setShownModals(tempShownModals);
    };

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
                <Formik
                    initialValues={{
                        term: "",
                        column: "id"
                    }}
                    onSubmit={(values) => {
                        setSubmitting(prevState => ({
                            ...prevState,
                            search: true
                        }))
                        submitSearch(values);
                    }}
                    enableReinitialize={true}
                    validationSchema={searchSchema}
                >
                    {formProps => (
                        <Form>
                            <Grid fluid>
                                <Row>
                                    <Col sm={12}>
                                        <SearchContainer>
                                            <FaSearch />
                                            <FField
                                                type="text"
                                                required
                                                onChange={formProps.handleChange}
                                                placeholder={`What are you looking for today?`}
                                                name="term"
                                                value={formProps.values.term || ""}
                                                onKeyUp={() => 
                                                    setErrors(prevState => ({
                                                        ...prevState,
                                                        term: ""
                                                    }))
                                                }
                                                onClick={() => 
                                                    setErrors(prevState => ({
                                                        ...prevState,
                                                        term: ""
                                                    }))
                                                }
                                                error={ ((formProps.errors.term && formProps.touched.term) || errors?.term) ? 1 : 0 }
                                            />
                                            <Button 
                                                type="submit" 
                                                disabled={submitting.search}
                                            >
                                                Search 
                                            </Button>
                                            <SField
                                                name="column"
                                                component="select"
                                                onChange={formProps.handleChange}
                                            >
                                                {
                                                    tableCols.filter(column => column.value !== "timestamp").map((column) => {
                                                        return (
                                                            <option key={column.value} value={column.value}>{column.label}</option>
                                                        )
                                                    })
                                                }
                                            </SField>
                                            {search.term && (
                                                <Button 
                                                    type="button"
                                                    btype={BTYPES.INVERTED}
                                                    color={theme.colors.yellow}
                                                    onClick={() => clearSearch(formProps.resetForm)}
                                                >
                                                    Clear
                                                </Button>
                                            )}
                                        </SearchContainer>
                                    </Col>
                                </Row>
                                <Row center="xs">
                                    <Col xs={12}>
                                        <FormError
                                            yupError={formProps.errors.term}
                                            formikTouched={formProps.touched.term}
                                            stateError={errors?.term}
                                        /> 
                                    </Col>
                                </Row>
                            </Grid>
                        </Form>
                    )}
                </Formik>
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
                                        <Td colSpan={tableCols.length + 1} style={{textAlign:"center"}}>
                                            <Body color={theme.colors.red}>No results</Body>
                                        </Td>
                                    </Tr>
                                )}
                                { items.length !== 0 && items.map((item, i) => {
                                    return (
                                        <Tr key={i}>
                                            <Td>
                                                {item.id}
                                            </Td>
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
                                <Body margin="0" size={SIZES.SM}>Showing {items.length} of {itemCount}</Body>
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