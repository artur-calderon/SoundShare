import React, { useEffect } from 'react';
import { useSocketStore } from '../../contexts/PlayerContext/useSocketStore';
import { useRoomStore } from '../../contexts/PlayerContext/useRoomStore';
import { usePlayerStore } from '../../contexts/PlayerContext/usePlayerStore';
import { usePlaylistStore } from '../../contexts/PlayerContext/usePlaylistStore';
import { userContext } from '../../contexts/UserContext';
import { RoomControls } from '../../components/RoomControls';

interface RoomPageProps {
	roomId: string;
}

export const RoomPageExample: React.FC<RoomPageProps> = ({ roomId }) => {
	const { user } = userContext();
	const { connect, disconnect, leaveRoom } = useSocketStore();
	const { getInfoRoom, roomSpecs, roomState, isHost, canModerate } = useRoomStore();
	const { currentTrack, isPlaying, seekTo } = usePlayerStore();
	const { playlist, currentIndex } = usePlaylistStore();

	// Conectar ao socket quando entrar na página
	useEffect(() => {
		if (roomId && user.id) {
			// Buscar informações da sala primeiro
			getInfoRoom(roomId, user);
			
			// Conectar ao socket
			connect(roomId, {
				name: user.name,
				email: user.email,
				image: user.image,
				role: user.role,
				owner: roomSpecs?.owner,
				moderators: roomSpecs?.moderators
			});
		}

		// Cleanup ao sair da página
		return () => {
			leaveRoom();
			disconnect();
		};
	}, [roomId, user.id]);

	// Sincronizar informações da sala quando mudarem
	useEffect(() => {
		if (roomSpecs?.owner) {
			// Reconectar com informações atualizadas
			connect(roomId, {
				name: user.name,
				email: user.email,
				image: user.image,
				role: user.role,
				owner: roomSpecs.owner,
				moderators: roomSpecs.moderators
			});
		}
	}, [roomSpecs?.owner, roomSpecs?.moderators]);

	return (
		<div className="room-page">
			{/* Header da Sala */}
			<div className="room-header">
				<h1>{roomSpecs?.name || 'Carregando...'}</h1>
				<div className="room-status">
					<span className={`status ${roomState?.online ? 'online' : 'offline'}`}>
						{roomState?.online ? '🟢 Online' : '🔴 Offline'}
					</span>
					<span className="user-count">
						👥 {roomState?.listeners || 0} usuários
					</span>
				</div>
			</div>

			{/* Informações do Usuário */}
			<div className="user-info">
				<img src={user.image} alt={user.name} className="avatar" />
				<div className="user-details">
					<h3>{user.name}</h3>
					<div className="user-roles">
						{isHost && <span className="role owner">👑 Dono da Sala</span>}
						{!isHost && roomSpecs?.moderators?.includes(user.id) && (
							<span className="role moderator">🛡️ Moderador</span>
						)}
						{!isHost && !roomSpecs?.moderators?.includes(user.id) && (
							<span className="role user">👤 Usuário</span>
						)}
					</div>
				</div>
			</div>

			{/* Player de Música */}
			<div className="music-player">
				{currentTrack ? (
					<div className="current-track">
						<img src={currentTrack.thumbnail} alt={currentTrack.title} />
						<div className="track-info">
							<h4>{currentTrack.title}</h4>
							<p>{currentTrack.description}</p>
							<p className="artist">Por: {currentTrack.user.name}</p>
						</div>
						<div className="player-status">
							<span className="status">
								{isPlaying ? '▶️ Tocando' : '⏸️ Pausado'}
							</span>
						</div>
					</div>
				) : (
					<div className="no-track">
						<p>Nenhuma música tocando</p>
					</div>
				)}
			</div>

			{/* Playlist */}
			<div className="playlist-section">
				<h3>Playlist ({playlist?.length || 0} músicas)</h3>
				{playlist?.length > 0 ? (
					<div className="playlist">
						{playlist.map((track, index) => (
							<div 
								key={track.id} 
								className={`playlist-item ${index === currentIndex ? 'current' : ''}`}
							>
								<div className="track-info">
									<span className="track-number">{index + 1}</span>
									<img src={track.thumbnail} alt={track.title} />
									<div className="track-details">
										<h5>{track.title}</h5>
										<p>{track.user.name}</p>
									</div>
								</div>
								<div className="track-actions">
									{canModerate && (
										<>
											<button 
												onClick={() => {/* jumpToTrack(index) */}}
												disabled={index === currentIndex}
												className="btn btn-primary"
											>
												🎯 Tocar
											</button>
											<button 
												onClick={() => {/* removeTrack(track.id) */}}
												className="btn btn-danger"
											>
												🗑️ Remover
											</button>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="empty-playlist">
						<p>Playlist vazia. Adicione algumas músicas!</p>
					</div>
				)}
			</div>

			{/* Controles da Sala */}
			<RoomControls roomId={roomId} />

			{/* Lista de Usuários */}
			<div className="users-section">
				<h3>Usuários na Sala</h3>
				<div className="users-list">
					{roomState?.users.map((roomUser) => (
						<div key={roomUser.id} className="user-item">
							<div className="user-info">
								<img src={roomUser.image} alt={roomUser.name} className="avatar" />
								<div className="user-details">
									<h5>{roomUser.name}</h5>
									<span className={`role ${roomUser.role}`}>
										{roomUser.role === 'owner' ? '👑 Dono' : 
										 roomUser.role === 'moderator' ? '🛡️ Moderador' : '👤 Usuário'}
									</span>
								</div>
							</div>
							<div className="user-status">
								<span className="joined-time">
									Entrou: {new Date(roomUser.joinedAt).toLocaleTimeString()}
								</span>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Mensagens de Sistema */}
			<div className="system-messages">
				{/* Aqui você pode mostrar notificações de eventos do socket */}
				{/* Por exemplo: usuário entrou, música adicionada, etc. */}
			</div>
		</div>
	);
};

// Estilos básicos (você pode usar styled-components ou CSS modules)
const styles = `
.room-page {
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
}

.room-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	padding: 20px;
	background: #f8f9fa;
	border-radius: 12px;
}

.room-status {
	display: flex;
	gap: 16px;
	align-items: center;
}

.status.online {
	color: #28a745;
	font-weight: 600;
}

.status.offline {
	color: #dc3545;
	font-weight: 600;
}

.user-info {
	display: flex;
	align-items: center;
	gap: 16px;
	margin-bottom: 24px;
	padding: 20px;
	background: white;
	border-radius: 12px;
	border: 1px solid #e9ecef;
}

.avatar {
	width: 48px;
	height: 48px;
	border-radius: 50%;
	object-fit: cover;
}

.user-roles {
	display: flex;
	gap: 8px;
}

.role {
	padding: 4px 8px;
	border-radius: 12px;
	font-size: 12px;
	font-weight: 500;
}

.role.owner {
	background: #ffc107;
	color: #212529;
}

.role.moderator {
	background: #17a2b8;
	color: white;
}

.role.user {
	background: #6c757d;
	color: white;
}

.music-player {
	margin-bottom: 24px;
	padding: 20px;
	background: white;
	border-radius: 12px;
	border: 1px solid #e9ecef;
}

.current-track {
	display: flex;
	align-items: center;
	gap: 16px;
}

.current-track img {
	width: 80px;
	height: 80px;
	border-radius: 8px;
	object-fit: cover;
}

.playlist-section {
	margin-bottom: 24px;
}

.playlist {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.playlist-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #e9ecef;
}

.playlist-item.current {
	background: #e3f2fd;
	border-color: #2196f3;
}

.track-info {
	display: flex;
	align-items: center;
	gap: 12px;
}

.track-number {
	font-weight: 600;
	color: #6c757d;
	min-width: 24px;
}

.track-info img {
	width: 48px;
	height: 48px;
	border-radius: 4px;
	object-fit: cover;
}

.track-actions {
	display: flex;
	gap: 8px;
}

.btn {
	padding: 8px 16px;
	border: none;
	border-radius: 6px;
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s;
}

.btn-primary {
	background: #007bff;
	color: white;
}

.btn-primary:hover:not(:disabled) {
	background: #0056b3;
}

.btn-primary:disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.btn-danger {
	background: #dc3545;
	color: white;
}

.btn-danger:hover {
	background: #c82333;
}

.users-section {
	margin-bottom: 24px;
}

.users-list {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.user-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 16px;
	background: #f8f9fa;
	border-radius: 8px;
	border: 1px solid #e9ecef;
}

.user-details h5 {
	margin: 0 0 4px 0;
}

.user-details p {
	margin: 0;
	color: #6c757d;
}

.joined-time {
	font-size: 12px;
	color: #6c757d;
}

@media (max-width: 768px) {
	.room-header {
		flex-direction: column;
		gap: 16px;
		text-align: center;
	}
	
	.current-track {
		flex-direction: column;
		text-align: center;
	}
	
	.playlist-item {
		flex-direction: column;
		gap: 16px;
		align-items: flex-start;
	}
	
	.track-actions {
		width: 100%;
		justify-content: space-between;
	}
	
	.user-item {
		flex-direction: column;
		gap: 16px;
		align-items: flex-start;
	}
}
`;
