import { create } from "zustand";

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
	duration?: number;
	user: User;
}

interface PlaylistState {
	// Estado da playlist
	tracks: Track[];
	currentIndex: number;
	
	// Setters básicos
	setTracks: (tracks: Track[]) => void;
	setCurrentIndex: (index: number) => void;
	addTrack: (track: Track) => void;
	removeTrack: (trackId: string) => void;
	clearPlaylist: () => void;
	
	// Navegação
	nextTrack: () => Track | null;
	previousTrack: () => Track | null;
	jumpToTrack: (index: number) => Track | null;
	
	// Utilitários
	getCurrentTrack: () => Track | null;
	getTrackByIndex: (index: number) => Track | null;
	getTrackById: (id: string) => Track | null;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
	// Estado inicial
	tracks: [],
	currentIndex: 0,

	// Setters básicos
	setTracks: (tracks) => {
		// ✅ CORREÇÃO: Verificar se realmente mudou antes de atualizar
		const currentTracks = get().tracks;
		const hasChanged = JSON.stringify(currentTracks) !== JSON.stringify(tracks);
		
		if (hasChanged) {
			console.log("🔄 PlaylistStore: setTracks chamado com:", tracks);
			set({ tracks });
		} else {
			console.log("ℹ️ PlaylistStore: setTracks ignorado - tracks não mudaram");
		}
	},

	setCurrentIndex: (index) => {
		const { tracks } = get();
		if (index >= 0 && index < tracks.length) {
			set({ currentIndex: index });
		}
	},

	addTrack: (track) => {
		const { tracks } = get();
		// Verificar se a música já existe
		const exists = tracks.some(t => t.id === track.id);
		if (!exists) {
			const newTracks = [...tracks, track];
			set({ tracks: newTracks });
		}
	},

	removeTrack: (trackId) => {
		const { tracks, currentIndex } = get();
		const trackIndex = tracks.findIndex(t => t.id === trackId);
		
		if (trackIndex !== -1) {
			const newTracks = tracks.filter(t => t.id !== trackId);
			let newCurrentIndex = currentIndex;
			
			// Ajustar índice atual se necessário
			if (trackIndex < currentIndex) {
				newCurrentIndex = currentIndex - 1;
			} else if (trackIndex === currentIndex && newTracks.length > 0) {
				// Se removemos a música atual, ir para a próxima ou anterior
				newCurrentIndex = Math.min(currentIndex, newTracks.length - 1);
			} else if (newTracks.length === 0) {
				newCurrentIndex = 0;
			}
			
			set({ 
				tracks: newTracks, 
				currentIndex: newCurrentIndex 
			});
		}
	},

	clearPlaylist: () => {
		set({ tracks: [], currentIndex: 0 });
	},

	// Navegação
	nextTrack: () => {
		const { tracks, currentIndex } = get();
		if (tracks.length === 0) return null;
		
		const nextIndex = (currentIndex + 1) % tracks.length;
		const nextTrack = tracks[nextIndex];
		
		set({ currentIndex: nextIndex });
		
		return nextTrack;
	},

	previousTrack: () => {
		const { tracks, currentIndex } = get();
		if (tracks.length === 0) return null;
		
		const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
		const prevTrack = tracks[prevIndex];
		
		set({ currentIndex: prevIndex });
		
		return prevTrack;
	},

	jumpToTrack: (index) => {
		const { tracks } = get();
		if (index >= 0 && index < tracks.length) {
			const track = tracks[index];
			set({ currentIndex: index });
			return track;
		}
		return null;
	},

	// Utilitários
	getCurrentTrack: () => {
		const { tracks, currentIndex } = get();
		return tracks[currentIndex] || null;
	},

	getTrackByIndex: (index) => {
		const { tracks } = get();
		return tracks[index] || null;
	},

	getTrackById: (id) => {
		const { tracks } = get();
		return tracks.find(t => t.id === id) || null;
	},
}));
