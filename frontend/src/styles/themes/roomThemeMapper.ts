// styles/themes/roomThemeMapper.ts

import { darkRoomTheme } from "./roomTheme";

export const mapDarkRoomThemeToStyled = () => ({
	token: {
		colorPrimary: darkRoomTheme.token.colorPrimary,
		colorBgContainer: darkRoomTheme.token.colorBgBase,
		colorBorder: darkRoomTheme.token.colorBorder,
		colorBorderSecondary: darkRoomTheme.token.colorBorder,
		colorTextBase: darkRoomTheme.token.colorTextBase,
		colorText: darkRoomTheme.token.colorText,
		colorLink: darkRoomTheme.token.colorLink,
		colorLinkHover: darkRoomTheme.token.colorLinkHover,
		colorLinkActive: darkRoomTheme.token.colorLinkActive,
	},
	components: {
		Button: darkRoomTheme.components.Button,
		Layout: darkRoomTheme.components.Layout,
		Menu: darkRoomTheme.components.Menu,
		List: darkRoomTheme.components.List,
		Input: darkRoomTheme.components.Input,
		Progress: darkRoomTheme.components.Progress,
		Content: darkRoomTheme.components.Content,
	}
});
