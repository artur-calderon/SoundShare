import { Socket } from "socket.io";

interface ISocketUser {
    room: string;
    socket: Socket;
}

export { ISocketUser };
