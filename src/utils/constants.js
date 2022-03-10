// ** font constants and colors only used as defaults if nothing loaded
// ** to import custom local font under globalStyle since I will always have to hardcode the font constant because not a default html font nor a Google font if importing from webfontloader library
export const BTYPES = {
    INVERTED: 'inverted',
    TEXTED: 'texted'
}

export const PLACEHOLDER = {
    FIRST_NAME: "Taylor",
    LAST_NAME: "Doe",
    EMAIL: "taylor_doe@email.com",
    PHONE: "+1 (123) 456-7890",
    MESSAGE: "Detail what you want to say here.",
    PASSWORD: "*********************"
}

export const DEFAULT_SITE = {
    NAME: "Fire React Base",
    LOGO: {
        WIDTH: "100px",
        URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=d327bc99-6ee8-496e-86c7-0206244b837b",
        SHOW_TITLE: true,
    },
    HERO: {
        BANNERS: [
            "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fbanners%2FDSC_0047.JPG?alt=media&token=8d4ff53c-11c2-4849-9479-6cd091598635",
        ],
    },
    EMAILS: {
        MESSAGES: [
            "hi@camposjames.com",
        ],
        SUPPORT: "help@camposjames.com",
        NOREPLY: "noreply@camposjames.com",
    },
    THEME: {
        FONTS: {
            BODY: "Roboto Regular",
            HEADING: "Roboto Bold",
        },
        SCHEMES: {
            LIGHT: {
                VALUE: "light",
                COLORS: {
                    PRIMARY: "#470A68",
                    SECONDARY: "hotpink",
                    TERTIARY: "tomato",
                    RED: "firebrick",
                    GREEN: "green",
                    YELLOW: "gold",
                    GREY: "grey",
                    LIGHT_GREY: "lightgrey",
                    BLUE: "navy",
                    FONT: {
                        HEADING: "black",
                        BODY: "black",
                        LINK: "navy",
                    },
                    BACKGROUND: "white",
                },
            },
            DARK: {
                VALUE: "dark",
                COLORS: {
                    PRIMARY: "#470A68",
                    SECONDARY: "hotpink",
                    TERTIARY: "tomato",
                    RED: "firebrick",
                    GREEN: "green",
                    YELLOW: "gold",
                    GREY: "grey",
                    LIGHT_GREY: "lightgrey",
                    BLUE: "navy",
                    FONT: {
                        HEADING: "white",
                        BODY: "white",
                        LINK: "lightblue",
                    },
                    BACKGROUND: "#36454F",
                },
            },
        },
    },
};

export const SCHEMES = {
    LIGHT: "light",
    DARK: "dark"
}