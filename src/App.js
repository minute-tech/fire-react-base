import React, { useState, useEffect, useRef } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { collection, doc, onSnapshot, query } from 'firebase/firestore';
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
import { DEFAULT_SITE, SCHEMES, ITEMS } from './utils/constants.js';
import { BodyWrapper, Centered, DevAlert, Div, GlobalStyle } from './utils/styles/misc';
import { Spinner } from './utils/styles/images';
import DynamicHeadTags from './components/misc/DynamicHeadTags';

setConfiguration({ 
    // sm, md, lg, xl, xxl, xxxl
    breakpoints: [576, 768, 992, 1200, 1600, 1920],
    containerWidths: [540, 740, 960, 1140, 1540, 1810],
    defaultScreenClass: 'sm', 
    gutterWidth: 10,
});

function App() {
    const [loading, setLoading] = useState({ 
        user: true,
        fireUser: true,
        site: true,
    }); 

    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const [user, setUser] = useState();
    const [fireUser, setFireUser] = useState("");
    const [customClaims, setCustomClaims] = useState("");
    const [roles, setRoles] = useState([]);
    const [pages, setPages] = useState([]);

    const [theme, setTheme] = useState({
        value: SCHEMES.LIGHT,
        font: {
            heading: DEFAULT_SITE.THEME.FONT.HEADING,
            subheading: DEFAULT_SITE.THEME.FONT.SUBHEADING,
            body: DEFAULT_SITE.THEME.FONT.BODY,
        },
        color: {
            primary: DEFAULT_SITE.THEME.COLOR.LIGHT.PRIMARY,
            secondary: DEFAULT_SITE.THEME.COLOR.LIGHT.SECONDARY,
            tertiary: DEFAULT_SITE.THEME.COLOR.LIGHT.TERTIARY,
            red: DEFAULT_SITE.THEME.COLOR.LIGHT.RED,
            green: DEFAULT_SITE.THEME.COLOR.LIGHT.GREEN,
            yellow: DEFAULT_SITE.THEME.COLOR.LIGHT.YELLOW,
            blue: DEFAULT_SITE.THEME.COLOR.LIGHT.BLUE,
            grey: DEFAULT_SITE.THEME.COLOR.LIGHT.GREY,
            lightGrey: DEFAULT_SITE.THEME.COLOR.LIGHT.LIGHT_GREY,
            background: DEFAULT_SITE.THEME.COLOR.LIGHT.BACKGROUND,
            font: {
                heading: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.HEADING,
                body: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.BODY,
                link: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.LINK,
                solid: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.SOLID,
                inverted: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.INVERTED,
            },
        },
    });

    // Initially just pull the default site in case custom site not set yet
    const [site, setSite] = useState({
        unset: true,
        name: DEFAULT_SITE.NAME,
        description: DEFAULT_SITE.DESCRIPTION,
        emails: {
            support: DEFAULT_SITE.EMAILS.SUPPORT,
            noreply: DEFAULT_SITE.EMAILS.NOREPLY,
        },
        logo: {
            width: DEFAULT_SITE.LOGO.WIDTH,
            height: DEFAULT_SITE.LOGO.HEIGHT,
            lightUrl: DEFAULT_SITE.LOGO.LIGHT_URL,
            darkUrl: DEFAULT_SITE.LOGO.DARK_URL,
            favicon: DEFAULT_SITE.LOGO.FAVICON,
            appleTouchIcon: DEFAULT_SITE.LOGO.APPLE_TOUCH_ICON,
            showTitle: DEFAULT_SITE.LOGO.SHOW_TITLE,
        },
        theme: {
            font: {
                heading: {
                    name: DEFAULT_SITE.THEME.FONT.HEADING.NAME,
                    url: DEFAULT_SITE.THEME.FONT.HEADING.URL,
                },
                subheading: {
                    name: DEFAULT_SITE.THEME.FONT.SUBHEADING.NAME,
                    url: DEFAULT_SITE.THEME.FONT.SUBHEADING.URL,
                },
                body: {
                    name: DEFAULT_SITE.THEME.FONT.BODY.NAME,
                    url: DEFAULT_SITE.THEME.FONT.BODY.URL,
                },
            },
            color: {
                light: {
                    enabled: DEFAULT_SITE.THEME.COLOR.LIGHT.ENABLED,
                    primary: DEFAULT_SITE.THEME.COLOR.LIGHT.PRIMARY,
                    secondary: DEFAULT_SITE.THEME.COLOR.LIGHT.SECONDARY,
                    tertiary: DEFAULT_SITE.THEME.COLOR.LIGHT.TERTIARY,
                    red: DEFAULT_SITE.THEME.COLOR.LIGHT.RED,
                    green: DEFAULT_SITE.THEME.COLOR.LIGHT.GREEN,
                    yellow: DEFAULT_SITE.THEME.COLOR.LIGHT.YELLOW,
                    blue: DEFAULT_SITE.THEME.COLOR.LIGHT.BLUE,
                    grey: DEFAULT_SITE.THEME.COLOR.LIGHT.GREY,
                    lightGrey: DEFAULT_SITE.THEME.COLOR.LIGHT.LIGHT_GREY,
                    background: DEFAULT_SITE.THEME.COLOR.LIGHT.BACKGROUND,
                    font: {
                        heading: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.HEADING,
                        body: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.BODY,
                        link: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.LINK,
                        solid: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.SOLID,
                        inverted: DEFAULT_SITE.THEME.COLOR.LIGHT.FONT.INVERTED,
                    },
                },
                dark: {
                    enabled: DEFAULT_SITE.THEME.COLOR.DARK.ENABLED,
                    primary: DEFAULT_SITE.THEME.COLOR.DARK.PRIMARY,
                    secondary: DEFAULT_SITE.THEME.COLOR.DARK.SECONDARY,
                    tertiary: DEFAULT_SITE.THEME.COLOR.DARK.TERTIARY,
                    red: DEFAULT_SITE.THEME.COLOR.DARK.RED,
                    green: DEFAULT_SITE.THEME.COLOR.DARK.GREEN,
                    yellow: DEFAULT_SITE.THEME.COLOR.DARK.YELLOW,
                    blue: DEFAULT_SITE.THEME.COLOR.DARK.BLUE,
                    grey: DEFAULT_SITE.THEME.COLOR.DARK.GREY,
                    lightGrey: DEFAULT_SITE.THEME.COLOR.DARK.LIGHT_GREY,
                    background: DEFAULT_SITE.THEME.COLOR.DARK.BACKGROUND,
                    font: {
                        heading: DEFAULT_SITE.THEME.COLOR.DARK.FONT.HEADING,
                        body: DEFAULT_SITE.THEME.COLOR.DARK.FONT.BODY,
                        link: DEFAULT_SITE.THEME.COLOR.DARK.FONT.LINK,
                        solid: DEFAULT_SITE.THEME.COLOR.DARK.FONT.SOLID,
                        inverted: DEFAULT_SITE.THEME.COLOR.DARK.FONT.INVERTED,
                    },
                },
                
            },
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
        alert: {
            text: DEFAULT_SITE.ALERT.TEXT,
            background: DEFAULT_SITE.ALERT.BACKGROUND,
            link: DEFAULT_SITE.ALERT.LINK,
        },
        menus: {
            header: DEFAULT_SITE.MENUS.HEADER,
            quickTabs: DEFAULT_SITE.MENUS.QUICK_TABS,
            quickLinks: DEFAULT_SITE.MENUS.QUICK_LINKS,
            footer: DEFAULT_SITE.MENUS.FOOTER,
        },
    });

    // Properly assemble the theme object to be passed to styled-components Theme based on the current scheme preference.
    useEffect(() => {
        let themeObject = {};
        let isDarkScheme = false;
        
        if (site.theme.color.dark.enabled && !site.theme.color.light.enabled) {
            isDarkScheme = true;
        } else if (site.theme.color.light.enabled && !site.theme.color.dark.enabled) {
            isDarkScheme = false;
        } else if(site.theme.color.light.enabled && site.theme.color.dark.enabled) {
            // Both enabled, so check user preference
            if (user) {
                // User signed in, so grab their currently set preference
                if ((user?.flags?.themeScheme ?? SCHEMES.LIGHT) === SCHEMES.DARK) {
                    isDarkScheme = true;
                }
            } else {
                // No user signed in yet, so just grab the user's OS preference
                if ((window.matchMedia(`(prefers-color-scheme: ${SCHEMES.DARK})`).matches ? SCHEMES.DARK : SCHEMES.LIGHT) === SCHEMES.DARK) {
                    isDarkScheme = true;
                }
            }
        } else {
            // Neither enabled, so just use light scheme
            isDarkScheme = false;
        }
        
        // Note: the extra logic of checking if the .light value of a color is taken is so this can be expanded to potentially accept a light and dark "red" for example.
        themeObject = { 
            value: (isDarkScheme ? SCHEMES.DARK : SCHEMES.LIGHT),
            color: {
                primary: (isDarkScheme ? site.theme.color.dark.primary : site.theme.color.light.primary),
                secondary: (isDarkScheme ? site.theme.color.dark.secondary : site.theme.color.light.secondary),
                tertiary: (isDarkScheme ? site.theme.color.dark.tertiary : site.theme.color.light.tertiary),
                red: (isDarkScheme ? site.theme.color.dark.red : site.theme.color.light.red),
                green: (isDarkScheme ? site.theme.color.dark.green : site.theme.color.light.green),
                yellow: (isDarkScheme ? site.theme.color.dark.yellow : site.theme.color.light.yellow),
                blue: (isDarkScheme ? site.theme.color.dark.blue : site.theme.color.light.blue),
                grey: (isDarkScheme ? site.theme.color.dark.grey : site.theme.color.light.grey),
                lightGrey: (isDarkScheme ? site.theme.color.dark.lightGrey : site.theme.color.light.lightGrey),
                background: (isDarkScheme ? site.theme.color.dark.background : site.theme.color.light.background),
                font: {
                    heading: (isDarkScheme ? site.theme.color.dark.font.heading : site.theme.color.light.font.heading),
                    body: (isDarkScheme ? site.theme.color.dark.font.body : site.theme.color.light.font.body),
                    link: (isDarkScheme ? site.theme.color.dark.font.link : site.theme.color.light.font.link),
                    inverted: (isDarkScheme ? site.theme.color.dark.font.inverted : site.theme.color.light.font.inverted),
                    solid: (isDarkScheme ? site.theme.color.dark.font.solid : site.theme.color.light.font.solid),
                },
            },
            font: {
                heading: {
                    name: site.theme.font.heading.name,
                    url: site.theme.font.heading.url,
                },
                subheading: {
                    name: site.theme.font.subheading.name,
                    url: site.theme.font.subheading.url,
                },
                body: {
                    name: site.theme.font.body.name,
                    url: site.theme.font.body.url,
                },
            },
        }

        setTheme(themeObject);
    }, [user, site])

    useEffect(() => {
        return onSnapshot(doc(firestore, "site", "public"), (siteDoc) => {
            if(siteDoc.exists()){
                let siteData = siteDoc.data();
                setSite(siteData);

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

    useEffect(() => {
        return onSnapshot(query(collection(firestore, ITEMS.ROLES.COLLECTION)), (querySnapshot) => {
            const tempRoles = [];
            querySnapshot.forEach((doc) => {
                tempRoles.push(doc.data());
            });

            setRoles(tempRoles);
        });
    }, []);

    useEffect(() => {
        return onSnapshot(query(collection(firestore, ITEMS.PAGES.COLLECTION)), (querySnapshot) => {
            const tempPages = [];
            querySnapshot.forEach((doc) => {
                tempPages.push(doc.data());
            });

            setPages(tempPages);
        });
    }, []);

    const unsubAuth = useRef();
    const unsubUser = useRef();
    
    useEffect(() => {
        const refreshAuthToken = async () => {
            if (!fireUser) {
              return;
            }
      
            try {
              await fireUser.getIdToken(true);
              console.log("Refreshed auth token...");
            } catch (error) {
              console.error("Error refreshing token:", error);
            }
        };
            
        unsubAuth.current = onAuthStateChanged(auth, async (fireUserData) => {
            if (fireUserData) {
                fireUserData.getIdTokenResult().then((idTokenResult) => {
                    console.log("idTokenResult.claims: ");
                    console.log(idTokenResult.claims);
                    setCustomClaims(idTokenResult.claims);
                });
                
                setFireUser(fireUserData);
                refreshAuthToken();
                setLoading(prevState => ({
                    ...prevState,
                    fireUser: false
                }))

                unsubUser.current = onSnapshot(doc(firestore, ITEMS.USERS.COLLECTION, fireUserData.uid), (userDoc) => {
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
            } else {                
                // No user signed in
                setLoading(prevState => ({
                    ...prevState,
                    fireUser: false,
                    user: false,
                }))
            }
        });

        return () => {
            if (unsubAuth.current) {
                unsubAuth?.current();
            }

            if (unsubUser.current) {
                unsubUser?.current();
            }
        };
    }, [site, fireUser]); // if site is not added here, the pages will continue to render endlessly for some reason

    const cleanUpLogout = () => {
        if(unsubUser.current){
            unsubUser?.current();
        }

        if(unsubAuth.current){
            unsubAuth?.current();
        }

        setFireUser("");
        setUser("");
    }

    if(loading.fireUser || loading.user || loading.site){
        return (
            <Div position="relative" height="100vh" bgColor="white" margin="0">
                <Centered absolute>
                    <Spinner size={100} />
                </Centered>
            </Div>
        )
    } else {
        return (
            <>
            <HelmetProvider>
                <DynamicHeadTags theme={theme} site={site} />
                <ScreenClassProvider>
                    {/* ** Adjust this paddingBottom if icon is unaligned with font, applied to ALL font. Override with inline style for 1 icon! */}
                    <IconContext.Provider value={{ style: { verticalAlign: "middle", display: "inline", paddingBottom: "1%"} }}>
                        <ThemeProvider theme={theme}>
                            <BodyWrapper>
                                <BrowserRouter>
                                    <GlobalStyle /> 
                                    <FirebaseAnalytics />
                                    <StartAtTop />
                                    {process.env.NODE_ENV === 'development' && (
                                        <DevAlert> LOCAL SERVER </DevAlert>
                                    )}      
                                    <Header site={site} user={user} />
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
                                        customClaims={customClaims}
                                        user={user}
                                        roles={roles}
                                        pages={pages}
                                        setFireUser={setFireUser}
                                        setUser={setUser}
                                        setIsLoggingIn={setIsLoggingIn}
                                        cleanUpLogout={cleanUpLogout}
                                        isLoggingIn={isLoggingIn}
                                    />
                                    <Footer site={site} />
                                </BrowserRouter>
                            </BodyWrapper>
                        </ThemeProvider>
                    </IconContext.Provider>
                </ScreenClassProvider>
                
            </HelmetProvider>
            </>
        );
    }
}

export default App;