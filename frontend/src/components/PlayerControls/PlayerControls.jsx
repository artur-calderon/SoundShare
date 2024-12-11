import { Flex, Slider, Typography, Progress } from "antd";
import { Play, SkipBack, SkipForward, Volume2, Pause } from "lucide-react";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import { ChevronDown, ChevronUp, VolumeX } from "lucide-react";
import { PlayerControlsContainer } from "./styles.js";
// import {useState} from "react";
import Duration from "./Duration.jsx";

function PlayerControls() {
  const { Title } = Typography;
  const {
    handleBeforeSong,
    handleNextSong,
    playing,
    played,
    duration,
    changeMute,
    controlMute,
    changeVolume,
    controlPlay,
    playAndPause,
    currentMusicPlaying,
    changeSearchToPlayer,
    changePlayerToSearch,
  } = useStore((store) => {
    return {
      currentMusicPlaying: store.currentMusicPlaying,
      changeSearchToPlayer: store.changeSearchToPlayer,
      changePlayerToSearch: store.changePlayerToSearch,
      playAndPause: store.playAndPause,
      controlPlay: store.controlPlay,
      controlVolume: store.controlVolume,
      changeVolume: store.changeVolume,
      changeMute: store.changeMute,
      controlMute: store.controlMute,
      duration: store.duration,
      played: store.played,
      playing: store.playing,
      handleNextSong: store.handleNextSong,
      handleBeforeSong: store.handleBeforeSong,
    };
  });

  function handleVolume(volume) {
    changeVolume(volume);
    if (controlMute === true) {
      changeMute();
    } else {
      return;
    }
  }
  return (
    <PlayerControlsContainer>
      {playing ? (
        <Progress percent={played * 100} status="active" showInfo={false} />
      ) : null}
      <Flex>
        <Flex
          style={{ width: "20%" }}
          justify="flex-start"
          align="center"
          horizontal="horizontal"
          gap={10}
        >
          <SkipBack
            strokeWidth={1.5}
            size={25}
            style={{ fontSize: "2.1rem", cursor: "pointer" }}
            onClick={() => handleBeforeSong()}
          />
          {controlPlay ? (
            <Pause
              strokeWidth={1.5}
              size={35}
              style={{ fontSize: "2.2rem", cursor: "pointer" }}
              onClick={() => playAndPause()}
            />
          ) : (
            <Play
              strokeWidth={1.5}
              size={35}
              style={{ fontSize: "2.2rem", cursor: "pointer" }}
              onClick={() => playAndPause()}
            />
          )}
          <SkipForward
            strokeWidth={1.5}
            size={25}
            style={{ fontSize: "2.1rem", cursor: "pointer" }}
            onClick={() => handleNextSong()}
          />
          <span style={{ width: "7rem" }}>
            <Duration seconds={duration * played} />/
            <Duration seconds={duration} />
          </span>
        </Flex>
        <Flex
          horizontal="horizontal"
          gap={20}
          style={{ width: "60%" }}
          align="center"
          justify="center"
        >
          <img
            alt="album cover"
            src={currentMusicPlaying.video?.thumbnail ?? null}
            width="100rem"
          />
          <Flex vertical="vertical" justify="flex-start" align="flex-start">
            <Title level={5}>{currentMusicPlaying.video?.title ?? null}</Title>
            <span>{currentMusicPlaying.video?.title ?? null}</span>
          </Flex>
        </Flex>
        <Flex
          horizontal="horizontal"
          style={{ width: "20%" }}
          align="center"
          justify="center"
          gap={20}
        >
          <span>Volume</span>
          <Slider
            style={{ width: "inherit" }}
            defaultValue={0.8}
            onChange={(value) => handleVolume(value)}
            min={0}
            max={1}
            step={0.01}
            tooltip={{
              formatter: null,
            }}
          />
          {controlMute ? (
            <VolumeX
              strokeWidth={1.5}
              style={{ fontSize: "1rem", cursor: "pointer" }}
              onClick={() => changeMute()}
            />
          ) : (
            <Volume2
              strokeWidth={1.5}
              style={{ fontSize: "1rem", cursor: "pointer" }}
              onClick={() => changeMute()}
            />
          )}
          {changePlayerToSearch ? (
            <ChevronDown
              size={20}
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={() => changeSearchToPlayer()}
            />
          ) : (
            <ChevronUp
              size={20}
              style={{ cursor: "pointer", marginLeft: "10px" }}
              onClick={() => changeSearchToPlayer()}
            />
          )}
        </Flex>
      </Flex>
    </PlayerControlsContainer>
  );
}

export default PlayerControls;
