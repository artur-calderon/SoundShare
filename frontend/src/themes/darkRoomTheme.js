export const primary =  "#f5c249";
export const primary2 =  "#f4ecd8";
export const background = "#141620";
export const border = "#313239";
const backgroundDark = "#060606";
const white = '#ffffff'

export let darkRoomTheme;
darkRoomTheme = {
    token: {
        "colorBgBase": backgroundDark,
        "colorTextBase":primary,
        "colorPrimary": primary,
        "colorInfo": background,
        "colorLinkHover":primary,
        "colorLinkActive": primary,
        "colorBorder": border,
        "colorSuccessBg":background,
        "colorWarningBg": background,
        "colorErrorBg": background,
        "colorLink":white,
        "colorText":primary
    },
    components: {
        Button: {
            defaultHoverBg: "#d5a635",
        },
        Layout: {
            headerBg: background,
            siderBg: background,
            headerPadding: 20,
            headerHeight: 100,
            triggerHeight:'100vh',
            footerBg:background
        },
        Content:{
            borderRadius:10
        },
        Space:{
            bgcolor:background
        },
        Menu: {
            itemBg: 'inherit'
        },
        List:{
            colorBorder:primary
        },
        "Divider": {
            "colorSplit": primary
        },
        "Input": {
            "colorBgContainer": background
        },
        "Alert": {
            "colorInfoBg": background
        },
        Progress:{
            defaultColor:primary
        }
    }
};




