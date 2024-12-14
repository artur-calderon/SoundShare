import { create } from "zustand";
import { talkToApi } from "../../utils/utils.js";

export const useStore = create((set, get) => {
  return {
    playlist: [],
    user: undefined,
    setUser: (user) => set({ user }),
    roomOnline: false,
    socket: undefined,
    setSocket: (socket) => set({ socket }),
    roomSpecs: {},

    currentMusicPlaying: [],
    isLoading: false,
    searchResults: [],
    changePlayerToSearch: true,
    playing: false,

    //controlPlayer
    controlPlay: false,
    controlSkip: false,
    controlBack: false,
    controlVolume: 0.8,
    controlMute: false,
    duration: 0,
    played: 0,

    changeRoomToOffline: async (status) => {
      const { user, roomSpecs } = get();
      // // Muda o status da sala para offline
      const info = { online: status ? true : false };
      const res = await talkToApi(
        "put",
        "/room",
        `/${roomSpecs.id}`,
        { info },
        user.accessToken,
      );
      if (res.status === 200) {
        get().getInfoRoom(roomSpecs.id, user);
      } else {
        console.log(res.status);
      }
    },

    getInfoRoom: async (id, user) => {
      try {
        const res = await talkToApi("get", "/room/", id, {}, user.accessToken);
        set({
          roomSpecs: res.data,
        });
      } catch (e) {
        if (e.status === 404) {
          alert("Essa Sala não existe");
          window.location.href = "/app";
        }
      }
    },
    handleDuration: (duration) => {
      set({
        duration: duration,
      });
    },
    handlePlayed: (played) => {
      set({
        played: played.played,
      });
    },

    changeVolume: (newVolume) => {
      const { controlVolume } = get();
      set({
        controlVolume: newVolume,
      });
      if (controlVolume <= 0.02) {
        set({
          controlMute: true,
        });
      }
    },

    changeMute: async () => {
      const { controlMute } = get();

      set({
        controlMute: !controlMute,
      });
    },

    changeSearchToPlayer: () => {
      const { changePlayerToSearch } = get();
      set({
        changePlayerToSearch: !changePlayerToSearch,
      });
    },
    //se tiver um botão de stop, mas não pretendo colocar ainda
    changePlaying: () => {
      const { playing } = get();
      set({
        playing: !playing,
      });
    },

    playAndPause: async () => {
      const { roomSpecs, user, socket } = get();

      await socket.emit("playerEvent", user.uid, roomSpecs.id, "playAndPause");

      await get().listenPlayerEvents();
    },
    listenPlayerEvents: async () => {
      const { socket, controlPlay } = get();
      await socket.on("playerEvent", (event, music) => {
        switch (event) {
          case "playMusic":
            set({
              currentMusicPlaying: music,
              playing: music.playing,
              controlPlay: music.controlPlay,
            });
            break;
          case "playAndPause":
            set({
              controlPlay: !controlPlay,
            });
            break;
        }
      });
    },
    playMusic: async (music) => {
      const { roomSpecs, user, socket } = get();

      const info = {
        user: {
          name: user.name || user.email,
          image: user.image || user.photoURL,
        },
        video: {
          ...music,
        },
        playing: true,
        controlPlay: true,
      };
      await socket.emit("playerEvent", user.uid, roomSpecs.id, "playMusic", {
        ...info,
      });
      get().addMusicToPlaylist(music);
      await get().listenPlayerEvents();
    },

    addMusicToPlaylist: async (musicSelectedInfo) => {
      const { roomSpecs, user, socket } = get();
      const info = {
        user: {
          name: user.name || user.email,
          image: user.image || user.photoURL,
        },
        video: {
          ...musicSelectedInfo,
        },
      };
      await socket.emit("add", user.uid, roomSpecs.id, info);
    },

    updatePlaylist: (input, replace = false) => {
      set((state) => {
        // Verifica se o input é um array (playlist) ou uma única música
        const newSongs = Array.isArray(input) ? input : [input];

        return {
          playlist: replace
            ? newSongs // Substitui a playlist se `replace` for true
            : [...state.playlist, ...newSongs], // Adiciona novas músicas
        };
      });
    },
    removeMusicFromPlaylist: async (musicToRemove) => {
      const { roomSpecs, user, socket } = get();
      await socket.emit("remove", user.uid, roomSpecs.id, {
        ...musicToRemove,
      });
    },
    removeMusic: (musicIndexToRemove) => {
      const { playlist, updatePlaylist } = get();
      const newPlaylist = playlist.filter(
        (_, index) => index !== musicIndexToRemove,
      );
      updatePlaylist(newPlaylist, true);
    },
    handleNextSong: () => {
      //TODO: Adicionar playing  = false quando a playlist terminar
      const { playlist, currentMusicPlaying, played } = get();
      // Se houver músicas na playlistt
      try {
        if (playlist.length > 0) {
          playlist.forEach((music, index) => {
            const sameMusicInPlaylist =
              music.video.url === currentMusicPlaying.video.url;
            const finishedPlayed = played * 100;
            let nextSong = 0;
            if (sameMusicInPlaylist || finishedPlayed >= 99) {
              nextSong = index + 1;
              get().playMusic(playlist[nextSong].video);
            } else if (nextSong > index || nextSong === index) {
              console.log(nextSong, index);
              get().playAndPause();
            }
          });
        } else {
          console.log("Playlist vazia");
          get().playAndPause(); // Define currentPlaying como null se a playlist estiver vazia
        }
      } catch (e) {
        return;
      }
    },
    handleBeforeSong: () => {
      //TODO: Adicionar playing  = false quando a playlist terminar
      const { playlist, currentMusicPlaying } = get();

      // Se houver músicas na playlist
      try {
        if (playlist.length > 0) {
          playlist.forEach((music, index) => {
            const sameMusicInPlaylist =
              music.video.url === currentMusicPlaying.video.url;
            let prevSong = index;
            if (sameMusicInPlaylist) {
              prevSong = index - 1;
              get().playMusic(playlist[prevSong].video);
            } else if (prevSong < index) {
              console.log("Playlist vazia");
              get().playAndPause();
            }
          });
        } else {
          console.log("Playlist vazia");
          set({
            currentMusicPlaying: {},
          }); // Define currentPlaying como null se a playlist estiver vazia
        }
      } catch (e) {
        return;
      }
    },

    handleSearchMusic: async (text, user) => {
      const params = new URLSearchParams();
      params.append("search", text);

      try {
        if (text === undefined) {
          set({
            isLoading: true,
            searchResults: [],
          });
          return;
        }
        set({
          isLoading: true,
          searchResults: [],
        });
        const res = await talkToApi(
          "get",
          "/video?search=",
          text,
          {},
          user.accessToken,
        );
        set({
          isLoading: false,
          searchResults: res.data,
          changePlayerToSearch: true,
        });
      } catch (e) {
        console.log(e);
      }
    },
  };
});
