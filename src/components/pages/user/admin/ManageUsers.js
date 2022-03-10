import React, { Component } from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, endAt, limitToLast, addDoc } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight, FaShieldAlt, FaShieldVirus } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { withTheme } from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { toast } from 'react-toastify';

import { ModalCard, Hr, OverflowXAuto, Spinner, Table, Tbody, Td, Th, Thead, Tr, Wrapper, ModalContainer, Div } from '../../../../utils/styles/misc'
import { ALink, Body, H1, H2, Label } from '../../../../utils/styles/text'
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { readTimestamp } from '../../../../utils/misc';
import { BTYPES } from '../../../../utils/constants';

class ManageUsers extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            users: [],
            admins: [],
            superAdmins: [],
            currentPage: 0,
            beginCursor: "",
            finalCursor: "",
            loadingUsers: true,
            loadingSensitive: true,
            loadingCounts: true,
            userCount: 0,
            usersPerPage: 10,
            shownUsers: []
        }
    }
    componentDidMount = async () =>{
        this.unsubCounts = onSnapshot(doc(firestore, "site", "counts"), (countsDoc) => {
            if(countsDoc.exists()){
                let countsData = countsDoc.data();
                this.setState({
                    userCount: countsData.users,
                    loadingCounts: false
                });
            } else {
                console.log("No custom site set, can't properly count users.")
                this.setState({
                    loadingCounts: false
                });
            }
        });

        this.unsubSensitive = onSnapshot(doc(firestore, "site", "sensitive"), (sensitiveDoc) => {
            if(sensitiveDoc.exists()){
                let sensitiveData = sensitiveDoc.data();
                this.setState({
                    admins: sensitiveData.admins || [],
                    superAdmins: sensitiveData.superAdmins || [],
                    loadingSensitive: false
                });
            } else {
                console.log("No custom site set, can't properly find sensitives.")
                this.setState({
                    loadingSensitive: false
                });
            }
        });

        // Get first page of users
        const currentPageQuery = query(
            collection(firestore, "users"), 
            orderBy("timestamp", "desc"), 
            limit(this.state.usersPerPage)
        );
        const pageDocSnaps = await getDocs(currentPageQuery);
        // Get the last visible document cursor so we can reference it for the next page
        const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
        
        // Get content from each doc on this page 
        let users = [];
        let shownUsers = []
        pageDocSnaps.forEach((doc) => {
            const docWithMore = Object.assign({}, doc.data());
            docWithMore.id = doc.id;
            users.push(docWithMore);
            shownUsers.push(false)
        });

        this.setState({
            users: users,
            finalCursor: finalCursor,
            currentPage: 1,
            loadingUsers: false,
            shownUsers: shownUsers
        })
    }

    componentWillUnmount(){
        if(this.unsubCounts){
            this.unsubCounts();
        }

        if(this.unsubSensitive){
            this.unsubSensitive();
        }
    }
    
    getPrevMessages = async () => {
        if(this.state.currentPage !== 1){
            this.setState({
                loadingUsers: true
            })
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "users"), 
                orderBy("timestamp", "desc"),
                endAt(this.state.beginCursor),
                limitToLast(this.state.usersPerPage) // Adding this seemed to solve the going abck issue, but now everything is jumbled when going back
            );
            const pageDocSnaps = await getDocs(currentPageQuery);
            const beginCursor = pageDocSnaps.docs[ 0 ];
            const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const prevPage = this.state.currentPage - 1;

            // Set data in docs to state
            let users = [];
            let shownUsers = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                users.push(docWithMore);
                shownUsers.push(false)
            });

            this.setState({
                users: users,
                beginCursor: beginCursor,
                finalCursor: finalCursor,
                currentPage: prevPage,
                loadingUsers: false,
            })
        }
    }

    getNextMessages = async () => {
        if(this.state.currentPage !== Math.ceil(this.state.userCount/this.state.usersPerPage)){
            this.setState({
                loadingUsers: true
            })
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "users"), 
                orderBy("timestamp", "desc"),
                startAfter(this.state.finalCursor),
                limit(this.state.usersPerPage)
            );
            const pageDocSnaps = await getDocs(currentPageQuery);
            const beginCursor = pageDocSnaps.docs[ 0 ];
            const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const nextPage = this.state.currentPage + 1;

            // Set data in docs to state
            let users = [];
            let shownUsers = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                users.push(docWithMore);
                shownUsers.push(false)
            });

            this.setState({
                users: users,
                beginCursor: beginCursor,
                finalCursor: finalCursor,
                currentPage: nextPage,
                loadingUsers: false,
            })
        }
    }

    toggleUser = (newStatus, index) => {
        let tempShownMessages = this.state.shownUsers
        tempShownMessages[index] = newStatus
        this.setState({
            shownUsers: tempShownMessages
        })
    }

    submitNewAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", this.props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new admin doc to Firestore.");
            toast.success("Successful add of new admin doc to Firestore.");
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
        });
    }

    submitNewSuperAdmin = (id, email, name) => {
        // Write to the current newAdmins collection to be verified on the backend.
        addDoc(collection(firestore, "users", this.props.user.id, "newAdmins"), {
            id: id,
            email: email,
            name: name,
            superAdmin: true,
            timestamp: Date.now(),
        }).then(() => {
            console.log("Successful add of new super admin doc to Firestore.");
            toast.success("Successful add of new super admin doc to Firestore.");
        }).catch((error) => {
            console.error("Error adding document: ", error);
            toast.error(`Error setting users doc: ${error}`);
        });
    }

    renderAdminBadges = (user) => {
        if(this.state.admins.some(admin => admin.id === user.id)){
            <Body margin="0" display="inline-block" color={this.props.theme.colors.red}><FaShieldAlt /> Admin</Body>
        } else {
            return (
                <Button
                    color={this.props.theme.colors.yellow}
                    btype={BTYPES.INVERTED}
                    size="sm"
                    onClick={() => this.submitNewAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)}         
                >
                    Set as Admin <FaShieldAlt />
                </Button> 
            )
            
        }
    }

    renderSuperAdminBadges = (user) => {
        if(
            !this.state.superAdmins.some(superAdmin => superAdmin.id === user.id) && 
            this.state.admins.some(admin => admin.id === user.id)
        ){
            // Already admin, but not super admin yet
            return (
                <Button
                    color={this.props.theme.colors.red}
                    btype={BTYPES.INVERTED}
                    size="sm"
                    onClick={() => this.submitNewSuperAdmin(user.id, user.email, `${user.firstName} ${user.lastName}`)}         
                >
                    Set as Super Admin <FaShieldVirus />
                </Button> 
            )
            
        } else if (this.state.superAdmins.some(superAdmin => superAdmin.id === user.id)) {
            // Already superAdmin
            return (
                <Body margin="0" display="inline-block" color={this.props.theme.colors.red}><FaShieldVirus /> Super Admin</Body>
            )
            
        } else {
            // Not admin
            return (
                ""
            )
        }
    }

    render() {
        if(this.state.loadingUsers && this.state.loadingCounts && this.state.loadingSensitive){
            return (
                <Wrapper>
                    <H2>Loading... <Spinner /> </H2> 
                </Wrapper>
            )
        } else { 
            return (
                <Wrapper>
                    <Helmet>
                        <title>Manage Users {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                    </Helmet>
                    <Link to="/admin/dashboard">
                        <Button>
                            <FaChevronLeft />
                            &nbsp; Back to Admin Dashboard
                        </Button>
                    </Link>
                    <H1>Manage Users: {this.state.userCount}</H1>
                    {this.state.userCount === 0 && (
                        <Body color={this.props.theme.colors.red} bold size={"lg"}>No users yet!</Body>
                    )}
                    {this.state.userCount !== 0 && (
                        <>
                        <OverflowXAuto>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Timestamp</Th>
                                        <Th>Name</Th>
                                        <Th>Email</Th>
                                        <Th>Phone</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    { this.state.users.length !== 0 && this.state.users.map((user, i) => {
                                        return (
                                            <Tr key={i}>
                                                <Td>
                                                    {readTimestamp(user.timestamp).date} @ {readTimestamp(user.timestamp).time}
                                                </Td>
                                                <Td>
                                                    {user.firstName} {user.lastName}
                                                </Td>
                                                <Td>
                                                    {user.email}&nbsp;
                                                    {   
                                                        (user.email.toLowerCase() === this.props.user.email) 
                                                        ? 
                                                        <Body display="inline" color={this.props.theme.colors.green}>(You!)</Body> 
                                                        : 
                                                        ""
                                                    }
                                                </Td>
                                                <Td>
                                                    {user.phone}
                                                </Td>
                                                <Td>
                                                    <Button
                                                        btype={BTYPES.TEXTED} 
                                                        color={this.props.theme.colors.primary}
                                                        size="sm"
                                                        onClick={() => this.toggleUser(true, i)}         
                                                    >
                                                        View full details
                                                    </Button>

                                                    {this.state.shownUsers[i] && (
                                                        <ModalContainer onClick={() => this.toggleUser(false, i)}>
                                                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                                                <Label>{user.firstName} {user.lastName}</Label> <ALink href={`mailto:${user.email}`}>&lt;{user.email}&gt;</ALink>
                                                                <Body margin="0" size="sm"><i>{readTimestamp(user.timestamp).date} @ {readTimestamp(user.timestamp).time}</i></Body>
                                                                <Div margin="10px 30px 0 0">
                                                                    { this.renderAdminBadges(user) }
                                                                    { this.renderSuperAdminBadges(user) }
                                                                </Div> 
                                                                
                                                                <Hr/>
                                                                <Button 
                                                                    size="sm" 
                                                                    onClick={() => this.toggleUser(false, i)}
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
                        <Grid fluid>
                            <Row center="xs" middle="xs">
                                <Col xs={12} sm={4}>
                                    {this.state.currentPage !== 1 && (
                                        <Button onClick={() => this.getPrevMessages()}>
                                            <FaChevronLeft /> Previous page    
                                        </Button>
                                    )}
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Body size="lg">Page {this.state.currentPage} of {Math.ceil(this.state.userCount/this.state.usersPerPage)}</Body>
                                </Col>
                                <Col xs={12} sm={4}>
                                    {this.state.currentPage !== Math.ceil(this.state.userCount/this.state.usersPerPage) && (
                                        <Button onClick={() => this.getNextMessages()}>
                                            Next page <FaChevronRight /> 
                                        </Button>
                                    )}
                                
                                </Col>
                            </Row>
                        </Grid>
                        </>
                    )}
                </Wrapper>
            )
        }
    }
}

export default withTheme(ManageUsers)