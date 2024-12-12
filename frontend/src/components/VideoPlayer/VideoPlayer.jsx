import { Player } from "./style.js";
import { Alert, Empty, Flex } from "antd";
import Marquee from "react-fast-marquee";
import ReactPlayer from "react-player/lazy";
import emptyVideo from "../../../public/emptyVideoWhite.svg";
import { Typography } from "antd";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import { SpaceContainer } from "./style.js";
import { socketUseStore } from "../../contexts/zustand-context/Socket.js";
import { useEffect } from "react";

function VideoPlayer() {
  const { Title } = Typography;
  const {
    handleNextSong,
    handlePlayed,
    handleDuration,
    controlMute,
    controlVolume,
    controlPlay,
    playing,
    currentMusicPlaying,
    roomSpecs,
    changePlayerToSearch,
  } = useStore((store) => {
    return {
      currentMusicPlaying: store.currentMusicPlaying,
      roomSpecs: store.roomSpecs,
      changePlayerToSearch: store.changePlayerToSearch,
      playing: store.playing,
      controlPlay: store.controlPlay,
      controlVolume: store.controlVolume,
      controlMute: store.controlMute,
      handleDuration: store.handleDuration,
      handlePlayed: store.handlePlayed,
      handleNextSong: store.handleNextSong,
    };
  });
  const { usersConnectedInRoom } = socketUseStore((store) => {
    return {
      usersConnectedInRoom: store.usersConnectedInRoom,
    };
  });
  useEffect(() => {}, [usersConnectedInRoom]);
  return (
    <SpaceContainer
      direction={"vertical"}
      $changeplayertosearch={changePlayerToSearch}
    >
      {playing ? (
        <Alert
          banner
          type="info"
          key={
            currentMusicPlaying.video?.url
              ? currentMusicPlaying.video?.url
              : null
          }
          style={{ width: "100%" }}
          showIcon={false}
          message={
            <Marquee pauseOnHover gradient={false}>
              <b>Tocando agora </b>
              <span>
                {":  " + currentMusicPlaying.video?.title
                  ? currentMusicPlaying.video?.title
                  : null}
              </span>
              <b style={{ marginLeft: "15px" }}> Enviado por: </b>
              <span style={{ marginRight: "5px" }}>
                {currentMusicPlaying.user?.name
                  ? currentMusicPlaying.user?.name
                  : null}
              </span>
            </Marquee>
          }
        />
      ) : null}

      <Player>
        {playing ? (
          <ReactPlayer
            url={
              currentMusicPlaying.video?.url
                ? currentMusicPlaying.video?.url
                : null
            }
            controls={true}
            width="auto"
            height={"36rem"}
            volume={controlVolume}
            muted={controlMute}
            playing={controlPlay}
            onProgress={handlePlayed}
            onEnded={handleNextSong}
            onDuration={handleDuration}
          ></ReactPlayer>
        ) : (
          <Flex style={{ width: "100%" }} align="center" justify="center">
            <Empty
              description="Nenhum vídeo adicionado"
              image={emptyVideo}
              style={{ color: "black" }}
            />
          </Flex>
        )}
      </Player>
    </SpaceContainer>
  );
}

export default VideoPlayer;
