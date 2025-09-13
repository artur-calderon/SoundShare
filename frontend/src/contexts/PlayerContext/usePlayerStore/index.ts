import { create } from "zustand";
import { api } from "../../../lib/axios.ts";

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
	duration?: number; // ✅ NOVO: Duração da música em segundos
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
	// Estado de reprodução
	isPlaying: boolean;
	played: number;
	duration: number;
	currentTrack: Track | null;
	volume: number;
	mute: boolean;
	seekTime: number;
	
	// Estado de busca
	loading: boolean;
	searchResults: VideoResult[];
	
	// Setters básicos
	setTrack: (track: Track | null) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setSeekTime: (time: number) => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setPlayed: (played: number) => void;
	setDuration: (duration: number) => void;
	
	// Funcionalidades de busca
	searchMusic: (text: string, user: User) => void;
	
	// Limpeza de estado
	clearPlayerState: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
	return {
		// Estado inicial
		isPlaying: false,
		played: 0,
		duration: 0,
		currentTrack: null,
		volume: 0.8,
		mute: false,
		seekTime: 0,
		loading: false,
		searchResults: [],

		// Setters básicos
		setTrack: (track) => {
			set({ currentTrack: track });
			// Preservar duração se disponível
			if (track?.duration && track.duration > 0) {
				set({ duration: track.duration });
			}
		},
		
		setIsPlaying: (isPlaying) => {
			set({ isPlaying });
		},
		
		setVolume: (volume) => set({ volume }),
		toggleMute: () => set((state) => ({ mute: !state.mute })),
		setSeekTime: (time) => set({ seekTime: time }),
		setPlayed: (played) => {
			set({ played });
		},
		
		setDuration: (duration) => {
			// ✅ CORREÇÃO: Preservar duração existente se a nova for 0 ou inválida
			const currentState = get();
			if (duration > 0) {
				set({ duration });
			} else if (currentState.duration > 0) {
				// Manter duração existente se a nova for inválida
				console.log(`ℹ️ Preservando duração existente: ${currentState.duration}s (nova: ${duration}s)`);
			} else {
				set({ duration });
			}
		},

		// Funcionalidades de busca
		searchMusic: async (text, user) => {
			console.log("Searching for:", text);
			set({ loading: true });
			try {
				if (!text) return;
				const res = await api.get(`video?search=${text}`, {
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.accessToken}`,
					},
				});
				set({ searchResults: res?.data });
			} catch (e) {
				console.log(e);
			} finally {
				set({ loading: false });
			}
		},

		// ✅ NOVO: Limpar estado do player
		clearPlayerState: () => {
			console.log("🧹 Limpando estado do player");
			set({
				isPlaying: false,
				played: 0,
				duration: 0,
				currentTrack: null,
				seekTime: 0,
				loading: false,
				searchResults: []
			});
		},

	};
});