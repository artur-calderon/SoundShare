import {useEffect} from "react";

import { Layout, Menu, } from "antd";
import {MenuInfo} from "rc-menu/lib/interface";

import { menuItems } from "./menuItens.jsx";
import {Outlet, useNavigate} from "react-router-dom";
import { Container, SiderC } from "./styles.js";
import {userContext} from "../../contexts/UserContext.tsx";

export function UserHome() {
	const { Content, Footer } = Layout;
	const {signOut, user, isLoggedIn} = userContext()

	const navigate = useNavigate();

	//
	// useEffect(() => {
	// 	if (!isLoggedIn) {
	// 		navigate("/login");
	// 	}
	// }, [isLoggedIn, navigate]);

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
							<Outlet />
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
