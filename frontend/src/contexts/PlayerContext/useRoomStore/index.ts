import {create} from 'zustand';
import {talkToApi} from "../../../utils/talkToApi";

import {db} from "../../../services/firebase";
import {doc, updateDoc} from "firebase/firestore";

interface RoomSpecs {
	id?:string;
	name?:string;
	online?:boolean;
	owner?:string;
	[key: string]: any;

}

interface User {
	id: string,
	accessToken: string,
	name: string,
	email: string,
	image:string,
	role:string
}

interface Track{
	id:string;
	title:string;
	description:string;
	thumbnail:string;
	url:string;
	user: User;
}

interface RoomState {
	roomId: string;
	online: boolean;
	listeners: number;
	playlist: Track[];
	playing: boolean;
	currentTrack?: Track;
	played?: number;
}

interface RoomStore{
	user: User;
	roomOnline: boolean;
	isHost: boolean;
	roomSpecs: RoomSpecs;
	roomState: RoomState | null;
	socket?: any;
	setSocket: (socket: any) => void;
	changeRoomOffline: (status: boolean, id: string) => Promise<void>;
	getInfoRoom: (id: string | undefined, user:User) => Promise<void>;
	setRoomState:(newState: RoomState) => void;
	setPlaying:(playing: boolean) => void;
	seekTo:(time: number) => void;
	setIsHost: (isHost: boolean) => void;
	changeRoomOnOffline: (status: boolean, id:string) => Promise<void>;
}

export const useRoomStore = create<RoomStore>((set,get) => {
	return {
		roomOnline: false,
		roomState:null,
		isPlaying: false,
		isHost: false,
		roomSpecs: {},
		socket: undefined,
		setIsHost: (isHost) => set({isHost}),
		setSocket: (socket) => set({socket}),
		setRoomState: (newState) => set({roomState: newState}),
		setPlaying: (playing) => set({isPlaying: playing}),



		seekTo: (time) =>{
			const {roomState} = get()
			if(roomState){
				set({roomState: {...roomState, played: time}})
			}
		},



		changeRoomOnOffline: async (status, id) => {
			try{
				const roomRef = doc(db, "rooms", id);
				await updateDoc(roomRef, {
					online: status
				})
				get().getInfoRoom(id, get().user)
			}catch (e){
				console.log(e)
			}

		},

		getInfoRoom: async (id, user) => {
			try {
				const res = await talkToApi("get", "room",id, user.accessToken);
				set({ roomSpecs: res.data });
			} catch (e: any) {
				if (e.status === 404) {
					alert("Essa Sala não existe");
					window.location.href = "/app";
				}
			}
		},
	}

})