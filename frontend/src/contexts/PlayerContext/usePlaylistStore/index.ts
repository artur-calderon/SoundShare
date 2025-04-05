import {create} from 'zustand';
import {usePlayerStore} from "../usePlayerStore";

import {useSocketStore} from "../useSocketStore";
import {userContext} from "../../UserContext.tsx";
import {useRoomStore} from "../useRoomStore";


interface User {
	id: string,
	accessToken: string,
	name: string,
	email: string,
	image:string,
	role:string
}

interface Track {
	title: string;
	description: string;
	url: string;
	thumbnail: string;
	user:User
}

interface PlaylistState {
	playlist: Track[];
	currentIndex: number;
	addTrack: (roomId: string, track: Track) => void;
	removeTrack: (trackUrl: string) => void;
	clearPlaylist: () => void;
	setCurrentIndex: (index: number) => void;
	nextSong: () => void;
	beforeSong: () => void;

}

export const usePlaylistStore = create<PlaylistState>((set, get) => {

	return{
		playlist: [],
		currentIndex: 0,
		addTrack: (track, roomId) => {
			const {roomState} = useRoomStore.getState()
			const {user} = userContext.getState()
			const {socket} = useSocketStore.getState()
			const trackMusic = {
				title: track.title,
				description: track.description,
				url: track.url,
				thumbnail: track.thumbnail,
				user: user
			}
			const isAlreadyInPlaylist = roomState?.playlist.some(music => music.url === trackMusic.url)

			if(!isAlreadyInPlaylist){
			socket?.emit('addTrack', {roomId, track: trackMusic})
			// set((state) => ({ playlist: [...state.playlist, trackMusic] }))
			}else {return}

		},

		removeTrack: (trackUrl: string) => {
			const { roomSpecs } = useRoomStore.getState();
			const { socket } = useSocketStore.getState();

			if (!roomSpecs?.id || !socket) return;

			socket.emit("removeTrack", {
				roomId: roomSpecs.id,
				trackUrl: trackUrl,
			});
		},

		nextSong: () => {
			const {roomSpecs} = useRoomStore.getState()
			const {socket} = useSocketStore.getState()
			const { roomState } = useRoomStore.getState();
			const { currentTrack, played, playMusic } = usePlayerStore.getState();

			if (roomState?.playlist.length === 0) {
				console.log("Playlist is empty");
				usePlayerStore.getState().setPlay();
				return;
			}


			const currentIndex = roomState?.playlist.findIndex((track) => track.url === roomState.currentTrack?.url);
			const finishedPlayed = played * 100;
			if (currentIndex !== -1 && (finishedPlayed >= 99 || currentIndex < roomState.playlist.length - 1)) {
				// @ts-ignore
				const nextTrack = roomState?.playlist[currentIndex + 1];
				// Atualiza a música apenas se houver próxima
				if (nextTrack) {
					playMusic(roomSpecs.id, nextTrack);

					// Envia a nova música para os outros usuários
					socket?.emit("syncNextSong", { roomId: roomSpecs.id,track: nextTrack });
				}
			} else {
				console.log("End of playlist");
				usePlayerStore.getState().setPlay();
			}
		},

		beforeSong: () => {
			const {roomSpecs, roomState} = useRoomStore.getState()
			const {socket} = useSocketStore.getState()
			const {  playMusic, setPlay } = usePlayerStore.getState();

			if (roomState?.playlist.length === 0) {
				console.log("Playlist vazia");
				setPlay();
				return;
			}


			const currentIndex = roomState?.playlist.findIndex((music) => music.url === roomState.currentTrack?.url);

			if (currentIndex > 0) {
				const previousTrack = roomState?.playlist[currentIndex - 1];
				playMusic(roomSpecs.id, previousTrack);

				// Envia a atualização para os outros usuários
				socket?.emit("syncBeforeSong", { roomId:roomSpecs.id,  track: previousTrack });
			} else {
				console.log("Primeira música da playlist");
			}
		},



		clearPlaylist: () => set({ playlist: [], currentIndex: 0 }),


		setCurrentIndex: (index) => set({ currentIndex: index }),
	}

})
