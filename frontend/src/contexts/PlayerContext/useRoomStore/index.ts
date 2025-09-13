import { create } from "zustand";
import { talkToApi } from "../../../utils/talkToApi";
import { db } from "../../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { userContext } from "../../UserContext.tsx";

interface RoomSpecs {
	id?: string;
	name?: string;
	online?: boolean;
	owner?: string;
	moderators?: string[];
	[key: string]: any;
}

interface User {
	id: string;
	accessToken: string;
	name: string;
	email: string;
	image: string;
	role: string;
}

interface Track {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	user: User;
}

interface RoomUser {
	id: string;
	name: string;
	email: string;
	image: string;
	role: string;
	socketId: string;
	joinedAt: Date;
	// ✅ NOVA IMPLEMENTAÇÃO: Status de atividade
	isActive?: boolean;
	lastActivity?: Date;
	canBeSyncSource?: boolean;
}

interface RoomState {
	roomId: string;
	online: boolean;
	listeners: number;
	playlist: Track[];
	playing: boolean;
	currentTrack?: Track;
	currentTime: number;
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

interface RoomStore {
	user: User;
	roomOnline: boolean;
	isHost: boolean;
	isModerator: boolean;
	canModerate: boolean;
	roomSpecs: RoomSpecs;
	roomState: RoomState | null;
	
	// Setters
	setRoomState: (newState: RoomState) => void;
	setPlaying: (playing: boolean) => void;
	setCurrentTime: (time: number) => void;
	setRoomOnline: (online: boolean) => void;
	setIsHost: () => void;
	setIsModerator: () => void;
	setCanModerate: () => void;
	
	// Contadores e usuários
	updateListeners: (count: number) => void;
	updateModerators: (moderators: string[]) => void;
	
	// Status da sala
	setRoomOffline: () => void;
	changeRoomOffline: (status: boolean, id: string) => Promise<void>;
	changeRoomOnOffline: (status: boolean, id: string) => Promise<void>;
	
	// Informações da sala
	getInfoRoom: (id: string | undefined, user: User) => Promise<void>;
	
	// Sincronização
	seekTo: (time: number) => void;
	
	// Limpeza de estado
	clearRoomState: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => {
	return {
		user: {} as User,
		roomOnline: false,
		roomState: null,
		isHost: false,
		isModerator: false,
		canModerate: false,
		roomSpecs: {},

		setRoomState: (newState) => {
			// ✅ CORREÇÃO: Evitar chamadas em cascata que causam ciclo infinito
			const currentState = get();
			const currentRoomState = currentState.roomState;
			
			// Só atualiza se realmente mudou
			const hasChanged = !currentRoomState || 
				JSON.stringify(currentRoomState) !== JSON.stringify(newState);
			
			if (hasChanged) {
				set({ roomState: newState });

				// ✅ CORREÇÃO: Usar setTimeout para evitar chamadas síncronas em cascata
				setTimeout(() => {
					// Atualiza dinamicamente quem é o host e moderador
					get().setIsHost();
					get().setIsModerator();
					get().setCanModerate();
				}, 0);
			}
		},

		setIsHost: () => {
			const { roomState } = get();
			const { user } = userContext.getState();
			if (user.id && roomState) {
				// ✅ CORREÇÃO: Host é quem está na syncSource, não necessariamente o owner
				const isHost = roomState.syncSource?.userId === user.id;
				console.log(`🔍 Verificando se é host: user.id=${user.id}, syncSource.userId=${roomState.syncSource?.userId}, isHost=${isHost}`);
				set({ isHost });
			}
		},

		setIsModerator: () => {
			const { roomState } = get();
			const { user } = userContext.getState();
			if (user.id && roomState && roomState.moderators) {
				const isModerator = roomState.moderators.includes(user.id);
				console.log(`🔍 Verificando se é moderador: user.id=${user.id}, moderators=${roomState.moderators}, isModerator=${isModerator}`);
				set({ isModerator });
			}
		},

		setCanModerate: () => {
			const { roomState } = get();
			const { user } = userContext.getState();
			if (user.id && roomState) {
				// ✅ CORREÇÃO: canModerate é baseado em owner ou moderador, não em host
				const isOwner = roomState.owner === user.id;
				const isModerator = roomState.moderators?.includes(user.id) || false;
				const canModerate = isOwner || isModerator;
				console.log(`🔍 Verificando canModerate: isOwner=${isOwner}, isModerator=${isModerator}, canModerate=${canModerate}`);
				set({ canModerate });
			}
		},

		setPlaying: (playing) => {
			const { roomState } = get();
			if (roomState) {
				set({ roomState: { ...roomState, playing } });
			}
		},

		setCurrentTime: (time) => {
			const { roomState } = get();
			if (roomState) {
				set({ roomState: { ...roomState, currentTime: time } });
			}
		},

		setRoomOnline: (online) => {
			set({ roomOnline: online });
		},

		updateListeners: (count) => {
			const { roomState } = get();
			if (roomState) {
				set({ roomState: { ...roomState, listeners: count } });
			}
		},

		updateModerators: (moderators) => {
			const { roomSpecs } = get();
			set({ roomSpecs: { ...roomSpecs, moderators } });
			get().setIsModerator();
			get().setCanModerate();
		},

		setRoomOffline: () => {
			set({ roomOnline: false, roomState: null });
			
			// Redirecionar para /app após um pequeno delay
			setTimeout(() => {
				window.location.href = "/app";
			}, 100);
		},

		seekTo: (time) => {
			const { roomState } = get();
			if (roomState) {
				set({ roomState: { ...roomState, currentTime: time } });
			}
		},

		changeRoomOnOffline: async (status, id) => {
			try {
				const roomRef = doc(db, "rooms", id);
				await updateDoc(roomRef, { online: status });
				const { user } = userContext.getState();
				if (user.id) {
					get().getInfoRoom(id, user);
				}
			} catch (e) {
				console.log(e);
			}
		},

		changeRoomOffline: async (status, id) => {
			try {
				const roomRef = doc(db, "rooms", id);
				await updateDoc(roomRef, { online: status });
				const { user } = userContext.getState();
				if (user.id) {
					get().getInfoRoom(id, user);
				}
			} catch (e) {
				console.log(e);
			}
		},

		getInfoRoom: async (id, user) => {
			try {
				console.log("🔍 getInfoRoom Debug - id:", id, "user:", user);
				const res = await talkToApi("get", "room", id, user.accessToken);
				if (res?.data) {
					console.log("🔍 getInfoRoom Debug - roomData da API:", res.data);
					set({ roomSpecs: res.data, user });
				}

				// Define se o usuário é o host baseado nos dados da API
				get().setIsHost();
				get().setIsModerator();
				get().setCanModerate();
			} catch (e: any) {
				if (e.status === 404) {
					alert("Essa Sala não existe");
					window.location.href = "/app";
				}
			}
		},

		// ✅ NOVO: Limpar estado da sala
		clearRoomState: () => {
			console.log("🧹 Limpando estado da sala");
			set({
				roomOnline: false,
				roomState: null,
				isHost: false,
				isModerator: false,
				canModerate: false,
				roomSpecs: {}
			});
		},
	};
});