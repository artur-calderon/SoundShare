import { Avatar, List,  Tooltip } from "antd";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import { ListMusic } from "lucide-react";
import {PlaylistContainer, PlaylistItens, TitlePlaylist} from "./styles.ts";
import {usePlaylistStore} from "../../../../contexts/PlayerContext/usePlaylistStore";
import {usePlayerStore} from "../../../../contexts/PlayerContext/usePlayerStore";
import {useEffect} from "react";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {useParams} from "react-router-dom";

export function Playlist() {

	const screens = useBreakpoint();


	const {playlist, removeTrack} = usePlaylistStore()
	const {playMusic} = usePlayerStore()
	const {roomState, isHost} = useRoomStore()
	const {id} = useParams()



	// @ts-ignore
	useEffect(() => {
			if (roomState?.playlist?.length > 0) {
				usePlaylistStore.setState((state) => ({playlist: [...state.playlist, roomState?.playlist]}))
			}

	}, [roomState]);


	const playlistContent = (<>
		<TitlePlaylist level={4}>
			<ListMusic />
			PLAYLIST
		</TitlePlaylist>

		<PlaylistItens>
			{playlist?.length > 0 ? (
				<List
					pagination={{ position: "bottom", align: "center" }}
					itemLayout="vertical"
					style={{ width: "100%" }}
					size="small"
					dataSource={roomState?.playlist}
					renderItem={(item) => (
						<List.Item
							style={{
								width: "100%",
								display: "flex",
								flexDirection: screens.xs ? "column" : "row",
								alignItems: screens.xs ? "flex-start" : "center",
								gap: "1rem",
								padding: screens.xs ? "1rem 0" : "1rem",
							}}
							actions={
								isHost
									? [
										<Tooltip title="Tocar agora" placement="top" key="play">
											<PlayCircleOutlined
												onClick={() => {
													playMusic(id, item);
												}}
												style={{
													fontSize: "20px",
													marginRight: "20px",
													display: isHost ? "block" : "none",
												}}
											/>
										</Tooltip>,
										<Tooltip
											title="Remover da Playlist"
											placement="top"
											key="remove"
										>
											<DeleteOutlined
												onClick={() => removeTrack(item.url)}
												style={{
													fontSize: "20px",
													display: isHost ? "block" : "none",
												}}
											/>
										</Tooltip>,
									]
									: []
							}
							extra={
								<img
									width={screens.xs ? "100%" : 100}
									style={{ maxWidth: "150px", height: "auto", borderRadius: "8px" }}
									alt="logo"
									src={item.thumbnail}
								/>
							}
						>
							<List.Item.Meta
								avatar={
									<Avatar
										src={
											item.user?.image ||
											"https://cdn-icons-png.flaticon.com/512/149/149071.png"
										}
									/>
								}
								title={<div style={{ wordBreak: "break-word" }}>{item.title}</div>}
								description={
									<div style={{ wordBreak: "break-word" }}>
										{"Enviado por: " + item.user?.name}
									</div>
								}
							/>
						</List.Item>
					)}
				/>
			) : (
				<List />
			)}
		</PlaylistItens>
	</>)

	return (
		<PlaylistContainer direction="vertical">
			{playlistContent}
		</PlaylistContainer>
	);
}
