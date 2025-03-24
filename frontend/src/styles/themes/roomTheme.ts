import {defaultThemeColors} from "./default.ts";
import type { ThemeConfig } from "antd";


interface ThemeType  extends ThemeConfig{
	token: {
		colorBgBase: string;
		colorTextBase: string;
		colorPrimary: string;
		colorInfo: string;
		colorLinkHover: string;
		colorLinkActive: string;
		colorBorder: string;
		// colorSuccessBg: string;
		// colorWarningBg: string;
		// colorErrorBg: string;
		colorLink: string;
		colorText: string;
	};
	components: Record<string, any>;
}

export const darkRoomTheme : ThemeType = {
	token: {
		"colorBgBase": defaultThemeColors.colors["--clr-surface-a0"],
		"colorTextBase": defaultThemeColors.colors["--clr-light-a0"],
		"colorPrimary": defaultThemeColors.colors["--clr-primary-a30"],
		"colorInfo": defaultThemeColors.colors["--clr-primary-a40"],
		"colorLinkHover": defaultThemeColors.colors["--clr-surface-a10"],
		"colorLinkActive": defaultThemeColors.colors["--clr-primary-a20"],
		"colorBorder": defaultThemeColors.colors["--clr-surface-a30"],
		// "colorSuccessBg":defaultThemeColors.colors.background,
		// "colorWarningBg": defaultThemeColors.colors.background,
		// "colorErrorBg": defaultThemeColors.colors.background,
		"colorLink": defaultThemeColors.colors["--clr-light-a0"],
		"colorText": defaultThemeColors.colors["--clr-light-a0"],

	},
	components: {
		Button: {
			defaultHoverBg: "#d5a635",
		},
		Layout: {
			headerBg: 'transparent',
			siderBg: defaultThemeColors.colors["--clr-surface-a0"],
			headerPadding: 20,
			headerHeight: 100,
			triggerHeight:'100vh',
			footerBg:'transparent'
		},
		Content:{
			borderRadius:10
		},
		// Space:{
		// 	bgcolor:defaultThemeColors.colors.background
		// },
		Menu: {
			itemBg: 'inherit'
		},
		List:{
			colorBorder:defaultThemeColors.colors.primary
		},

		"Input": {
			"colorBgContainer": defaultThemeColors.colors['--clr-surface-a10']
		},
		Progress:{
			defaultColor:defaultThemeColors.colors["--clr-primary-a40"]
		}
	}
};




