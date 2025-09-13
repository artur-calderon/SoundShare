import {List, Empty, Flex, Tooltip, Button} from "antd";
import { PlayCircleOutlined, UnorderedListOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import { SpaceContainer, SearchContainer, SearchInput, ResultsContainer, ResultsCard } from "./styles.ts";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {userContext} from "../../contexts/UserContext.tsx";
import {useSocketStore} from "../../contexts/PlayerContext/useSocketStore";
import {useParams} from "react-router-dom";
import {useRoomStore} from "../../contexts/PlayerContext/useRoomStore";

export function SearchMusic() {
	const [showResults, setShowResults] = useState(false);

	// ✅ OTIMIZAÇÃO: Usar seletores específicos para evitar re-renders desnecessários
	const {searchMusic, loading, searchResults} = usePlayerStore();
	const {user} = userContext();
	const {playTrack} = useSocketStore();
	const {id} = useParams();
	const {roomState} = useRoomStore();

	// Debug: log do roomId e estado
	useEffect(() => {
		console.log("🔍 SearchMusic Debug:", {
			roomId: id,
			roomState: roomState ? {
				roomId: roomState.roomId,
				playlistLength: roomState.playlist?.length || 0,
				currentTrack: roomState.currentTrack?.title || 'null',
				playing: roomState.playing
			} : 'null'
		});
		
		// ✅ CORREÇÃO: Se não há música atual mas há playlist, define a primeira
		if (roomState && !roomState.currentTrack && roomState.playlist && roomState.playlist?.length > 0) {
			const { setTrack } = usePlayerStore.getState();
			setTrack(roomState.playlist[0]);
		}
	}, [id, roomState]);

	// Debug: log dos resultados da busca
	useEffect(() => {
		if (searchResults && searchResults.length > 0) {
			console.log("Resultados da busca:", searchResults);
			console.log("Primeiro resultado:", searchResults[0]);
		}
	}, [searchResults]);

	// Fechar ao clicar fora
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			if (!target.closest('.search-results-container') && !target.closest('.ant-input-search')) {
				setShowResults(false);
			}
		};

		if (showResults) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [showResults]);

	const handleSearch = (value: string) => {
		searchMusic(value, user);
		setShowResults(true);
	};

	const handleResultClick = () => {
		// Manter os resultados visíveis por um tempo após clicar
		setTimeout(() => setShowResults(false), 2000);
	};

	const handleCloseResults = () => {
		setShowResults(false);
	};

	// Verifica se uma música já está na playlist
	const isTrackInPlaylist = (trackId: string) => {
		// Verifica por ID ou por URL se não houver ID
		return roomState?.playlist?.some(track => 
			track.id === trackId || track.url === trackId
		) || false;
	};

	// Verifica se uma música está tocando atualmente
	const isTrackCurrentlyPlaying = (trackId: string) => {
		// Verifica se a música é a atual E se está tocando
		const isCurrentTrack = roomState?.currentTrack?.id === trackId || 
							  roomState?.currentTrack?.url === trackId;
		const isPlaying = roomState?.playing === true;
		
		return isCurrentTrack && isPlaying;
	};

	return (
		<SpaceContainer direction="vertical">
			<SearchContainer>
				<SearchInput
					placeholder="Buscar músicas no YouTube..."
					enterButton={<SearchOutlined />}
					loading={loading}
					size="large"
					onSearch={handleSearch}
					onFocus={() => setShowResults(true)}
					style={{
						width: "100%",
						maxWidth: "800px",
						boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
					}}
				/>
			</SearchContainer>

			{/* Lista de resultados flutuante */}
			{showResults && searchResults?.length > 0 && (
				<ResultsContainer className="search-results-container">
					<ResultsCard>
						{/* Header com botão de fechar */}
						<div style={{
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							padding: "12px 16px",
							borderBottom: "1px solid #f0f0f0"
						}}>
							<span style={{ fontSize: "14px", fontWeight: "500", color: "#262626" }}>
								Resultados da busca
							</span>
							<Button
								type="text"
								icon={<CloseOutlined />}
								onClick={handleCloseResults}
								style={{ color: "#8c8c8c" }}
								size="small"
							/>
						</div>
						
						<List
							itemLayout="horizontal"
							size="small"
							dataSource={searchResults}
							renderItem={(item: any) => {
								// Usar a URL como ID único se não houver campo id
								const trackId = item.id || item.url || `track-${Math.random()}`;
								const inPlaylist = isTrackInPlaylist(trackId);
								const isPlaying = isTrackCurrentlyPlaying(trackId);
								
								return (
									<List.Item
										style={{
											width: "100%",
											display: "flex",
											flexDirection: "row",
											alignItems: "flex-start",
											gap: "12px",
											padding: "12px 16px",
											borderBottom: "1px solid #f0f0f0",
											cursor: "pointer",
											minHeight: "80px",
											overflow: "hidden",
											backgroundColor: inPlaylist ? "#f6ffed" : "transparent"
										}}
										onClick={handleResultClick}
										actions={[
											<Tooltip 
												title={isPlaying ? "Já está tocando" : "Tocar agora"} 
												placement="top" 
												key="play"
											>
												<Button
													type="text"
													icon={<PlayCircleOutlined />}
													onClick={(e) => {
														e.stopPropagation();
														console.log("🎵 Botão Play clicado:", { id, trackId, isPlaying });
														if (id && !isPlaying) {
															const trackToPlay = {
																...item,
																id: trackId, // Garantir que o ID seja definido
																user: user
															};
															console.log("🎯 Tocando música:", trackToPlay);
															// ✅ CORREÇÃO: Apenas playTrack - o backend adiciona à playlist automaticamente
															playTrack(trackToPlay);
														}
														setShowResults(false);
													}}
													style={{ 
														color: isPlaying ? "#d9d9d9" : "#1890ff",
														cursor: isPlaying ? "not-allowed" : "pointer"
													}}
													disabled={isPlaying}
												/>
											</Tooltip>,
											<Tooltip 
												title={inPlaylist ? "Já está na playlist" : "Adicionar à Playlist"} 
												placement="top" 
												key="addToPlaylist"
											>
												<Button
													type="text"
													icon={<UnorderedListOutlined />}
													onClick={(e) => {
														e.stopPropagation();
														console.log("📝 Botão Add to Playlist clicado:", { id, trackId, inPlaylist });
														if (id && !inPlaylist) {
															const trackToAdd = {
																...item,
																id: trackId, // Garantir que o ID seja definido
																user: user
															};
															console.log("🎯 Adicionando à playlist:", trackToAdd);
															// ✅ CORREÇÃO: Usar addTrack do socket para adicionar sem tocar
															const { addTrack: socketAddTrack } = useSocketStore.getState();
															socketAddTrack(trackToAdd);
														}
													}}
													style={{ 
														color: inPlaylist ? "#d9d9d9" : "#52c41a",
														cursor: inPlaylist ? "not-allowed" : "pointer"
													}}
													disabled={inPlaylist}
												/>
											</Tooltip>,
										]}
										extra={
											<div style={{ 
												flexShrink: 0,
												width: "60px",
												height: "60px",
												overflow: "hidden",
												borderRadius: "8px",
												position: "relative"
											}}>
												<img 
													width="100%"
													height="100%"
													alt="thumbnail" 
													src={item.thumbnail}
													style={{ 
														width: "100%",
														height: "100%",
														objectFit: "cover",
														borderRadius: "8px"
													}}
												/>
												{/* Indicador visual para música na playlist */}
												{inPlaylist && (
													<div style={{
														position: "absolute",
														top: "2px",
														right: "2px",
														width: "16px",
														height: "16px",
														backgroundColor: "#52c41a",
														borderRadius: "50%",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														fontSize: "10px",
														color: "white",
														fontWeight: "bold"
													}}>
														✓
													</div>
												)}
												{/* Indicador visual para música tocando - SÓ UMA PODE ESTAR TOCANDO */}
												{isPlaying && inPlaylist && (
													<div style={{
														position: "absolute",
														bottom: "2px",
														right: "2px",
														width: "16px",
														height: "16px",
														backgroundColor: "#1890ff",
														borderRadius: "50%",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														fontSize: "10px",
														color: "white",
														fontWeight: "bold"
													}}>
														▶
													</div>
												)}
											</div>
										}
									>
										{/* Conteúdo textual da música */}
										<div style={{
											flex: 1,
											minWidth: 0,
											overflow: "visible",
											padding: "0 12px"
										}}>
											{/* Título da música */}
											<div style={{ 
												fontSize: "14px", 
												fontWeight: "500",
												color: "#262626",
												marginBottom: "4px",
												width: "100%",
												display: "block",
												overflow: "visible",
												whiteSpace: "normal",
												wordBreak: "break-word",
												lineHeight: "1.4",
												visibility: "visible",
												opacity: 1
											}}>
												{item.title || "Música sem título"}
												{inPlaylist && (
													<span style={{
														marginLeft: "8px",
														fontSize: "12px",
														color: "#52c41a",
														fontWeight: "normal"
													}}>
														(na playlist)
													</span>
												)}
												{/* SÓ UMA MÚSICA PODE ESTAR TOCANDO */}
												{isPlaying && inPlaylist && (
													<span style={{
														marginLeft: "8px",
														fontSize: "12px",
														color: "#1890ff",
														fontWeight: "normal"
													}}>
														(tocando)
													</span>
												)}
											</div>
											
											{/* Descrição da música */}
											<div style={{ 
												fontSize: "12px", 
												color: "#8c8c8c",
												lineHeight: "1.4",
												width: "100%",
												display: "block",
												overflow: "visible",
												whiteSpace: "normal",
												wordBreak: "break-word",
												visibility: "visible",
												opacity: 1
											}}>
												{item.description || "Sem descrição disponível"}
											</div>
										</div>
									</List.Item>
								);
							}}
						/>
					</ResultsCard>
				</ResultsContainer>
			)}

			{/* Estado vazio quando não há resultados */}
			{showResults && (!searchResults || searchResults.length === 0) && (
				<ResultsContainer>
					<ResultsCard>
						<Flex style={{ width: "100%" }} align="center" justify="center" vertical>
							<Empty
								description="Nenhuma música encontrada"
								style={{ color: "#8c8c8c" }}
							/>
						</Flex>
					</ResultsCard>
				</ResultsContainer>
			)}
		</SpaceContainer>
	);
}
