import {RoomContainer, RoomContent, RoomInnerWrapper, SiderContainer} from "./styles.ts";

import {ConfigProvider, Layout, Drawer, Button} from "antd";
import {MenuOutlined} from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import {darkRoomTheme} from "../../styles/themes/roomTheme.ts";
import {MenuSide} from "./components/Menu";
import {Playlist} from "./components/Playlist";
import {Main} from "./components/Main";
import {PlayerControls} from "./components/PlayerControls";

import {motion} from "framer-motion";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {useSocketStore} from "../../contexts/PlayerContext/useSocketStore";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import {ThemeProvider} from "styled-components";
import {mapDarkRoomThemeToStyled} from "../../styles/themes/roomThemeMapper.ts";


export function Room(){

	const [menuOpen, setMenuOpen] = useState(false);
	const [openPLaylist, setOpenPlaylist] = useState(false);
	const screens = useBreakpoint();


	const {Content} = Layout
	const mappedTheme = mapDarkRoomThemeToStyled();

	const variantsControls = {
		show: { position: "fixed", y: -2, display: "flex", width: "100%" },
		closed: { position: "relative", y: 0, display: "none", width: "100%" },
	};
	const {id} = useParams();
	const {isPlaying} = usePlayerStore();
	const {connect } = useSocketStore()
	const {sendHandShake} = useSocketStore();

	useEffect(() => {
		const handleOpenDrawer = () => setOpenPlaylist(true)
		window.addEventListener("openPlaylistDrawer", handleOpenDrawer)
		return () => window.removeEventListener("openPlaylistDrawer", handleOpenDrawer)
	}, []);

	useEffect(()=>{
		connect(id)
	},[connect, id, sendHandShake])

	return(
		<ConfigProvider theme={darkRoomTheme}>
			<ThemeProvider theme={mappedTheme}>
				<RoomContainer>
						<Content
							style={{height:"100vh"}}
						>
							<Layout
								style={{zIndex:1, position:"relative", height:"100%"}}
							>
								{!screens.md && (
									<Button
										type="text"
										icon={<MenuOutlined />}
										onClick={() => setMenuOpen(true)}
										style={{
											position: "fixed",
											top: 1,
											left: 16,
											zIndex: 10,
											fontSize: "20px",
											color: mappedTheme.token.colorPrimary,
										}}
									/>
								)}

								{/* Menu lateral para desktop */}
								{screens.md && (
									<>
										<SiderContainer width="180">
											<MenuSide />
										</SiderContainer>

									</>
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


								<Drawer
									placement="right"
									open={openPLaylist}
									onClose={() => setOpenPlaylist(false)}
									bodyStyle={{ padding: 0, backgroundColor: mappedTheme.token.colorBgContainer }}
									headerStyle={{ backgroundColor: mappedTheme.token.colorBgContainer, borderBottom: "none" }}
									closeIcon={<span style={{ color: mappedTheme.token.colorPrimary}}>X</span>}
									width={300}
								>
									<Playlist/>
								</Drawer>

								<RoomInnerWrapper>
									<RoomContent>
										<Main/>
									</RoomContent>
									{screens.md && (
										<SiderContainer width="420">
											<Playlist/>
										</SiderContainer>
									)}
								</RoomInnerWrapper>
							</Layout>
							<motion.div
								initial={{
									y: 200,
									display: "none",
									position: "relative",
									zIndex: 2,
								}}
								animate={isPlaying ? "show" : "closed"}
								variants={variantsControls}
							>
								<PlayerControls/>
							</motion.div>
						</Content>
				</RoomContainer>
			</ThemeProvider>
		</ConfigProvider>
	)
}