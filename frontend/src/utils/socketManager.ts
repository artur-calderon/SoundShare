import { io, Socket } from "socket.io-client";
import { useRoomStore } from "../contexts/PlayerContext/useRoomStore";
import { usePlayerStore } from "../contexts/PlayerContext/usePlayerStore";
import { usePlaylistStore } from "../contexts/PlayerContext/usePlaylistStore";
import { userContext } from "../contexts/UserContext";

interface Track {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	duration?: number;
	user: {
		id: string;
		accessToken: string;
		name: string;
		email: string;
		image: string;
		role: string;
	};
}

interface RoomUser {
	id: string;
	name: string;
	email: string;
	image: string;
	role: string;
	socketId: string;
	joinedAt: Date;
}

interface RoomState {
	roomId: string;
	online: boolean;
	playing: boolean;
	currentTime: number;
	listeners: number;
	playlist: Track[];
	currentTrack?: Track;
	users: RoomUser[];
	currentUserRole: 'owner' | 'moderator' | 'user';
	canModerate: boolean;
	owner: string;
	moderators: string[];
	createdAt: Date;
	lastActivity: Date;
	trackStartTime: Date | null;
	lastSyncTime: number;
	syncSource?: {
		userId: string;
		userRole: string;
		lastSyncTime: number;
		isActive: boolean;
		lastActivity: Date;
	};
}

class SocketManager {
	private socket: Socket | null = null;
	private connected = false;
	private roomId: string | null = null;
	private userId: string | null = null;
	private timeSyncInterval: NodeJS.Timeout | null = null;
	private onStateChange: ((state: any) => void) | null = null;

	// ✅ SINGLETON: Garantir que só existe uma instância
	private static instance: SocketManager;
	
	public static getInstance(): SocketManager {
		if (!SocketManager.instance) {
			SocketManager.instance = new SocketManager();
		}
		return SocketManager.instance;
	}

