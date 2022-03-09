import React, { Component } from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";  
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { withTheme } from 'styled-components';

import { Wrapper } from '../../../../utils/styles/misc'
import { Body, H1, Li, Ol } from '../../../../utils/styles/text'
import { firestore } from '../../../../Fire';
import { Button } from '../../../../utils/styles/buttons';
import { readTimestamp } from '../../../../utils/misc';
import { Helmet } from 'react-helmet-async';


class AdminMessages extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            messages: "",
            currentPage: 0,
            beginCursor: "",
            finalCursor: "",
            loadingMessages: true
        }
    }
    componentDidMount = async () =>{
        // Paginate: https://firebase.google.com/docs/firestore/query-data/query-cursors
        // Query the first page of docs so we can display them to user
        const currentPageQuery = query(
            collection(firestore, "messages"), 
            orderBy("timestamp"), 
            limit(5)
        );
        const pageDocSnaps = await getDocs(currentPageQuery);
        let messages = [];
        pageDocSnaps.forEach((doc, i) => {
            messages.push(doc.data());
        })

        // Get the last visible document cursor so we can reference it for the next page
        const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];

        this.setState({
            messages: messages,
            finalCursor: finalCursor,
            currentPage: 1,
            loadingMessages: false,
        })
    }
    // TODO: make sure we are not skipping any items with the beforeAfter, etc
    getPrevMessages = async () => {
        if(this.state.currentPage !== 1){
            console.log("testing..")
        }
    }

    getNextMessages = async () => {
        // TODO: properly test if final page
        if(this.state.currentPage !== 0){
            this.setState({
                loadingMessages: true
            })
            // Construct a new query starting at this document,
            const currentPageQuery = query(
                collection(firestore, "messages"), 
                orderBy("timestamp"),
                startAfter(this.state.finalCursor),
                limit(5)
            );
            const pageDocSnaps = await getDocs(currentPageQuery);
            let messages = [];
            pageDocSnaps.forEach((doc, i) => {
                messages.push(doc.data());
            })
            const beginCursor = pageDocSnaps.docs[ 0 ];
            const finalCursor = pageDocSnaps.docs[ pageDocSnaps.docs.length - 1 ];
            const nextPage = this.state.currentPage + 1;
            
            this.setState({
                messages: messages,
                beginCursor: beginCursor,
                finalCursor: finalCursor,
                currentPage: nextPage,
                loadingMessages: false,
            })
        }
    }


    render() {
        return (
            <Wrapper>
                <Helmet>
                    <title>Contact Messages {this.props.site.name ? `| ${this.props.site.name}` : ""}</title>
                </Helmet>
                <H1>Contact Messages</H1>
                <Body>Below are the messages from the contact form on the site.</Body>
                {!this.state.loadingMessages && this.state.messages.length === 0 && (
                    <Body color={this.props.theme.colors.red} bold size={"lg"}>No messages yet!</Body>
                )}
                <Ol>
                    { !this.state.loadingMessages && this.state.messages.length > 0 && this.state.messages.map((message, i) => {
                        return (
                            <Li key={i}>
                                <b>From:</b> {message.email}<br/>
                                <b>Message:</b> {message.message}<br/>
                                <b>Timestamp:</b> {readTimestamp(message.timestamp).date} @ {readTimestamp(message.timestamp).time}<br/>
                                <br/>
                            </Li>
                        )
                    })}
                </Ol>
                {this.state.currentPage !== 1 && (
                    <Button onClick={() => this.getPrevMessages()}>
                        <FaChevronLeft /> Previous messages    
                    </Button>
                )}
                
                {/* TODO: how to test if last page? */}
                <Button style={{ float: "right" }} onClick={() => this.getNextMessages()}>
                    Next messages <FaChevronRight /> 
                </Button>
            </Wrapper>
        )
        
    }
}


export default withTheme(AdminMessages)