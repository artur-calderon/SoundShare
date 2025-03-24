import {create} from 'zustand'
import {io, Socket} from 'socket.io-client'


import {useRoomStore} from "../useRoomStore";
import {userContext} from "../../UserContext.tsx";


interface SocketState {
	socket: Socket | null;
	connected: boolean;
	connect: (roomId: string) => void;
	sendHandShake: () => void;
	disconnect: () => void;
	sendEvent: (event: string, data: any) => void;
	onMessageReceived: (event: string, callback: (data: any) => void) => void;
	leaveRoom: (roomId: string) => void;
}


export const useSocketStore = create<SocketState>((set, get) => {
	return {
		socket: null,
		connected: false,
		connect: async (roomId) => {
			const {user} = userContext.getState()

			const  [socket] = await Promise.all([io('/', {
				reconnectionAttempts: 5,
				reconnectionDelay: 5000,
				autoConnect: true,
				transports: ['websocket'],
			})]);
			socket.on('connect', () => {
				console.log('coneected')
				socket.emit('joinRoom', {roomId, userId: user.id});
				get().sendHandShake()
				set({ connected: true, socket });
			});

			socket.on('disconnect', () => {
				set({ connected: false, socket: null });
			});
			set({socket})
		},
		sendHandShake: ()=>{
			const {socket} = get()

			socket?.on('updateRoom', data => {
				useRoomStore.getState().setRoomState(data)
				useRoomStore.getState().setIsHost(useRoomStore.getState().roomSpecs.owner === userContext.getState().user.id)
			})

		},
		leaveRoom: (roomId) => {
			const {socket} = get();
			const {user} = userContext.getState()
			socket?.emit('leaveRoom',{roomId, userId: user.id});
		},
		disconnect: () => {
			const {socket} = get();
			socket?.disconnect();
			set({socket: null, connected: false})
		},
		sendEvent: (event, data) => {
			const {socket} = get();
			socket?.emit(event, data);
		},
		onMessageReceived: (event, callback) => {
			const {socket} = get();
			socket?.on(event, callback);
		}
	}
});
