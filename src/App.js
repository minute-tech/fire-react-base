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
import { auth } from './Fire';
import { DEFAULT_THEME } from './utils/constants';
import { DevAlert, GlobalStyle, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';

export default class App extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         loading: true,
         user: "",
         theme: {},
         themeMode: window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.MODES.DARK.VALUE})`).matches ? DEFAULT_THEME.MODES.DARK.VALUE : DEFAULT_THEME.MODES.LIGHT.VALUE,
      }
    }

    componentDidMount(){
        console.log("this.state.themeMode: " + this.state.themeMode)
        window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.MODES.DARK.VALUE})`).addEventListener('change', (element) => { 
                this.setState({
                    themeMode: element.matches ? DEFAULT_THEME.MODES.LIGHT.VALUE : DEFAULT_THEME.MODES.LIGHT.VALUE,
                })
            }
        );
        
        if(this.state.themeMode === DEFAULT_THEME.MODES.DARK.VALUE){
            this.setState({
                theme: {
                    value: DEFAULT_THEME.MODES.DARK.VALUE,
                    colors: {
                        primary: DEFAULT_THEME.MODES.DARK.COLORS.PRIMARY,
                        secondary: DEFAULT_THEME.MODES.DARK.COLORS.SECONDARY,
                        tertiary: DEFAULT_THEME.MODES.DARK.COLORS.TERTIARY,
                        red: DEFAULT_THEME.MODES.DARK.COLORS.RED,
                        green: DEFAULT_THEME.MODES.DARK.COLORS.GREEN,
                        yellow: DEFAULT_THEME.MODES.DARK.COLORS.YELLOW,
                        grey: DEFAULT_THEME.MODES.DARK.COLORS.GREY,
                        lightGrey: DEFAULT_THEME.MODES.DARK.COLORS.LIGHT_GREY,
                        blue: DEFAULT_THEME.MODES.DARK.COLORS.BLUE,
                        font: {
                            heading: DEFAULT_THEME.MODES.DARK.COLORS.FONT.HEADING,
                            body: DEFAULT_THEME.MODES.DARK.COLORS.FONT.BODY,
                            link: DEFAULT_THEME.MODES.DARK.COLORS.FONT.LINK,
                        },
                        background: DEFAULT_THEME.MODES.DARK.COLORS.BACKGROUND
                    },
                    fonts: {
                        heading: DEFAULT_THEME.FONTS.ROBOTO_BOLD,
                        body: DEFAULT_THEME.FONTS.ROBOTO_REGULAR
                    },
                }
            });
        } else {
            this.setState({
                theme: {
                    value: DEFAULT_THEME.MODES.LIGHT.VALUE,
                    colors: {
                        primary: DEFAULT_THEME.MODES.LIGHT.COLORS.PRIMARY,
                        secondary: DEFAULT_THEME.MODES.LIGHT.COLORS.SECONDARY,
                        tertiary: DEFAULT_THEME.MODES.LIGHT.COLORS.TERTIARY,
                        red: DEFAULT_THEME.MODES.LIGHT.COLORS.RED,
                        green: DEFAULT_THEME.MODES.LIGHT.COLORS.GREEN,
                        yellow: DEFAULT_THEME.MODES.LIGHT.COLORS.YELLOW,
                        grey: DEFAULT_THEME.MODES.LIGHT.COLORS.GREY,
                        lightGrey: DEFAULT_THEME.MODES.LIGHT.COLORS.LIGHT_GREY,
                        blue: DEFAULT_THEME.MODES.LIGHT.COLORS.BLUE,
                        font: {
                            heading: DEFAULT_THEME.MODES.LIGHT.COLORS.FONT.HEADING,
                            body: DEFAULT_THEME.MODES.LIGHT.COLORS.FONT.BODY,
                            link: DEFAULT_THEME.MODES.LIGHT.COLORS.FONT.LINK,
                        },
                        background: DEFAULT_THEME.MODES.LIGHT.COLORS.BACKGROUND
                    },
                    fonts: {
                        heading: DEFAULT_THEME.FONTS.ROBOTO_BOLD,
                        body: DEFAULT_THEME.FONTS.ROBOTO_REGULAR
                    },
                }
            });
        }
        
        const fireAuth = auth;
        this.unsubscribeAuth = onAuthStateChanged(fireAuth, (user) => {
            if (user) {
                this.setState({
                    user: user,
                    loading: false
                });
            } else {
                this.setState({
                    loading: false
                });
            }
        });
    }

    componentWillUnmount(){
        if(this.unsubscribeAuth){
            this.unsubscribeAuth();
        }

        window.matchMedia(`(prefers-color-scheme: ${DEFAULT_THEME.MODES.DARK.VALUE})`).removeEventListener('change', () => {
            console.log("Safely removed theme listener.")
        });
    }

    userLoggedOut = () => {
        this.setState({
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
                            <Header user={this.state.user} />
                            <ToastContainer
                                position="top-center"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                theme={this.state.themeMode}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                pauseOnHover
                            />
                            <FirebaseAnalytics />
                            <Views user={this.state.user} userLoggedOut={this.userLoggedOut} />
                            <Footer />
                        </BrowserRouter>
                    </ThemeProvider>
                </HelmetProvider>
            );
        }
    }
}

