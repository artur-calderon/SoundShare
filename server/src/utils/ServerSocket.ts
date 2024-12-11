import { Server as HTTPServer } from "http";
import { Socket, Server } from "socket.io";
import { IPlaylistVideo, IRoomsOnline, ISocketUsers } from "../interfaces";
import { roomRepository } from "../repositories";

class ServerSocket {
  private static instance: ServerSocket;
  private io: Server;

  /** Lista dos usuários conectados */
  private users: ISocketUsers;

  /** Lista das rooms online */
  private rooms: IRoomsOnline;

  constructor(server: HTTPServer) {
    ServerSocket.instance = this;

    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: "*",
      },
    });

    this.users = {};
    this.rooms = {};

    ServerSocket.instance.io.on(
      "connect",
      ServerSocket.instance.StartListeners,
    );

    console.info("Socket IO iniciado.");
  }

  private StartListeners(socket: Socket) {
    console.info("Mensagem recebida de " + socket.id);

    socket.on(
      "handshake",
      async (
        user: string,
        room: string,
        callback: (playlist: IPlaylistVideo[]) => void,
      ) => {
        console.info("Aperto de mão recebido de " + socket.id);
        /** Verifica se a room está online */
        if (!(await ServerSocket.instance.RoomIsOnline(room))) {
          return callback([]);
        }

        /** Verifica se é uma reconexão */
        const userIsReconnecting = Object.keys(
          ServerSocket.instance.users,
        ).includes(user);

        if (!userIsReconnecting) {
          ServerSocket.instance.users[user] = {
            room,
            socket,
          };
        }

        const userRef = ServerSocket.instance.users[user];

        if (userRef.room != room || userRef.socket.id != socket.id) {
          userRef.socket.leave(userRef.room);

          if (userRef.room != room) {
            userRef.room = room;
          }

          if (userRef.socket.id != socket.id) {
            userRef.socket = socket;
          }
        }

        socket.join(room);

        console.log("Enviando retorno de chamada do aperto de mão...");
        return callback(ServerSocket.instance.rooms[room]);
      },
    );

    socket.on("disconnect", () => {
      console.info("Desconexão recebida de " + socket.id);

      const user = ServerSocket.instance.GetIdFromSocketId(socket.id);

      if (user) {
        const userRef = ServerSocket.instance.users[user];

        userRef.socket.leave(userRef.room);

        delete ServerSocket.instance.users[user];
      }
    });

    socket.on(
      "add",
      async (user: string, room: string, toAdd: IPlaylistVideo) => {
        console.log(user, room, toAdd);
        if (!(await ServerSocket.instance.UserIsOnRoom(user, room))) return;
        const videoIndex = ServerSocket.instance.GetVideoIndex(room, toAdd);

        if (videoIndex != -1) return;

        ServerSocket.instance.rooms[room].push(toAdd);

        ServerSocket.instance.io.to(room).emit("add", toAdd);
      },
    );

    socket.on(
      "remove",
      async (user: string, room: string, toRemove: IPlaylistVideo) => {
        console.log(user, room, toRemove);
        if (!(await ServerSocket.instance.UserIsOnRoom(user, room))) return;

        const videoIndex = ServerSocket.instance.GetVideoIndex(room, toRemove);
        if (videoIndex == -1) return;

        ServerSocket.instance.rooms[room].splice(videoIndex, 1);

        ServerSocket.instance.io.to(room).emit("remove", videoIndex);
      },
    );

    socket.on(
      "playerEvent",
      async (user: string, room: string, event: string, ...args) => {
        if (!(await ServerSocket.instance.UserIsOnRoom(user, room))) return;
        ServerSocket.instance.io.to(room).emit("playerEvent", event, ...args);
      },
    );
  }

  private GetIdFromSocketId(socketId: string): string | undefined {
    return Object.keys(ServerSocket.instance.users).find(
      (user) => ServerSocket.instance.users[user].socket.id === socketId,
    );
  }

  private async RoomIsOnline(room: string): Promise<boolean> {
    const online = Object.keys(ServerSocket.instance.rooms).includes(room);

    if (online) return true;
    const _room = await roomRepository.findById(room);

    if (_room.online) {
      ServerSocket.OnlineSwitch(room, true);

      return true;
    }

    return false;
  }

  private async UserIsOnRoom(user: string, room: string): Promise<boolean> {
    if (!(await ServerSocket.instance.RoomIsOnline(room))) return false;

    const userSentHandshake = Object.keys(ServerSocket.instance.users).includes(
      user,
    );

    if (!userSentHandshake) return false;

    return ServerSocket.instance.users[user].room == room;
  }

  private GetVideoIndex(room: string, toFind: IPlaylistVideo): number {
    return ServerSocket.instance.rooms[room].findIndex((video) => {
      return video.video.url == toFind.video.url;
    });
  }

  public static OnlineSwitch(id: string, online: boolean) {
    if (!online && Object.keys(ServerSocket.instance.rooms).includes(id)) {
      delete ServerSocket.instance.rooms[id];

      ServerSocket.instance.io.to(id).emit("disconnect");
    } else if (online) {
      ServerSocket.instance.rooms[id] = [];
    }
  }
}

export { ServerSocket };
