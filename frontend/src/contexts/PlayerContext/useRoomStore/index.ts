import { create } from "zustand";
import { talkToApi } from "../../../utils/talkToApi";
import { db } from "../../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { userContext } from "../../UserContext.tsx";
import { usePlayerStore } from "../usePlayerStore";
import { usePlaylistStore } from "../usePlaylistStore";

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
	currentTime: number;
	roomSpecs: RoomSpecs;
	roomState: RoomState | null;
	socket?: any;
	
	// Setters
	setSocket: (socket: any) => void;
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
}

export const useRoomStore = create<RoomStore>((set, get) => {
	return {
		user: {} as User,
		roomOnline: false,
		roomState: null,
		currentTime: 0,
		isHost: false,
		isModerator: false,
		canModerate: false,
		roomSpecs: {},
		socket: undefined,

		setSocket: (socket) => set({ socket }),

		setRoomState: (newState) => {
			set({ roomState: newState });

			// Atualiza dinamicamente quem é o host e moderador
			get().setIsHost();
			get().setIsModerator();
			get().setCanModerate();
		},

		setIsHost: () => {
			const { roomSpecs, user } = get();
			if (user.id) {
				const isHost = roomSpecs.owner === user.id;
				set({ isHost });
			}
		},

		setIsModerator: () => {
			const { roomSpecs, user } = get();
			if (user.id && roomSpecs.moderators) {
				const isModerator = roomSpecs.moderators.includes(user.id);
				set({ isModerator });
			}
		},

		setCanModerate: () => {
			const { isHost, isModerator } = get();
			set({ canModerate: isHost || isModerator });
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
			set({ currentTime: time });
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
			set({ roomOnline: false });
			// TODO: Redirecionar usuários para fora da sala
		},

		seekTo: (time) => {
			const { roomState } = get();
			if (roomState) {
				set({ roomState: { ...roomState, currentTime: time } });
			}
			set({ currentTime: time });
		},

		changeRoomOnOffline: async (status, id) => {
			try {
				const roomRef = doc(db, "rooms", id);
				await updateDoc(roomRef, { online: status });
				const { user } = get();
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
				const { user } = get();
				if (user.id) {
					get().getInfoRoom(id, user);
				}
			} catch (e) {
				console.log(e);
			}
		},

		getInfoRoom: async (id, user) => {
			try {
				const res = await talkToApi("get", "room", id, user.accessToken);
				if (res?.data) {
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
	};
});