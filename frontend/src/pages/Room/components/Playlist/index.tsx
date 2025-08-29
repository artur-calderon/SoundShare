import { Avatar, List, Tooltip, Typography, Empty, Button, message, Space } from "antd";
import { DeleteOutlined, PlayCircleOutlined, CustomerServiceOutlined, StepForwardOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import { ListMusic } from "lucide-react";
import {PlaylistContainer, PlaylistItens, TitlePlaylist, PlaylistHeader, EmptyPlaylistContainer} from "./styles.ts";
import {usePlaylistStore} from "../../../../contexts/PlayerContext/usePlaylistStore";
import {usePlayerStore} from "../../../../contexts/PlayerContext/usePlayerStore";
import {useSocketStore} from "../../../../contexts/PlayerContext/useSocketStore";
import {useEffect} from "react";
import {useRoomStore} from "../../../../contexts/PlayerContext/useRoomStore";
import {useParams} from "react-router-dom";

const { Text } = Typography;

export function Playlist() {
	const screens = useBreakpoint();

	const {playlist, removeTrack, setPlaylist, currentIndex} = usePlaylistStore();
	const {playMusic, currentTrack} = usePlayerStore();
	const {roomState, canModerate} = useRoomStore();
	const {jumpToTrack} = useSocketStore();
	const {id} = useParams();

	// ✅ CORREÇÃO: Sincronizar playlist com o estado da sala
	useEffect(() => {
		if (roomState?.playlist) {
			console.log("🔄 Playlist sincronizada com roomState:", roomState.playlist.length, "músicas");
			setPlaylist(roomState.playlist);
			
			// ✅ CORREÇÃO: Se não há música atual mas há playlist, define a primeira
			if (!roomState.currentTrack && roomState.playlist.length > 0) {
				const { setTrack } = usePlayerStore.getState();
				setTrack(roomState.playlist[0]);
			}
		}
	}, [roomState?.playlist, roomState?.currentTrack, setPlaylist]);

	// ✅ CORREÇÃO: Sincronizar índice atual com o estado da sala
	useEffect(() => {
		if (roomState?.currentTrack && roomState.playlist) {
			const currentIndex = roomState.playlist.findIndex(track => 
				track.id === roomState.currentTrack?.id || track.url === roomState.currentTrack?.url
			);
			if (currentIndex !== -1) {
				console.log("🎯 Índice atual sincronizado:", currentIndex, roomState.currentTrack.title);
				// ✅ NOVA IMPLEMENTAÇÃO: Atualiza o currentIndex local
				usePlaylistStore.getState().setCurrentIndex(currentIndex);
			}
		}
	}, [roomState?.currentTrack, roomState?.playlist]);

	// Função para pular para música específica com verificação de permissões
	const handleJumpToTrack = (trackIndex: number) => {
		if (canModerate) {
			jumpToTrack(trackIndex);
		} else {
			message.info("Apenas donos e moderadores podem controlar a reprodução");
		}
	};

	// Função para remover música com verificação de permissões
	const handleRemoveTrack = (trackId: string) => {
		if (canModerate) {
			removeTrack(trackId);
		} else {
			message.info("Apenas donos e moderadores podem remover músicas");
		}
	};

	// Função para tocar música específica
	const handlePlayTrack = (track: any) => {
		if (id) {
			playMusic(id, track);
		}
	};

	const playlistContent = (
		<>
			<PlaylistHeader>
				<TitlePlaylist level={4}>
					<ListMusic style={{ marginRight: "8px" }} />
					Playlist ({playlist?.length || 0} músicas)
				</TitlePlaylist>
			</PlaylistHeader>

			<PlaylistItens>
				{playlist?.length > 0 ? (
					<List
						itemLayout="horizontal"
						style={{ width: "100%" }}
						size="small"
						dataSource={playlist}
						renderItem={(item, index) => (
							<List.Item
								style={{
									width: "100%",
									display: "flex",
									flexDirection: "row",
									alignItems: "flex-start",
									gap: "12px",
									padding: "5px",
									borderRadius: "8px",
									marginBottom: "8px",
									background: index === currentIndex ? "#e6f7ff" : "#fafafa",
									border: index === currentIndex ? "1px solid #1890ff" : "1px solid #f0f0f0",
									cursor: "pointer",
									minHeight: "80px",
									overflow: "hidden"
								}}
								onClick={() => handleJumpToTrack(index)}
								actions={
									canModerate
										? [
											<Tooltip title="Tocar agora" placement="top" key="play">
												<Button
													type="text"
													icon={<PlayCircleOutlined />}
													onClick={(e) => {
														e.stopPropagation();
														handlePlayTrack(item);
													}}
													style={{
														color: "#1890ff",
														display: canModerate ? "block" : "none",
													}}
													disabled={index === currentIndex}
												/>
											</Tooltip>,
											<Tooltip
												title="Pular para esta música"
												placement="top"
												key="jump"
											>
												<Button
													type="text"
													icon={<StepForwardOutlined />}
													onClick={(e) => {
														e.stopPropagation();
														handleJumpToTrack(index);
													}}
													style={{
														color: "#52c41a",
														display: canModerate ? "block" : "none",
													}}
													disabled={index === currentIndex}
												/>
											</Tooltip>,
											<Tooltip
												title="Remover da Playlist"
												placement="top"
												key="remove"
											>
												<Button
													type="text"
													icon={<DeleteOutlined />}
													onClick={(e) => {
														e.stopPropagation();
														handleRemoveTrack(item.id);
													}}
													style={{
														color: "#ff4d4f",
														display: canModerate ? "block" : "none",
													}}
												/>
											</Tooltip>,
										]
										: []
								}
								extra={
									<div style={{ 
										flexShrink: 0,
										width: "60px",
										height: "60px",
										overflow: "hidden",
										borderRadius: "8px"
									}}>
										<img
											width="100%"
											height="100%"
											style={{ 
												width: "100%",
												height: "100%",
												objectFit: "cover",
												borderRadius: "8px"
											}}
											alt="thumbnail"
											src={item.thumbnail}
										/>
									</div>
								}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											src={
												item.user?.image ||
												"https://cdn-icons-png.flaticon.com/512/149/149071.png"
											}
											size="small"
											style={{ flexShrink: 0 }}
										/>
									}
									title={
										<div style={{ 
											display: "flex", 
											alignItems: "center", 
											gap: "8px",
											flexWrap: "wrap",
											minWidth: 0,
											width: "100%"
										}}>
											<Text 
												strong 
												style={{ 
													fontSize: "14px",
													color: index === currentIndex ? "#1890ff" : "#262626",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: screens.xs ? "150px" : "200px",
													flex: 1,
													minWidth: 0
												}}
											>
												{index + 1}. {item.title}
											</Text>
										</div>
									}
									description={
										<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
											<Text 
												type="secondary" 
												style={{ 
													fontSize: "12px",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
													maxWidth: screens.xs ? "150px" : "200px"
												}}
											>
												Enviado por: {item.user?.name}
											</Text>
											{index === currentIndex && (
												<span 
													style={{ 
														fontSize: "10px",
														color: "#1890ff",
														backgroundColor: "#e6f7ff",
														padding: "2px 6px",
														borderRadius: "4px",
														border: "1px solid #91d5ff",
														alignSelf: "flex-start",
														whiteSpace: "nowrap"
													}}
												>
													▶ Tocando agora
												</span>
											)}
										</div>
									}
								/>
							</List.Item>
						)}
					/>
				) : (
					<EmptyPlaylistContainer>
						<CustomerServiceOutlined style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }} />
						<Text type="secondary" style={{ fontSize: "16px", marginBottom: "8px" }}>
							Playlist vazia
						</Text>
						<Text type="secondary" style={{ fontSize: "14px", textAlign: "center" }}>
							Adicione músicas da busca para aparecerem aqui
						</Text>
					</EmptyPlaylistContainer>
				)}
			</PlaylistItens>
		</>
	)

	return (
		<PlaylistContainer direction="vertical" size="small" style={{ height: '100%' }}>
			{playlistContent}
		</PlaylistContainer>
	);
}
