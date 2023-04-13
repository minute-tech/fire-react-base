import { BiMessageAltDetail } from "react-icons/bi";
import { MdOutlineFeedback } from "react-icons/md";
import { RiPagesLine } from "react-icons/ri";

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

/////////////////// Back-end also //////////////////////
export const SIZES = {
    XS: "xs",
    SM: "sm",
    MD: "md",
    LG: "lg",
    XL: "xl",
    XXL: "2xl",
    XXXL: "3xl",
};

export const RESERVED_ROLES = [
    "super",
    "bccEmailGroups",
    "ccEmailGroups",
    // Update these item collections if they change!
    "messages",
    "feedback",
    "clients",
    "shops",
    "products",
    "orders",
    "users",
    "roles",
    "pages",
    // custom claim reserved tokens: https://firebase.google.com/docs/auth/admin/create-custom-tokens#reserved_custom_token_names
    "acr",
    "amr",
    "auth_time",
    "azp",
    "cnf",
    "c_hash",
    "aud",
    "at_hash",
    "exp",
    "iat",
    "iss",
    "jti",
    "nbf",
    "nonce",
    "sub",
    "firebase",
    "user_id",
];

export const DEFAULT_SITE = {
    NAME: "Fire React Base",
    DESCRIPTION: "Fire React Base is a template for creating web apps with Firebase and React.js.",
    PROJECT_ID: "fire-react-base",
    CUSTOM_URL: "",
    EMAILS: {
        SUPPORT: "help@minute.tech",
        NOREPLY: "noreply@minute.tech",
    },
    LOGO: {
        WIDTH: 100,
        HEIGHT: 100,
        LIGHT_URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo-dark.png?alt=media&token=1483f9fd-0cc4-4e4d-b737-2042cfef05f7",
        DARK_URL: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Flogo192.png?alt=media&token=d327bc99-6ee8-496e-86c7-0206244b837b",
        FAVICON: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Ffavicon.ico?alt=media&token=3f463d53-9d63-4e47-864f-8ad01df23638",
        APPLE_TOUCH_ICON: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Flogos%2Fapple-touch-icon.png?alt=media&token=fa68e408-7fe8-4c3f-91b4-bdbdabe46e9a",
        SHOW_TITLE: true,
    },
    THEME: {
        FONT: {
            HEADING: {
                NAME: "Roboto Black",
                URL: "",
            },
            SUBHEADING: {
                NAME: "Roboto Bold",
                URL: "",
            },
            BODY: {
                NAME: "Roboto Regular",
                URL: "",
            },
        },
        COLOR: {
            LIGHT: {
                ENABLED: true,
                PRIMARY: "dodgerblue",
                SECONDARY: "purple",
                TERTIARY: "tomato",
                RED: "firebrick",
                GREEN: "green",
                YELLOW: "gold",
                GREY: "grey",
                LIGHT_GREY: "lightgrey",
                BLUE: "navy",
                BACKGROUND: "white",
                FONT: {
                    HEADING: "black",
                    BODY: "black",
                    LINK: "navy",
                    SOLID: "white",
                    INVERTED: "dodgerblue",
                },
            },
            DARK: {
                ENABLED: true,
                PRIMARY: "dodgerblue",
                SECONDARY: "purple",
                TERTIARY: "tomato",
                RED: "firebrick",
                GREEN: "green",
                YELLOW: "gold",
                GREY: "grey",
                LIGHT_GREY: "lightgrey",
                BLUE: "navy",
                BACKGROUND: "black",
                FONT: {
                    HEADING: "white",
                    BODY: "white",
                    LINK: "lightblue",
                    SOLID: "white",
                    INVERTED: "dodgerblue",
                },
            },
        },
    },
    HERO: {
        HEADING: "Hero Section",
        BODY: `This is the homepage hero section, customize it as you please, please. Dolore irure deserunt occaecat tempor. 
        Dolore reprehenderit ut consequat anim officia amet. Laboris officia ea eu elit consectetur sit dolor duis adipisicing reprehenderit reprehenderit deserunt reprehenderit quis. 
        Fugiat est reprehenderit quis labore aute anim in labore officia non ut aliquip mollit. In laboris amet amet occaecat. Laboris minim culpa cillum veniam adipisicing et deserunt sit.`,
        CTA: {
            LINK: "/gift-ship-form",
            TEXT: "Order a Gift",
            SIZE: SIZES.LG,
            COLOR: "black",
        },
        BANNER: "https://firebasestorage.googleapis.com/v0/b/test-fire-react-base.appspot.com/o/public%2Fbanners%2FDSC_0047.JPG?alt=media&token=8d4ff53c-11c2-4849-9479-6cd091598635",
    },
    ALERT: {
        TEXT: "This is a test alert, please ignore.",
        BACKGROUND: "red",
        LINK: "https://www.minute.tech",
        IS_HIDDEN: true,
    },
    MENUS: {
        HEADER: [
            {
                name: "Home",
                link: "/",
            },
            {
                name: "About",
                link: "/about",
            },
            {
                name: "Dashboard",
                link: "/Dashboard",
            },
            {
                name: "Minute.tech",
                link: "https://www.minute.tech",
            },
        ],
        QUICK_TABS: [
            {
                name: "General",
            },
            {
                name: "HR",
            },
            {
                name: "Social Media",
            },
        ],
        QUICK_LINKS: [
            {
                name: "Help Desk",
                link: "https://www.minute.tech",
                tab: "General",
                icon: "",
                color: "",
            },
            {
                name: "Training",
                link: "https://www.tovutilms.com/",
                tab: "General",
                icon: "",
                color: "green",
            },
            {
                name: "Office Vibe",
                link: "https://login.officevibe.com",
                tab: "HR",
                icon: "FiSmile",
                color: "",
            },
            {
                name: "PayChex",
                link: "https://www.paychex.com",
                tab: "HR",
                icon: "FiBriefcase",
                color: "",
            },
            {
                name: "Instagram",
                link: "https://www.instagram.com",
                tab: "Social Media",
                icon: "",
                color: "brown",
            },
            {
                name: "LinkedIn",
                link: "https://www.linkedin.com",
                tab: "Social Media",
                icon: "",
                color: "navy",
            },
            {
                name: "TikTok",
                link: "https://www.tiktok.com",
                tab: "Social Media",
                icon: "",
                color: "black",
            },
            {
                name: "Facebook",
                link: "https://www.facebook.com",
                tab: "Social Media",
                icon: "",
                color: "dodgerblue",
            },
            {
                name: "Twitter",
                link: "https://www.twitter.com",
                tab: "Social Media",
                icon: "",
                color: "dodgerblue",
            },
        ],
        FOOTER: [],
    },
};

