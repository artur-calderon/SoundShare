import { create } from "zustand";
import { talkToApi } from "../../../utils/talkToApi";

import { usePlaylistStore } from "../usePlaylistStore";
import { userContext } from "../../UserContext.tsx";
import { useSocketStore } from "../useSocketStore";
import { useRoomStore } from "../useRoomStore";
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
	
	// Setters
	setTrack: (track: Track | null) => void;
	setVolume: (volume: number) => void;
	toggleMute: () => void;
	setSeekTime: (time: number) => void;
	togglePlay: () => void;
	setIsPlaying: (isPlaying: boolean) => void;
	setPlayed: (played: number) => void;
	setDuration: (duration: number) => void;
	
	// Funcionalidades
	searchMusic: (text: string, user: User) => void;
	playMusic: (roomId: string, track: Track) => void;
	
	// Controles de reprodução
	playPause: (playing: boolean) => void;
	nextTrack: () => void;
	previousTrack: () => void;
	jumpToTrack: (trackIndex: number) => void;
	syncTime: (currentTime: number) => void;
	
	// Sincronização
	seekTo: (time: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => {
	return {
		isPlaying: false,
		play: false,
		loading: false,
		searchResults: [],
		currentTrack: null,
		volume: 0.8,
		mute: false,
		seekTime: 0,

		togglePlay: () => {
			const { isPlaying } = get();
			const { playPause } = useSocketStore.getState();
			const { canModerate } = useRoomStore.getState();
			
			// Só permite controlar se for dono ou moderador
			if (canModerate) {
				playPause(!isPlaying);
			}
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

			playMusic: (roomId, track) => {
		console.log("🎵 playMusic chamado:", { roomId, track: track.title });
		
		const { addTrack } = usePlaylistStore.getState();
		const { user } = userContext.getState();
		const { addTrack: socketAddTrack, playTrack } = useSocketStore.getState();

		// ✅ CORREÇÃO: Verifica se a música já está tocando no player atual
		const { currentTrack, isPlaying } = get();
		const { roomState } = useRoomStore.getState();
		
		console.log("🔍 Estado atual:", { 
			currentTrack: currentTrack?.title || 'null', 
			isPlaying, 
			roomCurrentTrack: roomState?.currentTrack?.title || 'null',
			roomPlaying: roomState?.playing
		});

		// ✅ CORREÇÃO: Só bloqueia se for exatamente a mesma música E estiver tocando
		const isSameTrack = currentTrack && (
			currentTrack.id === track.id || 
			currentTrack.url === track.url
		);
		
		if (isSameTrack && isPlaying) {
			console.log("⚠️ Música já está tocando no player:", track.title);
			return;
		}

		// ✅ CORREÇÃO: Se não há música no player OU é uma música diferente, permite tocar
		console.log("✅ Permitindo tocar música:", track.title);

		const trackMusic = {
			id: track.id,
			title: track.title,
			description: track.description,
			thumbnail: track.thumbnail,
			url: track.url,
			user: user,
		};

		console.log("🎯 Tocando música via socket:", trackMusic.title);

		// ✅ CORREÇÃO: Primeiro adiciona à playlist via socket
		socketAddTrack(trackMusic);
		
		// ✅ CORREÇÃO: Depois toca a música via socket
		// O socket vai emitir "trackChanged" que atualizará o estado para todos
		playTrack(trackMusic);

		// ✅ CORREÇÃO: NÃO atualiza localmente - deixa o socket sincronizar
		// O evento "trackChanged" vai atualizar o estado para todos os usuários
	},

		playPause: (playing: boolean) => {
			console.log("🎮 playPause chamado:", { playing });
			
			const { playPause } = useSocketStore.getState();
			const { roomState } = useRoomStore.getState();
			
			// ✅ CORREÇÃO: Só permite controlar se for moderador
			if (!roomState?.canModerate) {
				console.log("❌ Sem permissão para controlar reprodução");
				return;
			}
			
			console.log("✅ Permissão concedida, enviando para socket...");
			
			// Envia para o socket
			playPause(playing);
			
			// ✅ CORREÇÃO: Atualiza estado local imediatamente para feedback visual
			set({ isPlaying: playing });
			
			console.log("📡 Play/Pause enviado para socket");
		},

		nextTrack: () => {
			const { nextTrack } = useSocketStore.getState();
			nextTrack();
		},

		previousTrack: () => {
			const { previousTrack } = useSocketStore.getState();
			previousTrack();
		},

		jumpToTrack: (trackIndex: number) => {
			const { jumpToTrack } = useSocketStore.getState();
			jumpToTrack(trackIndex);
		},

		syncTime: (currentTime: number) => {
			const { syncTrack } = useSocketStore.getState();
			syncTrack(currentTime);
		},

		seekTo: (time: number) => {
			set({ seekTime: time });
			// Sincroniza o tempo com outros usuários se for moderador
			const { canModerate } = useRoomStore.getState();
			if (canModerate) {
				get().syncTime(time);
			}
		},
	};
});