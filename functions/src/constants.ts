export const BTYPES = {
    INVERTED: "inverted",
    TEXTED: "texted",
};

export const PLACEHOLDER = {
    FIRST_NAME: "Taylor",
    LAST_NAME: "Doe",
    EMAIL: "taylor_doe@email.com",
    PHONE: "+1 (123) 456-7890",
    BODY: "Detail what you want to say here.",
    PASSWORD: "*********************",
};

export const SIZES = {
    XS: "xs",
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    XXL: "2xl",
    XXXL: "3xl",
};

export const DEFAULT_SITE = {
    NAME: "Fire React Base",
    LOGO: {
        WIDTH: 100,
        URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=d327bc99-6ee8-496e-86c7-0206244b837b",
        SHOW_TITLE: true,
    },
    HERO: {
        HEADING: "Hero Section",
        BODY: `This is the homepage hero section, customize it as you please, please. Dolore irure deserunt occaecat tempor. 
            Dolore reprehenderit ut consequat anim officia amet. Laboris officia ea eu elit consectetur sit dolor duis adipisicing reprehenderit reprehenderit deserunt reprehenderit quis. 
            Fugiat est reprehenderit quis labore aute anim in labore officia non ut aliquip mollit. In laboris amet amet occaecat. Laboris minim culpa cillum veniam adipisicing et deserunt sit.`,
        CTA: {
            LINK: "/about",
            TEXT: "Call to Action",
            SIZE: SIZES.LG,
            COLOR: "black",
        },
        BANNER: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fbanners%2FDSC_0047.JPG?alt=media&token=8d4ff53c-11c2-4849-9479-6cd091598635",
    },
    EMAILS: {
        MESSENGERS: [
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
                    BACKGROUND: "#242423",
                },
            },
        },
    },
};

export const SCHEMES = {
    LIGHT: "light",
    DARK: "dark",
};
