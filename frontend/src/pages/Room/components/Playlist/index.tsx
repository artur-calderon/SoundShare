import { Avatar, List,  Tooltip } from "antd";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import { ListMusic } from "lucide-react";
import {PlaylistContainer, PlaylistItens, TitlePlaylist} from "./styles.ts";
import {usePlaylistStore} from "../../../../contexts/PlayerContext/usePlaylistStore";
import {usePlayerStore} from "../../../../contexts/PlayerContext/usePlayerStore";
import {useEffect, useState} from "react";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {useParams} from "react-router-dom";

export function Playlist() {

	const screens = useBreakpoint();

	const {playlist, removeTrack} = usePlaylistStore()
	const {playMusic} = usePlayerStore()
	const {roomState} = useRoomStore()
	const {id} = useParams()

	const [playlistMusic, setPlaylistMusic] = useState([]);

	// function highlightTheCurrentMusic(playlistMusic) {
	// 	if (currentMusicPlaying.video?.url === playlistMusic) {
	// 		return `3px solid ${primary}`;
	// 	} else {
	// 		return " ";
	// 	}
	// }

	// @ts-ignore
	useEffect(() => {
			if (roomState?.playlist?.length > 0) {
				// console.log(data)
				usePlaylistStore.setState((state) => ({playlist: [...state.playlist, roomState?.playlist]}))
			}

	}, [roomState]);

	useEffect(() => {
		playlist.map((music) => {
			setPlaylistMusic(music)
		}
		)
	}, [playlist]);

	return (
		<PlaylistContainer
			direction="vertical"
		>
			<TitlePlaylist
				level={4}
			>
				<ListMusic />
				PLAYLIST
			</TitlePlaylist>
			<PlaylistItens>
				{playlist?.length > 0 ? (
					<List
						pagination={"bottom"}
						itemLayout="vertical"
						style={{ width: "auto" }}
						size="small"
						dataSource={playlistMusic}
						renderItem={(item) => (
							<List.Item
								style={{
									width: screens.xs ? "100%" : "25rem",
									display: "flex",

									// borderLeft: `${highlightTheCurrentMusic(item.video.url)}`,
								}}
								actions={[
									<Tooltip title="Tocar agora" placement="top" key="play">
										<PlayCircleOutlined
											onClick={() => {
												playMusic(id,item);
											}}
											style={{ fontSize: "20px", marginRight: "20px" }}
										/>
									</Tooltip>,
									<Tooltip
										title="Remover da Playlist"
										placement="top"
										key="add-to-playlist"
									>
										<DeleteOutlined
											onClick={() => removeTrack(item.url)}
											style={{ fontSize: "20px" }}
										/>
									</Tooltip>,
								]}
								extra={
									<img
										width={screens.xs ? "100%" : 100}
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
									title={item.title}
									description={"Enviado por: " + item.user?.name}
								/>
							</List.Item>
						)}
					></List>
				) : (
					<List></List>
				)}
			</PlaylistItens>
		</PlaylistContainer>
	);
}
