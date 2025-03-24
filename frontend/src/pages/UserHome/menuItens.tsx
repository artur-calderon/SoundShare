import { Search, UserRoundPen, LogOut, Speaker } from "lucide-react";

export const menuItems = [
	{
		label: "Procurar Salas",
		key: "salas",
		icon: <Search strokeWidth={1.5} size={15} />,
	},

	{
		label: "Perfil",
		key: "profile",
		icon: <UserRoundPen strokeWidth={1.5} size={15} />,
	},
	{
		label: "Minhas Salas",
		key: "myRooms",
		icon: <Speaker strokeWidth={1.5} size={15} />,
	},
	{
		label: "Sair",
		key: "sair",
		icon: <LogOut strokeWidth={1.5} size={15} />,
	},
	// {
	//     label: 'Playlists',
	//     key: 'playlist',
	//     icon:<Heart strokeWidth={1.5} size={15}/>,
	//     type:'group',
	//     children:[
	//         {
	//             key:'fav1',
	//             label:'Dance Music',
	//             icon:<Heart strokeWidth={1.5} size={15}/>
	//         },
	//         {
	//             key:'fav2',
	//             label:'Sertanejo',
	//             icon:<Heart strokeWidth={1.5} size={15}/>
	//         },
	//
	//     ]
	//
	// }
];
