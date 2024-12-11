import { Avatar, List, Space, Tooltip, Typography } from "antd";
import { DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import { primary, border } from "../themes/darkRoomTheme.js";
import { useStore } from "../contexts/zustand-context/PlayerContext.js";
import { useEffect } from "react";

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint.js";

import { ListMusic } from "lucide-react";

function AsidePlaylist() {
  const { currentMusicPlaying, removeMusicFromPlaylist, playMusic, playlist } =
    useStore((store) => {
      return {
        playMusic: store.playMusic,
        addMusicToPlaylist: store.addMusicToPlaylist,
        playlist: store.playlist,
        removeMusicFromPlaylist: store.removeMusicFromPlaylist,
        currentMusicPlaying: store.currentMusicPlaying,
      };
    });
  const { Title } = Typography;
  const screens = useBreakpoint();

  useEffect(() => {}, [playlist]);

  function highlightTheCurrentMusic(playlistMusic) {
    if (currentMusicPlaying.video?.url === playlistMusic) {
      return `3px solid ${primary}`;
    } else {
      return " ";
    }
  }
  return (
    <Space
      direction="vertical"
      align="center"
      justify="center"
      style={{ width: "100%'", height: "100%" }}
    >
      <Title
        level={4}
        style={{ display: "flex", alignItems: "center", gap: "1rem" }}
      >
        <ListMusic />
        PLAYLIST
      </Title>
      <div
        style={{
          overflowY: "scroll",
          height: "auto",
          maxHeight: "50vh",
          transition: "height 0.5s ease",
          scrollbarColor: `${primary} ${border}`,
          scrollbarWidth: "thin",
        }}
      >
        {playlist.length > 0 ? (
          <List
            pagination={"bottom"}
            itemLayout="vertical"
            style={{ width: "auto" }}
            size="small"
            dataSource={playlist}
            renderItem={(item) => (
              <List.Item
                style={{
                  width: screens.xs ? "100%" : "30rem",
                  display: "flex",

                  borderLeft: `${highlightTheCurrentMusic(item.video.url)}`,
                }}
                actions={[
                  <Tooltip title="Tocar agora" placement="top" key="play">
                    <PlayCircleOutlined
                      onClick={() => {
                        playMusic(item.video);
                      }}
                      style={{ fontSize: "20px", marginRight: "20px" }}
                    />
                  </Tooltip>,
                  <Tooltip
                    title="Remover da Playlist"
                    placement="top"
                    key="add-to-playlist"
                  >
                    <DeleteOutlined
                      onClick={() => removeMusicFromPlaylist(item)}
                      style={{ fontSize: "20px" }}
                    />
                  </Tooltip>,
                ]}
                extra={
                  <img
                    width={screens.xs ? "100%" : 100}
                    alt="logo"
                    src={item.video.thumbnail}
                  />
                }
              >
                <List.Item.Meta
                  avatar={
                    <Avatar
                      src={
                        item.user.image ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                    />
                  }
                  title={item.video.title}
                  description={"Enviado por: " + item.user.name}
                />
              </List.Item>
            )}
          ></List>
        ) : (
          <List></List>
        )}
      </div>
    </Space>
  );
}
export default AsidePlaylist;
