import { create } from 'zustand';
import { usePlayerStore } from "../usePlayerStore";
import { useSocketStore } from "../useSocketStore";
import { userContext } from "../../UserContext.tsx";
import { useRoomStore } from "../useRoomStore";

interface User {
	id: string,
	accessToken: string,
	name: string,
	email: string,
	image: string,
	role: string
}

interface Track {
	id: string;
	title: string;
	description: string;
	url: string;
	thumbnail: string;
	user: User;
}

interface PlaylistState {
	playlist: Track[];
	currentIndex: number;
	
	// Setters
	setPlaylist: (playlist: Track[]) => void;
	setCurrentIndex: (index: number) => void;
	
	// Controles de playlist
	addTrack: (roomId: string, track: Track) => void;
	removeTrack: (trackId: string) => void;
	clearPlaylist: () => void;
	
	// Navegação
	nextSong: () => void;
	beforeSong: () => void;
	jumpToTrack: (trackIndex: number) => void;
}

export const usePlaylistStore = create<PlaylistState>((set, get) => {
	return {
		playlist: [],
		currentIndex: 0,

		setPlaylist: (playlist) => set({ playlist }),
		setCurrentIndex: (index) => set({ currentIndex: index }),

			addTrack: (roomId, track) => {
		console.log("🎯 addTrack chamado:", { roomId, track });
		
		const { roomState } = useRoomStore.getState();
		const { user } = userContext.getState();
		const { addTrack: socketAddTrack } = useSocketStore.getState();
		
		console.log("🔍 Estado atual:", { roomState: !!roomState, user: !!user, socketAddTrack: !!socketAddTrack });
		
		const trackMusic = {
			id: track.id,
			title: track.title,
			description: track.description,
			url: track.url,
			thumbnail: track.thumbnail,
			user: user
		};

		console.log("🎵 TrackMusic criado:", trackMusic);

		// Verifica se já está na playlist
		const isAlreadyInPlaylist = roomState?.playlist.some(music => 
			music.id === trackMusic.id || music.url === trackMusic.url
		);

		console.log("🔍 Verificação playlist:", { isAlreadyInPlaylist, playlistLength: roomState?.playlist?.length });

		if (!isAlreadyInPlaylist) {
			// ✅ CORREÇÃO: Adiciona via socket para sincronizar com todos
			console.log("📡 Enviando para socket...");
			socketAddTrack(trackMusic);
			
			// Não atualiza localmente - o socket vai atualizar via evento "trackAdded"
			console.log("✅ Música enviada para adicionar via socket:", trackMusic.title);
		} else {
			console.log("⚠️ Música já está na playlist:", trackMusic.title);
		}
	},

		removeTrack: (trackId: string) => {
			console.log("🗑️ removeTrack chamado:", { trackId });
			
			const { canModerate } = useRoomStore.getState();
			const { removeTrack: socketRemoveTrack } = useSocketStore.getState();

			// Só permite remover se for dono ou moderador
			if (!canModerate) {
				console.log("❌ Sem permissão para remover música");
				return;
			}

			console.log("✅ Permissão concedida, removendo via socket...");
			
			// ✅ CORREÇÃO: NÃO remove localmente - deixa o socket sincronizar
			// O evento "trackRemoved" vai atualizar o estado para todos
			socketRemoveTrack(trackId);
			
			console.log("📡 Música enviada para remover via socket");
		},

		nextSong: () => {
			console.log("⏭️ nextSong chamado");
			
			const { canModerate } = useRoomStore.getState();
			const { nextTrack } = useSocketStore.getState();
			const { playlist, currentIndex } = get();

			console.log("🔍 Estado atual:", { canModerate, playlistLength: playlist.length, currentIndex });

			// Só permite controlar se for dono ou moderador
			if (!canModerate) {
				console.log("❌ Sem permissão para controlar reprodução");
				return;
			}

			if (playlist.length === 0) {
				console.log("⚠️ Playlist vazia");
				return;
			}

			console.log("✅ Permissão concedida, enviando nextTrack para socket...");
			
			// ✅ CORREÇÃO: Sempre envia para socket - não verifica índice
			// O backend vai gerenciar a navegação
			nextTrack();
			
			console.log("📡 NextTrack enviado para socket");
		},

		beforeSong: () => {
			console.log("⏮️ beforeSong chamado");
			
			const { canModerate } = useRoomStore.getState();
			const { previousTrack } = useSocketStore.getState();
			const { playlist, currentIndex } = get();

			console.log("🔍 Estado atual:", { canModerate, playlistLength: playlist.length, currentIndex });

			// Só permite controlar se for dono ou moderador
			if (!canModerate) {
				console.log("❌ Sem permissão para controlar reprodução");
				return;
			}

			if (playlist.length === 0) {
				console.log("⚠️ Playlist vazia");
				return;
			}

			console.log("✅ Permissão concedida, enviando previousTrack para socket...");
			
			// ✅ CORREÇÃO: Sempre envia para socket - não verifica índice
			// O backend vai gerenciar a navegação
			previousTrack();
			
			console.log("📡 PreviousTrack enviado para socket");
		},

		jumpToTrack: (trackIndex: number) => {
			console.log("🎯 jumpToTrack chamado:", { trackIndex });
			
			const { canModerate } = useRoomStore.getState();
			const { jumpToTrack: socketJumpToTrack } = useSocketStore.getState();
			const { playlist } = get();

			console.log("🔍 Estado atual:", { canModerate, playlistLength: playlist.length });

			// Só permite controlar se for dono ou moderador
			if (!canModerate) {
				console.log("❌ Sem permissão para controlar reprodução");
				return;
			}

			if (playlist.length === 0) {
				console.log("⚠️ Playlist vazia");
				return;
			}

			console.log("✅ Permissão concedida, enviando jumpToTrack para socket...");
			
			// ✅ CORREÇÃO: Sempre envia para socket - validação será feita no backend
			socketJumpToTrack(trackIndex);
			
			console.log("📡 JumpToTrack enviado para socket");
		},

		clearPlaylist: () => set({ playlist: [], currentIndex: 0 }),
	};
});
