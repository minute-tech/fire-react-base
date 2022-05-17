





import React, { useEffect, useState} from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, endAt, limitToLast, addDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight, FaShieldAlt, FaShieldVirus } from 'react-icons/fa';
import { CgClose, CgMail, CgMailOpen } from 'react-icons/cg';
import { useTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Col, Grid, Row } from 'react-flexbox-grid';

import { ModalCard, Hr, OverflowXAuto, Spinner, Table, Tbody, Td, Th, Thead, Tr, ModalContainer, Div } from '../../../../utils/styles/misc'
import { ALink, Body, H1, H2, Label, LLink } from '../../../../utils/styles/text'
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { readTimestamp } from '../../../../utils/misc';
import { BTYPES, SIZES, PAGE_SIZES } from '../../../../utils/constants.js';
import { PageSelect } from '../../../../utils/styles/forms';
import { ColChevron } from '../../../misc/Misc';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import ConfirmAlert from '../../../misc/ConfirmAlert';

function ManageUsers(props) {
    const theme = useTheme();
    const [loading, setLoading] = useState({ 
        counts: true,
        sensitive: true,
        items: true,
    }); 
    const [itemCount, setItemCount] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(PAGE_SIZES[0].value);
    const [items, setItems] = useState([]);
    const [beginCursor, setBeginCursor] = useState("");
    const [finalCursor, setFinalCursor] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [shownModals, setShownModals] = useState([false]); 

    
    const [admins, setAdmins] = useState([]);
    const [superAdmins, setSuperAdmins] = useState([]);
    const [messengerEmails, setMessengerEmails] = useState([]);

    const [tableCols, setTableCols] = useState([
        {
            label: "Timestamp",
            value: "timestamp",
            direction: "desc",
            active: true
        },
        {
            label: "First Name",
            value: "firstName",
            direction: "",
            active: false
        },
        {
            label: "Last Name",
            value: "lastName",
            direction: "",
            active: false
        },
        {
            label: "Email",
            value: "email",
            direction: "",
            active: false
        },
        {
            label: "Phone",
            value: "phone",
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
                setItemCount(countsData.users);
            } else {
                console.log("No custom site set, can't properly count users.");
                setLoading(prevState => ({
                    ...prevState,
                    counts: false
                }));
            }
        });
    }, []);

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "sensitive"), (sensitiveDoc) => {
            if(sensitiveDoc.exists()){
                let sensitiveData = sensitiveDoc.data();
                setAdmins(sensitiveData.admins);
                setSuperAdmins(sensitiveData.superAdmins);
                setMessengerEmails(sensitiveData.messengers);

                setLoading(prevState => ({
                    ...prevState,
                    sensitive: false
                }));
            } else {
                console.log("No custom site set, can't properly find sensitives.")
                setLoading(prevState => ({
                    ...prevState,
                    sensitive: false
                }));
            }
        });
    }, []);

    useEffect(() => {
        // Get first page of items
        const currentPageQuery = query(
            collection(firestore, "users"), 
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
                collection(firestore, "users"), 
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
    };

    const getNextPage = async () => {
        if(currentPage !== Math.ceil(itemCount/itemsPerPage)){
            setLoading(prevState => ({
                ...prevState,
                items: false
            }));
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "users"), 
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

    /// Non-default functions ///
    const submitNewAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new admin doc to Firestore.");
            toast.success("Successful add of new admin!");
        }).catch((error) => {
            console.error("Error adding newAdmins doc: ", error);
            toast.error(`Error setting newAdmins doc: ${error}`);
        });
    };

    const submitNewSuperAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            superAdmin: true,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new super admin doc to Firestore.");
            toast.success("Successful add of new super admin!");
        }).catch((error) => {
            console.error("Error adding newAdmins doc: ", error);
            toast.error(`Error setting newAdmins doc: ${error}`);
        });
    };

    const addMessenger = (email) => {
        // Write to the current newAdmins collection to be verified on the backend.
        updateDoc(doc(firestore, "site", "sensitive"), {
            "messengers": arrayUnion(email)
        }).then(() => {
            console.log("Successful add of email to get contact users doc to Firestore.");
            toast.success("Successful add of a new email to get contact users.");
        }).catch((error) => {
            console.error("Error updating sensitive doc: ", error);
            toast.error(`Error updating sensitive doc: ${error}`);
        });
    };

    const removeMessenger = (email) => {
        // Write to the current newAdmins collection to be verified on the backend.
        updateDoc(doc(firestore, "site", "sensitive"), {
            "messengers": arrayRemove(email)
        }).then(() => {
            console.log("Successfully removed email from contact users doc to Firestore.");
            toast.success("Successfully removed email from contact users.");
        }).catch((error) => {
            console.error("Error updating sensitive doc: ", error);
            toast.error(`Error updating sensitive doc: ${error}`);
        });
    };

    const renderAdminBadge = (user) => {
        if(admins.some(admin => admin.id === user.id)){
            <Body margin="0" display="inline-block" color={theme.colors.red}><FaShieldAlt /> Admin</Body>
        } else {
            return (
                <Button
                    type="button"
                    color={theme.colors.yellow}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Admin`}
                                        body={`Are you sure you want to upgrade <${user.email}> to be an Admin?`}
                                        yesFunc={() => submitNewAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)} 
                                        yesText={`Yes`} 
                                        noFunc={function () {}} 
                                        noText={`No`}   
                                    />
                                );
                            }
                        })}       
                >
                    Set as Admin <FaShieldAlt />
                </Button> 
            )
            
        }
    };

    const renderSuperAdminBadge = (user) => {
        if(
            !superAdmins.some(superAdmin => superAdmin.id === user.id) && 
            admins.some(admin => admin.id === user.id)
        ){
            // Already admin, but not super admin yet
            return (
                <Button
                    type="button"
                    color={theme.colors.red}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Super Admin`}
                                        body={`Are you sure you want to upgrade <${user.email}> to be a SUPER Admin?`}
                                        yesFunc={() => submitNewSuperAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Set as Super Admin <FaShieldVirus />
                </Button> 
            )
            
        } else if (superAdmins.some(superAdmin => superAdmin.id === user.id)) {
            // Already superAdmin
            return (
                <Body margin="0" display="inline-block" color={theme.colors.red}><FaShieldVirus /> Super Admin</Body>
            )
            
        } else {
            // Not admin
            return (
                ""
            )
        }
    };

    const renderMessengerBadge = (user) => {
        if(
            !messengerEmails.some(email => email === user.email) && 
            admins.some(admin => admin.id === user.id)
        ){
            // Is admin but not on email list
            return (
                <Button
                    type="button"
                    color={theme.colors.green}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Add Contact Messenger`}
                                        body={`Are you sure you want to add <${user.email}> to be a recipient of all incoming contact messages?`}
                                        yesFunc={() => addMessenger(user.email)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Set as Messenger <CgMailOpen />
                </Button> 
            )
            
        } else if (
            messengerEmails.some(email => email === user.email) && 
            admins.some(admin => admin.id === user.id)
        ) {
            // Is admin and already receiving emails, but prompted to remove
            return (
                <Button
                    type="button"
                    color={theme.colors.red}
                    btype={BTYPES.INVERTED}
                    size={SIZES.SM}
                    onClick={() =>         
                        confirmAlert({
                            customUI: ({ onClose }) => {
                                return (
                                    <ConfirmAlert
                                        theme={theme}
                                        onClose={onClose} 
                                        headingText={`Remove Messenger`}
                                        body={`Are you sure you want to remove <${user.email}> so the user will no longer receive contact messages?`}
                                        yesFunc={() => removeMessenger(user.email)} 
                                        yesText={`Yes`}
                                        noFunc={function () {}} 
                                        noText={`Cancel`}   
                                    />
                                );
                            }
                        })}        
                >
                    Remove Messenger? <CgMail />
                </Button> 
            )
            
        } else {
            // Not admin
            return (
                ""
            )
        }
    };

    if(loading.items && loading.counts && loading.sensitive){
        return (
            <>
                <H2>Loading... <Spinner /> </H2> 
            </>
        )
    } else {
        return (
            <>
                <Helmet>
                    <title>Users {props.site.name ? `| ${props.site.name}` : ""}</title>
                </Helmet>
                <LLink to="/dashboard/admin">
                    <Button type="button">
                        <FaChevronLeft />
                        &nbsp; Back to Admin Dashboard
                    </Button>
                </LLink>
                <H1>Users: {itemCount}</H1>
                {itemCount === 0 && (
                    <Body color={theme.colors.red} bold size={SIZES.LG}>No users yet!</Body>
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
                                { items.length !== 0 && items.map((item, i) => {
                                    return (
                                        <Tr key={i}>
                                            <Td>
                                                {readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}
                                            </Td>
                                            <Td>
                                                {item.firstName}
                                            </Td>
                                            <Td>
                                                {item.lastName}
                                            </Td>
                                            <Td>
                                                {item.email}&nbsp;
                                                {   
                                                    (item.email.toLowerCase() === props.user.email) 
                                                    ? 
                                                    <Body display="inline" color={theme.colors.green}>(You!)</Body> 
                                                    : 
                                                    ""
                                                }
                                            </Td>
                                            <Td>
                                                {item.phone}
                                            </Td>
                                            <Td>
                                                <Button
                                                    type="button"
                                                    btype={BTYPES.TEXTED} 
                                                    size={SIZES.SM}
                                                    onClick={() => toggleModal(true, i)}         
                                                >
                                                    View full details
                                                </Button>

                                                {shownModals[i] && (
                                                    <ModalContainer onClick={() => toggleModal(false, i)}>
                                                        <ModalCard onClick={(e) => e.stopPropagation()}>
                                                            <Label>{item.firstName} {item.lastName}</Label> <ALink href={`mailto:${item.email}`}>&lt;{item.email}&gt;</ALink>
                                                            <Body margin="0" size={SIZES.SM}><i>{readTimestamp(item.timestamp).date} @ {readTimestamp(item.timestamp).time}</i></Body>
                                                            <Div margin="10px 30px 0 0">
                                                                { renderAdminBadge(item) }
                                                                { renderSuperAdminBadge(item) }
                                                                { renderMessengerBadge(item) }
                                                            </Div> 
                                                            
                                                            <Hr/>
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

export default ManageUsers;