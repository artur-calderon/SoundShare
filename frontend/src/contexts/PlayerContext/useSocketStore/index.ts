import { create } from "zustand";
import { Socket } from "socket.io-client";
import { socketManager } from "../../../utils/socketManager";

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
	
	// Eventos de Chat
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
	
	// Funções de sincronização de tempo
	startTimeSync: () => void;
	stopTimeSync: () => void;
	startRoomStatusCheck: () => NodeJS.Timeout | undefined;
}

export const useSocketStore = create<SocketState>((set, get) => {
	// ✅ CORREÇÃO: Configurar callback para sincronizar estado
	socketManager.setStateChangeCallback((state) => {
		set({
			connected: state.connected,
			socket: state.socket,
			roomId: state.roomId,
			userId: state.userId
		});
	});

	return {
		socket: null,
		connected: false,
		roomId: null,
		userId: null,

		connect: async (roomId: string, userData: any) => {
			console.log(`🔌 useSocketStore: Conectando à sala ${roomId}`, userData);
			
			// ✅ CORREÇÃO: Usar socketManager singleton
			socketManager.connect(roomId, userData);
			
			// Estado será atualizado via callback
		},

		setupEventListeners: () => {
			// ✅ CORREÇÃO: Listeners agora são gerenciados pelo socketManager
			console.log("ℹ️ Event listeners são gerenciados pelo socketManager");
		},

		// ✅ CORREÇÃO: Métodos simplificados usando socketManager
		startTimeSync: () => {
			// Delegate para socketManager
			console.log("ℹ️ startTimeSync delegado para socketManager");
		},

		stopTimeSync: () => {
			// Delegate para socketManager
			console.log("ℹ️ stopTimeSync delegado para socketManager");
		},

		startRoomStatusCheck: () => {
			// Delegate para socketManager
			console.log("ℹ️ startRoomStatusCheck delegado para socketManager");
			return undefined;
		},

		joinRoom: (roomId: string, userData: any) => {
			// Delegate para socketManager
			socketManager.emit("joinRoom", {
				roomId,
				userId: userData.id,
				userData: {
					name: userData.name,
					email: userData.email,
					image: userData.image,
					role: userData.role,
					owner: userData.owner,
					moderators: userData.moderators
				}
			});
		},

		leaveRoom: () => {
			socketManager.emit("leaveRoom", {
				roomId: get().roomId,
				userId: get().userId
			});
		},

		toggleRoomStatus: (online: boolean) => {
			socketManager.emit("toggleRoomStatus", {
				roomId: get().roomId,
				userId: get().userId,
				online
			});
		},

		addTrack: (track: Track) => {
			console.log("📡 Socket addTrack chamado:", { track: track.title });
			socketManager.emit("addTrack", {
				roomId: get().roomId,
				track,
				userId: get().userId
			});
		},

		removeTrack: (trackId: string) => {
			console.log("🗑️ Socket removeTrack chamado:", { trackId });
			socketManager.emit("removeTrack", {
				roomId: get().roomId,
				trackId,
				userId: get().userId
			});
		},

		playPause: (playing: boolean) => {
			console.log("🎮 Socket playPause chamado:", { playing });
			socketManager.emit("playPause", {
				roomId: get().roomId,
				userId: get().userId,
				playing
			});
		},

		playTrack: (track: Track) => {
			socketManager.emit("playTrack", {
				roomId: get().roomId,
				track,
				userId: get().userId
			});
		},

		syncTrack: (currentTime: number) => {
			socketManager.emit("syncTrack", {
				roomId: get().roomId,
				currentTime,
				userId: get().userId
			});
		},

		nextTrack: () => {
			console.log("⏭️ Socket nextTrack chamado");
			socketManager.emit("nextTrack", {
				roomId: get().roomId,
				userId: get().userId
			});
		},

		previousTrack: () => {
			console.log("⏮️ Socket previousTrack chamado");
			socketManager.emit("previousTrack", {
				roomId: get().roomId,
				userId: get().userId
			});
		},

		jumpToTrack: (trackIndex: number) => {
			console.log("🎯 Socket jumpToTrack chamado:", { trackIndex });
			socketManager.emit("jumpToTrack", {
				roomId: get().roomId,
				userId: get().userId,
				trackIndex
			});
		},

		kickUser: (targetUserId: string, reason?: string) => {
			socketManager.emit("kickUser", {
				roomId: get().roomId,
				targetUserId,
				userId: get().userId,
				reason
			});
		},

		toggleModerator: (targetUserId: string, isModerator: boolean) => {
			socketManager.emit("toggleModerator", {
				roomId: get().roomId,
				targetUserId,
				userId: get().userId,
				isModerator
			});
		},

		ping: () => {
			socketManager.emit("ping", {});
		},

		// Funções de Chat
		sendChatMessage: (messageData: any) => {
			console.log("📤 Enviando mensagem de chat:", messageData);
			socketManager.emit("sendChatMessage", messageData);
		},

		editChatMessage: (editData: any) => {
			console.log("✏️ Editando mensagem de chat:", editData);
			socketManager.emit("editChatMessage", editData);
		},

		deleteChatMessage: (deleteData: any) => {
			console.log("🗑️ Deletando mensagem de chat:", deleteData);
			socketManager.emit("deleteChatMessage", deleteData);
		},

		requestChatHistory: (roomId: string) => {
			console.log("📚 Solicitando histórico do chat para sala:", roomId);
			socketManager.emit("requestChatHistory", { roomId });
		},

		userTyping: (typingData: any) => {
			socketManager.emit("userTyping", typingData);
		},

		stopTyping: (typingData: any) => {
			socketManager.emit("stopTyping", typingData);
		},

		disconnect: () => {
			socketManager.disconnect();
			set({ socket: null, connected: false, roomId: null, userId: null });
		},
	};
});