import React from 'react';
import { useSocketStore } from '../../contexts/PlayerContext/useSocketStore';
import { useRoomStore } from '../../contexts/PlayerContext/useRoomStore';
import { usePlaylistStore } from '../../contexts/PlayerContext/usePlaylistStore';
import { usePlayerStore } from '../../contexts/PlayerContext/usePlayerStore';
import { userContext } from '../../contexts/UserContext';
import { RoomControlsContainer } from './styles';

interface RoomControlsProps {
	roomId: string;
}

export const RoomControls: React.FC<RoomControlsProps> = ({ roomId }) => {
	const { user } = userContext();
	
	// ✅ OTIMIZAÇÃO: Usar seletores específicos para evitar re-renders desnecessários
	const isHost = useRoomStore((state) => state.isHost);
	const isModerator = useRoomStore((state) => state.isModerator);
	const canModerate = useRoomStore((state) => state.canModerate);
	const roomOnline = useRoomStore((state) => state.roomOnline);
	const roomState = useRoomStore((state) => state.roomState);
	
	// ✅ OTIMIZAÇÃO: Seletores individuais para melhor performance
	const toggleRoomStatus = useSocketStore((state) => state.toggleRoomStatus);
	const kickUser = useSocketStore((state) => state.kickUser);
	const toggleModerator = useSocketStore((state) => state.toggleModerator);
	const ping = useSocketStore((state) => state.ping);
	const playPause = useSocketStore((state) => state.playPause);
	const nextTrack = useSocketStore((state) => state.nextTrack);
	const previousTrack = useSocketStore((state) => state.previousTrack);
	const jumpToTrack = useSocketStore((state) => state.jumpToTrack);
	
	const removeTrack = usePlaylistStore((state) => state.removeTrack);
	const tracks = usePlaylistStore((state) => state.tracks);
	const currentIndex = usePlaylistStore((state) => state.currentIndex);
	
	const isPlaying = usePlayerStore((state) => state.isPlaying);

	// ✅ NOVO: Valores seguros para evitar erros (definidos antes de qualquer uso)
	const safeTracks = Array.isArray(tracks) ? tracks : [];
	const safeCurrentIndex = typeof currentIndex === 'number' ? currentIndex : 0;
	
	// ✅ NOVO: Garantir que safeTracks sempre tenha length
	const tracksLength = safeTracks.length || 0;

	// Debug: verificar estado dos dados (removido para evitar spam de logs)
	// console.log("🔍 RoomControls Debug:", {
	// 	tracks: tracks,
	// 	tracksLength: tracksLength,
	// 	currentIndex: currentIndex,
	// 	safeCurrentIndex: safeCurrentIndex,
	// 	roomState: roomState
	// });

	// ✅ NOVO: Early return se dados não estiverem prontos
	if (safeTracks.length === 0 && (!tracks || !Array.isArray(tracks))) {
		console.log("⚠️ RoomControls: tracks não está pronto, renderizando loading");
		return (
			<RoomControlsContainer>
				<div>Carregando controles da sala...</div>
			</RoomControlsContainer>
		);
	}

	// Função para expulsar usuário
	const handleKickUser = (userId: string, reason?: string) => {
		if (canModerate) {
			kickUser(userId, reason);
		}
	};

	// Função para adicionar/remover moderador
	const handleToggleModerator = (userId: string, isModerator: boolean) => {
		// ✅ CORREÇÃO: Apenas owner pode promover moderadores
		const isOwner = roomState?.owner === user?.id;
		if (isOwner) {
			toggleModerator(userId, isModerator);
		}
	};

	// Função para ativar/desativar sala
	const handleToggleRoomStatus = () => {
		// ✅ CORREÇÃO: Apenas owner pode ativar/desativar sala
		const isOwner = roomState?.owner === user?.id;
		if (isOwner) {
			toggleRoomStatus(!roomOnline);
		}
	};

	// Função para pular para música específica
	const handleJumpToTrack = (trackIndex: number) => {
		if (canModerate) {
			jumpToTrack(trackIndex);
		}
	};

	// Função para remover música da playlist
	const handleRemoveTrack = (trackId: string) => {
		if (canModerate) {
			removeTrack(trackId);
		}
	};

	// Ping para manter conexão ativa
	React.useEffect(() => {
		const interval = setInterval(() => {
			ping();
		}, 30000); // Ping a cada 30 segundos

		return () => clearInterval(interval);
	}, [ping]); // ✅ CORREÇÃO: Incluir ping nas dependências

	return (
		<RoomControlsContainer>
			<div className="room-controls">
			{/* Status da Sala */}
			<div className="room-status">
				<h3>Status da Sala</h3>
				<div className="status-indicator">
					<span className={`status-dot ${roomOnline ? 'online' : 'offline'}`}></span>
					<span>{roomOnline ? 'Online' : 'Offline'}</span>
				</div>
				
				{/* Contador de usuários */}
				<div className="user-count">
					<span>👥 Usuários na sala: {roomState?.listeners || 0}</span>
				</div>

				{/* Botão para ativar/desativar sala (apenas dono) */}
				{isHost && (
					<button 
						onClick={handleToggleRoomStatus}
						className={`toggle-status-btn ${roomOnline ? 'offline' : 'online'}`}
					>
						{roomOnline ? 'Desativar Sala' : 'Ativar Sala'}
					</button>
				)}
			</div>

			{/* Controles de Reprodução */}
			{canModerate && (
				<div className="playback-controls">
					<h3>Controles de Reprodução</h3>
					<div className="control-buttons">
						<button 
							onClick={() => playPause(!isPlaying)}
							className="control-btn"
						>
							{isPlaying ? '⏸️ Pausar' : '▶️ Tocar'}
						</button>
						
						<button 
							onClick={previousTrack}
							className="control-btn"
							disabled={safeCurrentIndex <= 0}
						>
							⏮️ Anterior
						</button>
						
						<button 
							onClick={nextTrack}
							className="control-btn"
							disabled={safeCurrentIndex >= tracksLength - 1}
						>
							⏭️ Próxima
						</button>
					 </div>
				</div>
			)}

			{/* Playlist e Controles */}
			{canModerate && (
				<div className="playlist-controls">
					<h3>Controle da Playlist</h3>
					<div className="playlist">
						{safeTracks.map((track, index) => (
							<div key={track.id} className="playlist-item">
								<span className={`track-info ${index === safeCurrentIndex ? 'current' : ''}`}>
									{index + 1}. {track.title} - {track.user.name}
								</span>
								
								<div className="track-actions">
									<button 
										onClick={() => handleJumpToTrack(index)}
										className="action-btn jump"
										disabled={index === safeCurrentIndex}
									>
										🎯 Tocar
									</button>
									
									<button 
										onClick={() => handleRemoveTrack(track.id)}
										className="action-btn remove"
									>
										🗑️ Remover
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Lista de Usuários e Moderação */}
			<div className="user-management">
				<h3>Usuários na Sala</h3>
				<div className="users-list">
					{roomState?.users?.map((roomUser) => (
						<div key={`user-${roomUser.id}`} className="user-item">
							<div className="user-info">
								<img 
									src={roomUser.image} 
									alt={roomUser.name} 
									className="user-avatar"
								/>
								<span className="user-name">{roomUser.name}</span>
								<span className={`user-role ${roomUser.role}`}>
									{roomUser.role === 'owner' ? '👑 Dono' : 
									 roomUser.role === 'moderator' ? '🛡️ Moderador' : '👤 Usuário'}
								</span>
							</div>
							
							{/* Ações de moderação */}
							{canModerate && roomUser.id !== user.id && (
								<div className="moderation-actions">
									{/* Adicionar/Remover moderador (apenas dono) */}
									{isHost && roomUser.role !== 'owner' && (
										<button 
											onClick={() => handleToggleModerator(
												roomUser.id, 
												roomUser.role !== 'moderator'
											)}
											className={`mod-btn ${roomUser.role === 'moderator' ? 'remove' : 'add'}`}
										>
											{roomUser.role === 'moderator' ? '❌ Remover Mod' : '🛡️ Tornar Mod'}
										</button>
									)}
									
									{/* Expulsar usuário */}
									<button 
										onClick={() => handleKickUser(roomUser.id, 'Expulso pelo moderador')}
										className="kick-btn"
									>
										🚪 Expulsar
									</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Informações de Permissão */}
			<div className="permissions-info">
				<h3>Suas Permissões</h3>
				<div className="permissions">
					<span className={`permission ${roomState?.owner === user?.id ? 'active' : 'inactive'}`}>
						👑 Dono da Sala: {roomState?.owner === user?.id ? 'Sim' : 'Não'}
					</span>
					<span className={`permission ${isModerator ? 'active' : 'inactive'}`}>
						🛡️ Moderador: {isModerator ? 'Sim' : 'Não'}
					</span>
					<span className={`permission ${canModerate ? 'active' : 'inactive'}`}>
						⚙️ Pode Moderar: {canModerate ? 'Sim' : 'Não'}
					</span>
					<span className={`permission ${isHost ? 'active' : 'inactive'}`}>
						🎵 Host (Sincronização): {isHost ? 'Sim' : 'Não'}
					</span>
				</div>
			</div>
			</div>
		</RoomControlsContainer>
	);
};
