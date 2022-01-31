import React, { Component } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Views from "./Views";

// CSS
import "./assets/css/App.css";
import 'react-notifications-component/dist/theme.css'

import { DevAlert, GlobalStyle, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';

// Components
import Footer from './components/misc/Footer';
import Header from './components/misc/Header';

import { COLORS, FONTS } from './utils/constants';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';

export default class App extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         loading: true
      }
    }

    componentDidMount(){
        // fire.auth().onAuthStateChanged((user) => {
        //   if(user){
        //     // Listen for user state change
        //     this.unsubscribeReadOnly = firestore.collection("users").doc(user.uid).collection('readOnly').doc('flags')
        //         .onSnapshot((doc) => {
        //             if(doc.exists){
        //                 this.setState({
        //                     isSuperUser: doc.data().isSuperUser
        //                 })
        //             }
        //         });
            
        //     this.setState({
        //         user: user,
        //         loading: false
        //     });
        //   } else {
            this.setState({
              loading: false
            });
        //   }
        // });
    }
    
    // componentWillUnmount(){
    //     if(this.unsubscribeReadOnly){
    //         this.unsubscribeReadOnly();
    //     }
    // }

    render() {
        if(this.state.loading){
            return (
                <Wrapper>
                    <H2>Loading... <i className="fas fa-spinner fa-spin" /></H2> 
                </Wrapper>
            )
        } else {
            return (
                <HelmetProvider>
                    <ThemeProvider 
                        // Pass any user defined colors below
                        // i.e.: primary: this.state.user.theme.color || COLORS.PRIMARY
                        theme={{
                            colors: {
                                primary: COLORS.PRIMARY,
                                secondary: COLORS.SECONDARY,
                                tertiary: COLORS.TERTIARY,
                                red: COLORS.RED,
                                green: COLORS.GREEN,
                                yellow: COLORS.YELLOW,
                                grey: COLORS.GREY,
                                lightGrey: COLORS.LIGHT_GREY,
                                blue: COLORS.BLUE
                            },
                            fonts: {
                                heading: FONTS.ROBOTO_BOLD,
                                body: FONTS.ROBOTO_REGULAR
                            }
                        }}
                    >
                        <BrowserRouter>
                            { !this.state.loading && (
                                <>
                                {process.env.NODE_ENV === 'development' && (
                                    <DevAlert>
                                        LOCAL SERVER
                                    </DevAlert>
                                )}
                                
                                </>
                            )}
                            <Header />
                            {/* <ReactNotificationStyled /> */}
                            <GlobalStyle /> 
                            <Views />
                            <Footer />
                        </BrowserRouter>
                    </ThemeProvider>
                </HelmetProvider>
            );
        }
    }
}

