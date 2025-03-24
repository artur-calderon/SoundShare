import {create} from 'zustand';
import {usePlayerStore} from "../usePlayerStore";

import {useSocketStore} from "../useSocketStore";
import {userContext} from "../../UserContext.tsx";


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
	removeTrack: (id: string) => void;
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
			const {playlist} = get()
			const {user} = userContext.getState()
			const {socket} = useSocketStore.getState()
			const trackMusic = {
				title: track.title,
				description: track.description,
				url: track.url,
				thumbnail: track.thumbnail,
				user: user
			}
			const isAlreadyInPlaylist = playlist.some(music => music.url === trackMusic.url)

			if(!isAlreadyInPlaylist){
			socket?.emit('addTrack', {roomId, track: trackMusic})
			// set((state) => ({ playlist: [...state.playlist, trackMusic] }))
			}else {return}

		},

		nextSong: () =>{
			const {playlist} = get()
			const {currentTrack, played, playMusic}= usePlayerStore.getState()

			if(playlist.length === 0){
				console.log('Playlist is empty')
				usePlayerStore.getState().setPlay()
				return
			}

			const currentIndex = playlist.findIndex(track => track.url === currentTrack.url)
			const finishedPlayed = played * 100;

			if(currentIndex !== -1 && (finishedPlayed>= 99 || currentIndex < playlist.length - 1)){
				playMusic(playlist[currentIndex + 1], playlist[currentIndex + 1].user)
			}else {
				console.log('End of playlist')
				usePlayerStore.getState().setPlay()
			}


		},

		beforeSong: () =>{
			const { playlist } = get();
			const { currentTrack, playMusic, setPlay } = usePlayerStore.getState();

			if (playlist.length === 0) {
				console.log("Playlist vazia");
				setPlay();
				return;
			}

			// Encontra o índice da música atual
			const currentIndex = playlist.findIndex(music => music.url === currentTrack?.url);

			// Se houver uma música anterior, toca ela
			if (currentIndex > 0) {
				playMusic(playlist[currentIndex - 1], playlist[currentIndex - 1].user);
			} else {
				console.log("Primeira música da playlist");
			}

		},

		removeTrack: (url) => set((state) => ({
			playlist: state.playlist.filter(track => track.url !== url)
		})),



		clearPlaylist: () => set({ playlist: [], currentIndex: 0 }),


		setCurrentIndex: (index) => set({ currentIndex: index }),
	}

})
