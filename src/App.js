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
            loading: {
                roFlags: true,
                user: true
            },
            fireUser: "",
            theme: {},
        }
    }

    componentDidMount(){
        const fireAuth = auth;
        this.unsubAuth = onAuthStateChanged(fireAuth, (fireUser) => {
            if (fireUser) {
                let userData = "";
                this.unsubUser = onSnapshot(doc(firestore, "users", fireUser.uid), (userDoc) => {
                    if(userDoc.exists){
                        // User exists, so grab their scheme preference from Firestore
                        // ** These set states are really big and annoying.. can we refactor them to be smaller?
                        userData = userDoc.data();
                        this.setState({
                            fireUser: fireUser,
                            user: userData,
                            loading: {
                                user: false
                            },
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
                this.unsubROFlags = onSnapshot(doc(firestore, "users", fireUser.uid,"readOnly", "flags"), (roFlagsDoc) => {
                    if(roFlagsDoc.exists){
                        this.setState({
                            roFlags: roFlagsDoc.data(),
                            loading: {
                                roFlags: false
                            },
                        });
                    }
                });
            } else {
                // No user signed in, just pull their OS scheme preference
                this.setState({
                    loading: {
                        user: false,
                        roFlags: false
                    },
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
                });
            }
        });

    }

    componentWillUnmount(){
        if(this.unsubAuth){
            this.unsubAuth();
        }

        if(this.unsubUser){
            this.unsubUser();
        }

        if(this.unsubROFlags){
            this.unsubROFlags();
        }
    }

    userLoggedOut = () => {
        if(this.unsubUser){
            this.unsubUser();
        }

        this.setState({
            fireUser: "",
            user: "",
            roFlags: "",
        });
    }

    render() {
        if(this.state.loading.user && this.state.loading.roFlags){
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
                                { !this.state.loading && (
                                    <>
                                    {process.env.NODE_ENV === 'development' && (
                                        <DevAlert>
                                            LOCAL SERVER
                                        </DevAlert>
                                    )}
                                    
                                    </>
                                )}
                                <GlobalStyle /> 
                                <Header fireUser={this.state.fireUser} />
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
                                <FirebaseAnalytics />
                                <Views 
                                    fireUser={this.state.fireUser} 
                                    user={this.state.user} 
                                    roFlags={this.state.roFlags}
                                    userLoggedOut={this.userLoggedOut} 
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

