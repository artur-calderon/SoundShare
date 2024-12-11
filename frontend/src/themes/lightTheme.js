const primary =  "#f5c249";
const background = "#141620";
const backgroundDark = "#060606";
const white = '#ffffff'

export let lightTheme;
lightTheme = {
    token: {
        // "colorBgBase": backgroundDark,
        "colorTextBase":background,
        "colorText":primary,
        "colorPrimary": primary,
        // "colorInfo": background,
        "colorLinkHover":primary,
        "colorLinkActive": primary,
        "colorBorder": primary,
        "colorSuccessBg":background,
        "colorWarningBg": background,
        "colorErrorBg": background,
        "colorLink":white,
    },
    components: {
        Button: {
            defaultHoverBg: background,
            defaultBg:background
        },
        Layout: {
            headerBg: white,
            siderBg: white,
            headerPadding: 20,
            headerHeight: 100,
            bodyBg:'#F5F5F5'
        },
        Content:{
            borderRadius:10,
            bgColor:white
        },
        Space:{
            bgcolor:white
        },
        Menu: {
            itemBg: 'inherit'
        },

        "Divider": {
            "colorSplit": primary
        },
        // "Input": {
        //     "colorBgContainer": background
        // },
        // "Alert": {
        //     "colorInfoBg": background
        // },
    }
};