	connect(roomId: string, userData: any) {
		const { user } = userContext.getState();
		
		// ✅ CORREÇÃO: Desconectar socket anterior se existir
		if (this.socket) {
			this.socket.disconnect();
		}
		
		// ✅ NOVO: Limpar estado dos stores ao trocar de sala
		console.log("🧹 Limpando estado ao trocar de sala");
		usePlayerStore.getState().clearPlayerState();
		useRoomStore.getState().clearRoomState();
		usePlaylistStore.getState().clearPlaylist();
		
		this.socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:1337", {
			path: "/socket.io",
			reconnectionAttempts: 5,
			reconnectionDelay: 5000,
			autoConnect: true,
			transports: ["websocket"],
		});

		this.socket.on("connect", () => {
			console.log(`🔌 Socket conectado: ${this.socket?.id}`);
			this.connected = true;
			this.roomId = roomId;
			this.userId = user.id;
			this.setupEventListeners();
			this.joinRoom(roomId, userData);
			
			// ✅ CORREÇÃO: Notificar mudança de estado
			this.notifyStateChange();
		});

		this.socket.on("disconnect", () => {
			console.log(`🔌 Socket desconectado`);
			this.connected = false;
			this.socket = null;
			this.roomId = null;
			this.userId = null;
			this.stopTimeSync();
			
			// ✅ CORREÇÃO: Notificar mudança de estado
			this.notifyStateChange();
		});

		this.socket.on("connect_error", (error) => {
			console.error(`❌ Erro de conexão:`, error);
		});
	}

	private setupEventListeners() {
		if (!this.socket) return;

		// Entrou na sala
		this.socket.on("roomJoined", (roomState: RoomState) => {
			this.handleRoomJoined(roomState);
		});

		// Estado da sala atualizado
		this.socket.on("updateRoom", (roomState: RoomState) => {
			this.handleUpdateRoom(roomState);
		});

		// Nova música tocando
		this.socket.on("trackChanged", ({ track, playing, currentTime, direction, trackIndex }) => {
			this.handleTrackChanged({ track, playing, currentTime, direction, trackIndex });
		});

		// Estado de reprodução alterado
		this.socket.on("playbackStateChanged", ({ playing, currentTime }) => {
			this.handlePlaybackStateChanged({ playing, currentTime });
		});

		// Música adicionada à playlist
		this.socket.on("trackAdded", ({ track, playlist }) => {
			this.handleTrackAdded({ track, playlist });
		});

		// Música removida da playlist
		this.socket.on("trackRemoved", ({ trackId, playlist }) => {
			this.handleTrackRemoved({ trackId, playlist });
		});

		// Outros eventos...
		this.setupOtherEventListeners();
	}

	private handleRoomJoined(roomState: RoomState) {
		// ✅ CORREÇÃO: Usar setTimeout para evitar chamadas síncronas que causam ciclo
		setTimeout(() => {
			const { setRoomState } = useRoomStore.getState();
			const { setTracks } = usePlaylistStore.getState();
			const { setTrack, setIsPlaying } = usePlayerStore.getState();

			// Atualiza o estado da sala
			setRoomState(roomState);
			
			// Atualiza a playlist
			setTracks(roomState.playlist || []);

			console.log(`🎯 Estado ao entrar na sala:`, {
				playing: roomState.playing,
				currentTrack: roomState.currentTrack?.title || 'null',
				syncSource: roomState.syncSource?.userId || 'null',
				playlistLength: roomState.playlist?.length || 0,
				currentTime: roomState.currentTime
			});

			// ✅ DEBUG: Logs detalhados para identificar problema do dono da sala
			console.log("🔍 handleRoomJoined Debug - roomState completo:", roomState);
			console.log("🔍 handleRoomJoined Debug - roomState.owner:", roomState.owner);
			console.log("🔍 handleRoomJoined Debug - this.userId:", this.userId);
			console.log("🔍 handleRoomJoined Debug - Comparação owner === userId:", roomState.owner === this.userId);

			// Sistema de sincronização
			if (roomState.playing && roomState.currentTrack) {
				console.log(`🎵 Música tocando: ${roomState.currentTrack.title} no tempo ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
				setTrack(roomState.currentTrack);
				setIsPlaying(true);
				
				// ✅ CORREÇÃO: Sempre sincronizar, mesmo se currentTime for 0
				if (roomState.currentTime >= 0) {
					console.log(`🔄 Sincronizando com tempo: ${roomState.currentTime}s`);
					
					// ✅ CORREÇÃO: Delay para garantir que o player esteja pronto
					setTimeout(() => {
						window.dispatchEvent(new CustomEvent('syncWithSource', {
							detail: { 
								currentTime: roomState.currentTime,
								trackId: roomState.currentTrack.id,
								syncSource: roomState.syncSource
							}
						}));
					}, 1000); // 1 segundo de delay
				}
			} else if (roomState.playlist?.length > 0) {
				// Se há playlist mas não está tocando, define primeira música
				console.log(`🎵 Playlist disponível mas não tocando - definindo primeira música`);
				const firstTrack = roomState.playlist[0];
				setTrack(firstTrack);
				setIsPlaying(false);
			}

			console.log("Entrou na sala:", roomState);
		}, 0);
	}

	private handleUpdateRoom(roomState: RoomState) {
		// ✅ CORREÇÃO: Usar setTimeout para evitar chamadas síncronas que causam ciclo
		setTimeout(() => {
			const { setRoomState } = useRoomStore.getState();
			const { setTracks } = usePlaylistStore.getState();
			const { setTrack, setIsPlaying } = usePlayerStore.getState();

			console.log(`🔄 updateRoom recebido:`, {
				playing: roomState.playing,
				currentTrack: roomState.currentTrack?.title || 'null',
				currentTime: roomState.currentTime,
				playlistLength: roomState.playlist?.length || 0,
				syncSource: roomState.syncSource?.userId || 'null'
			});

			// ✅ CORREÇÃO: Verificar se realmente mudou antes de atualizar
			const currentRoomState = useRoomStore.getState().roomState;
			const currentTracks = usePlaylistStore.getState().tracks;
			
			// Só atualiza se realmente mudou
			const roomStateChanged = !currentRoomState || 
				JSON.stringify(currentRoomState.playlist) !== JSON.stringify(roomState.playlist) ||
				currentRoomState.playing !== roomState.playing ||
				currentRoomState.currentTrack?.id !== roomState.currentTrack?.id;

			if (roomStateChanged) {
				// Atualiza o estado da sala
				setRoomState(roomState);
				
				// Atualiza a playlist apenas se mudou
				if (JSON.stringify(currentTracks) !== JSON.stringify(roomState.playlist || [])) {
					setTracks(roomState.playlist || []);
				}

				// Se há playlist mas não há música atual, define a primeira como atual
				if (roomState.playlist?.length > 0 && !roomState.currentTrack) {
					console.log(`🎵 updateRoom: Definindo primeira música da playlist como atual`);
					const firstTrack = roomState.playlist[0];
					setTrack(firstTrack);
				}
				// Atualiza a música atual se mudou
				else if (roomState.currentTrack) {
					setTrack(roomState.currentTrack);
				}

				// Atualiza o estado de reprodução
				setIsPlaying(roomState.playing);

				// Sincroniza tempo se houver música tocando
				if (roomState.currentTime && roomState.currentTime > 0 && roomState.playing && roomState.currentTrack) {
					const currentState = usePlayerStore.getState();
					if (currentState.currentTrack && currentState.currentTrack.id === roomState.currentTrack?.id) {
						const timeDifference = Math.abs(currentState.seekTime - roomState.currentTime);
						const shouldSync = timeDifference > 5 || currentState.seekTime === 0;
						
						if (shouldSync) {
							console.log(`🔄 Sincronizando tempo via updateRoom: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')} (diferença: ${timeDifference}s)`);
							
							if (roomState.syncSource?.isActive) {
								window.dispatchEvent(new CustomEvent('syncWithSource', {
									detail: { 
										currentTime: roomState.currentTime,
										trackId: roomState.currentTrack.id,
										syncSource: roomState.syncSource
									}
								}));
							}
						} else {
							console.log(`ℹ️ Diferença de tempo muito pequena (${timeDifference}s) - não sincronizando`);
						}
					}
				}

				console.log("Estado da sala atualizado:", roomState);
			} else {
				console.log(`ℹ️ updateRoom: Estado não mudou, ignorando atualização`);
			}
		}, 0);
	}

	private handleTrackChanged({ track, playing, currentTime, direction, trackIndex }: any) {
		const { setTrack, setIsPlaying } = usePlayerStore.getState();
		const { setCurrentIndex } = usePlaylistStore.getState();
		const { setRoomState } = useRoomStore.getState();
		
		console.log("🎵 TrackChanged recebido:", { track, playing, currentTime, direction, trackIndex });
		
		// Atualiza o estado da sala também
		if (track) {
			const currentRoomState = useRoomStore.getState().roomState;
			if (currentRoomState) {
				setRoomState({
					...currentRoomState,
					currentTrack: track,
					playing: playing,
					currentTime: currentTime || 0
				});
			}
		}
		
		// Define a nova música atual
		setTrack(track);
		setIsPlaying(playing);
		
		// Sincroniza o tempo se fornecido
		if (currentTime && currentTime > 0) {
			console.log(`🔄 Sincronizando tempo para nova música: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`);
			
			window.dispatchEvent(new CustomEvent('syncWithSource', {
				detail: { 
					currentTime: currentTime,
					trackId: track.id,
					syncSource: null
				}
			}));
		}
		
		// Atualiza o índice atual se fornecido
		if (trackIndex !== undefined) {
			setCurrentIndex(trackIndex);
		}
		
		console.log(`✅ Nova música sincronizada: ${track.title}`, { direction, trackIndex, playing, currentTime });
	}

	private handlePlaybackStateChanged({ playing, currentTime }: any) {
		const { setIsPlaying } = usePlayerStore.getState();
		const { setRoomState } = useRoomStore.getState();
		
		console.log(`🎮 playbackStateChanged recebido: ${playing ? 'play' : 'pause'}, tempo: ${currentTime}`);
		
		// Atualiza o estado local imediatamente
		setIsPlaying(playing);
		
		// Atualiza também o estado da sala
		const currentRoomState = useRoomStore.getState().roomState;
		if (currentRoomState) {
			setRoomState({
				...currentRoomState,
				playing: playing,
				currentTime: currentTime || currentRoomState.currentTime
			});
		}
		
		// Iniciar/parar envio periódico de tempo baseado no estado de reprodução
		if (playing) {
			this.startTimeSync();
		} else {
			this.stopTimeSync();
		}
	}

	private handleTrackAdded({ track, playlist }: any) {
		const { setTracks } = usePlaylistStore.getState();
		const { setRoomState } = useRoomStore.getState();
		
		console.log("🎵 TrackAdded recebido:", { track: track.title, playlistLength: playlist.length });
		
		// Atualiza a playlist local
		setTracks(playlist);
		
		// Atualiza o estado da sala também
		const currentRoomState = useRoomStore.getState().roomState;
		if (currentRoomState) {
			setRoomState({
				...currentRoomState,
				playlist: playlist
			});
		}
		
		console.log(`✅ Playlist atualizada: ${track.title} adicionada`);
	}

	private handleTrackRemoved({ trackId, playlist }: any) {
		const { setTracks } = usePlaylistStore.getState();
		const { setRoomState } = useRoomStore.getState();
		
		console.log("🗑️ TrackRemoved recebido:", { trackId, playlistLength: playlist.length });
		
		// Atualiza a playlist local
		setTracks(playlist);
		
		// Atualiza o estado da sala também
		const currentRoomState = useRoomStore.getState().roomState;
		if (currentRoomState) {
			setRoomState({
				...currentRoomState,
				playlist: playlist
			});
		}
		
		console.log(`✅ Playlist atualizada: música ${trackId} removida`);
	}

	private setupOtherEventListeners() {
		if (!this.socket) return;

		// Usuário entrou na sala
		this.socket.on("userJoined", ({ user, listeners }) => {
			const { updateListeners } = useRoomStore.getState();
			updateListeners(listeners);
			console.log(`Usuário entrou: ${user.name}, total: ${listeners}`);
		});

		// Usuário saiu da sala
		this.socket.on("userLeft", ({ userId, listeners }) => {
			const { updateListeners } = useRoomStore.getState();
			updateListeners(listeners);
			console.log(`Usuário saiu: ${userId}, total: ${listeners}`);
		});

		// Sala offline
		this.socket.on("roomOffline", ({ message }) => {
			console.log(`🚫 Sala offline: ${message}`);
			this.handleRoomOffline();
		});

		// Usuário expulso
		this.socket.on("kicked", ({ reason }) => {
			console.log(`🚫 Expulso da sala: ${reason}`);
			this.handleRoomOffline();
		});

		// Outros eventos...
	}

	private handleRoomOffline() {
		// Parar envio periódico de tempo
		this.stopTimeSync();
		
		// Limpar todos os estados relacionados à sala
		const { setTrack, setIsPlaying, setSeekTime } = usePlayerStore.getState();
		const { setTracks, setCurrentIndex } = usePlaylistStore.getState();
		
		// Limpar player
		setTrack(null);
		setIsPlaying(false);
		setSeekTime(0);
		
		// Limpar playlist
		setTracks([]);
		setCurrentIndex(0);
		
		// Redirecionar para /app
		setTimeout(() => {
			window.location.href = "/app";
		}, 100);
	}

	private startTimeSync() {
		const { roomState } = useRoomStore.getState();
		
		// Só inicia se for a fonte de sincronização
		if (!roomState?.syncSource || roomState.syncSource.userId !== this.userId) {
			console.log(`ℹ️ Usuário não é a fonte de sincronização - não iniciando envio periódico`);
			return;
		}
		
		// Parar intervalo anterior se existir
		if (this.timeSyncInterval) {
			clearInterval(this.timeSyncInterval);
		}
		
		console.log(`🎯 Iniciando envio periódico de tempo como fonte de sincronização`);
		
		// Enviar tempo a cada 3 segundos
		this.timeSyncInterval = setInterval(() => {
			const { currentTrack, seekTime } = usePlayerStore.getState();
			const { roomState: currentRoomState } = useRoomStore.getState();
			
			// Só enviar se estiver tocando e for a fonte de sincronização
			if (currentRoomState?.playing && currentTrack && currentRoomState.syncSource?.userId === this.userId) {
				// Converter seekTime (0-1) para segundos
				const duration = currentTrack.duration || 0;
				
				// ✅ CORREÇÃO: Se duração for 0, tentar obter do player store
				let finalDuration = duration;
				if (finalDuration <= 0) {
					const playerState = usePlayerStore.getState();
					finalDuration = playerState.duration || 0;
					if (finalDuration > 0) {
						console.log(`ℹ️ Usando duração do player store: ${finalDuration}s`);
					}
				}
				
				if (finalDuration > 0) {
					const currentTime = Math.floor(seekTime * finalDuration);
					
					console.log(`📡 Enviando tempo como fonte: ${currentTime}s (${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')})`);
					
					// Verificar se o socket está conectado antes de enviar
					if (this.socket && this.roomId && this.socket.connected) {
						this.socket.emit("syncTrack", {
							roomId: this.roomId,
							currentTime,
							userId: this.userId
						});
					} else {
						console.warn(`⚠️ Socket não disponível ou desconectado - não enviando tempo`);
					}
				} else {
					console.warn(`⚠️ Duração da música não disponível: track=${duration}s, store=${usePlayerStore.getState().duration}s`);
				}
			}
		}, 3000);
	}

	private stopTimeSync() {
		if (this.timeSyncInterval) {
			clearInterval(this.timeSyncInterval);
			this.timeSyncInterval = null;
			console.log(`⏹️ Parado envio periódico de tempo`);
		}
	}

	private joinRoom(roomId: string, userData: any) {
		if (!this.socket || !this.userId) return;

		// Parar envio periódico de tempo ao sair da sala
		this.stopTimeSync();

		console.log(`🚪 Tentando entrar na sala: ${roomId}`, { userId: this.userId, userData });

		this.socket.emit("joinRoom", {
			roomId,
			userId: this.userId,
			userData: {
				name: userData.name,
				email: userData.email,
				image: userData.image,
				role: userData.role,
				owner: userData.owner,
				moderators: userData.moderators
			}
		});
	}

	// Métodos públicos para emitir eventos
	emit(event: string, data: any) {
		if (this.socket && this.connected) {
			this.socket.emit(event, data);
		}
	}

	disconnect() {
		this.stopTimeSync();
		
		if (this.socket) {
			this.socket.disconnect();
		}
		
		this.socket = null;
		this.connected = false;
		this.roomId = null;
		this.userId = null;
		
		// Notificar mudança de estado
		this.notifyStateChange();
	}

	getSocket() {
		return this.socket;
	}

	isConnected() {
		return this.connected;
	}

	// ✅ NOVO: Métodos para gerenciar callbacks
	setStateChangeCallback(callback: (state: any) => void) {
		this.onStateChange = callback;
	}

	private notifyStateChange() {
		if (this.onStateChange) {
			this.onStateChange({
				connected: this.connected,
				socket: this.socket,
				roomId: this.roomId,
				userId: this.userId
			});
		}
	}
}

// ✅ SINGLETON: Exportar instância única
export const socketManager = SocketManager.getInstance();
export default socketManager;
