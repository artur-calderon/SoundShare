import { create } from "zustand";
import { userContext } from "./UserContext.js";
import { useStore } from "./PlayerContext.js";
import io from "socket.io-client";

export const socketUseStore = create((set, get) => {
	return {
		socket: undefined,
		uid: "",
		usersConnectedInRoom: [],

		connectSocket: () => {
			const socket = io("/", {
				reconnectionAttempts: 5,
				reconnectionDelay: 5000,
				autoConnect: false,
				transports: ["websocket"],
			});

			// if (get().socket?.connected) return;
			socket.connect();
			set({ socket: socket });
			useStore.getState().setSocket(socket);
		},
		sendHandShake: async () => {
			const { socket } = get();
			const { user } = userContext.getState();
			const roomSpecs = useStore.getState().roomSpecs;
			if (!roomSpecs || Object.keys(roomSpecs).length === 0) {
				console.error(
					"roomSpecs ainda não foi preenchido. Certifique-se de que getInfoRoom foi chamado."
				);
				return;
			}
			console.info("Enviando Handshake");
			await socket.emit(
				"handshake",
				user.uid,
				roomSpecs.id,
				(playlist) => {
					useStore.getState().updatePlaylist(playlist);
				}
			);
		},

		startListeners: () => {
			const { socket } = get();
			// reconnect event
			socket.io.on("reconnect", (attempt) => {
				console.info("reconnected on attempt: " + attempt);
				get().sendHandShake();
			});
			//reconnect attempt event
			socket.io.on("reconnect_attempt", (attempt) => {
				console.info("reconnection attempt: " + attempt);
			});
			//reconnection error
			socket.io.on("reconnect_error", (error) => {
				console.info("reconnection: " + error);
			});

			//reconnection failed
			socket.io.on("reconnect_failed", () => {
				console.info("reconnection Failure");
				alert("Não foi possível reconectar");
			});
			socket.on("add", (data) => {
				useStore.getState().updatePlaylist(data);
			});
			socket.on("remove", (args) => {
				useStore.getState().removeMusic(args);
			});
			//
			//   socket.on("user_disconnected", (data) => {
			//     remove_users(data);
			//   });
		},

		update_socket: (sock) => {
			set({
				socket: sock,
			});
		},
		update_uid: (sock) => {
			set({
				uid: sock,
			});
		},
		// update_users: (sock) => {
		//   set((state) => ({
		//     usersConnectedInRoom: [...state.usersConnectedInRoom, sock.users],
		//   }));
		// },
		remove_users: (uid) => {
			set((state) => ({
				usersConnectedInRoom: state.usersConnectedInRoom.filter(
					(u) => u.uid !== uid
				),
			}));
		},
	};
});
