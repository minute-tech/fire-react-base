import React, { Component } from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs, onSnapshot, doc, endAt, limitToLast } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight,  } from 'react-icons/fa';
import { CgClose } from 'react-icons/cg';
import { withTheme } from 'styled-components';

import { ModalCard, Hr, OverflowXAuto, Spinner, Table, Tbody, Td, Th, Thead, Tr, ModalContainer } from '../../../../utils/styles/misc'
import { ALink, Body, H1, H2, Label } from '../../../../utils/styles/text'
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { readTimestamp } from '../../../../utils/misc';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { BTYPES, SIZES } from '../../../../utils/constants.js';


class ManageMessages extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            messages: "",
            currentPage: 0,
            beginCursor: "",
            finalCursor: "",
            loadingMessages: true,
            loadingCounts: true,
            messageCount: 0,
            messagesPerPage: 10,
            shownMessages: []
        }
    }
    
    componentDidMount = async () =>{
        this.unsubCounts = onSnapshot(doc(firestore, "site", "counts"), (countsDoc) => {
            if(countsDoc.exists()){
                let countsData = countsDoc.data();
                this.setState({
                    messageCount: countsData.messages,
                    loadingCounts: false
                });
            } else {
                console.log("No custom site set, can't properly count messages.")
                this.setState({
                    loadingCounts: false
                });
            }
        });

        // Get first page of messages
        const currentPageQuery = query(
            collection(firestore, "messages"), 
            orderBy("timestamp", "desc"), 
            limit(this.state.messagesPerPage)
        );
        const pageDocSnaps = await getDocs(currentPageQuery);
        // Get the last visible document cursor so we can reference it for the next page
        const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];

        // Get content from each doc on this page 
        let messages = [];
        let shownMessages = []
        pageDocSnaps.forEach((doc) => {
            const docWithMore = Object.assign({}, doc.data());
            docWithMore.id = doc.id;
            messages.push(docWithMore);
            shownMessages.push(false)
        });

        this.setState({
            messages: messages,
            finalCursor: finalCursor,
            currentPage: 1,
            loadingMessages: false,
            shownMessages: shownMessages
        })
    }

    componentWillUnmount(){
        if(this.unsubCounts){
            this.unsubCounts();
        }
    }
    
    getPrevPage = async () => {
        if(this.state.currentPage !== 1){
            this.setState({
                loadingMessages: true
            })
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "messages"), 
                orderBy("timestamp", "desc"),
                endAt(this.state.beginCursor),
                limitToLast(this.state.messagesPerPage) // Adding this seemed to solve the going abck issue, but now everything is jumbled when going back
            );
            const pageDocSnaps = await getDocs(currentPageQuery);
            const beginCursor = pageDocSnaps.docs[ 0 ];
            const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const prevPage = this.state.currentPage - 1;

            // Set data in docs to state
            let messages = [];
            let shownMessages = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                messages.push(docWithMore);
                shownMessages.push(false)
            });

            this.setState({
                messages: messages,
                beginCursor: beginCursor,
                finalCursor: finalCursor,
                currentPage: prevPage,
                loadingMessages: false,
            })
        }
    }

    getNextPage = async () => {
        if(this.state.currentPage !== Math.ceil(this.state.messageCount/this.state.messagesPerPage)){
            this.setState({
                loadingMessages: true
            })
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "messages"), 
                orderBy("timestamp", "desc"),
                startAfter(this.state.finalCursor),
                limit(this.state.messagesPerPage)
            );
            const pageDocSnaps = await getDocs(currentPageQuery);
            const beginCursor = pageDocSnaps.docs[ 0 ];
            const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const nextPage = this.state.currentPage + 1;

            // Set data in docs to state
            let messages = [];
            let shownMessages = []
            pageDocSnaps.forEach((doc) => {
                const docWithMore = Object.assign({}, doc.data());
                docWithMore.id = doc.id;
                messages.push(docWithMore);
                shownMessages.push(false)
            });

            this.setState({
                messages: messages,
                beginCursor: beginCursor,
                finalCursor: finalCursor,
                currentPage: nextPage,
                loadingMessages: false,
            })
        }
    }

    toggleMessage = (newStatus, index) => {
        let tempShownMessages = this.state.shownMessages
        tempShownMessages[index] = newStatus
        this.setState({
            shownMessages: tempShownMessages
        })
    }

    render() {
        if(this.state.loadingMessages && this.state.loadingCounts){
            return (
                <>
                    <H2>Loading... <Spinner /> </H2> 
                </>
            )
        } else {
            return (
                <>
                    <Helmet>
                        <title>Contact Messages {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                    </Helmet>
                    <Link to="/dashboard/admin">
                        <Button>
                            <FaChevronLeft />
                            &nbsp; Back to Admin Dashboard
                        </Button>
                    </Link>
                    <H1>Contact Messages: {this.state.messageCount}</H1>
                    {this.state.messageCount === 0 && (
                        <Body color={this.props.theme.colors.red} bold size={SIZES.LG}>No messages yet!</Body>
                    )}
                    {this.state.messageCount !== 0 && (
                        <>
                        <OverflowXAuto>
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Timestamp</Th>
                                        <Th>Name</Th>
                                        <Th>Email</Th>
                                        <Th>Actions</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    { this.state.messages.length !== 0 && this.state.messages.map((message, i) => {
                                        return (
                                            <Tr key={i}>
                                                <Td>
                                                    {readTimestamp(message.timestamp).date} @ {readTimestamp(message.timestamp).time}
                                                </Td>
                                                <Td>
                                                    {message.name}
                                                </Td>
                                                <Td>
                                                    {message.email}
                                                </Td>
                                                <Td>
                                                    <Button
                                                        btype={BTYPES.TEXTED} 
                                                        size={SIZES.SM}
                                                        onClick={() => this.toggleMessage(true, i)}         
                                                    >
                                                        View message
                                                    </Button>
                                                    {this.state.shownMessages[i] && (
                                                        <ModalContainer onClick={() => this.toggleMessage(false, i)}>
                                                            <ModalCard onClick={(e) => e.stopPropagation()}>
                                                                <Label>{message.name}</Label> <ALink href={`mailto:${message.email}`}>&lt;{message.email}&gt;</ALink>
                                                                <Body margin="0" size={SIZES.SM}><i>{readTimestamp(message.timestamp).date} @ {readTimestamp(message.timestamp).time}</i></Body>
                                                                <Body>{message.body}</Body>
                                                                <Button 
                                                                    size={SIZES.SM} 
                                                                    onClick={() => this.toggleMessage(false, i)}
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
                                    {this.state.currentPage !== 1 && (
                                        <Button onClick={() => this.getPrevPage()}>
                                            <FaChevronLeft /> Previous page    
                                        </Button>
                                    )}
                                </Col>
                                <Col xs={12} sm={4}>
                                    <Body size={SIZES.LG}>Page {this.state.currentPage} of {Math.ceil(this.state.messageCount/this.state.messagesPerPage)}</Body>
                                </Col>
                                <Col xs={12} sm={4}>
                                    {this.state.currentPage !== Math.ceil(this.state.messageCount/this.state.messagesPerPage) && (
                                        <Button onClick={() => this.getNextPage()}>
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
}

export default withTheme(ManageMessages)