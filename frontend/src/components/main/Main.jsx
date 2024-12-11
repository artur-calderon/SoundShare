import { Layout, Input, Space } from "antd";
import { darkRoomTheme } from "../../themes/darkRoomTheme.js";

import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import AsidePlaylist from "../AsidePlaylist.jsx";
import VideoPlayer from "../VideoPlayer/VideoPlayer.jsx";
import SearchMusic from "../SearchMusic/SearchMusic.jsx";
import { userContext } from "../../contexts/zustand-context/UserContext.js";
import RoomStats from "../RoomStats/RoomStats.jsx";

function Main() {
  const { Search } = Input;
  const { playlist, isLoading, handleSearchMusic } = useStore((store) => {
    return {
      getInfoRoom: store.getInfoRoom,
      isLoading: store.isLoading,
      handleSearchMusic: store.handleSearchMusic,
      playlist: store.playlist,
    };
  });
  const { user } = userContext((store) => {
    return {
      user: store.user,
    };
  });

  return (
    <Layout
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <Space
        direction="vertical"
        style={{
          display: "flex",
          height: "100%",
          padding: 20,
          width: "70%",
          backgroundColor: `${darkRoomTheme.components.Space.bgcolor}`,
        }}
      >
        <Space style={{ marginBottom: "15px" }}>
          <Search
            placeholder="Procure sua Música Favorita"
            enterButton="Pesquisar"
            loading={isLoading}
            size="middle"
            onSearch={(e) => handleSearchMusic(e, user)}
          />
        </Space>
        <VideoPlayer />
        <SearchMusic />
      </Space>
      <Space
        direction="vertical"
        style={{
          padding: 20,
          width: "30%",
          backgroundColor: `${darkRoomTheme.components.Space.bgcolor}`,
        }}
      >
        {playlist.length > 0 && <AsidePlaylist />}
        <RoomStats></RoomStats>
      </Space>
    </Layout>
  );
}

export default Main;
