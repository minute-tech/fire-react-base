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

export const DEFAULT_THEME = {
    FONTS: {
        ROBOTO_REGULAR: "Roboto Regular",
        ROBOTO_BOLD: "Roboto Bold",
    },
    MODES: {
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
                    HEADING: 'black',
                    BODY: 'black',
                    LINK: 'navy'
                },
                BACKGROUND: "white"
            }
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
                    HEADING: 'white',
                    BODY: 'white',
                    LINK: 'lightblue'
                },
                BACKGROUND: "#36454F"
            }
        }
    }
}