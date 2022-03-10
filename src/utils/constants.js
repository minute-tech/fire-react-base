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
        URL: "https://firebasestorage.googleapis.com/v0/b/fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=a3f0ea8f-b612-48ce-b452-d58fe61ec88a",
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
                    PRIMARY: "dodgerblue",
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
                    PRIMARY: "dodgerblue",
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