export const SCHEMES = {
    LIGHT: "light",
    DARK: "dark",
};

export const ADMIN = {
    SUPER: "super",
    ROLE: "role",
    RECREATED: "recreated",
};

export const USER_STRUCTURE = {
    NAME: "name",
    EMAIL: "email",
};

export const ORDER_PRODUCT_STRUCTURE = {
    IMAGES: "images",
    NAME: "name",
    SKU: "sku",
    CLIENT: "client",
    SHOP: "shop",
    CATEGORY: "category",
    DESCRIPTION: "description",
    QUANTITY: "quantity",
    OPTION_CHOICES: "optionChoices"
};

export const DATA_TYPE = {
    TEXT: "text",
    TEXTAREA: "textarea",
    SELECT: "select",
    CHECKBOX: "checkbox",
    RADIO: "radio",
    ARRAY: "array",
    TIMESTAMP: "timestamp",
    OBJECT: "object",
    NUMBER: "number",
    IMAGES: "images",
    RICH_TEXT: "rich-text",
};

export const CRUD = {
    READ: "read",
    CREATE: "create",
    UPDATE: "update",
    DELETE: "delete",
    CC_ON_CREATE: "CC on create",
    BCC_ON_CREATE: "BCC on create",
};

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
    ADDRESS: {
        LINE1: {
            KEY: "line1",
            LABEL: "Street Line 1",
            PLACEHOLDER: "123 Main Street",
            ERRORS: {
                REQUIRED: "A street address is required!",
                MAX: {
                    MESSAGE: "The street address can only be 35 characters long.",
                    KEY: 35,
                },
                MIN: {
                    MESSAGE: "The street address must be at least 2 characters long.",
                    KEY: 2,
                },
            },
        },
        LINE2: {
            KEY: "line2",
            LABEL: "Street Line 2",
            PLACEHOLDER: "Apt, suite, unit, building, floor, etc.",
            ERRORS: {
                MAX: {
                    MESSAGE: "The field can only be 35 characters long.",
                    KEY: 35,
                },
            },
        },
        LINE3: {
            KEY: "line3",
            LABEL: "Street Line 3",
            PLACEHOLDER: "Non-US address information",
            ERRORS: {
                MAX: {
                    MESSAGE: "The field can only be 35 characters long.",
                    KEY: 35,
                },
            },
        },
        CITY: {
            KEY: "city",
            LABEL: "City",
            PLACEHOLDER: "San Francisco",
            ERRORS: {
                REQUIRED: "A city is required!",
                MAX: {
                    MESSAGE: "The city can only be 35 characters long.",
                    KEY: 35,
                },
                MIN: {
                    MESSAGE: "The city must be at least 2 characters long.",
                    KEY: 2,
                },
            },
        },
        STATE: {
            KEY: "state",
            LABEL: "State",
            PLACEHOLDER: "CA",
            ERRORS: {
                REQUIRED: "A state is required!",
                MAX: {
                    MESSAGE: "The state can only be 35 characters long.",
                    KEY: 35,
                },
                MIN: {
                    MESSAGE: "The state must be at least 2 characters long.",
                    KEY: 2,
                },
            },
        },
        ZIP: {
            KEY: "zip",
            LABEL: "Postal Code",
            PLACEHOLDER: "12345",
            ERRORS: {
                REQUIRED: "A postal code is required!",
                MAX: {
                    MESSAGE: "The postal code can only be 35 characters long.",
                    KEY: 35,
                },
                MIN: {
                    MESSAGE: "The postal code must be at least 2 characters long.",
                    KEY: 2,
                },
            },
        },
        COUNTRY: {
            KEY: "country",
            LABEL: "Country",
            PLACEHOLDER: "US",
            ERRORS: {
                REQUIRED: "A country is required!",
                MAX: {
                    MESSAGE: "The country can only be 2 characters long.",
                    KEY: 2,
                },
                MIN: {
                    MESSAGE: "The state must be at least 2 characters long.",
                    KEY: 2,
                },
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
    NOTES: {
        KEY: "notes",
        LABEL: "Notes",
        PLACEHOLDER: "Jot down some notes such as major changes, unique characteristics, etc that may have been missed and would be helpful for the rest of the team to know.",
        TOOLTIP: "This notes field will always be internal use only and will not be displayed to the public.",
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
                MESSAGE: "The color must be at least 2 characters long.",
                KEY: 2,
            },
            VALIDATE: {
                MESSAGE: "Looks like one of the colors you inputted is not a proper HTML color. Try using a hex color like '#FFFFFF'!",
            },
        },
    },
    URL: {
        KEY: "url",
        LABEL: "URL",
        PLACEHOLDER: "https://www.example.com",
        ERRORS: {
            REQUIRED: "A URL is required!",
            MAX: {
                MESSAGE: "The URL can only be 500 characters long.",
                KEY: 500,
            },
            MIN: {
                MESSAGE: "The URL must be at least 1 characters long.",
                KEY: 1,
            },
            PATTERN: {
                MESSAGE: "This doesn't look like a valid URL address. Please copy the URL directly from your browser and paste it here, including 'http'/'https' portion.",
                // KEY: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g // fixed useless escapes
                KEY: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gi
                // KEY: /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
            },
        },
    },
};

