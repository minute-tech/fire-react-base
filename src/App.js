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
import { DevAlert, GlobalStyle, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';
import { doc, onSnapshot } from 'firebase/firestore';

export default class App extends Component {
    constructor(props) {
      super(props)
        this.state = {
            loading: true,
            fireUser: "",
            theme: {},
        }
    }

    componentDidMount(){
        const fireAuth = auth;
        this.unsubAuth = onAuthStateChanged(fireAuth, (fireUser) => {
            if (fireUser) {
                let user = "";
                this.unsubUser = onSnapshot(doc(firestore, "users", fireUser.uid), (userDoc) => {
                    if(userDoc.exists){
                        user = userDoc.data();
                        // ** These set states are really big and annoying.. can we refactor them to be smaller?
                        this.setState({
                            fireUser: fireUser,
                            user: user,
                            loading: false,
                            theme: {
                                value: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.VALUE :DEFAULT_THEME.SCHEME.LIGHT.VALUE,
                                colors: {
                                    primary: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.PRIMARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.PRIMARY,
                                    secondary: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.SECONDARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.SECONDARY,
                                    tertiary: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.TERTIARY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.TERTIARY,
                                    red: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.RED : DEFAULT_THEME.SCHEME.LIGHT.COLORS.RED,
                                    green: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREEN : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREEN,
                                    yellow: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.YELLOW : DEFAULT_THEME.SCHEME.LIGHT.COLORS.YELLOW,
                                    blue: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BLUE : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BLUE,
                                    grey: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.GREY,
                                    lightGrey: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.LIGHT_GREY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.LIGHT_GREY,
                                    font: {
                                        heading: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.HEADING : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.HEADING,
                                        body: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.BODY : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.BODY,
                                        link: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.FONT.LINK : DEFAULT_THEME.SCHEME.LIGHT.COLORS.FONT.LINK,
                                    },
                                    background: user.flags.themeScheme === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.COLORS.BACKGROUND : DEFAULT_THEME.SCHEME.LIGHT.COLORS.BACKGROUND,
                                },
                                fonts: {
                                    heading: DEFAULT_THEME.FONTS.ROBOTO_BOLD,
                                    body: DEFAULT_THEME.FONTS.ROBOTO_REGULAR
                                },
                            }
                        });
                    }
                });
            } else {
                this.setState({
                    loading: false,
                    theme: {
                        value: (window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.SCHEME.DARK.VALUE})`).matches ? DEFAULT_THEME.SCHEME.DARK.VALUE : DEFAULT_THEME.SCHEME.LIGHT.VALUE) === DEFAULT_THEME.SCHEME.DARK.VALUE ? DEFAULT_THEME.SCHEME.DARK.VALUE :DEFAULT_THEME.SCHEME.LIGHT.VALUE,
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
                            heading: DEFAULT_THEME.FONTS.ROBOTO_BOLD,
                            body: DEFAULT_THEME.FONTS.ROBOTO_REGULAR
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
    }

    userLoggedOut = () => {
        this.setState({
            fireUser: "",
            user: ""
        });
    }

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
                                autoClose={5000}
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
                                userLoggedOut={this.userLoggedOut} 
                            />
                            <Footer />
                        </BrowserRouter>
                    </ThemeProvider>
                </HelmetProvider>
            );
        }
    }
}

