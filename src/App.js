import React, { useState, useEffect, useRef, useReducer } from 'react';
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
import { ACTIONS, DEFAULT_SITE, SCHEMES } from './utils/constants.js';
import { BodyWrapper, DevAlert, GlobalStyle, Spinner, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';

function App() {
    const [loading, setLoading] = useState({ 
        user: true,
        fireUser: true,
        site: true,
        readOnlyFlags: true
    }); 

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [user, setUser] = useState();

    const [fireUser, setFireUser] = useState("");

    const [readOnlyFlags, setReadOnlyFlags] = useState("");

    // Initially just pull the default site in case custom site not set yet
    const [site, setSite] = useState({
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
    });

    // Properly assemble the theme object to be passed to styled-components Theme based on the current scheme preference.
    function currentThemeReducer(currentTheme, action){
        let themeObject = {};
        let isDarkScheme = false;
        
        if(action.type === ACTIONS.CURRENT_THEME.USER_CHANGE){
            // User signed in, so grab their currently set preference
            if((action.payload.user?.flags?.themeScheme ?? SCHEMES.LIGHT) === SCHEMES.DARK){
                isDarkScheme = true
            }
        } else {
            // No user signed in yet, so just grab the user's OS preference
            if((window.matchMedia(`(prefers-color-scheme: ${SCHEMES.DARK})`).matches ? SCHEMES.DARK : SCHEMES.LIGHT) === SCHEMES.DARK){
                isDarkScheme = true
            }
        }

        console.log("action: ")
        console.log(action)

        
        // console.log("currentTheme: ")
        // console.log(currentTheme)
        
        themeObject = { 
            value: isDarkScheme ? action.payload.site.theme.schemes.dark.value : action.payload.site.theme.schemes.light.value,
            colors: {
                primary: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.primary : action.payload.site.theme.schemes.light.colors.primary,
                secondary: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.secondary : action.payload.site.theme.schemes.light.colors.secondary,
                tertiary: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.tertiary : action.payload.site.theme.schemes.light.colors.tertiary,
                red: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.red : action.payload.site.theme.schemes.light.colors.red,
                green: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.green : action.payload.site.theme.schemes.light.colors.green,
                yellow: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.yellow : action.payload.site.theme.schemes.light.colors.yellow,
                blue: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.blue : action.payload.site.theme.schemes.light.colors.blue,
                grey: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.grey : action.payload.site.theme.schemes.light.colors.grey,
                lightGrey: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.lightGrey : action.payload.site.theme.schemes.light.colors.lightGrey,
                font: {
                    heading: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.font.heading : action.payload.site.theme.schemes.light.colors.font.heading,
                    body: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.font.body : action.payload.site.theme.schemes.light.colors.font.body,
                    link: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.font.link : action.payload.site.theme.schemes.light.colors.font.link,
                },
                background: isDarkScheme ? action.payload.site.theme.schemes.dark.colors.background : action.payload.site.theme.schemes.light.colors.background,
            },
            fonts: {
                heading: action.payload.site.theme.fonts.heading,
                body: action.payload.site.theme.fonts.body
            },
        }

        return themeObject;
    }

    const [currentTheme, dispatchCurrentTheme] = useReducer(currentThemeReducer, {
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
    })

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "public"), (siteDoc) => {
            if(siteDoc.exists()){
                let siteData = siteDoc.data();
                setSite(siteData)
                setLoading(prevState => ({
                    ...prevState,
                    site: false
                }));
                dispatchCurrentTheme({ type: ACTIONS.CURRENT_THEME.SITE_EXISTS, payload: { site: siteData } });
            } else {
                console.log("No custom site set, using theme defaults in setSite.")
                setLoading(prevState => ({
                    ...prevState,
                    site: false
                }));
            }
        });
    }, [])

    const unsubUser = useRef();
    const unsubReadOnlyFlags = useRef();

    useEffect(() => {
        onAuthStateChanged(auth, (fireUserData) => {
            // console.log("fireUserData: ")
            // console.log(fireUserData)
            if (fireUserData) {
                setFireUser(fireUserData)
                setLoading(prevState => ({
                    ...prevState,
                    fireUser: false
                }))

                unsubUser.current = onSnapshot(doc(firestore, "users", fireUserData.uid), (userDoc) => {
                    if(userDoc.exists()){
                        // User exists
                        const docWithMore = Object.assign({}, userDoc.data());
                        docWithMore.id = userDoc.id;
                        console.log("user docWithMore: ")
                        console.log(docWithMore)
                        setUser(docWithMore);
                        setLoading(prevState => ({
                            ...prevState,
                            user: false
                        }))
                        dispatchCurrentTheme({ type: ACTIONS.CURRENT_THEME.USER_CHANGE, payload: { site: site } });
                    } else {
                        console.log("No user exists.")
                        setLoading(prevState => ({
                            ...prevState,
                            user: false
                        }))
                    }
                });

                // For seeing if admin
                unsubReadOnlyFlags.current = onSnapshot(doc(firestore, "users", fireUserData.uid, "readOnly", "flags"), (readOnlyFlagsDoc) => {
                    if(readOnlyFlagsDoc.exists()){
                        setReadOnlyFlags(readOnlyFlagsDoc.data());
                        setLoading(prevState => ({
                            ...prevState,
                            readOnlyFlags: false
                        }));
                    } else {
                        console.log("No read only read only flags exists.")
                        setLoading(prevState => ({
                            ...prevState,
                            readOnlyFlags: false
                        }));
                    }
                });
                
            } else {
                // No user signed in
                dispatchCurrentTheme({ type: ACTIONS.CURRENT_THEME.USER_CHANGE, payload: { site: site }  });
                setLoading(prevState => ({
                    ...prevState,
                    fireUser: false,
                    user: false,
                    readOnlyFlags: false
                }))
            }
        });

        return () => {
            if(unsubUser.current){
                unsubUser?.current();
            }
            if(unsubReadOnlyFlags.current){
                unsubReadOnlyFlags?.current();
            }
        };
    }, [site]);

    // These userLogging functions are to clean up, but 
    // mainly we needed to "wake up" the parent component by changing the state.
    // Might be a better way to do this... tbd
    const userLoggingOut = () => {
        unsubUser?.current();
        unsubReadOnlyFlags?.current();

        setFireUser("");
        setUser("");
        setReadOnlyFlags("")
    }
    
    if(loading.fireUser || loading.user || loading.readOnlyFlags || loading.site){
        return (
            <Wrapper>
                <H2>Loading... <Spinner /> </H2> 
            </Wrapper>
        )
    } else {
        return (
            <HelmetProvider>
                <Helmet>
                    <title>{site.name ? `${site.name}` : "Fire React Base"}</title>
                </Helmet>
                <IconContext.Provider value={{ style: { verticalAlign: "middle", display: "inline", paddingBottom: "1%"} }}>
                    <ThemeProvider theme={currentTheme}>
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
                                    site={site}
                                    user={user} 
                                />
                                <ToastContainer
                                    position="top-center"
                                    autoClose={4000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    theme={currentTheme.value}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    pauseOnHover
                                />
                                <Views 
                                    fireUser={fireUser} 
                                    user={user} 
                                    site={site}
                                    readOnlyFlags={readOnlyFlags}
                                    userLoggingOut={userLoggingOut} 
                                    setIsLoggingIn={setIsLoggingIn} 
                                    isLoggingIn={isLoggingIn}
                                />
                                <Footer
                                    site={site} 
                                />
                            </BrowserRouter>
                        </BodyWrapper>
                    </ThemeProvider>
                </IconContext.Provider>
            </HelmetProvider>
        );
    }
}

export default App;
