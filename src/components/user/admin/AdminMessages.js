import React, { Component } from 'react'
import { collection, query, orderBy, startAfter, limit, getDocs } from "firebase/firestore";  

import { Spinner, Wrapper } from '../../../utils/styles/misc'
import { Body, H1, H2, Li, Ol } from '../../../utils/styles/text'
import { firestore } from '../../../Fire';
import { Button } from '../../../utils/styles/buttons';
import { readTimestamp } from '../../../utils/misc';
import { withTheme } from 'styled-components';

class AdminMessages extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            messages: "",
            lastVisible: "",
            loadingMessages: true
        }
    }
    componentDidMount = async () =>{
        // Paginate: https://firebase.google.com/docs/firestore/query-data/query-cursors
        // Query the first page of docs
        const first = query(collection(firestore, "messages"), orderBy("timestamp"), limit(100));
        const messageDocSnaps = await getDocs(first);
        let messages = [];
        messageDocSnaps.forEach((doc, i) => {
            messages.push(doc.data());
        })
        this.setState({
            messages: messages
        })
        // Get the last visible document
        const currentCursor = messageDocSnaps.docs[messageDocSnaps.docs.length-1];
        console.log("currentCursor: ", currentCursor);
        this.setState({
            currentCursor: currentCursor,
            loadingMessages: false
        })


    }

    getNextMessages = () => {
        // Construct a new query starting at this document,
        this.setState({
            loadingMessages: true
        })
        const currentCursor = query(collection(firestore, "messages"),
            orderBy("timestamp"),
            startAfter(this.state.currentCursor),
            limit(25));
        
        this.setState({
            currentCursor: currentCursor,
            loadingMessages: false
        })
    }

    render() {
        if(this.state.loadingMessages){
            return (
                <Wrapper>
                    <H2>Loading... <Spinner /> </H2> 
                </Wrapper>
            )
        } else {
            return (
                <Wrapper>
                    <H1>Contact Messages</H1>
                    <Body>Below are the messages from the contact form on the site.</Body>
                    {this.state.messages.length === 0 && (
                        <Body color={this.props.theme.colors.red} bold size={"lg"}>No messages yet!</Body>
                    )}
                    <Ol>
                    { this.state.messages.length > 0 && this.state.messages.map((message, i) => {
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
                   
                    <Button onClick={() => this.getNextMessages()}>
                        Get next messages    
                    </Button>
                </Wrapper>
            )
        }
        
    }
}


export default withTheme(AdminMessages)