export const VARIANT_LAYOUT = {
    SELECT: "Select Dropdown",
    RADIOS: "Radio Buttons",
    BUTTONS: "Box Buttons",
};

// REMEMBER: update any changes by copy pasting this into the constants.ts file in ffunctions!  Just remember to remove the the ICON field in .ts version!
export const ITEMS = {
    MESSAGES: {
        COLLECTION: "messages",
        NAME: "message",
        ICON: <BiMessageAltDetail size={25} />,
        ORDER: 4,
        COLOR: DEFAULT_SITE.THEME.COLOR.LIGHT.GREEN,
        STRUCTURE: [
            {
                label: "Name",
                key: "name",
                shown: true,
                uneditable: true,
                type: DATA_TYPE.TEXT,
            },
            {
                label: "Email",
                key: "email",
                shown: true,
                uneditable: true,
                type: DATA_TYPE.TEXT,
            },
            {
                label: "Body",
                key: "body",
                shown: true,
                uneditable: true,
                type: DATA_TYPE.TEXTAREA,
            },
            {
                label: "Resolved",
                key: "resolved",
                shown: true,
                type: DATA_TYPE.RADIO,
                breakpoints: {
                    xs: 12,
                },
                isBool: true,
                initialValue: "false",
            },
            {
                label: "IP Address",
                key: "ip",
                uneditable: true,
                hideinEmail: true,
                type: DATA_TYPE.TEXT,
            },
            {
                label: INPUT.NOTES.LABEL,
                key: INPUT.NOTES.KEY,
                placeholder: INPUT.NOTES.PLACEHOLDER,
                tooltip: INPUT.NOTES.TOOLTIP,
                type: DATA_TYPE.RICH_TEXT,
                breakpoints: {
                    xs: 12,
                },
            },
        ],
    },
    FEEDBACK: {
        COLLECTION: "feedback",
        NAME: "feedback",
        ICON: <MdOutlineFeedback size={25} />,
        ORDER: 5,
        COLOR: DEFAULT_SITE.THEME.COLOR.LIGHT.RED,
        STRUCTURE: [
            {
                label: "Emotion",
                key: "emotionSymbol",
                hideInModal: true,
                shown: true,
                uneditable: true,
                // Emotion input not allowed yet in ItemManager
            },
            {
                label: "Score out of 100",
                key: "rangeValue",
                shown: true,
                uneditable: true,
                // Range input not allowed yet in ItemManager
            },
            {
                label: "Message",
                key: "body",
                type: DATA_TYPE.TEXTAREA,
                shown: true,
                uneditable: true,
            },
        ],
    },
    PAGES: {
        COLLECTION: "pages",
        NAME: "page",
        ICON: <RiPagesLine size={25} />,
        COLOR: DEFAULT_SITE.THEME.COLOR.LIGHT.GREEN,
        STRUCTURE: [
            {
                label: "Name",
                key: "name",
                shown: true,
                type: DATA_TYPE.TEXT,
                tooltip: "The URL path will be formed from this name.",
                placeholder: "FAQ",
                breakpoints: {
                    xs: 12,
                    sm: 6,
                },
                validators: {
                    required: INPUT.NAME.ERRORS.REQUIRED,
                    maxLength: {
                        value: INPUT.NAME.ERRORS.MAX.KEY,
                        message: INPUT.NAME.ERRORS.MAX.MESSAGE,
                    },
                    minLength: {
                        value: INPUT.NAME.ERRORS.MIN.KEY,
                        message: INPUT.NAME.ERRORS.MIN.MESSAGE,
                    },
                },
            },
            {
                label: "Is internal?",
                key: "isInternal",
                tooltip: "Is this page intended for internal users only? Or can anyone view this page?",
                breakpoints: {
                    xs: 12,
                    sm: 6,
                },
                type: DATA_TYPE.RADIO,
                isBool: true,
                initialValue: "false",
            },
            {
                label: "Body",
                key: "body",
                shown: true,
                type: DATA_TYPE.RICH_TEXT,
                placeholder: INPUT.BODY.PLACEHOLDER,
                breakpoints: {
                    xs: 12,
                },
                validators: {
                    required: INPUT.BODY.ERRORS.REQUIRED,
                },
            },
        ],
    },
    USERS: {
        COLLECTION: "users",
        NAME: "user",
        STRUCTURE: [
            {
                label: INPUT.FIRST_NAME.LABEL,
                key: INPUT.FIRST_NAME.KEY,
                type: DATA_TYPE.TEXT,
                shown: true,
                uneditable: true,
            },
            {
                label: INPUT.LAST_NAME.LABEL,
                key: INPUT.LAST_NAME.KEY,
                type: DATA_TYPE.TEXT,
                shown: true,
                uneditable: true,
            },
            {
                label: INPUT.EMAIL.LABEL,
                key: INPUT.EMAIL.KEY,
                type: DATA_TYPE.TEXT,
                shown: true,
                uneditable: true,
            },
            {
                label: INPUT.PHONE.LABEL,
                key: INPUT.PHONE.KEY,
                type: DATA_TYPE.TEXT,
                shown: true,
                uneditable: true,
            },
            {
                label: "Role",
                key: "role",
                type: DATA_TYPE.SELECT,
                shown: true,
                parentCollection: "roles",
                options: ["Loading..."],
            },
            // {
            //     label: INPUT.NOTES.LABEL,
            //     key: INPUT.NOTES.KEY,
            //     placeholder: INPUT.NOTES.PLACEHOLDER,
            //     tooltip: INPUT.NOTES.TOOLTIP,
            //     type: DATA_TYPE.RICH_TEXT,
            //     breakpoints: {
            //         xs: 12,
            //     },
            // },
        ],
    },
    ROLES: {
        COLLECTION: "roles",
        NAME: "role",
        STRUCTURE: [
            {
                label: "Role Name",
                key: "name",
                shown: true,
                breakpoints: {
                    xs: 12,
                    sm: 6,
                },
                type: DATA_TYPE.TEXT,
                placeholder: "Team Edward",
                validators: {
                    required: INPUT.NAME.ERRORS.REQUIRED,
                    maxLength: {
                        value: INPUT.NAME.ERRORS.MAX.KEY,
                        message: INPUT.NAME.ERRORS.MAX.MESSAGE,
                    },
                    minLength: {
                        value: INPUT.NAME.ERRORS.MIN.KEY,
                        message: INPUT.NAME.ERRORS.MIN.MESSAGE,
                    },
                },
            },
            {
                label: "Admin role?",
                key: "isAdmin",
                tooltip: "Does this role allow users to access the admin dashboard? Or is it a front facing, non-admin role? If this is 'No' then filters and permissions below are ignored.",
                breakpoints: {
                    xs: 12,
                    sm: 6,
                },
                type: DATA_TYPE.RADIO,
                isBool: true,
                initialValue: "false",
                // validators: {
                //     required: "We need to know if this is an admin type role or not.",
                // },
            },
            {
                label: "Item Collection Permissions",
                key: "permissions",
                tooltip: "Setting the item collection permissions would limit what actions the user can make on the database. Remember to include any dependent collections reads for drop-downs, etc!",
                breakpoints: {
                    xs: 12,
                },
                type: DATA_TYPE.ARRAY,
                validators: {
                    required: "An item permission is required.",
                },
                subColumns: [
                    {
                        label: "Item Actions",
                        key: "itemActions",
                        tooltip: "Actions that the users in this role can use on data within this collection. CC will overwrite BCC on create in an email!",
                        type: DATA_TYPE.CHECKBOX,
                        options: [
                            CRUD.READ,
                            CRUD.CREATE,
                            CRUD.UPDATE,
                            CRUD.DELETE,
                            CRUD.CC_ON_CREATE,
                            CRUD.BCC_ON_CREATE,
                        ],
                        validators: {
                            required: "A item action set must be provided.",
                        },
                    },
                    {
                        label: "Item Collection Key",
                        key: "itemKey",
                        tooltip: "The item collection key would be the main item management tab that the admin can view and the collection on the database.",
                        type: DATA_TYPE.SELECT,
                        options: [
                            "messages",
                            "feedback",
                            "clients",
                            "shops",
                            "products",
                            "orders",
                        ],
                        noDups: true,
                        validators: {
                            required: "An item key must be provided.",
                        },
                    },
                ],
                defaultArrayFieldStruct: {
                    itemKey: "",
                    itemActions: "",
                },
                initialValue: [],
            },
            {
                label: "Filter",
                key: "filter",
                tooltip: "An item filter will allow you to limit what exact data this role can interact with. If none provided, all sub-data will be usable. ",
                type: DATA_TYPE.OBJECT,
                breakpoints: {
                    xs: 12,
                },
                nestedColumns: [
                    {
                        label: "Apply filter?",
                        key: "applyFilter",
                        tooltip: "Do we want to activate this filter or not?",
                        breakpoints: {
                            xs: 12,
                        },
                        type: DATA_TYPE.RADIO,
                        isBool: true,
                        initialValue: "false",
                        // validators: {
                        //     required: "We need to know if you want to apply this filter or not.",
                        // },
                    },
                    {
                        label: "Main Collection Key",
                        key: "filterKey",
                        noDups: true,
                        tooltip: "The filter collection key would be the main item management tab that the admin can view and the collection on the database like 'products'.",
                        breakpoints: {
                            xs: 12,
                            sm: 6,
                        },
                        type: DATA_TYPE.SELECT,
                        options: [
                            "messages",
                            "feedback",
                            "clients",
                            "shops",
                            "products",
                            "orders",
                        ],
                    },
                    {
                        label: "Dependent Collection Keys",
                        key: "depKeys",
                        tooltip: "Which collection keys should we apply the dependent column key to? This value does not need to include the main collection key above.",
                        breakpoints: {
                            xs: 12,
                            sm: 6,
                        },
                        type: DATA_TYPE.ARRAY,
                        subColumns: [
                            {
                                label: "Collection key",
                                key: "depKey",
                                noDups: true,
                                type: DATA_TYPE.SELECT,
                                options: [
                                    "messages",
                                    "feedback",
                                    "clients",
                                    "shops",
                                    "products",
                                    "orders",
                                ],
                                validators: {
                                    required: "A collection key must be provided.",
                                },
                            },
                        ],
                        defaultArrayFieldStruct: {
                            columnValue: "",
                        },
                        initialValue: [],
                    },
                    {
                        label: "Main Field Column Key",
                        key: "columnKey",
                        tooltip: "Filter column key would be the key string of the field that you want to limit, such as a client's 'name' field.",
                        placeholder: "name",
                        breakpoints: {
                            xs: 12,
                            sm: 6,
                        },
                        type: DATA_TYPE.TEXT,
                    },
                    {
                        label: "Dependent Field Column Key",
                        key: "depColKey",
                        tooltip: "The dependent column key would be another field key that this data is sorted by in ANOTHER item data collection, such as in 'shops' collection, 'clients' are sorted by the 'client' key, not 'name' key, so you would put 'client' here.",
                        breakpoints: {
                            xs: 12,
                            sm: 6,
                        },
                        placeholder: "client",
                        type: DATA_TYPE.TEXT,
                    },
                    {
                        label: "Field Column Values",
                        key: "columnValues",
                        tooltip: "Filter column value would be the expected value to limit like client name such as 'Twilio' or 'Google'.",
                        type: DATA_TYPE.ARRAY,
                        subColumns: [
                            {
                                label: "Value",
                                key: "columnValue",
                                breakpoints: {
                                    xs: 12,
                                    sm: 6,
                                    md: 4,
                                },
                                placeholder: "ACME",
                                type: DATA_TYPE.TEXT,
                                validators: {
                                    required: "A filter column value must be provided.",
                                },
                            },
                        ],
                        defaultArrayFieldStruct: {
                            columnValue: "",
                        },
                        initialValue: [],
                    },
                ],
            },
            {
                label: INPUT.NOTES.LABEL,
                key: INPUT.NOTES.KEY,
                placeholder: INPUT.NOTES.PLACEHOLDER,
                tooltip: INPUT.NOTES.TOOLTIP,
                type: DATA_TYPE.RICH_TEXT,
                breakpoints: {
                    xs: 12,
                },
            },
        ],
    },
};
