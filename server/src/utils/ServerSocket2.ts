import { Server } from "socket.io";

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

interface RoomState {
  roomId: string;
  online: boolean;
  playing: boolean;
  listeners: number;
  playlist: Track[];
  currentTrack: Track | null;
  users: Set<string>;
}

const rooms: Record<string, RoomState> = {};

export function startSocketServer(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("joinRoom", ({ roomId, userId }) => {
      socket.join(roomId);

      if (!rooms[roomId]) {
        rooms[roomId] = {
          roomId,
          online: true,
          playing: false,
          listeners: 0,
          playlist: [],
          currentTrack: null,
          users: new Set(),
        };
      }

      if (!rooms[roomId].users.has(userId)) {
        rooms[roomId].users.add(userId);
        rooms[roomId].listeners++;
      }

      socket.emit("updateRoom", rooms[roomId]);
      io.to(roomId).emit("updateRoom", rooms[roomId]);
    });

    socket.on(
      "addTrack",
      ({ roomId, track }: { roomId: string; track: Track }) => {
        if (rooms[roomId]) {
          rooms[roomId].playlist.push(track);
          io.to(roomId).emit("updateRoom", rooms[roomId]);
        }
      },
    );

    socket.on("playPause", ({ roomId }) => {
      if (rooms[roomId]) {
        rooms[roomId].playing = !rooms[roomId].playing;
        io.to(roomId).emit("updateRoom", rooms[roomId]);
      }
    });
    socket.on(
      "playTrack",
      ({ roomId, track }: { roomId: string; track: Track }) => {
        if (rooms[roomId]) {
          rooms[roomId].currentTrack = track;
          rooms[roomId].playing = true;
          io.to(roomId).emit("updateRoom", rooms[roomId]);
        }
      },
    );

    socket.on(
      "syncTrack",
      ({ roomId, played }: { roomId: string; played: number }) => {
        if (rooms[roomId]) {
          io.to(roomId).emit("updatePlayed", { played });
        }
      },
    );

    socket.on("leaveRoom", ({ roomId, userId }) => {
      socket.leave(roomId);

      if (rooms[roomId] && rooms[roomId].users.has(userId)) {
        rooms[roomId].users.delete(userId);
        rooms[roomId].listeners--;

        if (rooms[roomId].listeners <= 0) {
          rooms[roomId].online = false;
        }

        io.to(roomId).emit("updateRoom", rooms[roomId]);
      }
    });

    socket.on("disconnect", () => {
      console.log("Usuário desconectado:", socket.id);
    });
  });

  console.log("Servidor Socket.IO rodando...");
}
