// Front-end only //
export const BTYPES = {
    INVERTED: "inverted",
    TEXTED: "texted",
}

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
        alt: "georgie dog sunglasses"
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
];

export const PAGE_SIZES = [10, 25, 50, 100,];

export const APHORISMS = [
    "The world is your oyster.",
    "You can do anything you set your mind to.",
    "Nothing is impossible to a willing heart.",
    // "The best things in life are free.",
    "Don't pursue happiness - create it.",
    "The real kindness comes from within you.",
    "The usefulness of a cup can be in its emptiness.",
    "Big journeys begin with a single step.",
    "Happiness isn't an outside job, it's an inside job.",
    "You are beautiful inside and out.",
    "A lifetime of happiness lies ahead of you.",
    "A pleasant surprise is waiting for you.",
    "Adventure can be real happiness.",
    "Allow compassion to guide your decisions.",
    "Believe it can be done.",
    "Courtesy is contagious.",
    "Every flower blooms in time.",
    "Have a wonderful day.",
    "Love is a warm fire to keep the soul warm.",
    "Miles are covered one step at a time.",
    "You are in good hands today.",
    "You are talented in many ways.",
    "Practice makes perfect.",
    "Love lights up the world.",
    "You look like a million bucks today.",
    "A stranger is a friend you have not spoken to yet.",
    // "Everyone agrees. You are the best.",
    "Now is the time to try something new.",
    // "Sometimes you just need to lay on the floor.",
    // "The greatest risk is not taking one.",
    "You can create happiness."
];

/////////////////// Back-end Only //////////////////////
export const INPUT = {
    EMAIL: {
        KEY: "email",
        LABEL: "Email",
        PLACEHOLDER: "taylor_doe@email.com",
        ERRORS: {
            REQUIRED: "An email is required!",
            PATTERN: {
                MESSAGE: "This doesn't look like a valid email address.",
                KEY: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            },
            TAKEN: {
                MESSAGE: "Email already registered! Try logging in or use another email address.",
                TYPE: "taken",
            },
        },
    },
    PHONE: {
        KEY: "phone",
        LABEL: "Phone",
        PLACEHOLDER: "+1 (123) 456-7890",
        ERRORS: {
            REQUIRED: "A phone number is required!",
            MAX: {
                MESSAGE: "The phone number can only be 25 characters long.",
                KEY: 25,
            },
            MIN: {
                MESSAGE: "The phone number must be at least 4 characters long.",
                KEY: 4,
            },
        },
    },
    PASSWORD: {
        KEY: "password",
        LABEL: "Password",
        PLACEHOLDER: "*********************",
        ERRORS: {
            REQUIRED: "A password is required!",
            MAX: {
                MESSAGE: "The password can only be 50 characters long.",
                KEY: 50,
            },
            MIN: {
                MESSAGE: "The password must be at least 6 characters long.",
                KEY: 6,
            },
        },
    },
    CONFIRM_PASSWORD: {
        KEY: "confirmPassword",
        LABEL: "Confirm password",
        PLACEHOLDER: "*********************",
        ERRORS: {
            REQUIRED: "The password must be confirmed!",
            MAX: {
                MESSAGE: "The password can only be 50 characters long.",
                KEY: 50,
            },
            MIN: {
                MESSAGE: "The password must be at least 6 characters long.",
                KEY: 6,
            },
            NO_MATCH: {
                TYPE: "no-match",
                MESSAGE: "The passwords entered must match!",
            },
        },
    },
    FIRST_NAME: {
        KEY: "firstName",
        LABEL: "First name",
        PLACEHOLDER: "Taylor",
        ERRORS: {
            REQUIRED: "A first name is required!",
            MAX: {
                MESSAGE: "The first name can only be 150 characters long.",
                KEY: 150,
            },
            MIN: {
                MESSAGE: "The first name must be at least 1 characters long.",
                KEY: 1,
            },
        },
    },
    LAST_NAME: {
        KEY: "lastName",
        LABEL: "Last name",
        PLACEHOLDER: "Doe",
        ERRORS: {
            REQUIRED: "A last name is required!",
            MAX: {
                MESSAGE: "The last name can only be 150 characters long.",
                KEY: 150,
            },
            MIN: {
                MESSAGE: "The last name must be at least 1 characters long.",
                KEY: 1,
            },
        },
    },
    NAME: {
        KEY: "name",
        LABEL: "Name",
        PLACEHOLDER: "Taylor Doe",
        ERRORS: {
            REQUIRED: "A name is required!",
            MAX: {
                MESSAGE: "The name can only be 150 characters long.",
                KEY: 150,
            },
            MIN: {
                MESSAGE: "The name must be at least 1 characters long.",
                KEY: 1,
            },
        },
    },
    BODY: {
        KEY: "body",
        LABEL: "Message body",
        PLACEHOLDER: "Detail what you want to say here.",
        ERRORS: {
            REQUIRED: "A text body is required!",
            MAX: {
                MESSAGE: "The text body can only be 30,000 characters long.",
                KEY: 30000,
            },
            MIN: {
                MESSAGE: "The text body must be at least 10 characters long.",
                KEY: 10,
            },
        },
    },
    COLOR: {
        KEY: "color",
        LABEL: "Color",
        PLACEHOLDER: "#FFFFFF",
        ERRORS: {
            REQUIRED: "A color is required!",
            MAX: {
                MESSAGE: "The color can only be 15 characters long.",
                KEY: 15,
            },
            MIN: {
                MESSAGE: "The text body must be at least 2 characters long.",
                KEY: 2,
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