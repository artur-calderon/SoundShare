import {RoomContainer, RoomContent, SiderContainer} from "./styles.ts";
import {ConfigProvider, Layout} from "antd";
import {darkRoomTheme} from "../../styles/themes/roomTheme.ts";
import {MenuSide} from "./components/Menu";
import {Playlist} from "./components/Playlist";
import RoomStats from "./components/RoomStats";
import {Main} from "./components/Main";
import {PlayerControls} from "./components/PlayerControls";

import {motion} from "framer-motion";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {useSocketStore} from "../../contexts/PlayerContext/useSocketStore";
import {useEffect} from "react";
import {useParams} from "react-router-dom";


export function Room(){

	const {Content} = Layout

	const variantsControls = {
		show: { position: "fixed", y: -110, display: "flex", width: "100%" },
		closed: { position: "relative", y: 0, display: "none", width: "100%" },
	};
	const {id} = useParams();
	const {isPlaying} = usePlayerStore();
	const {connect } = useSocketStore()
	const {sendHandShake} = useSocketStore();

	useEffect(()=>{
		connect(id)
	},[connect, id, sendHandShake])

	return(
		<ConfigProvider theme={darkRoomTheme}>
			<RoomContainer>
					<Content
						style={{height:"100vh"}}
					>
						<Layout
							style={{zIndex:1, position:"relative", height:"100%"}}
						>
							<SiderContainer width="180">
								<MenuSide/>
							</SiderContainer>
							<RoomContent>
								<Main/>
							</RoomContent>
							<SiderContainer width="420">
								<Playlist/>
								<RoomStats/>
							</SiderContainer>
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
		</ConfigProvider>
	)
}