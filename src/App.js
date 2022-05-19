import React, { useState, useEffect, useRef } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { doc, onSnapshot } from 'firebase/firestore';
import { IconContext } from 'react-icons';
import { ScreenClassProvider, setConfiguration } from 'react-grid-system';

// CSS
import "./assets/css/App.css";
import 'react-toastify/dist/ReactToastify.css';
import 'react-confirm-alert/src/react-confirm-alert.css';

// Components
import Footer from './components/misc/Footer';
import Header from './components/misc/Header';
import Views from "./Views";
import { FirebaseAnalytics, StartAtTop } from './components/misc/Misc';
import { auth, firestore } from './Fire';
import { DEFAULT_SITE, SCHEMES } from './utils/constants.js';
import { BodyWrapper, DevAlert, GlobalStyle, Spinner, Wrapper } from './utils/styles/misc';
import { H2 } from './utils/styles/text';


setConfiguration({ 
    // sm, md, lg, xl, xxl, xxxl
    breakpoints: [576, 768, 992, 1200, 1600, 1920],
    containerWidths: [540, 740, 960, 1140, 1540, 1810],
    defaultScreenClass: 'sm', 
    gutterWidth: 25 
});

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

    const [theme, setTheme] = useState({
        value: SCHEMES.LIGHT,
        colors: {
            primary: DEFAULT_SITE.THEME.COLORS.PRIMARY,
            secondary: DEFAULT_SITE.THEME.COLORS.SECONDARY,
            tertiary: DEFAULT_SITE.THEME.COLORS.TERTIARY,
            red: DEFAULT_SITE.THEME.COLORS.RED,
            green: DEFAULT_SITE.THEME.COLORS.GREEN,
            yellow: DEFAULT_SITE.THEME.COLORS.YELLOW,
            blue: DEFAULT_SITE.THEME.COLORS.BLUE,
            grey: DEFAULT_SITE.THEME.COLORS.GREY,
            lightGrey: DEFAULT_SITE.THEME.COLORS.LIGHT_GREY,
            font: {
                heading: DEFAULT_SITE.THEME.COLORS.FONT.HEADING.LIGHT,
                body:DEFAULT_SITE.THEME.COLORS.FONT.BODY.LIGHT,
                link: DEFAULT_SITE.THEME.COLORS.FONT.LINK.LIGHT,
            },
            background: DEFAULT_SITE.THEME.COLORS.BACKGROUND.LIGHT,
        },
        fonts: {
            heading: DEFAULT_SITE.THEME.FONTS.HEADING,
            body: DEFAULT_SITE.THEME.FONTS.BODY,
        },
    });

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
            colors: {
                primary: DEFAULT_SITE.THEME.COLORS.PRIMARY,
                secondary: DEFAULT_SITE.THEME.COLORS.SECONDARY,
                tertiary: DEFAULT_SITE.THEME.COLORS.TERTIARY,
                red: DEFAULT_SITE.THEME.COLORS.RED,
                green: DEFAULT_SITE.THEME.COLORS.GREEN,
                yellow: DEFAULT_SITE.THEME.COLORS.YELLOW,
                blue: DEFAULT_SITE.THEME.COLORS.BLUE,
                grey: DEFAULT_SITE.THEME.COLORS.GREY,
                lightGrey: DEFAULT_SITE.THEME.COLORS.LIGHT_GREY,
                font: {
                    heading: {
                        light: DEFAULT_SITE.THEME.COLORS.FONT.HEADING.LIGHT,
                        dark: DEFAULT_SITE.THEME.COLORS.FONT.HEADING.DARK,
                    },
                    body: {
                        light: DEFAULT_SITE.THEME.COLORS.FONT.BODY.LIGHT,
                        dark: DEFAULT_SITE.THEME.COLORS.FONT.BODY.DARK,
                    },
                    link: {
                        light: DEFAULT_SITE.THEME.COLORS.FONT.LINK.LIGHT,
                        dark: DEFAULT_SITE.THEME.COLORS.FONT.LINK.DARK,
                    },
                },
                background: {
                    light: DEFAULT_SITE.THEME.COLORS.BACKGROUND.LIGHT,
                    dark: DEFAULT_SITE.THEME.COLORS.BACKGROUND.DARK,
                },
            },
        },
    });

    // Properly assemble the theme object to be passed to styled-components Theme based on the current scheme preference.
    useEffect(() => {
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
        
        // Note: the extra logic of checking if the .light value of a color is taken is so this can be expanded to potentially accept a light and dark "red" for example.
        themeObject = { 
            value: isDarkScheme ? SCHEMES.DARK : SCHEMES.LIGHT,
            colors: {
                primary: !site.theme.colors.primary.light ? site.theme.colors.primary : (isDarkScheme ? site.theme.colors.primary.dark : site.theme.colors.primary.light),
                secondary: !site.theme.colors.secondary.light ? site.theme.colors.secondary : (isDarkScheme ? site.theme.colors.secondary.dark : site.theme.colors.secondary.light),
                tertiary: !site.theme.colors.tertiary.light ? site.theme.colors.tertiary : (isDarkScheme ? site.theme.colors.tertiary.dark : site.theme.colors.tertiary.light),
                red: !site.theme.colors.red.light ? site.theme.colors.red : (isDarkScheme ? site.theme.colors.red.dark : site.theme.colors.red.light),
                green: !site.theme.colors.green.light ? site.theme.colors.green : (isDarkScheme ? site.theme.colors.green.dark : site.theme.colors.green.light),
                yellow: !site.theme.colors.yellow.light ? site.theme.colors.yellow : (isDarkScheme ? site.theme.colors.yellow.dark : site.theme.colors.yellow.light),
                blue: !site.theme.colors.blue.light ? site.theme.colors.blue : (isDarkScheme ? site.theme.colors.blue.dark : site.theme.colors.blue.light),
                grey: !site.theme.colors.grey.light ? site.theme.colors.grey : (isDarkScheme ? site.theme.colors.grey.dark : site.theme.colors.grey.light),
                lightGrey: !site.theme.colors.lightGrey.light ? site.theme.colors.lightGrey : (isDarkScheme ? site.theme.colors.lightGrey.dark : site.theme.colors.lightGrey.light),
                font: {
                    heading: !site.theme.colors.font.heading.light ? site.theme.colors.font.heading : (isDarkScheme ? site.theme.colors.font.heading.dark : site.theme.colors.font.heading.light),
                    body: !site.theme.colors.font.body.light ? site.theme.colors.font.body : (isDarkScheme ? site.theme.colors.font.body.dark : site.theme.colors.font.body.light),
                    link: !site.theme.colors.font.link.light ? site.theme.colors.font.link : (isDarkScheme ? site.theme.colors.font.link.dark : site.theme.colors.font.link.light),
                },
                background: !site.theme.colors.background.light ? site.theme.colors.primary : (isDarkScheme ? site.theme.colors.background.dark : site.theme.colors.background.light),
            },
            fonts: {
                heading: site.theme.fonts.heading,
                body: site.theme.fonts.body
            },
        }

        setTheme(themeObject)
    }, [user, site])

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "public"), (siteDoc) => {
            if(siteDoc.exists()){
                let siteData = siteDoc.data();
                setSite(siteData)
                setLoading(prevState => ({
                    ...prevState,
                    site: false
                }));
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
                        setUser(docWithMore);
                        setLoading(prevState => ({
                            ...prevState,
                            user: false
                        }))
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

    const cleanUpLogout = () => {
        if(unsubUser.current){
            unsubUser?.current();
        }
        if(unsubReadOnlyFlags.current){
            unsubReadOnlyFlags?.current();
        }

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
        console.log("user: ")
        console.log(user)
        return (
            <HelmetProvider>
                <Helmet>
                    <title>{site.name ? `${site.name}` : "Fire React Base"}</title>
                </Helmet>
                <ScreenClassProvider>
                    {/* ** Adjust this paddingBottom if icon is unaligned with font, applied to ALL fonts. Override with inline style for 1 icon! */}
                    <IconContext.Provider value={{ style: { verticalAlign: "middle", display: "inline", paddingBottom: "1%"} }}>
                        <ThemeProvider theme={theme}>
                            <BodyWrapper>
                                <BrowserRouter>
                                    <GlobalStyle /> 
                                    <FirebaseAnalytics />
                                    <StartAtTop />
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
                                        theme={theme.value}
                                        closeOnClick
                                        rtl={false}
                                        pauseOnFocusLoss
                                        pauseOnHover
                                    />
                                    <Views 
                                        site={site}
                                        fireUser={fireUser} 
                                        user={user} 
                                        readOnlyFlags={readOnlyFlags}
                                        setFireUser={setFireUser}
                                        setUser={setUser}
                                        setReadOnlyFlags={setReadOnlyFlags}
                                        setIsLoggingIn={setIsLoggingIn} 
                                        cleanUpLogout={cleanUpLogout}
                                        isLoggingIn={isLoggingIn}
                                    />
                                    <Footer
                                        site={site} 
                                    />
                                </BrowserRouter>
                            </BodyWrapper>
                        </ThemeProvider>
                    </IconContext.Provider>
                </ScreenClassProvider>
                
            </HelmetProvider>
        );
    }
}

export default App;
