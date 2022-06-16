export const INPUT = {
    EMAIL: {
        VALUE: "email",
        LABEL: "Email",
        PLACEHOLDER: "taylor_doe@email.com",
        ERRORS: {
            REQUIRED: "An email is required!",
            PATTERN: {
                MESSAGE: "This doesn't look like a valid email address.",
                VALUE: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            },
            TAKEN: {
                MESSAGE: "Email already registered! Try logging in or use another email address.",
                TYPE: "taken",
            },
        },
    },
    PHONE: {
        VALUE: "phone",
        LABEL: "Phone",
        PLACEHOLDER: "+1 (123) 456-7890",
        ERRORS: {
            REQUIRED: "A phone number is required!",
            MAX: {
                MESSAGE: "The phone number can only be 25 characters long.",
                VALUE: 25,
            },
            MIN: {
                MESSAGE: "The phone number must be at least 4 characters long.",
                VALUE: 4,
            },
        },
    },
    PASSWORD: {
        VALUE: "password",
        LABEL: "Password",
        PLACEHOLDER: "*********************",
        ERRORS: {
            REQUIRED: "A password is required!",
            MAX: {
                MESSAGE: "The password can only be 50 characters long.",
                VALUE: 50,
            },
            MIN: {
                MESSAGE: "The password must be at least 6 characters long.",
                VALUE: 6,
            },
        },
    },
    CONFIRM_PASSWORD: {
        VALUE: "confirmPassword",
        LABEL: "Confirm password",
        PLACEHOLDER: "*********************",
        ERRORS: {
            REQUIRED: "The password must be confirmed!",
            MAX: {
                MESSAGE: "The password can only be 50 characters long.",
                VALUE: 50,
            },
            MIN: {
                MESSAGE: "The password must be at least 6 characters long.",
                VALUE: 6,
            },
            NO_MATCH: {
                TYPE: "no-match",
                MESSAGE: "The passwords entered must match!",
            },
        },
    },
    FIRST_NAME: {
        VALUE: "firstName",
        LABEL: "First name",
        PLACEHOLDER: "Taylor",
        ERRORS: {
            REQUIRED: "A first name is required!",
            MAX: {
                MESSAGE: "The first name can only be 150 characters long.",
                VALUE: 150,
            },
            MIN: {
                MESSAGE: "The first name must be at least 1 characters long.",
                VALUE: 1,
            },
        },
    },
    LAST_NAME: {
        VALUE: "lastName",
        LABEL: "Last name",
        PLACEHOLDER: "Doe",
        ERRORS: {
            REQUIRED: "A last name is required!",
            MAX: {
                MESSAGE: "The last name can only be 150 characters long.",
                VALUE: 150,
            },
            MIN: {
                MESSAGE: "The last name must be at least 1 characters long.",
                VALUE: 1,
            },
        },
    },
    NAME: {
        VALUE: "name",
        LABEL: "Name",
        PLACEHOLDER: "Taylor Doe",
        ERRORS: {
            REQUIRED: "A name is required!",
            MAX: {
                MESSAGE: "The name can only be 150 characters long.",
                VALUE: 150,
            },
            MIN: {
                MESSAGE: "The name must be at least 1 characters long.",
                VALUE: 1,
            },
        },
    },
    BODY: {
        VALUE: "body",
        LABEL: "Message body",
        PLACEHOLDER: "Detail what you want to say here.",
        ERRORS: {
            REQUIRED: "A text body is required!",
            MAX: {
                MESSAGE: "The text body can only be 30,000 characters long.",
                VALUE: 30000,
            },
            MIN: {
                MESSAGE: "The text body must be at least 10 characters long.",
                VALUE: 10,
            },
        },
    },
    COLOR: {
        VALUE: "color",
        LABEL: "Color",
        PLACEHOLDER: "#FFFFFF",
        ERRORS: {
            REQUIRED: "A color is required!",
            MAX: {
                MESSAGE: "The color can only be 15 characters long.",
                VALUE: 15,
            },
            MIN: {
                MESSAGE: "The text body must be at least 2 characters long.",
                VALUE: 2,
            },
            VALIDATE: {
                MESSAGE: "Looks like one of the colors you inputted is not a proper HTML color. Try using a hex color like '#FFFFFF'!",
            },
        },
    },
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
    DESCRIPTION: "Fire React Base is a template for creating web apps with Firebase and React.js.",
    PROJECT_ID: "fire-react-base",
    LOGO: {
        WIDTH: 100,
        HEIGHT: 100,
        LIGHT_URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo-dark.png?alt=media&token=1483f9fd-0cc4-4e4d-b737-2042cfef05f7",
        DARK_URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=d327bc99-6ee8-496e-86c7-0206244b837b",
        FAVICON: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Ffavicon.ico?alt=media&token=3f463d53-9d63-4e47-864f-8ad01df23638",
        APPLE_TOUCH_ICON: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Fapple-touch-icon.png?alt=media&token=fa68e408-7fe8-4c3f-91b4-bdbdabe46e9a",
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
            HEADING: {
                NAME: "Roboto Bold",
                URL: "",
                LIGHT: "black",
                DARK: "white",
            },
            BODY: {
                NAME: "Roboto Regular",
                URL: "",
                LIGHT: "black",
                DARK: "white",
            },
            LINK: {
                NAME: "",
                URL: "",
                LIGHT: "navy",
                DARK: "lightblue",
            },
        },
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
            BACKGROUND: {
                LIGHT: "white",
                DARK: "black",
            },
        },
    },
};

export const SCHEMES = {
    LIGHT: "light",
    DARK: "dark",
};
