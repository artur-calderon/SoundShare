import { List, Tooltip } from "antd";
import { PlayCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { useStore } from "../../contexts/zustand-context/PlayerContext.js";

import { SpaceContainer } from "./styles.js";

export default function SearchMusic() {
  const {
    playlist,
    addMusicToPlaylist,
    results,
    playMusic,
    changePlayerToSearch,
  } = useStore((store) => {
    return {
      results: store.searchResults,
      playMusic: store.playMusic,
      changePlayerToSearch: store.changePlayerToSearch,
      addMusicToPlaylist: store.addMusicToPlaylist,
      playlist: store.playlist,
    };
  });

  return (
    <SpaceContainer
      direction="vertical"
      $changeplayertosearch={changePlayerToSearch}
      results={results}
      playlist={playlist}
    >
      <div className="list">
        <List
          pagination={"bottom"}
          itemLayout="vertical"
          style={{ width: "100%" }}
          size="small"
          dataSource={results}
          renderItem={(item) => (
            <List.Item
              style={{
                width: "100%",
                borderBottom: "1px solid rgba(255,200,0,.5)",
              }}
              actions={[
                <Tooltip title="Tocar agora" placement="top" key="play">
                  <PlayCircleOutlined
                    onClick={() => {
                      playMusic(item);
                    }}
                    style={{ fontSize: "20px", marginRight: "20px" }}
                  />
                </Tooltip>,
                <Tooltip
                  title="Adicionar à Playlist"
                  placement="top"
                  key="addToPlaylist"
                >
                  <UnorderedListOutlined
                    style={{ fontSize: "20px" }}
                    onClick={() => addMusicToPlaylist(item)}
                  />
                </Tooltip>,
              ]}
              extra={<img width={100} alt="logo" src={item.thumbnail} />}
            >
              <List.Item.Meta
                title={item.title.substring(0, 100)}
                description={item.description}
              />
            </List.Item>
          )}
        ></List>
      </div>
    </SpaceContainer>
  );
}
