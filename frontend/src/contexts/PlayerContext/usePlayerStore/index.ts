import {create} from 'zustand';
import {talkToApi} from "../../../utils/talkToApi";

import {usePlaylistStore} from "../usePlaylistStore";
import {userContext} from "../../UserContext.tsx";
import {useSocketStore} from "../useSocketStore";

interface User {
	id: string,
	accessToken: string,
	name: string,
	email: string,
	image:string,
	role:string
}

interface Track {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
	user: User
}

interface VideoResult {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
}

interface PlayerState {
	loading: boolean
	isPlaying: boolean;
	play:boolean;
	played: number;
	duration: number;
	searchResults:VideoResult[],
	currentTrack: Track;
	volume: number;
	mute: boolean;
	seekTime: number;
	setTrack: (track: string | null) => void;
	setVolume: (volume: number) => void;
	setMute: () => void;
	setSeekTime: (time: number) => void;
	setPlay: () => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setPlayed: (played: number) => void;
	setDuration: (duration: number) => void;
	searchMusic: (text:string, user:User) => void;
	playMusic: (roomId: string, track:Track) => void;
}

export const usePlayerStore = create<PlayerState>((set) => {
	return{
		isPlaying: false,
		play:false,
		loading:false,
		searchResults:[],
		currentTrack: '',
		volume:0.8,
		mute: false,
		seekTime: 0,
		setPlay: () => set((state) => ({ play: !state.play })),
		setIsPlaying: (isPlaying) => set({ isPlaying }),
		setVolume: (volume) => set({ volume }),
		setMute: () => {
			set((state) => ({ mute: !state.mute }));
		},
		setSeekTime: (time) => set({ seekTime: time }),
		setPlayed: (played) => set({ played }),

		setDuration: (duration) => set({ duration }),

		searchMusic: async (text,user)=>{
			set({loading:true})
			try{
				if(text === undefined)return
				const res = await talkToApi("get","video?search=",text,user.accessToken);
				set({searchResults:res?.data})
			}catch(e){
				console.log(e)
			}finally {
				set({loading:false})
			}
		},

		playMusic: (roomId , track)=>{
			const {addTrack} = usePlaylistStore.getState()
			const {user} = userContext.getState()
			const {socket} = useSocketStore.getState()

			const trackMusic = {
				id: track.id,
				title: track.title,
				description: track.description,
				thumbnail: track.thumbnail,
				url: track.url,
				user: user
			}

			addTrack(roomId,trackMusic)

			socket?.emit('playTrack', {roomId, track: trackMusic, userId: user.id});
		}

	}
})