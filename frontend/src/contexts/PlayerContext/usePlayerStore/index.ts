import { create } from "zustand";
import { talkToApi } from "../../../utils/talkToApi";

import { usePlaylistStore } from "../usePlaylistStore";
import { userContext } from "../../UserContext.tsx";
import { useSocketStore } from "../useSocketStore";
import { useRoomStore } from "../useRoomStore";

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

interface VideoResult {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	url: string;
}

interface PlayerState {
	loading: boolean;
	isPlaying: boolean;
	play: boolean;
	played: number;
	duration: number;
	searchResults: VideoResult[];
	currentTrack: Track | null;
	volume: number;
	mute: boolean;
	seekTime: number;
	setTrack: (track: Track | null) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setSeekTime: (time: number) => void;
	togglePlay: () => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setPlayed: (played: number) => void;
	setDuration: (duration: number) => void;
	searchMusic: (text: string, user: User) => void;
	playMusic: (roomId: string, track: Track) => void;
}

export const usePlayerStore = create<PlayerState>((set,get) => {
	return{
		isPlaying: false,
		play: false,
		loading: false,
		searchResults: [],
		currentTrack: null,
		volume: 0.8,
		mute: false,
		seekTime: 0,

		togglePlay: () => {
			const { play } = get();
			const { syncRoom } = useRoomStore.getState();

			syncRoom();
			set({ play: !play });
		},

		setTrack: (track) => set({ currentTrack: track }),
		setIsPlaying: (isPlaying) => set({ isPlaying }),
		setVolume: (volume) => set({ volume }),

		toggleMute: () => {
			set((state) => ({ mute: !state.mute }));
		},

		setSeekTime: (time) => set({ seekTime: time }),
		setPlayed: (played) => set({ played }),

		setDuration: (duration) => set({ duration }),

		searchMusic: async (text, user) => {
			set({ loading: true });
			try {
				if (!text) return;
				const res = await talkToApi("get", "video?search=", text, user.accessToken);
				set({ searchResults: res.data });
			} catch (e) {
				console.log(e);
			} finally {
				set({ loading: false });
			}
		},

		playMusic: (roomId, track) => {
			const { addTrack } = usePlaylistStore.getState();
			const { user } = userContext.getState();
			const { socket } = useSocketStore.getState();
			const { currentTrack, isPlaying } = get();

			// Verifica se a música já está tocando
			if (currentTrack && currentTrack.id === track.id && isPlaying) {
				return;
			}

			const trackMusic = {
				id: track.id,
				title: track.title,
				description: track.description,
				thumbnail: track.thumbnail,
				url: track.url,
				user: user,
			};

			addTrack(roomId, trackMusic);
			socket?.emit("playTrack", { roomId, track: trackMusic, userId: user.id });

			set({ currentTrack: trackMusic, isPlaying: true });
		},
	}
})