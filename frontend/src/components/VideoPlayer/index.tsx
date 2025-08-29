import { Player, PlayerOverlay, SpaceContainer, PlayerContainer, EmptyStateContainer, EmptyStateIcon, EmptyStateText, EmptyStateDescription } from "./styles.ts";
import { Alert, Flex, Button, Space, Tooltip } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player/lazy";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { usePlayerStore } from "../../contexts/PlayerContext/usePlayerStore";
import { usePlaylistStore } from "../../contexts/PlayerContext/usePlaylistStore";
import { useRoomStore } from "../../contexts/PlayerContext/useRoomStore";
import { useEffect, useRef, useCallback } from "react";
import { useSocketStore } from "../../contexts/PlayerContext/useSocketStore";
import { useParams } from "react-router-dom";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

export function VideoPlayer() {
	const { isPlaying, volume, mute, play, setPlayed, setDuration, setIsPlaying, currentTrack } = usePlayerStore();
	const { roomState, isHost, canModerate } = useRoomStore();
	const { socket, playPause, nextTrack, previousTrack, syncTrack } = useSocketStore();
	const { nextSong, beforeSong, playlist, currentIndex } = usePlaylistStore();

	const playerRef = useRef<ReactPlayer>(null);
	const { id } = useParams();

	const screens = useBreakpoint();

	// Função otimizada para emitir o progresso do vídeo
	const handleProgress = useCallback((state: { played: number }) => {
		// Atualiza o estado local sempre
		setPlayed(state.played);
		
		// Só sincroniza se for moderador e houver uma sala
		if (canModerate && id) {
			// Sincroniza a cada 10 segundos para reduzir tráfego
			const progress = Math.floor(state.played * 100);
			if (progress % 10 === 0) {
				// Converte o progresso para segundos baseado na duração
				const duration = playerRef.current?.getDuration() || 0;
				if (duration > 0) {
					const currentTime = Math.floor(state.played * duration);
					syncTrack(currentTime);
				}
			}
		}
	}, [canModerate, syncTrack, id, setPlayed]);

	// Atualiza o estado de reprodução apenas se houver mudança
	useEffect(() => {
		if (roomState?.playing !== undefined && roomState.playing !== isPlaying) {
			setIsPlaying(roomState.playing);
		}
	}, [roomState?.playing, isPlaying, setIsPlaying]);

	// ✅ NOVA IMPLEMENTAÇÃO: Sincronização visual com fonte de sincronização
	useEffect(() => {
		if (roomState?.currentTime && roomState?.currentTrack && playerRef.current) {
			// Converte segundos para porcentagem baseado na duração
			const duration = playerRef.current.getDuration();
			if (duration > 0) {
				const seekPercentage = roomState.currentTime / duration;
				
				// ✅ CORREÇÃO: Sempre atualiza visual se houver tempo, independente da fonte
				if (roomState.currentTime > 0) {
					console.log(`🔄 Atualizando estado visual: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')} (${Math.floor(seekPercentage * 100)}%)`);
					
					// Atualiza apenas o estado local (sem interferir no player)
					setPlayed(seekPercentage);
				}
			} else {
				console.warn(`⚠️ Duração do player não disponível para sincronização visual`);
			}
		}
	}, [roomState?.currentTime, roomState?.currentTrack, setPlayed]);

	// ✅ NOVA IMPLEMENTAÇÃO: Sincronização quando a música muda
	useEffect(() => {
		if (roomState?.currentTrack && playerRef.current) {
			// Quando a música muda, sincroniza o tempo se houver
			if (roomState.currentTime && roomState.currentTime > 0) {
				const duration = playerRef.current.getDuration();
				if (duration > 0) {
					const seekPercentage = roomState.currentTime / duration;
					setPlayed(seekPercentage);
					console.log(`🎵 Nova música sincronizada: ${roomState.currentTrack.title} no tempo ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')} (${Math.floor(seekPercentage * 100)}%)`);
				} else {
					console.warn(`⚠️ Duração não disponível para nova música: ${roomState.currentTrack.title}`);
				}
			} else {
				// Se não há tempo específico, volta para o início
				setPlayed(0);
				console.log(`🎵 Nova música sem tempo específico - começando do início: ${roomState.currentTrack.title}`);
			}
		}
	}, [roomState?.currentTrack, roomState?.currentTime, setPlayed]);

	// ✅ NOVA IMPLEMENTAÇÃO: Sistema de herança dinâmica para sincronização
	useEffect(() => {
		// Listener para sincronização com fonte ativa
		const handleSyncWithSource = (event: CustomEvent) => {
			const { currentTime, trackId, syncSource } = event.detail;
			
			if (playerRef.current && currentTime > 0) {
				const sourceInfo = syncSource ? `${syncSource.userRole} ${syncSource.userId}` : 'sem fonte específica';
				console.log(`🎯 SINCRONIZAÇÃO: ${sourceInfo} - Tempo: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`);
				
				// ✅ FORÇA seek no player com o tempo atual
				playerRef.current.seekTo(currentTime);
				
				// Atualiza estado local
				const duration = playerRef.current.getDuration();
				if (duration > 0) {
					const seekPercentage = currentTime / duration;
					setPlayed(seekPercentage);
				}
				
				// Sincroniza via socket se for moderador
				if (canModerate) {
					syncTrack(currentTime);
				}
				
				console.log(`✅ Sincronização concluída`);
			}
		};

		// Listener para mudança de fonte de sincronização
		const handleSyncSourceChanged = (event: CustomEvent) => {
			const { newSource, previousSource, reason } = event.detail;
			
			console.log(`🔄 Fonte de sincronização mudou: ${previousSource} → ${newSource.userId} (${newSource.userRole}) - Motivo: ${reason}`);
			
			// Pode mostrar notificação visual para o usuário
			// Por exemplo: "Nova fonte de sincronização: João (Moderador)"
		};

		// Listener para sala vazia
		const handleRoomEmpty = (event: CustomEvent) => {
			const { message, reason } = event.detail;
			
			console.log(`🏠 Sala vazia: ${message} - Motivo: ${reason}`);
			
			// Para a reprodução
			setIsPlaying(false);
			setPlayed(0);
			
			// Pode mostrar mensagem: "Sala vazia - Reprodução pausada"
		};

		// Adiciona listeners para o sistema de herança dinâmica
		window.addEventListener('syncWithSource', handleSyncWithSource as EventListener);
		window.addEventListener('syncSourceChanged', handleSyncSourceChanged as EventListener);
		window.addEventListener('roomEmpty', handleRoomEmpty as EventListener);

		// Cleanup
		return () => {
			window.removeEventListener('syncWithSource', handleSyncWithSource as EventListener);
			window.removeEventListener('syncSourceChanged', handleSyncSourceChanged as EventListener);
			window.removeEventListener('roomEmpty', handleRoomEmpty as EventListener);
		};
	}, [canModerate, syncTrack, setPlayed, setIsPlaying]);

	// Determina qual música mostrar (prioriza o currentTrack local)
	const displayTrack = currentTrack || roomState?.currentTrack;

	// Função para tocar/pausar
	const handlePlayPause = useCallback(() => {
		if (canModerate) {
			// Atualiza o estado local imediatamente para feedback visual
			setIsPlaying(!isPlaying);
			// Envia para o socket
			playPause(!isPlaying);
		}
	}, [canModerate, isPlaying, setIsPlaying, playPause]);

	// Função para próxima música
	const handleNextTrack = useCallback(() => {
		if (canModerate && playlist.length > 0) {
			nextTrack();
		}
	}, [canModerate, playlist.length, nextTrack]);

	// Função para música anterior
	const handlePreviousTrack = useCallback(() => {
		if (canModerate && playlist.length > 0) {
			previousTrack();
		}
	}, [canModerate, playlist.length, previousTrack]);

	return (
		<SpaceContainer direction="vertical">
			{isPlaying && displayTrack && (
				<Alert
					banner
					type="info"
					className="alert-player"
					key={displayTrack.url}
					style={{ 
						width: "100%", 
						backgroundColor: "#e6f7ff",
						border: "1px solid #91d5ff",
						borderRadius: "8px"
					}}
					showIcon={false}
					message={
						<Marquee pauseOnHover gradient={false}>
							<b style={{ color: "#1890ff" }}>Tocando agora </b>
							<span style={{ color: "#262626" }}>{":  " + displayTrack.title}</span>
							<b style={{ marginLeft: "15px", color: "#1890ff" }}> Enviado por: </b>
							<span style={{ marginRight: "5px", color: "#262626" }}>{displayTrack.user?.name}</span>
						</Marquee>
					}
				/>
			)}

			<PlayerContainer>
				{displayTrack ? (
					<>
						<Player>
							<ReactPlayer
								ref={playerRef}
								url={displayTrack.url}
								controls={false}
								width="100%"
								height="100%"
								autoPlay={true}
								volume={volume}
								muted={mute}
								playing={isPlaying}
								onProgress={handleProgress}
								onEnded={() => nextSong && nextSong()}
								onDuration={setDuration}
								config={{
									youtube: {
										playerVars: {
											controls: 0,
											showinfo: 0,
											rel: 0,
											modestbranding: 1,
											iv_load_policy: 3,
											cc_load_policy: 0,
											fs: 0,
											disablekb: 1,
											autohide: 1,
										}
									}
								}}
							/>
							
							{/* ✅ PROTEÇÃO: Overlay que impede cliques diretos no player para TODOS */}
							<PlayerOverlay 
								title="Use os controles abaixo para controlar a reprodução"
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
								onDoubleClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
								}}
							/>
						</Player>
						
						{/* Controles de reprodução */}
						<Flex 
							justify="center" 
							align="center" 
							style={{ 
								marginTop: "16px",
								padding: "16px",
								background: "rgba(0,0,0,0.8)",
								borderRadius: "8px"
							}}
						>
							<Space size="middle">
								<Tooltip title="Música anterior" placement="top">
									<Button
										type="text"
										icon={<StepBackwardOutlined />}
										onClick={handlePreviousTrack}
										disabled={!canModerate || currentIndex <= 0}
										style={{ 
											color: "#fff", 
											fontSize: "18px",
											opacity: (!canModerate || currentIndex <= 0) ? 0.5 : 1
										}}
									/>
								</Tooltip>

								<Tooltip title={isPlaying ? "Pausar" : "Tocar"} placement="top">
									<Button
										type="text"
										icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
										onClick={handlePlayPause}
										disabled={!canModerate}
										style={{ 
											color: "#1db954", 
											fontSize: "32px",
											opacity: !canModerate ? 0.5 : 1
										}}
									/>
								</Tooltip>

								<Tooltip title="Próxima música" placement="top">
									<Button
										type="text"
										icon={<StepForwardOutlined />}
										onClick={handleNextTrack}
										disabled={!canModerate || currentIndex >= playlist.length - 1}
										style={{ 
											color: "#fff", 
											fontSize: "18px",
											opacity: (!canModerate || currentIndex >= playlist.length - 1) ? 0.5 : 1
										}}
									/>
								</Tooltip>
							</Space>
						</Flex>
						
						{/* ✅ MENSAGEM: Informa sobre o overlay de proteção */}
						<Flex 
							justify="center" 
							align="center" 
							style={{ 
								marginTop: "8px",
								padding: "8px 16px",
								background: "rgba(24, 144, 255, 0.1)",
								border: "1px solid rgba(24, 144, 255, 0.3)",
								borderRadius: "6px"
							}}
						>
							<span style={{ 
								fontSize: "12px", 
								color: "#1890ff",
								textAlign: "center"
							}}>
								🔒 Use os controles acima para controlar a reprodução
							</span>
						</Flex>
					</>
				) : (
					<EmptyStateContainer>
						<EmptyStateIcon>
							<CustomerServiceOutlined style={{ fontSize: "64px", color: "#d9d9d9" }} />
						</EmptyStateIcon>
						<EmptyStateText>Nenhuma música selecionada</EmptyStateText>
						<EmptyStateDescription>
							Pesquise uma música abaixo ou selecione uma da playlist para começar a tocar
						</EmptyStateDescription>
					</EmptyStateContainer>
				)}
			</PlayerContainer>
		</SpaceContainer>
	);
}
