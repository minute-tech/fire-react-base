import React, { Component } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import { IconContext } from 'react-icons';

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
import { DEFAULT_SITE, SCHEMES } from './utils/constants.js';
import { BodyWrapper, DevAlert, GlobalStyle, Spinner, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';

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
            loadingSite: true,
            loadingReadOnlyFlags: true,
            isLoggingIn: false,
            fireUser: "",
            user: "",
            readOnlyFlags: "",
            // Initially just pull the default site in case custom site not set yet
            site: {
                unset: true,
                name: DEFAULT_SITE.NAME,
                logo: {
                    width: DEFAULT_SITE.LOGO.WIDTH,
                    url: DEFAULT_SITE.LOGO.URL,
                    showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
                },
                hero: {
                    heading: DEFAULT_SITE.HERO.HEADING,
                    body: DEFAULT_SITE.HERO.BODY,
                    cta: {
                        link: DEFAULT_SITE.HERO.CTA.LINK,
                        text: DEFAULT_SITE.HERO.CTA.TEXT,
                        size: DEFAULT_SITE.HERO.CTA.SIZE,
                        color: DEFAULT_SITE.HERO.CTA.COLOR,
                    },                    
                    banner: DEFAULT_SITE.HERO.BANNER,
                },
                emails: {
                    support: DEFAULT_SITE.EMAILS.SUPPORT,
                    noreply: DEFAULT_SITE.EMAILS.NOREPLY,
                },
                theme: { 
                    fonts: {
                        heading: DEFAULT_SITE.THEME.FONTS.HEADING,
                        body: DEFAULT_SITE.THEME.FONTS.BODY,
                    },
                    schemes: {
                        light: {
                            value: DEFAULT_SITE.THEME.SCHEMES.LIGHT.VALUE,
                            colors: {
                                primary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.PRIMARY,
                                secondary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.SECONDARY,
                                tertiary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.TERTIARY,
                                red: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.RED,
                                green: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREEN,
                                yellow: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.YELLOW,
                                blue: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BLUE,
                                grey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREY,
                                lightGrey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.LIGHT_GREY,
                                font: {
                                    heading: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.HEADING,
                                    body:DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.BODY,
                                    link: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.LINK,
                                },
                                background: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BACKGROUND,
                            },
                        },
                        dark: {
                            value: DEFAULT_SITE.THEME.SCHEMES.DARK.VALUE,
                            colors: {
                                primary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.PRIMARY,
                                secondary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.SECONDARY,
                                tertiary: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.TERTIARY,
                                red: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.RED,
                                green: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.GREEN,
                                yellow: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.YELLOW,
                                blue: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.BLUE,
                                grey: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.GREY,
                                lightGrey: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.LIGHT_GREY,
                                font: {
                                    heading: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.HEADING,
                                    body:DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.BODY,
                                    link: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.FONT.LINK,
                                },
                                background: DEFAULT_SITE.THEME.SCHEMES.DARK.COLORS.BACKGROUND,
                            },
                        },
                    },
                },
            },
            currentTheme: {
                value: DEFAULT_SITE.THEME.SCHEMES.LIGHT.VALUE,
                colors: {
                    primary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.PRIMARY,
                    secondary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.SECONDARY,
                    tertiary: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.TERTIARY,
                    red: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.RED,
                    green: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREEN,
                    yellow: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.YELLOW,
                    blue: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BLUE,
                    grey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.GREY,
                    lightGrey: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.LIGHT_GREY,
                    font: {
                        heading: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.HEADING,
                        body:DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.BODY,
                        link: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.FONT.LINK,
                    },
                    background: DEFAULT_SITE.THEME.SCHEMES.LIGHT.COLORS.BACKGROUND,
                },
                fonts: {
                    heading: DEFAULT_SITE.THEME.FONTS.HEADING,
                    body: DEFAULT_SITE.THEME.FONTS.BODY,
                },
            }
        }
    }

    componentDidMount(){
        let siteData = "";
        this.unsubPublicSite = onSnapshot(doc(firestore, "site", "public"), (siteDoc) => {
            if(siteDoc.exists()){
                siteData = siteDoc.data();
                this.setState({
                    site: siteData,
                    loadingSite: false
                });
                this.setCurrentTheme();
            } else {
                console.log("No custom site set, using theme defaults set in constructor.")
                this.setState({
                    loadingSite: false
                });
            }
        });

        this.unsubAuth = onAuthStateChanged(auth, (fireUser) => {
            if (fireUser) {
                this.setState({
                    fireUser: fireUser,
                    loadingFireUser: false,
                });

                this.unsubUser = onSnapshot(doc(firestore, "users", fireUser.uid), (userDoc) => {
                    if(userDoc.exists()){
                        // User exists
                        const docWithMore = Object.assign({}, userDoc.data());
                        docWithMore.id = userDoc.id;
                        this.setState({
                            user: docWithMore,
                            loadingUser: false,
                        });
                        this.setCurrentTheme(docWithMore);
                    } else {
                        console.log("No user exists.")
                        this.setState({
                            loadingUser: false,
                        });
                    }
                });

                // For seeing if admin
                this.unsubReadOnlyFlags = onSnapshot(doc(firestore, "users", fireUser.uid, "readOnly", "flags"), (readOnlyFlagsDoc) => {
                    if(readOnlyFlagsDoc.exists()){
                        this.setState({
                            readOnlyFlags: readOnlyFlagsDoc.data(),
                            loadingReadOnlyFlags: false,
                        });
                    } else {
                        console.log("No read only read only flags exists.")
                        this.setState({
                            loadingReadOnlyFlags: false,
                        });
                    }
                });
                
            } else {
                this.setCurrentTheme();
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
        if(this.unsubPublicSite){
            this.unsubPublicSite();
        }

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

    // Properly assemble the theme object to be passed to styled-components Theme based on the current scheme preference.
    setCurrentTheme = (user = "") => {
        let themeObject = {};
        let isDarkScheme = false;

        if(user){
            // User signed in, so grab their currently set preference
            if((user?.flags?.themeScheme ?? SCHEMES.LIGHT) === SCHEMES.DARK){
                isDarkScheme = true
            }
        } else {
            // No user signed in yet, so just grab the user's OS preference
            if((window.matchMedia(`(prefers-color-scheme: ${SCHEMES.DARK})`).matches ? SCHEMES.DARK : SCHEMES.LIGHT) === SCHEMES.DARK){
                isDarkScheme = true
            }
        }
        
        themeObject = { 
            value: isDarkScheme ? this.state.site.theme.schemes.dark.value : this.state.site.theme.schemes.light.value,
            colors: {
                primary: isDarkScheme ? this.state.site.theme.schemes.dark.colors.primary : this.state.site.theme.schemes.light.colors.primary,
                secondary: isDarkScheme ? this.state.site.theme.schemes.dark.colors.secondary : this.state.site.theme.schemes.light.colors.secondary,
                tertiary: isDarkScheme ? this.state.site.theme.schemes.dark.colors.tertiary : this.state.site.theme.schemes.light.colors.tertiary,
                red: isDarkScheme ? this.state.site.theme.schemes.dark.colors.red : this.state.site.theme.schemes.light.colors.red,
                green: isDarkScheme ? this.state.site.theme.schemes.dark.colors.green : this.state.site.theme.schemes.light.colors.green,
                yellow: isDarkScheme ? this.state.site.theme.schemes.dark.colors.yellow : this.state.site.theme.schemes.light.colors.yellow,
                blue: isDarkScheme ? this.state.site.theme.schemes.dark.colors.blue : this.state.site.theme.schemes.light.colors.blue,
                grey: isDarkScheme ? this.state.site.theme.schemes.dark.colors.grey : this.state.site.theme.schemes.light.colors.grey,
                lightGrey: isDarkScheme ? this.state.site.theme.schemes.dark.colors.lightGrey : this.state.site.theme.schemes.light.colors.lightGrey,
                font: {
                    heading: isDarkScheme ? this.state.site.theme.schemes.dark.colors.font.heading : this.state.site.theme.schemes.light.colors.font.heading,
                    body: isDarkScheme ? this.state.site.theme.schemes.dark.colors.font.body : this.state.site.theme.schemes.light.colors.font.body,
                    link: isDarkScheme ? this.state.site.theme.schemes.dark.colors.font.link : this.state.site.theme.schemes.light.colors.font.link,
                },
                background: isDarkScheme ? this.state.site.theme.schemes.dark.colors.background : this.state.site.theme.schemes.light.colors.background,
            },
            fonts: {
                heading: this.state.site.theme.fonts.heading,
                body: this.state.site.theme.fonts.body
            },
        }

        this.setState({
            currentTheme: themeObject
        })
    }

    render() {
        if(this.state.loadingFireUser || this.state.loadingUser || this.state.loadingReadOnlyFlags || this.state.loadingSite){
            return (
                <Wrapper>
                    <H2>Loading... <Spinner /> </H2> 
                </Wrapper>
            )
        } else {
            return (
                <HelmetProvider>
                    <Helmet>
                        <title>{this.state.site.name ? `${this.state.site.name}` : "Fire React Base"}</title>
                    </Helmet>
                    <IconContext.Provider value={{ style: { verticalAlign: "middle", display: "inline", paddingBottom: "1%"} }}>
                        <ThemeProvider theme={this.state.currentTheme}>
                            <BodyWrapper>
                                <BrowserRouter>
                                    <GlobalStyle /> 
                                    <FirebaseAnalytics />
                                    {process.env.NODE_ENV === 'development' && (
                                        <DevAlert>
                                            LOCAL SERVER
                                        </DevAlert>
                                    )}      
                                    <Header 
                                        site={this.state.site}
                                        user={this.state.user} 
                                    />
                                    <ToastContainer
                                        position="top-center"
                                        autoClose={4000}
                                        hideProgressBar={false}
                                        newestOnTop={false}
                                        theme={this.state.currentTheme.value}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        pauseOnHover
                                    />
                                    <Views 
                                        fireUser={this.state.fireUser} 
                                        user={this.state.user} 
                                        site={this.state.site}
                                        readOnlyFlags={this.state.readOnlyFlags}
                                        userLoggingOut={this.userLoggingOut} 
                                        userLoggingIn={this.userLoggingIn} 
                                        isLoggingIn={this.state.isLoggingIn}
                                    />
                                    <Footer
                                        site={this.state.site} 
                                    />
                                </BrowserRouter>
                            </BodyWrapper>
                        </ThemeProvider>
                    </IconContext.Provider>
                </HelmetProvider>
            );
        }
    }
}

