
import { Layout, Menu, Button} from "antd";
import {MenuInfo} from "rc-menu/lib/interface";

import { menuItems } from "./menuItens.jsx";
import {Outlet, useNavigate} from "react-router-dom";
import {Container, DrawerC, SiderC} from "./styles.js";
import {userContext} from "../../contexts/UserContext.tsx";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";
import {MenuOutlined} from "@ant-design/icons";
import {useState} from "react";

import {mapDarkRoomThemeToStyled} from "../../styles/themes/roomThemeMapper.ts";

export function UserHome() {
	const { Content, Footer } = Layout;
	const {signOut, user,} = userContext()

	const navigate = useNavigate();
	const screens = useBreakpoint();
	const [menuOpen, setMenuOpen] = useState(false);
	const mappedTheme = mapDarkRoomThemeToStyled();
	

	function handleMenuClick(click: MenuInfo) {
		const { key } = click;
		switch (key) {
			case "sair":
				signOut();
				navigate("/login");
				break;
			case "myRooms":
				navigate("/app/myrooms");
				break;
			case "salas":
				navigate("/app");
				break;
			case "profile":
				navigate("/app/profile");
				break;
		}
	}

	return (
		<Layout
			style={{
				minHeight: "100vh",
			}}
		>
			{!screens.md && (
				<Button
					type="text"
					icon={<MenuOutlined />}
					onClick={() => setMenuOpen(true)}
					style={{
						position: "fixed",
						top: 20,
						left: 1,
						zIndex: 10,
						fontSize: "20px",
					}}
				/>
			)}

			{screens.md && (
				<SiderC>
					<div className="demo-logo-vertical">
						<img
							alt="logo"
							src="/Logo%20Sound%20Share%20Sem%20fundo.png"
							width="150"
						/>
					</div>
					<div className="userInfo">
						<b>Bem vindo {user && 'name' in user ? user.name : 'Usuário'}</b>
					</div>
					<Menu
						theme="dark"
						defaultSelectedKeys={["1"]}
						mode="inline"
						items={menuItems}
						onClick={handleMenuClick}
					/>
				</SiderC>
			)}

			{/* Menu lateral para mobile */}

			<DrawerC
				placement="left"
				open={menuOpen}
				onClose={() => setMenuOpen(false)}
				bodyStyle={{padding: 0, backgroundColor: mappedTheme.token.colorBgContainer}}
				headerStyle={{backgroundColor: mappedTheme.token.colorBgContainer, borderBottom: "none"}}
				closeIcon={<span style={{color: mappedTheme.token.colorPrimary}}>X</span>}
				width={300}
				extra={
					<div className="demo-logo-vertical">
						<img
							alt="logo"
							src="/Logo%20Sound%20Share%20Sem%20fundo.png"
							width="150"
						/>
					</div>
				}
			>
				<div className="userInfo">
					<b>Bem vindo {user && 'name' in user ? user.name : 'Usuário'}</b>
				</div>
				<Menu
					className="menu"
					theme="dark"
					style={{color:"white"}}
					defaultSelectedKeys={["1"]}
					mode="inline"
					items={menuItems}
					onClick={handleMenuClick}
				/>
			</DrawerC>

			<Layout>
				<Content
					style={{
						margin: "0 16px",
					}}
				>
					<div
						style={{
							padding: 24,
							minHeight: 360,
						}}
					>
						<Container>
							<Outlet/>
						</Container>
					</div>
				</Content>
				<Footer
					style={{
						textAlign: "center",
					}}
				>
					Music Share ©{new Date().getFullYear()} Calderon Tecnologia
				</Footer>
			</Layout>
		</Layout>
	);
}
