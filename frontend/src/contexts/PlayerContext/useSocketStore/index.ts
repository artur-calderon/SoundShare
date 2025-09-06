import { create } from "zustand";
import { io, Socket } from "socket.io-client";

import { useRoomStore } from "../useRoomStore";
import { userContext } from "../../UserContext.tsx";
import { usePlayerStore } from "../usePlayerStore";
import { usePlaylistStore } from "../usePlaylistStore";

interface Track {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	duration?: number; // ✅ NOVO: Duração da música em segundos
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
	// ✅ NOVA IMPLEMENTAÇÃO: Sistema de herança dinâmica
	syncSource?: {
		userId: string;
		userRole: string;
		lastSyncTime: number;
		isActive: boolean;
		lastActivity: Date;
	};
}

interface SocketState {
	socket: Socket | null;
	connected: boolean;
	roomId: string | null;
	userId: string | null;
	connect: (roomId: string, userData: any) => void;
	disconnect: () => void;
	
	// Eventos de sala
	joinRoom: (roomId: string, userData: any) => void;
	leaveRoom: () => void;
	toggleRoomStatus: (online: boolean) => void;
	
	// Eventos de playlist
	addTrack: (track: Track) => void;
	removeTrack: (trackId: string) => void;
	
	// Eventos de reprodução
	playPause: (playing: boolean) => void;
	playTrack: (track: Track) => void;
	syncTrack: (currentTime: number) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	jumpToTrack: (trackIndex: number) => void;
	
	// Eventos de moderação
	kickUser: (targetUserId: string, reason?: string) => void;
	toggleModerator: (targetUserId: string, isModerator: boolean) => void;
	
	// ✅ NOVO: Eventos de Chat
	sendChatMessage: (messageData: any) => void;
	editChatMessage: (editData: any) => void;
	deleteChatMessage: (deleteData: any) => void;
	requestChatHistory: (roomId: string) => void;
	userTyping: (typingData: any) => void;
	stopTyping: (typingData: any) => void;
	
	// Eventos de manutenção
	ping: () => void;
	
	// Listeners de eventos
	setupEventListeners: () => void;
	
