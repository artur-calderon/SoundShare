import { ConfigProvider, Input } from "antd";
import "./RoomQR.js";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { Layout, Avatar, List, Tooltip } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";
import { userContext } from "../../contexts/zustand-context/UserContext.js";
import AsidePlaylist from "../../components/AsidePlaylist.jsx";
import { Header, RoomCover, SearchResults } from "./RoomQR.js";
import { darkRoomTheme } from "../../themes/darkRoomTheme.js";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";
import { LogOut } from "lucide-react";
import axios from "axios";

function RoomQRCode() {
  const { Search } = Input;
  const { Content } = Layout;
  const { id } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const {
    addMusicToPlaylist,
    isLoading,
    results,
    getInfoRoom,
    roomSpecs,
    handleSearchMusic,
    playlist,
    currentMusicPlaying,
  } = useStore((store) => {
    return {
      playing: store.playing,
      getInfoRoom: store.getInfoRoom,
      roomSpecs: store.roomSpecs,
      handleSearchMusic: store.handleSearchMusic,
      results: store.searchResults,
      isLoading: store.isLoading,
      addMusicToPlaylist: store.addMusicToPlaylist,
      playlist: store.playlist,
      currentMusicPlaying: store.currentMusicPlaying,
    };
  });
  const { user, isLogged } = userContext((store) => {
    return {
      user: store.user,
      isLogged: store.isLogged,
    };
  });

  function sairRoom() {
    localStorage.removeItem("insideRoom");
    navigate("/app");
  }

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
    getInfoRoom(id, user);
  }, [getInfoRoom, id, isLogged, navigate, user]);

  useEffect(() => {}, [currentMusicPlaying]);

  useEffect(() => {
    const req = axios.get(
      "https://api.lyrics.ovh/v1/bruno e marrone/vida vazia",
    );
    req.then((r) => {
      console.log(r.data);
    });
  }, []);

  function Logged() {
    return (
      <ConfigProvider theme={darkRoomTheme}>
        <Layout
          style={{
            height:
              results.length > 0 || playlist.length > 0 ? "100%" : "100vh",
          }}
        >
          <Content
            style={{
              margin: screens.xs ? "0" : "24px 16px 0",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: 24,
                display: "flex",
                justifyContent: screens.xs ? "none" : "center",
                flexDirection: screens.sm ? "row" : "column",
                gap: "5rem",
                width: screens.xs ? "100%" : "70%",
              }}
            >
              <div
                style={{
                  width: screens.xs ? "100%" : "70%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Header>
                  <RoomCover $cover={roomSpecs.cover}>
                    <img src={roomSpecs.cover} alt={roomSpecs.name} />
                  </RoomCover>
                  <h3>Bem vindo a Sala: {roomSpecs.name}</h3>
                  {currentMusicPlaying.video ? (
                    <h3>Tocando agora: {currentMusicPlaying.video?.title}</h3>
                  ) : (
                    " "
                  )}
                  <div onClick={() => sairRoom()}>
                    <LogOut strokeWidth={1.5} size={15} /> <h4>Sair</h4>
                  </div>
                </Header>
                <Search
                  placeholder="Procure sua Música Favorita"
                  enterButton="Pesquisar"
                  loading={isLoading}
                  size={screens.xs ? "large" : "small"}
                  onSearch={(e) => handleSearchMusic(e, user)}
                  style={{
                    width: screens.xs ? "100%" : "70%",
                  }}
                />
                <br />
                <br />
                {results.length > 0 ? (
                  <SearchResults>
                    <h1>Resultados</h1>
                    <List
                      pagination={"bottom"}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "70%",
                      }}
                      dataSource={results}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.thumbnail} />}
                            title={item.title}
                            description={item.description}
                          />

                          <Tooltip title="Adicionar à Playlist" placement="top">
                            <UnorderedListOutlined
                              onClick={() => addMusicToPlaylist(item)}
                              style={{ fontSize: "20px" }}
                            />
                          </Tooltip>
                        </List.Item>
                      )}
                    />
                  </SearchResults>
                ) : (
                  <h3>Pesquise uma música</h3>
                )}
              </div>
              {playlist.length > 0 && <AsidePlaylist />}
            </div>
          </Content>
        </Layout>
      </ConfigProvider>
    );
  }

  return <Logged></Logged>;
}

export default RoomQRCode;
