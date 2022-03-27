// ** font constants and colors only used as defaults if nothing loaded
// ** to import custom local font under globalStyle since I will always have to hardcode the font constant because not a default html font nor a Google font if importing from webfontloader library
export const BTYPES = {
    INVERTED: "inverted",
    TEXTED: "texted",
}

export const PLACEHOLDER = {
    FIRST_NAME: "Taylor",
    LAST_NAME: "Doe",
    EMAIL: "taylor_doe@email.com",
    PHONE: "+1 (123) 456-7890",
    BODY: "Detail what you want to say here.",
    PASSWORD: "*********************",
}

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
            "hi@minute.tech",
        ],
        SUPPORT: "help@minute.tech",
        NOREPLY: "noreply@minute.tech",
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

export const ANIMAL_GALLERY = [
    {
        src: require("../assets/images/misc/animals/1.png"),
        alt: "link cat couch"
    },
    {
        src: require("../assets/images/misc/animals/2.png"),
        alt: "zelda cat couch"
    },
    {
        src: require("../assets/images/misc/animals/3.png"),
        alt: "link cat laundry"
    },
    {
        src: require("../assets/images/misc/animals/4.png"),
        alt: "goergie dog sunglasses"
    },
    {
        src: require("../assets/images/misc/animals/5.png"),
        alt: "zelda cat sleeping"
    },
    {
        src: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fmisc%2F6.png?alt=media&token=665c362c-716e-46fd-8aa9-c0582a897dd1",
        alt: "link cat table"
    },
    {
        src: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fmisc%2F7.png?alt=media&token=be7179dd-bf38-44e2-837d-54d4a445d383",
        alt: "zelda cat lap"
    },
    {
        src: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fmisc%2F8.png?alt=media&token=265e4b18-35ab-45c5-9b7a-066469e0383e",
        alt: "georgie dog couch"
    },
    {
        src: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fmisc%2F9.png?alt=media&token=0ba93d22-580a-436c-8818-510f7f98bfae",
        alt: "zelda cat desk"
    },
    {
        src: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fmisc%2F10.png?alt=media&token=0cb38dd8-60d2-416c-8608-f70adb4a2844",
        alt: "zelda cat desk"
    },
]