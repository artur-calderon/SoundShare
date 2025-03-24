import { House , Settings , LogOut, Heart} from 'lucide-react'
import {defaultThemeColors} from "../../../../styles/themes/default.ts";


export const menuItems = [
	{
		label: 'Home',
		key: 'home',
		icon: <House strokeWidth={1.5} size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>,
},

{
	label: 'Configurações',
		key: 'ConfApp',
	icon: <Settings strokeWidth={1.5} size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>,
},
{
	label: 'Sair',
		key: 'sair',
	icon: <LogOut strokeWidth={1.5}  size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>,
},
{
	label: 'Playlists',
		key: 'playlist',
	icon:<Heart strokeWidth={1.5} size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>,
	type:'group',
		children:[
	{
		key:'fav1',
		label:'Dance Music',
		icon:<Heart strokeWidth={1.5} size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>
},
	{
		key:'fav2',
			label:'Sertanejo',
		icon:<Heart strokeWidth={1.5} size={20} color={defaultThemeColors.colors["--clr-primary-a0"]}/>
	},

]

}

]