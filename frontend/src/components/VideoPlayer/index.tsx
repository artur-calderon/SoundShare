import { Player, PlayerOverlay, SpaceContainer, PlayerContainer, EmptyStateContainer, EmptyStateIcon, EmptyStateText, EmptyStateDescription } from "./styles.ts";
import { Alert, Flex, Button, Space, Tooltip } from "antd";
import { PlayCircleOutlined, PauseCircleOutlined, StepForwardOutlined, StepBackwardOutlined } from "@ant-design/icons";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player/lazy";
import { CustomerServiceOutlined } from "@ant-design/icons";
import { usePlayerStore } from "../../contexts/PlayerContext/usePlayerStore";
import { useSocketStore } from "../../contexts/PlayerContext/useSocketStore";
import { useRoomStore } from "../../contexts/PlayerContext/useRoomStore";
import { useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";


export function VideoPlayer() {
	// ✅ OTIMIZAÇÃO: Usar seletores específicos para evitar re-renders desnecessários
	const { isPlaying, volume, mute, setPlayed, setDuration, setIsPlaying, currentTrack } = usePlayerStore();
	const { playPause, nextTrack, previousTrack, syncTrack } = useSocketStore();
	const { roomState } = useRoomStore();
	
	const canModerate = roomState?.canModerate || false;
	const playlistTracks = roomState?.playlist || [];
	
	const currentIndex = playlistTracks.findIndex((t: any) => t.id === currentTrack?.id);

	const playerRef = useRef<ReactPlayer>(null);
	const { id } = useParams();

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

	// ✅ OTIMIZAÇÃO: Removido - sincronização agora é feita via eventos customizados

	// ✅ NOVA IMPLEMENTAÇÃO: Sistema de herança dinâmica para sincronização
	useEffect(() => {
		// Listener para sincronização com fonte ativa
		const handleSyncWithSource = (event: CustomEvent) => {
			const { currentTime, syncSource, trackId } = event.detail;
			
			console.log(`🎯 EVENTO syncWithSource recebido:`, { currentTime, syncSource, trackId });
			
			// ✅ CORREÇÃO: Verificar se é a música atual
			if (currentTrack && trackId && currentTrack.id !== trackId) {
				console.log(`⚠️ Música diferente - ignorando sincronização. Atual: ${currentTrack.id}, Recebida: ${trackId}`);
				return;
			}
			
			if (playerRef.current && currentTime >= 0) {
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
			} else {
				console.log(`⚠️ Player não disponível ou tempo inválido:`, { 
					hasPlayer: !!playerRef.current, 
					currentTime 
				});
			}
		};

		// ✅ REMOVIDO: Listeners do Event Bus desnecessários

		// ✅ NOVO: Listener para sincronização inteligente
		const handleSmartSync = (event: CustomEvent) => {
			const { currentTime, syncSource, threshold } = event.detail;
			
			if (playerRef.current && currentTime > 0) {
				// Obter tempo atual do player
				const playerCurrentTime = playerRef.current.getCurrentTime();
				const timeDifference = Math.abs(playerCurrentTime - currentTime);
				
				console.log(`🧠 SmartSync: Diferença de tempo: ${timeDifference.toFixed(2)}s (threshold: ${threshold}s)`);
				
				// Só sincroniza se a diferença for maior que o threshold
				if (timeDifference > threshold) {
					const sourceInfo = syncSource ? `${syncSource.userRole} ${syncSource.userId}` : 'sem fonte específica';
					console.log(`🎯 SINCRONIZAÇÃO INTELIGENTE: ${sourceInfo} - Tempo: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')} (diferença: ${timeDifference.toFixed(2)}s)`);
					
					// Sincronizar com o tempo correto
					playerRef.current.seekTo(currentTime);
					
					// Atualiza estado local
					const duration = playerRef.current.getDuration();
					if (duration > 0) {
						const seekPercentage = currentTime / duration;
						setPlayed(seekPercentage);
					}
					
					console.log(`✅ Sincronização inteligente concluída`);
				} else {
					console.log(`ℹ️ Diferença muito pequena (${timeDifference.toFixed(2)}s) - não sincronizando`);
				}
			}
		};

		// ✅ NOVO: Listener para forçar reprodução após delay
		const handleForcePlay = () => {
			console.log(`🎵 Evento forcePlay recebido - forçando reprodução`);
			setIsPlaying(true);
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
		window.addEventListener('smartSync', handleSmartSync as EventListener);
		window.addEventListener('forcePlay', handleForcePlay as EventListener);
		window.addEventListener('syncSourceChanged', handleSyncSourceChanged as EventListener);
		window.addEventListener('roomEmpty', handleRoomEmpty as EventListener);

		// ✅ REMOVIDO: Listeners do Event Bus desnecessários

		// Cleanup
		return () => {
			window.removeEventListener('syncWithSource', handleSyncWithSource as EventListener);
			window.removeEventListener('smartSync', handleSmartSync as EventListener);
			window.removeEventListener('forcePlay', handleForcePlay as EventListener);
			window.removeEventListener('syncSourceChanged', handleSyncSourceChanged as EventListener);
			window.removeEventListener('roomEmpty', handleRoomEmpty as EventListener);
			
			// ✅ REMOVIDO: Cleanup do Event Bus desnecessário
		};
	}, [canModerate, syncTrack, setPlayed, setIsPlaying]);

	// ✅ OTIMIZAÇÃO: Usar apenas currentTrack do player store
	const displayTrack = currentTrack;

	// Função para tocar/pausar
	const handlePlayPause = useCallback(() => {
		if (canModerate) {
			// ✅ CORREÇÃO: Não atualiza o estado local - deixa o socket controlar
			// Envia apenas para o socket
			playPause(!isPlaying);
		}
	}, [canModerate, isPlaying, playPause]);

	// Função para próxima música
	const handleNextTrack = useCallback(() => {
		if (canModerate && playlistTracks.length > 0) {
			nextTrack();
		}
	}, [canModerate, playlistTracks.length, nextTrack]);

	// Função para música anterior
	const handlePreviousTrack = useCallback(() => {
		if (canModerate && playlistTracks.length > 0) {
			previousTrack();
		}
	}, [canModerate, playlistTracks.length, previousTrack]);

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
								onEnded={() => nextTrack()}
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
										disabled={!canModerate || currentIndex >= playlistTracks.length - 1}
										style={{ 
											color: "#fff", 
											fontSize: "18px",
											opacity: (!canModerate || currentIndex >= playlistTracks.length - 1) ? 0.5 : 1
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
