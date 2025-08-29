import { 
	DashboardOutlined, 
	CustomerServiceOutlined, 
	HeartOutlined, 
	ClockCircleOutlined,
	UserOutlined,
	PlayCircleOutlined,
	SettingOutlined,
	LogoutOutlined
} from '@ant-design/icons';
import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export const menuItems: MenuItem[] = [
	{
		label: 'Dashboard',
		key: 'dashboard',
		icon: <DashboardOutlined style={{ fontSize: '18px' }} />,
	},
	{
		label: 'Salas de Música',
		key: 'music-rooms',
		icon: <CustomerServiceOutlined style={{ fontSize: '18px' }} />,
	},
	{
		label: 'Favoritos',
		key: 'favorites',
		icon: <HeartOutlined style={{ fontSize: '18px' }} />,
	},
	{
		label: 'Histórico',
		key: 'history',
		icon: <ClockCircleOutlined style={{ fontSize: '18px' }} />,
	},
	{
		type: 'divider',
	},
	{
		label: 'Gerenciamento',
		type: 'group',
		children: [
			{
				label: 'Usuários',
				key: 'users',
				icon: <UserOutlined style={{ fontSize: '18px' }} />,
			},
			{
				label: 'Playlists',
				key: 'playlists',
				icon: <PlayCircleOutlined style={{ fontSize: '18px' }} />,
			},
			{
				label: 'Configurações',
				key: 'settings',
				icon: <SettingOutlined style={{ fontSize: '18px' }} />,
			},
		],
	},
	{
		type: 'divider',
	},
	{
		label: 'Sair',
		key: 'sair',
		icon: <LogoutOutlined style={{ fontSize: '18px' }} />,
	},
];