import {RoomContainer, RoomContent, SiderContainer} from "./styles.ts";

import {ConfigProvider, Layout, Drawer, Button} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import {darkRoomTheme} from "../../styles/themes/roomTheme.ts";
import {MenuSide} from "./components/Menu";
import {Playlist} from "./components/Playlist";
import {Main} from "./components/Main";
import {PlayerControls} from "./components/PlayerControls";
import {RoomInfo} from "./components/RoomInfo";
import {RoomControls} from "../../components/RoomControls";

import {motion, Variants} from "framer-motion";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {useSocketStore} from "../../contexts/PlayerContext/useSocketStore";
import {useRoomStore} from "../../contexts/PlayerContext/useRoomStore";
import {useEffect, useState, useRef} from "react";
import {useParams} from "react-router-dom";
import {userContext} from "../../contexts/UserContext";

import {ThemeProvider} from "styled-components";
import {mapDarkRoomThemeToStyled} from "../../styles/themes/roomThemeMapper.ts";

export function Room(){
	const [menuOpen, setMenuOpen] = useState(false);
	const [openPLaylist, setOpenPlaylist] = useState(false);
	const screens = useBreakpoint();
	const connectionAttempted = useRef(false);

	const mappedTheme = mapDarkRoomThemeToStyled();

	const variantsControls: Variants = {
		show: { position: "fixed" as const, y: -2, display: "flex", width: "100%" },
		closed: { position: "relative" as const, y: 0, display: "flex", width: "100%" },
	};
	
	const {id} = useParams();
	const {isPlaying} = usePlayerStore();
	const {connect, disconnect, leaveRoom, connected} = useSocketStore();
	const {getInfoRoom, roomSpecs, roomState, isHost, canModerate} = useRoomStore();
	const {user} = userContext();

	useEffect(() => {
		const handleOpenDrawer = () => setOpenPlaylist(true)
		window.addEventListener("openPlaylistDrawer", handleOpenDrawer)
		return () => window.removeEventListener("openPlaylistDrawer", handleOpenDrawer)
	}, []);

	// Buscar informações da sala quando entrar na página
	useEffect(() => {
		if (id && user.id && !roomSpecs?.owner) {
			getInfoRoom(id, user);
		}
	}, [id, user.id, getInfoRoom, roomSpecs?.owner]);

	// Conectar ao socket quando as informações da sala estiverem disponíveis
	useEffect(() => {
		if (id && user.id && roomSpecs?.owner && !connected && !connectionAttempted.current) {
			connectionAttempted.current = true;
			
			// Conectar ao socket com informações da sala
			connect(id, {
				name: user.name,
				email: user.email,
				image: user.image,
				role: user.role,
				owner: roomSpecs.owner,
				moderators: roomSpecs.moderators || []
			});
		}
	}, [id, user.id, roomSpecs?.owner, roomSpecs?.moderators, connect, connected]);

	// Cleanup ao sair da página
	useEffect(() => {
		return () => {
			if (id && connected) {
				leaveRoom();
				disconnect();
			}
		};
	}, [id, connected, leaveRoom, disconnect]);

	return(
		<ConfigProvider theme={darkRoomTheme}>
			<ThemeProvider theme={mappedTheme}>
				<RoomContainer>
					<Layout style={{height:"100vh"}}>
						{/* Menu lateral esquerdo para desktop */}
						{screens.md && (
							<SiderContainer width="280" theme="dark">
								<MenuSide />
							</SiderContainer>
						)}

						{/* Drawer para mobile */}
						<Drawer
							placement="left"
							open={menuOpen}
							onClose={() => setMenuOpen(false)}
							bodyStyle={{ padding: 0, backgroundColor: mappedTheme.token.colorBgContainer }}
							headerStyle={{ backgroundColor: mappedTheme.token.colorBgContainer, borderBottom: "none" }}
							closeIcon={<span style={{ color: mappedTheme.token.colorPrimary}}>X</span>}
							width={300}
						>
							<MenuSide />
						</Drawer>

						{/* Área central principal */}
						<Layout style={{background: "#f5f5f5"}}>
							{!screens.md && (
								<Button
									type="text"
									icon={<MenuOutlined />}
									onClick={() => setMenuOpen(true)}
									style={{
										position: "fixed",
										top: 16,
										left: 16,
										zIndex: 10,
										fontSize: "20px",
										color: mappedTheme.token.colorPrimary,
									}}
								/>
							)}

							<RoomContent>
								<Main/>
								
								{/* Controles de moderação para donos e moderadores */}
								{canModerate && (
									<div style={{ marginTop: "24px" }}>
										<RoomControls roomId={id || ""} />
									</div>
								)}
							</RoomContent>

							{/* Controles do player */}
							<motion.div
								initial={{
									y: 0,
									display: "flex",
									position: "relative" as const,
									zIndex: 2,
								}}
								animate={(roomState?.currentTrack) ? "show" : "closed"}
								variants={variantsControls}
								transition={{ duration: 0.3, ease: "easeInOut" }}
							>
								<PlayerControls/>
							</motion.div>
						</Layout>

						{/* Sidebar direita para desktop */}
						{screens.md && (
							<SiderContainer width="450" theme="light" style={{background: "#ffffff"}}>
								<div style={{padding: "24px", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column"}}>
									{/* Playlist com altura flexível */}
									<div style={{flex: 1, minHeight: "300px", maxHeight: "50%"}}>
										<Playlist/>
									</div>
									
									{/* RoomInfo com RoomStats integrado */}
									<div style={{marginTop: "24px", flex: "0 0 auto"}}>
										<RoomInfo/>
									</div>
								</div>
							</SiderContainer>
						)}

						{/* Drawer da playlist para mobile */}
						<Drawer
							placement="right"
							open={openPLaylist}
							onClose={() => setOpenPlaylist(false)}
							bodyStyle={{ padding: 0, backgroundColor: "#ffffff" }}
							headerStyle={{ backgroundColor: "#ffffff", borderBottom: "none" }}
							closeIcon={<span style={{ color: "#1890ff"}}>X</span>}
							width={400}
						>
							<div style={{padding: "24px", height: "100%", overflowY: "auto", display: "flex", flexDirection: "column"}}>
								{/* Playlist com altura flexível */}
								<div style={{flex: 1, minHeight: "300px", maxHeight: "50%"}}>
									<Playlist/>
								</div>
								
								{/* RoomInfo com RoomStats integrado */}
								<div style={{marginTop: "24px", flex: "0 0 auto"}}>
									<RoomInfo/>
								</div>
							</div>
						</Drawer>
					</Layout>
				</RoomContainer>
			</ThemeProvider>
		</ConfigProvider>
	)
}