	// ✅ NOVO: Funções de sincronização de tempo
	startTimeSync: () => void;
	stopTimeSync: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => {
	// ✅ NOVO: Intervalo para envio periódico de tempo (apenas host)
	let timeSyncInterval: NodeJS.Timeout | null = null;
	// ✅ NOVO: Flag para controlar se o usuário já foi sincronizado ao entrar na sala
	let hasInitialSync = false;

	return {
		socket: null,
		connected: false,
		roomId: null,
		userId: null,

		connect: async (roomId: string, userData: any) => {
			const { user } = userContext.getState();
			
			const socket = io(process.env.VITE_SOCKET_URL || "http://localhost:1337", {
				path: "/socket.io",
				reconnectionAttempts: 5,
				reconnectionDelay: 5000,
				autoConnect: true,
				transports: ["websocket"],
			});

			socket.on("connect", () => {
				set({ connected: true, socket, roomId, userId: user.id });
				get().setupEventListeners();
				get().joinRoom(roomId, userData);
			});

			socket.on("disconnect", () => {
				console.log(`🔌 Socket desconectado`);
				set({ connected: false, socket: null, roomId: null, userId: null });
				
				// ✅ NOVO: Parar envio periódico de tempo ao desconectar
				get().stopTimeSync();
				
				// ✅ NOVO: Se estava em uma sala, verificar se deve redirecionar
				const { roomState } = useRoomStore.getState();
				if (roomState && roomState.roomId) {
					console.log(`⚠️ Desconectado de sala ativa - tentando reconectar...`);
					
					// Tentar reconectar após um delay
					setTimeout(() => {
						const { socket } = get();
						if (socket && !socket.connected) {
							console.log(`🔄 Tentando reconectar...`);
							socket.connect();
						} else {
							// Se não conseguir reconectar, redirecionar para /app
							console.log(`❌ Falha na reconexão - redirecionando para /app`);
							window.location.href = "/app";
						}
					}, 3000); // Aguarda 3 segundos antes de tentar reconectar
				}
			});

			set({ socket });
		},

		setupEventListeners: () => {
			const { socket } = get();
			if (!socket) return;

			// ✅ NOVA IMPLEMENTAÇÃO: Entrou na sala com sistema de herança dinâmica
			socket.on("roomJoined", (roomState: RoomState) => {
				const { setRoomState } = useRoomStore.getState();
				const { setPlaylist } = usePlaylistStore.getState();
				const { setTrack, setIsPlaying } = usePlayerStore.getState();

				// Atualiza o estado da sala
				setRoomState(roomState);
				
				// Atualiza a playlist
				setPlaylist(roomState.playlist);

				console.log(`🎯 Estado ao entrar na sala:`, {
					playing: roomState.playing,
					currentTrack: roomState.currentTrack?.title || 'null',
					syncSource: roomState.syncSource?.userId || 'null',
					playlistLength: roomState.playlist.length,
					currentTime: roomState.currentTime
				});

				// ✅ CORREÇÃO: Se há playlist mas não há música atual, define a primeira como atual
				if (roomState.playlist.length > 0 && !roomState.currentTrack) {
					console.log(`🎵 Definindo primeira música da playlist como atual`);
					const firstTrack = roomState.playlist[0];
					setTrack(firstTrack);
					
					// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, solicita tempo atual
					if (roomState.syncSource?.isActive) {
						if (roomState.currentTime > 0) {
							console.log(`🔄 Sincronizando com fonte: ${roomState.syncSource.userRole} ${roomState.syncSource.userId} - Tempo: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
							
							window.dispatchEvent(new CustomEvent('syncWithSource', {
								detail: { 
									currentTime: roomState.currentTime,
									trackId: firstTrack.id,
									syncSource: roomState.syncSource
								}
							}));
						} else {
							console.log(`⚠️ Fonte ativa mas currentTime é 0 - solicitando tempo atual via socket`);
							// Solicita tempo atual da fonte de sincronização
							const { socket } = get();
							if (socket) {
								socket.emit("requestCurrentTime", {
									roomId: roomState.roomId,
									userId: roomState.syncSource.userId
								});
							}
						}
					}
				}
				// ✅ CORREÇÃO: SISTEMA DE HERANÇA DINÂMICA - Sincroniza com a fonte atual
				else if (roomState.playing && roomState.currentTrack && roomState.syncSource) {
					console.log(`�� Música tocando com fonte de sincronização: ${roomState.currentTrack.title}`);
					setTrack(roomState.currentTrack);
					setIsPlaying(true);
					
					// ✅ CORREÇÃO: Sempre sincroniza se houver tempo, independente da fonte estar ativa
					if (roomState.currentTime && roomState.currentTime > 0) {
						console.log(`🔄 Sincronizando com fonte: ${roomState.syncSource.userRole} ${roomState.syncSource.userId} - Tempo: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
						
						// ✅ Emite evento para sincronização inicial
						window.dispatchEvent(new CustomEvent('syncWithSource', {
							detail: { 
								currentTime: roomState.currentTime,
								trackId: roomState.currentTrack.id,
								syncSource: roomState.syncSource
							}
						}));
					} else {
						console.log(`⚠️ Sem tempo para sincronizar: ${roomState.currentTime}`);
					}
				} else if (roomState.playing && roomState.currentTrack) {
					// ✅ CORREÇÃO: Fallback - música tocando mas sem fonte de sincronização
					console.log(`🎵 Música tocando sem fonte de sincronização: ${roomState.currentTrack.title}`);
					setTrack(roomState.currentTrack);
					setIsPlaying(true);
					
					// ✅ CORREÇÃO: Se há tempo, sincroniza mesmo sem fonte
					if (roomState.currentTime && roomState.currentTime > 0) {
						console.log(`🔄 Sincronizando tempo sem fonte: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')}`);
						
						window.dispatchEvent(new CustomEvent('syncWithSource', {
							detail: { 
								currentTime: roomState.currentTime,
								trackId: roomState.currentTrack.id,
								syncSource: null
							}
						}));
					}
				} else if (roomState.playlist.length > 0) {
					// ✅ CORREÇÃO: Se há playlist mas não está tocando, define primeira música
					console.log(`🎵 Playlist disponível mas não tocando - definindo primeira música`);
					const firstTrack = roomState.playlist[0];
					setTrack(firstTrack);
					setIsPlaying(false);
					
					// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, tenta sincronizar
					if (roomState.syncSource?.isActive && roomState.currentTime === 0) {
						console.log(`⚠️ Fonte ativa mas currentTime é 0 - tentando sincronizar com fallback`);
						
						// Tenta sincronizar com tempo estimado baseado no lastSyncTime
						if (roomState.syncSource.lastSyncTime > 0) {
							const estimatedTime = roomState.syncSource.lastSyncTime;
							console.log(`🔄 Usando tempo estimado da fonte: ${estimatedTime}s`);
							
							window.dispatchEvent(new CustomEvent('syncWithSource', {
								detail: { 
									currentTime: estimatedTime,
									trackId: firstTrack.id,
									syncSource: roomState.syncSource
								}
							}));
						}
					}
				}

				console.log("Entrou na sala:", roomState);
			});

			// ✅ CORREÇÃO: Estado da sala atualizado - evento correto do backend
			socket.on("updateRoom", (roomState: RoomState) => {
				const { setRoomState } = useRoomStore.getState();
				const { setPlaylist } = usePlaylistStore.getState();
				const { setTrack, setIsPlaying } = usePlayerStore.getState();

				console.log(`🔄 updateRoom recebido:`, {
					playing: roomState.playing,
					currentTrack: roomState.currentTrack?.title || 'null',
					currentTime: roomState.currentTime,
					playlistLength: roomState.playlist.length,
					syncSource: roomState.syncSource?.userId || 'null'
				});

				// Atualiza o estado da sala
				setRoomState(roomState);
				
				// Atualiza a playlist
				setPlaylist(roomState.playlist);

				// ✅ CORREÇÃO: Se há playlist mas não há música atual, define a primeira como atual
				if (roomState.playlist.length > 0 && !roomState.currentTrack) {
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

				// ✅ CORREÇÃO: Sincroniza tempo se houver música tocando
				if (roomState.currentTime && roomState.currentTime > 0 && roomState.playing && roomState.currentTrack) {
					const currentState = usePlayerStore.getState();
					if (currentState.currentTrack && currentState.currentTrack.id === roomState.currentTrack?.id) {
						// ✅ CORREÇÃO: Sempre sincroniza para novos usuários ou se a diferença for significativa
						const timeDifference = Math.abs(currentState.seekTime - roomState.currentTime);
						const shouldSync = timeDifference > 5 || currentState.seekTime === 0; // ✅ NOVO: Sincroniza se seekTime é 0 (novo usuário)
						
						if (shouldSync) {
							console.log(`🔄 Sincronizando tempo via updateRoom: ${Math.floor(roomState.currentTime / 60)}:${(roomState.currentTime % 60).toString().padStart(2, '0')} (diferença: ${timeDifference}s)`);
							
							// ✅ CORREÇÃO: Emite evento para sincronização se houver fonte ativa
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

				// ✅ CORREÇÃO: Se há fonte de sincronização ativa mas currentTime é 0, tenta sincronizar
				if (roomState.syncSource?.isActive && roomState.currentTime === 0 && roomState.playlist.length > 0) {
					console.log(`⚠️ updateRoom: Fonte ativa mas currentTime é 0 - tentando sincronizar com fallback`);
					
					// Tenta sincronizar com tempo estimado baseado no lastSyncTime
					if (roomState.syncSource.lastSyncTime > 0) {
						const estimatedTime = roomState.syncSource.lastSyncTime;
						const firstTrack = roomState.playlist[0];
						console.log(`🔄 Usando tempo estimado da fonte: ${estimatedTime}s`);
						
						window.dispatchEvent(new CustomEvent('syncWithSource', {
							detail: { 
								currentTime: estimatedTime,
								trackId: firstTrack.id,
								syncSource: roomState.syncSource
							}
						}));
					}
				}

				console.log("Estado da sala atualizado:", roomState);
			});

			// ✅ CORREÇÃO: Nova música tocando - evento correto do backend
			socket.on("trackChanged", ({ track, playing, currentTime, direction, trackIndex, previousTrack }) => {
				const { setTrack, setIsPlaying } = usePlayerStore.getState();
				const { setCurrentIndex } = usePlaylistStore.getState();
				const { setRoomState } = useRoomStore.getState();
				
				console.log("🎵 TrackChanged recebido:", { track, playing, currentTime, direction, trackIndex });
				
				// ✅ CORREÇÃO: Atualiza o estado da sala também
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
				
				// ✅ CORREÇÃO: Sincroniza o tempo se fornecido
				if (currentTime && currentTime > 0) {
					console.log(`🔄 Sincronizando tempo para nova música: ${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')}`);
					
					// ✅ CORREÇÃO: Emite evento para sincronização imediata
					window.dispatchEvent(new CustomEvent('syncWithSource', {
						detail: { 
							currentTime: currentTime,
							trackId: track.id,
							syncSource: null // Nova música não tem fonte específica ainda
						}
					}));
				}
				
				// Atualiza o índice atual se fornecido
				if (trackIndex !== undefined) {
					setCurrentIndex(trackIndex);
				}
				
				console.log(`✅ Nova música sincronizada: ${track.title}`, { direction, trackIndex, playing, currentTime });
			});

			// ✅ CORREÇÃO: Estado de reprodução alterado - evento correto do backend
			socket.on("playbackStateChanged", ({ playing, currentTime }) => {
				const { setIsPlaying } = usePlayerStore.getState();
				const { setRoomState } = useRoomStore.getState();
				
				console.log(`🎮 playbackStateChanged recebido: ${playing ? 'play' : 'pause'}, tempo: ${currentTime}`);
				
				// ✅ CORREÇÃO: Atualiza o estado local imediatamente
				setIsPlaying(playing);
				
				// ✅ CORREÇÃO: Atualiza também o estado da sala
				const currentRoomState = useRoomStore.getState().roomState;
				if (currentRoomState) {
					setRoomState({
						...currentRoomState,
						playing: playing,
						currentTime: currentTime || currentRoomState.currentTime
					});
				}
				
				// ✅ CORREÇÃO: Reset da flag de sincronização apenas para novos usuários
				// Isso permite que novos usuários sincronizem quando o host der play/pause
				// Mas não impede usuários existentes de sincronizarem
				if (get().userId && get().roomId) {
					const { roomState } = useRoomStore.getState();
					const isNewUser = roomState?.users?.some(user => user.id === get().userId && user.joinedAt > new Date(Date.now() - 10000)); // Usuário que entrou nos últimos 10 segundos
					if (isNewUser) {
						hasInitialSync = false;
						console.log(`🆕 Novo usuário detectado - resetando flag de sincronização`);
					}
				}
				
				// ✅ NOVO: Iniciar/parar envio periódico de tempo baseado no estado de reprodução
				if (playing) {
					get().startTimeSync();
				} else {
					get().stopTimeSync();
				}
			});

			// ✅ CORREÇÃO: Sincronização de tempo - evento correto do backend
			socket.on("timeSync", ({ currentTime, trackId, syncSource, source }) => {
				const { currentTrack } = usePlayerStore.getState();
				
				// Só sincroniza se for a música atual
				if (currentTrack && currentTrack.id === trackId) {
					console.log(`🔄 TimeSync recebido: ${currentTime}s para música ${trackId} (fonte: ${source})`);
					
					// ✅ CORREÇÃO: Sempre sincroniza para novos usuários ou se não foi sincronizado
					const { roomState } = useRoomStore.getState();
					const isHost = roomState?.syncSource?.userId === get().userId;
					const isNewUser = roomState?.users?.some(user => user.id === get().userId && user.joinedAt > new Date(Date.now() - 10000)); // Usuário que entrou nos últimos 10 segundos
					
					if (!isHost && (!hasInitialSync || isNewUser)) {
						console.log(`🎯 Usuário não-host recebeu timeSync - sincronizando automaticamente (${isNewUser ? 'novo usuário' : 'primeira vez'})`);
						hasInitialSync = true;
						window.dispatchEvent(new CustomEvent('syncWithSource', {
							detail: { 
								currentTime: currentTime,
								trackId: trackId,
								syncSource: syncSource
							}
						}));
					} else {
						console.log(`ℹ️ TimeSync recebido - usuário já sincronizado inicialmente, não sincronizando automaticamente`);
					}
				}
			});

			// ✅ CORREÇÃO: Música adicionada à playlist - evento correto do backend
			socket.on("trackAdded", ({ track, playlist }) => {
				const { setPlaylist } = usePlaylistStore.getState();
				const { setRoomState } = useRoomStore.getState();
				
				console.log("🎵 TrackAdded recebido:", { track: track.title, playlistLength: playlist.length });
				
				// ✅ CORREÇÃO: Atualiza a playlist local
				setPlaylist(playlist);
				
				// ✅ CORREÇÃO: Atualiza o estado da sala também
				const currentRoomState = useRoomStore.getState().roomState;
				if (currentRoomState) {
					setRoomState({
						...currentRoomState,
						playlist: playlist
					});
				}
				
				console.log(`✅ Playlist atualizada: ${track.title} adicionada`);
			});

			// ✅ CORREÇÃO: Música removida da playlist - evento correto do backend
			socket.on("trackRemoved", ({ trackId, playlist }) => {
				const { setPlaylist } = usePlaylistStore.getState();
				const { setRoomState } = useRoomStore.getState();
				
				console.log("🗑️ TrackRemoved recebido:", { trackId, playlistLength: playlist.length });
				
				// ✅ CORREÇÃO: Atualiza a playlist local
				setPlaylist(playlist);
				
				// ✅ CORREÇÃO: Atualiza o estado da sala também
				const currentRoomState = useRoomStore.getState().roomState;
				if (currentRoomState) {
					setRoomState({
						...currentRoomState,
						playlist: playlist
					});
				}
				
				console.log(`✅ Playlist atualizada: música ${trackId} removida`);
			});

			// ✅ CORREÇÃO: Usuário entrou na sala - evento correto do backend
			socket.on("userJoined", ({ user, listeners, online }) => {
				const { updateListeners } = useRoomStore.getState();
				updateListeners(listeners);
				console.log(`Usuário entrou: ${user.name}, total: ${listeners}`);
			});

			// ✅ CORREÇÃO: Usuário saiu da sala - evento correto do backend
			socket.on("userLeft", ({ userId, listeners }) => {
				const { updateListeners } = useRoomStore.getState();
				updateListeners(listeners);
				console.log(`Usuário saiu: ${userId}, total: ${listeners}`);
			});

			// ✅ CORREÇÃO: Sala offline - evento correto do backend
			socket.on("roomOffline", ({ message }) => {
				console.log(`🚫 Sala offline: ${message}`);
				
				// ✅ NOVO: Parar envio periódico de tempo
				get().stopTimeSync();
				
				// ✅ NOVO: Limpar todos os estados relacionados à sala
				const { setRoomOffline } = useRoomStore.getState();
				const { setTrack, setIsPlaying, setSeekTime } = usePlayerStore.getState();
				const { setPlaylist, setCurrentIndex } = usePlaylistStore.getState();
				
				// Limpar player
				setTrack(null);
				setIsPlaying(false);
				setSeekTime(0);
				
				// Limpar playlist
				setPlaylist([]);
				setCurrentIndex(0);
				
				// ✅ NOVO: Chamar setRoomOffline que irá redirecionar
				setRoomOffline();
				
				// ✅ NOVO: Mostrar notificação para o usuário (se disponível)
				if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
					new Notification('SoundShare', {
						body: `A sala ficou offline: ${message}`,
						icon: '/Logo Sound Share ico.svg'
					});
				}
			});

			// ✅ CORREÇÃO: Usuário expulso - evento correto do backend
			socket.on("kicked", ({ reason, roomId }) => {
				console.log(`🚫 Expulso da sala: ${reason}`);
				
				// ✅ NOVO: Parar envio periódico de tempo
				get().stopTimeSync();
				
				// ✅ NOVO: Limpar todos os estados relacionados à sala
				const { setRoomOffline } = useRoomStore.getState();
				const { setTrack, setIsPlaying, setSeekTime } = usePlayerStore.getState();
				const { setPlaylist, setCurrentIndex } = usePlaylistStore.getState();
				
				// Limpar player
				setTrack(null);
				setIsPlaying(false);
				setSeekTime(0);
				
				// Limpar playlist
				setPlaylist([]);
				setCurrentIndex(0);
				
				// ✅ NOVO: Mostrar notificação para o usuário (se disponível)
				if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
					new Notification('SoundShare', {
						body: `Você foi expulso da sala: ${reason}`,
						icon: '/Logo Sound Share ico.svg'
					});
				}
				
				// ✅ NOVO: Redirecionar para /app após limpar estados
				setTimeout(() => {
					window.location.href = "/app";
				}, 100);
			});

			// ✅ CORREÇÃO: Usuário expulso (para outros usuários) - evento correto do backend
			socket.on("userKicked", ({ userId, reason, listeners }) => {
				const { updateListeners } = useRoomStore.getState();
				updateListeners(listeners);
				console.log(`Usuário expulso: ${userId}, motivo: ${reason}`);
			});

			// ✅ CORREÇÃO: Moderador atualizado - evento correto do backend
			socket.on("moderatorUpdated", ({ userId, isModerator, moderators }) => {
				const { updateModerators } = useRoomStore.getState();
				updateModerators(moderators);
				console.log(`Moderador ${isModerator ? 'adicionado' : 'removido'}: ${userId}`);
			});

			// ✅ CORREÇÃO: Eventos de erro e permissão - eventos corretos do backend
			socket.on("permissionDenied", ({ action, message }) => {
				console.log(`Permissão negada para ${action}: ${message}`);
				// TODO: Mostrar mensagem de erro na UI
			});

			socket.on("playlistEmpty", ({ message }) => {
				console.log(`Playlist vazia: ${message}`);
				// TODO: Mostrar mensagem na UI
			});

			socket.on("invalidTrackIndex", ({ message }) => {
				console.log(`Índice inválido: ${message}`);
				// TODO: Mostrar mensagem de erro na UI
			});

			// ✅ CORREÇÃO: Resposta do ping - evento correto do backend
			socket.on("pong", () => {
				console.log("✅ Conexão ativa - sala respondendo");
			});
			
			// ✅ NOVO: Evento para quando o backend não responde ao ping
			socket.on("pingTimeout", () => {
				console.log("⚠️ Timeout no ping - sala pode estar offline");
				
				// Tentar reconectar uma vez
				const { socket: currentSocket } = get();
				if (currentSocket && !currentSocket.connected) {
					console.log("🔄 Tentando reconectar após timeout...");
					currentSocket.connect();
				} else {
					// Se não conseguir, redirecionar para /app
					console.log("❌ Falha na reconexão após timeout - redirecionando para /app");
					setTimeout(() => {
						window.location.href = "/app";
					}, 2000);
				}
			});

			// ✅ NOVA IMPLEMENTAÇÃO: Recebe tempo atual da fonte de sincronização
			socket.on("currentTimeResponse", ({ currentTime, trackId, syncSource }) => {
				console.log(`🕐 Tempo atual recebido da fonte: ${currentTime}s para música ${trackId}`);
				
				if (currentTime > 0) {
					// Emite evento para sincronização com o tempo atual
					window.dispatchEvent(new CustomEvent('syncWithSource', {
						detail: { 
							currentTime: currentTime,
							trackId: trackId,
							syncSource: syncSource
						}
					}));
				}
			});

			// ✅ NOVA IMPLEMENTAÇÃO: Sistema de herança dinâmica
			
			// ✅ NOVO: Sala deletada
			socket.on("roomDeleted", ({ message, reason }) => {
				console.log(`🗑️ Sala deletada: ${message} - Motivo: ${reason}`);
				
				// ✅ NOVO: Parar envio periódico de tempo
				get().stopTimeSync();
				
				// ✅ NOVO: Limpar todos os estados relacionados à sala
				const { setRoomOffline } = useRoomStore.getState();
				const { setTrack, setIsPlaying, setSeekTime } = usePlayerStore.getState();
				const { setPlaylist, setCurrentIndex } = usePlaylistStore.getState();
				
				// Limpar player
				setTrack(null);
				setIsPlaying(false);
				setSeekTime(0);
				
				// Limpar playlist
				setPlaylist([]);
				setCurrentIndex(0);
				
				// ✅ NOVO: Mostrar notificação para o usuário (se disponível)
				if (typeof window !== 'undefined' && window.Notification && Notification.permission === 'granted') {
					new Notification('SoundShare', {
						body: `A sala foi deletada: ${message}`,
						icon: '/Logo Sound Share ico.svg'
					});
				}
				
				// ✅ NOVO: Redirecionar para /app após limpar estados
				setTimeout(() => {
					window.location.href = "/app";
				}, 100);
			});
			
			// Fonte de sincronização mudou
			socket.on("syncSourceChanged", (data) => {
				const { setRoomState } = useRoomStore.getState();
				const currentRoomState = useRoomStore.getState().roomState;
				
				if (currentRoomState) {
					console.log(`🔄 Fonte de sincronização mudou: ${data.previousSource} → ${data.newSource.userId} (${data.newSource.userRole}) - Motivo: ${data.reason}`);
					
					// Atualiza o estado da sala com nova fonte
					setRoomState({
						...currentRoomState,
						syncSource: data.newSource
					});
					
					// Notifica o VideoPlayer sobre a mudança
					window.dispatchEvent(new CustomEvent('syncSourceChanged', {
						detail: { 
							newSource: data.newSource,
							previousSource: data.previousSource,
							reason: data.reason
						}
					}));
					
					// ✅ NOVO: Verificar se o usuário atual é a nova fonte de sincronização
					const { userId } = get();
					if (data.newSource.userId === userId) {
						console.log(`🎯 Usuário atual é a nova fonte de sincronização - iniciando envio periódico`);
						get().startTimeSync();
					} else {
						console.log(`ℹ️ Usuário atual não é a fonte de sincronização - parando envio periódico`);
						get().stopTimeSync();
					}
				}
			});

			// Dono da sala mudou
			socket.on("ownerChanged", (data) => {
				const { setRoomState } = useRoomStore.getState();
				const currentRoomState = useRoomStore.getState().roomState;
				
				if (currentRoomState) {
					console.log(`👑 Dono da sala mudou: ${data.previousOwner} → ${data.newOwner} - Motivo: ${data.reason}`);
					
					// Atualiza o estado da sala com novo dono
					setRoomState({
						...currentRoomState,
						owner: data.newOwner,
						users: currentRoomState.users.map(user => ({
							...user,
							role: user.id === data.newOwner ? 'owner' : user.role === 'owner' ? 'user' : user.role
						}))
					});
				}
			});

			// Sala ficou vazia
			socket.on("roomEmpty", (data) => {
				const { setRoomState } = useRoomStore.getState();
				const { setPlaylist } = usePlaylistStore.getState();
				const { setTrack, setIsPlaying } = usePlayerStore.getState();
				
				console.log(`🏠 Sala vazia: ${data.message} - Motivo: ${data.reason}`);
				
				// Para a reprodução
				setIsPlaying(false);
				setTrack(null);
				setPlaylist([]);
				
				// Atualiza estado da sala
				const currentRoomState = useRoomStore.getState().roomState;
				if (currentRoomState) {
					setRoomState({
						...currentRoomState,
						playing: false,
						currentTrack: undefined,
						currentTime: 0,
						syncSource: undefined,
						users: []
					});
				}
				
				// Notifica o VideoPlayer
				window.dispatchEvent(new CustomEvent('roomEmpty', {
					detail: { message: data.message, reason: data.reason }
				}));
				
				// ✅ NOVO: Parar envio periódico de tempo
				get().stopTimeSync();
				
				// ✅ NOVO: Se a sala ficou vazia por muito tempo, redirecionar para /app
				setTimeout(() => {
					const { roomState } = useRoomStore.getState();
					if (roomState && roomState.users.length === 0) {
						console.log(`🏠 Sala vazia por muito tempo - redirecionando para /app`);
						window.location.href = "/app";
					}
				}, 5000); // Aguarda 5 segundos antes de redirecionar
			});

			// Status de usuário mudou
			socket.on("userStatusChanged", (data) => {
				const { setRoomState } = useRoomStore.getState();
				const currentRoomState = useRoomStore.getState().roomState;
				
				if (currentRoomState) {
					console.log(`👤 Status do usuário ${data.userId} mudou: ${data.isActive ? 'Ativo' : 'Inativo'} - Motivo: ${data.reason}`);
					
					// Atualiza o status do usuário na sala
					setRoomState({
						...currentRoomState,
						users: currentRoomState.users.map(user => 
							user.id === data.userId 
								? { ...user, isActive: data.isActive }
								: user
						)
					});
				}
			});
		},

		// ✅ NOVO: Função para iniciar envio periódico de tempo (apenas host)
		startTimeSync: () => {
			const { socket, roomId, userId } = get();
			const { roomState } = useRoomStore.getState();
			
			// Só inicia se for a fonte de sincronização
			if (!roomState?.syncSource || roomState.syncSource.userId !== userId) {
				console.log(`ℹ️ Usuário não é a fonte de sincronização - não iniciando envio periódico`);
				return;
			}
			
			// Parar intervalo anterior se existir
			if (timeSyncInterval) {
				clearInterval(timeSyncInterval);
			}
			
			console.log(`🎯 Iniciando envio periódico de tempo como fonte de sincronização`);
			
			// Enviar tempo a cada segundo
			timeSyncInterval = setInterval(() => {
				const { currentTrack, seekTime } = usePlayerStore.getState();
				const { roomState: currentRoomState } = useRoomStore.getState();
				
				// Só enviar se estiver tocando e for a fonte de sincronização
				if (currentRoomState?.playing && currentTrack && currentRoomState.syncSource?.userId === userId) {
					// Converter seekTime (0-1) para segundos
					const duration = currentTrack.duration || 0;
					if (duration > 0) {
						const currentTime = Math.floor(seekTime * duration);
						
						console.log(`📡 Enviando tempo como fonte: ${currentTime}s (${Math.floor(currentTime / 60)}:${(currentTime % 60).toString().padStart(2, '0')})`);
						
						// ✅ MELHORIA: Verificar se o socket está conectado antes de enviar
						if (socket && roomId && socket.connected) {
							socket.emit("syncTrack", {
								roomId,
								currentTime,
								userId
							});
						} else {
							console.warn(`⚠️ Socket não disponível ou desconectado - não enviando tempo`);
							// ✅ NOVO: Tentar reconectar se necessário
							if (socket && !socket.connected) {
								console.log(`🔄 Tentando reconectar socket...`);
								socket.connect();
							}
						}
					} else {
						console.warn(`⚠️ Duração da música não disponível: ${duration}s`);
					}
				} else {
					// ✅ NOVO: Log mais detalhado sobre por que não está enviando
					console.log(`ℹ️ Não enviando tempo:`, {
						playing: currentRoomState?.playing,
						hasTrack: !!currentTrack,
						isSyncSource: currentRoomState?.syncSource?.userId === userId,
						userId,
						syncSourceId: currentRoomState?.syncSource?.userId
					});
				}
			}, 1000); // Enviar a cada segundo
		},

			// ✅ NOVO: Função para parar envio periódico de tempo
	stopTimeSync: () => {
		if (timeSyncInterval) {
			clearInterval(timeSyncInterval);
			timeSyncInterval = null;
			console.log(`⏹️ Parado envio periódico de tempo`);
		}
	},

	// ✅ NOVO: Função para verificar periodicamente o status da sala
	startRoomStatusCheck: () => {
		const { socket, roomId } = get();
		if (!socket || !roomId) return;
		
		// Verificar status da sala a cada 30 segundos
		const roomStatusInterval = setInterval(() => {
			if (socket.connected && roomId) {
				console.log(`🔍 Verificando status da sala ${roomId}...`);
				socket.emit("ping");
			} else {
				console.log(`⚠️ Socket não conectado ou sem sala - parando verificação de status`);
				clearInterval(roomStatusInterval);
			}
		}, 30000); // 30 segundos
		
		// Retornar o intervalo para poder parar depois
		return roomStatusInterval;
	},

		joinRoom: (roomId: string, userData: any) => {
			const { socket, userId } = get();
			if (!socket || !userId) return;

			// ✅ NOVO: Parar envio periódico de tempo ao sair da sala
			get().stopTimeSync();

			socket.emit("joinRoom", {
				roomId,
				userId,
				userData: {
					name: userData.name,
					email: userData.email,
					image: userData.image,
					role: userData.role,
					owner: userData.owner,
					moderators: userData.moderators
				}
			});
			
			// ✅ NOVO: Iniciar verificação periódica de status da sala
			setTimeout(() => {
				get().startRoomStatusCheck();
			}, 1000); // Aguarda 1 segundo após entrar na sala
		},

		leaveRoom: () => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			// ✅ NOVO: Parar envio periódico de tempo ao sair da sala
			get().stopTimeSync();

			socket.emit("leaveRoom", {
				roomId,
				userId
			});
		},

		toggleRoomStatus: (online: boolean) => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			socket.emit("toggleRoomStatus", {
				roomId,
				userId,
				online
			});
		},

		addTrack: (track: Track) => {
			console.log("📡 Socket addTrack chamado:", { track: track.title });
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível:", { socket: !!socket, roomId, userId });
				return;
			}

			console.log("📤 Emitindo addTrack para socket:", { roomId, trackId: track.id, userId });
			socket.emit("addTrack", {
				roomId,
				track,
				userId
			});
			
			console.log("✅ addTrack emitido com sucesso");
		},

		removeTrack: (trackId: string) => {
			console.log("🗑️ Socket removeTrack chamado:", { trackId });
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível para removeTrack");
				return;
			}

			console.log("📤 Emitindo removeTrack para socket:", { roomId, trackId, userId });
			socket.emit("removeTrack", {
				roomId,
				trackId,
				userId
			});
			
			console.log("✅ removeTrack emitido com sucesso");
		},

		playPause: (playing: boolean) => {
			console.log("🎮 Socket playPause chamado:", { playing });
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível para playPause");
				return;
			}

			console.log("📤 Emitindo playPause para socket:", { roomId, userId, playing });
			socket.emit("playPause", {
				roomId,
				userId,
				playing
			});
			
			console.log("✅ playPause emitido com sucesso");
		},

		playTrack: (track: Track) => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			socket.emit("playTrack", {
				roomId,
				track,
				userId
			});
		},

