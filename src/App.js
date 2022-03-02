import React, { Component } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';

// CSS
import "./assets/css/App.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Components
import Footer from './components/misc/Footer';
import Header from './components/misc/Header';
import Views from "./Views";
import { FirebaseAnalytics } from './components/misc/FirebaseAnalytics';
import { auth, firestore } from './Fire';
import { DEFAULT_THEME } from './utils/constants';
import { DevAlert, GlobalStyle, Spinner, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';
import { doc, onSnapshot } from 'firebase/firestore';
import { IconContext } from 'react-icons';

export default class App extends Component {
    constructor(props) {
      super(props)
        this.state = {
            // Reminder that we cannot have a nested object with all loading or submitting flags
            // The objects are being overwritten when we change just 1 flag. We could prevent that by
            // copying the object, then changing it and re-setting the state, but that is cumbersome.
            // Usually only a few loading/submitting flags per page anyways. Con is long var names lol.
            loadingFireUser: true,
            loadingUser: true,
            loadingReadOnlyFlags: true,
            isLoggingIn: false,
            fireUser: "",
            user: "",
            readOnlyFlags: "",
            // initially just pull their OS scheme preference
            theme: {
                value: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE,
                colors: {
                    primary: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.PRIMARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.PRIMARY,
                    secondary: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.SECONDARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.SECONDARY,
                    tertiary: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.TERTIARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.TERTIARY,
                    red: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.RED : DEFAULT_THEME.SCHEME.LIGHT.COLORS.RED,
                    green: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREEN : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREEN,
                    yellow: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.YELLOW : DEFAULT_THEME.SCHEME.LIGHT.COLORS.YELLOW,
                    blue: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BLUE : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BLUE,
                    grey: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREY,
                    lightGrey: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.LIGHT_GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.LIGHT_GREY,
                    font: {
                        heading: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.HEADING : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.HEADING,
                        body: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.BODY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.BODY,
                        link: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.LINK : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.LINK,
                    },
                    background: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BACKGROUND : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BACKGROUND,
                },
                fonts: {
                    heading: DEFAULT_THEME.FONTS.HEADING,
                    body: DEFAULT_THEME.FONTS.BODY
                },
            }
        }
    }

    componentDidMount(){
        this.unsubAuth = onAuthStateChanged(auth, (fireUser) => {
            console.log("fireUser: ");
            console.log(fireUser);
            if (fireUser) {
                this.setState({
                    fireUser: fireUser,
                    loadingFireUser: false,
                });

                this.unsubUser = onSnapshot(doc(firestore, "users", fireUser.uid), (userDoc) => {
                    if(userDoc.exists){
                        // User exists, so grab their scheme preference from Firestore
                        // ** These set states are really big and annoying.. can we refactor them to be smaller?
                        let userData = userDoc.data();
                        this.setState({
                            user: userData,
                            loadingUser: false,
                            theme: {
                                value: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE,
                                colors: {
                                    primary: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.PRIMARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.PRIMARY,
                                    secondary: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.SECONDARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.SECONDARY,
                                    tertiary: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.TERTIARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.TERTIARY,
                                    red: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.RED : DEFAULT_THEME.SCHEME.LIGHT.COLORS.RED,
                                    green: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREEN : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREEN,
                                    yellow: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.YELLOW : DEFAULT_THEME.SCHEME.LIGHT.COLORS.YELLOW,
                                    blue: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BLUE : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BLUE,
                                    grey: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREY,
                                    lightGrey: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.LIGHT_GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.LIGHT_GREY,
                                    font: {
                                        heading: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.HEADING : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.HEADING,
                                        body: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.BODY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.BODY,
                                        link: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.LINK : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.LINK,
                                    },
                                    background: (userData?.flags?.themeScheme ?? DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BACKGROUND : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BACKGROUND,
                                },
                                fonts: {
                                    heading: DEFAULT_THEME.FONTS.HEADING,
                                    body: DEFAULT_THEME.FONTS.BODY
                                },
                            }
                        });
                    }
                });

                // For seeing if admin
                this.unsubReadOnlyFlags = onSnapshot(doc(firestore, "users", fireUser.uid, "readOnly", "flags"), (readOnlyFlagsDoc) => {
                    if(readOnlyFlagsDoc.exists){
                        this.setState({
                            readOnlyFlags: readOnlyFlagsDoc.data(),
                            loadingReadOnlyFlags: false,
                        });
                    } 
                });
            } else {
                // No user signed in
                this.setState({
                    loadingFireUser: false,
                    loadingUser: false,
                    loadingReadOnlyFlags: false,
                });
            }
        });

    }

    componentWillUnmount(){
        if(this.unsubUser){
            this.unsubUser();
        }

        if(this.unsubReadOnlyFlags){
            this.unsubReadOnlyFlags();
        }
    }

    // These userLogging functions are to clean up, but 
    // mainly we needed to "wake up" the parent component by changing the state.
    // Might be a better way to do this.
    userLoggingOut = () => {
        if(this.unsubUser){
            this.unsubUser();
        }

        if(this.unsubReadOnlyFlags){
            this.unsubReadOnlyFlags();
        }

        this.setState({
            fireUser: "",
            user: "",
            readOnlyFlags: "",
        });
    }

    userLoggingIn = (value) => {
        this.setState({
            isLoggingIn: value
        })
    }

    render() {
        if(this.state.loadingFireUser || this.state.loadingUser || this.state.loadingReadOnlyFlags){
            return (
                <Wrapper>
                    <H2>Loading... <Spinner /> </H2> 
                </Wrapper>
            )
        } else {
            return (
                <HelmetProvider>
                    <IconContext.Provider value={{ style: { verticalAlign: "middle", display: "inline", paddingBottom: "1%"} }}>
                        <ThemeProvider theme={this.state.theme}>
                            <BrowserRouter>
                                {process.env.NODE_ENV === 'development' && (
                                    <DevAlert>
                                        LOCAL SERVER
                                    </DevAlert>
                                )}                            
                                <ToastContainer
                                    position="top-center"
                                    autoClose={4000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    theme={this.state.theme.value}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    pauseOnHover
                                />
                                <GlobalStyle /> 
                                <Header fireUser={this.state.fireUser} />
                                <FirebaseAnalytics />
                                <Views 
                                    fireUser={this.state.fireUser} 
                                    user={this.state.user} 
                                    readOnlyFlags={this.state.readOnlyFlags}
                                    userLoggingOut={this.userLoggingOut} 
                                    userLoggingIn={this.userLoggingIn} 
                                    isLoggingIn={this.state.isLoggingIn}
                                />
                                <Footer />
                            </BrowserRouter>
                        </ThemeProvider>
                    </IconContext.Provider>
                </HelmetProvider>
            );
        }
    }
}

