import { create } from "zustand";
import { talkToApi } from "../../../utils/talkToApi";
import { db } from "../../../services/firebase";
import { doc, updateDoc } from "firebase/firestore";
import {userContext} from "../../UserContext.tsx";

interface RoomSpecs {
	id?: string;
	name?: string;
	online?: boolean;
	owner?: string;
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

interface RoomState {
	roomId: string;
	online: boolean;
	listeners: string[];
	playlist: Track[];
	playing: boolean;
	currentTrack?: Track;
	played?: number;
	owner: string;
}

interface RoomStore {
	user: User;
	roomOnline: boolean;
	isHost: boolean;
	played: number;
	roomSpecs: RoomSpecs;
	roomState: RoomState | null;
	socket?: any;
	setSocket: (socket: any) => void;
	changeRoomOffline: (status: boolean, id: string) => Promise<void>;
	getInfoRoom: (id: string | undefined, user: User) => Promise<void>;
	setRoomState: (newState: RoomState) => void;
	setPlaying: (playing: boolean) => void;
	setPlayed: (played: number) => void;
	seekTo: (time: number) => void;
	setIsHost: () => void;
	changeRoomOnOffline: (status: boolean, id: string) => Promise<void>;
	syncRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set,get) => {
	return {
		roomOnline: false,
		roomState: null,
		played: 0,
		isHost: false,
		roomSpecs: {},
		socket: undefined,

		setSocket: (socket) => set({socket}),

		setRoomState: (newState) => {
			set({roomState: newState});

			// Atualiza dinamicamente quem é o host
			get().setIsHost();
		},

		setIsHost: () => {
			const {roomSpecs, roomState} = get();
			const {user} = userContext.getState();
			if (roomState) {
				set({isHost: roomSpecs.owner === user.id});
			}
		},

		setPlaying: (playing) => {
			const {roomState} = get();
			if (roomState) {
				set({roomState: {...roomState, playing}});
			}
		},

		seekTo: (time) => {
			const {roomState} = get();
			if (roomState) {
				set({roomState: {...roomState, played: time}});
			}
		},

		setPlayed: (played) => {
			set({played});
		},

		syncRoom: () => {
			const {socket, isHost, setPlayed, seekTo} = get();

			socket?.on("updateRoom", (roomState) => {
				const {playMusic, currentTrack, setPlaying} = usePlayerStore.getState();

				// Atualiza o estado da sala
				get().setRoomState(roomState);

				// Se a música mudou, toca a nova música
				if (roomState.currentTrack && (!currentTrack || currentTrack.url !== roomState.currentTrack.url)) {
					playMusic(roomState.currentTrack, roomState.currentTrack.user);
				}

				// Se não for o host e a música estiver tocando, sincroniza o progresso
				if (!isHost && roomState.playing) {
					seekTo(roomState.played);
				}

				// Atualiza se a música está tocando ou não
				setPlaying(roomState.playing);
			});

			socket?.on("updatePlayed", ({played}) => {
				if (!isHost) {
					setPlayed(played);
					seekTo(played);
				}
			});
		},

		changeRoomOnOffline: async (status, id) => {
			try {
				const roomRef = doc(db, "rooms", id);
				await updateDoc(roomRef, {online: status});
				get().getInfoRoom(id, get().user);
			} catch (e) {
				console.log(e);
			}
		},

		getInfoRoom: async (id, user) => {
			try {
				const res = await talkToApi("get", "room", id, user.accessToken);
				set({roomSpecs: res.data});

				// Define se o usuário é o host baseado nos dados da API
				get().setIsHost();
			} catch (e: any) {
				if (e.status === 404) {
					alert("Essa Sala não existe");
					window.location.href = "/app";
				}
			}
		},
	}
})