		syncTrack: (currentTime: number) => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			socket.emit("syncTrack", {
				roomId,
				currentTime,
				userId
			});
		},

		nextTrack: () => {
			console.log("⏭️ Socket nextTrack chamado");
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível para nextTrack");
				return;
			}

			console.log("📤 Emitindo nextTrack para socket:", { roomId, userId });
			socket.emit("nextTrack", {
				roomId,
				userId
			});
			
			console.log("✅ nextTrack emitido com sucesso");
		},

		previousTrack: () => {
			console.log("⏮️ Socket previousTrack chamado");
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível para previousTrack");
				return;
			}

			console.log("📤 Emitindo previousTrack para socket:", { roomId, userId });
			socket.emit("previousTrack", {
				roomId,
				userId
			});
			
			console.log("✅ previousTrack emitido com sucesso");
		},

		jumpToTrack: (trackIndex: number) => {
			console.log("🎯 Socket jumpToTrack chamado:", { trackIndex });
			
			const { socket, roomId, userId } = get();
			console.log("🔍 Socket state:", { socket: !!socket, roomId, userId });
			
			if (!socket || !roomId || !userId) {
				console.log("❌ Socket não disponível para jumpToTrack");
				return;
			}

			console.log("📤 Emitindo jumpToTrack para socket:", { roomId, userId, trackIndex });
			socket.emit("jumpToTrack", {
				roomId,
				userId,
				trackIndex
			});
			
			console.log("✅ jumpToTrack emitido com sucesso");
		},

		kickUser: (targetUserId: string, reason?: string) => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			socket.emit("kickUser", {
				roomId,
				targetUserId,
				userId,
				reason
			});
		},

		toggleModerator: (targetUserId: string, isModerator: boolean) => {
			const { socket, roomId, userId } = get();
			if (!socket || !roomId || !userId) return;

			socket.emit("toggleModerator", {
				roomId,
				targetUserId,
				userId,
				isModerator
			});
		},

			ping: () => {
		const { socket } = get();
		socket?.emit("ping");
	},

	// ✅ NOVO: Funções de Chat
	sendChatMessage: (messageData: any) => {
		const { socket } = get();
		if (!socket) return;
		
		console.log("📤 Enviando mensagem de chat:", messageData);
		socket.emit("sendChatMessage", messageData);
	},

	editChatMessage: (editData: any) => {
		const { socket } = get();
		if (!socket) return;
		
		console.log("✏️ Editando mensagem de chat:", editData);
		socket.emit("editChatMessage", editData);
	},

	deleteChatMessage: (deleteData: any) => {
		const { socket } = get();
		if (!socket) return;
		
		console.log("🗑️ Deletando mensagem de chat:", deleteData);
		socket.emit("deleteChatMessage", deleteData);
	},

	requestChatHistory: (roomId: string) => {
		const { socket } = get();
		if (!socket) return;
		
		console.log("📚 Solicitando histórico do chat para sala:", roomId);
		socket.emit("requestChatHistory", { roomId });
	},

	userTyping: (typingData: any) => {
		const { socket } = get();
		if (!socket) return;
		
		socket.emit("userTyping", typingData);
	},

	stopTyping: (typingData: any) => {
		const { socket } = get();
		if (!socket) return;
		
		socket.emit("stopTyping", typingData);
	},

	disconnect: () => {
		const { socket } = get();
		// ✅ NOVO: Parar envio periódico de tempo ao desconectar
		get().stopTimeSync();
		
		// ✅ NOVO: Parar verificação de status da sala
		if (socket) {
			socket.disconnect();
		}
		
		set({ socket: null, connected: false, roomId: null, userId: null });
	},
	};
});
