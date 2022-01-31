// ** font constants and colors only used as defaults if nothing loaded
// ** to import custom local font under globalStyle since I will always have to hardcode the font constant because not a default html font nor a Google font if importing from webfontloader library
export const FONTS = {
    ROBOTO_REGULAR: "Roboto Regular",
    ROBOTO_BOLD: "Roboto Bold",
}

export const COLORS = {
    PRIMARY: "dodgerblue",
    SECONDARY: "olive",
    TERTIARY: "tomato",
    RED: "firebrick",
    GREEN: "green",
    YELLOW: "gold",
    GREY: "grey",
    LIGHT_GREY: "lightgrey",
    BLUE: "navy"
}

export const NOTIFICATION = {
    insert: "top",
    container: "top-center",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
        duration: 5000,
        onScreen: true,
        pauseOnHover: true
    }
}