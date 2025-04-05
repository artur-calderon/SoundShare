import {List, Space, Input, Empty, Flex, Tooltip} from "antd";
import { PlayCircleOutlined, UnorderedListOutlined } from "@ant-design/icons";

import { SpaceContainer } from "./styles.ts";
import {usePlayerStore} from "../../contexts/PlayerContext/usePlayerStore";
import {userContext} from "../../contexts/UserContext.tsx";
import {usePlaylistStore} from "../../contexts/PlayerContext/usePlaylistStore";
import {useParams} from "react-router-dom";

export function SearchMusic() {
	const { Search } = Input;

	const {searchMusic, loading, searchResults} = usePlayerStore()
	const {user} = userContext()
	const {addTrack} = usePlaylistStore()
	const {playMusic} = usePlayerStore()
	const {id} = useParams()

	return (
		<SpaceContainer
			direction="vertical"
			// $changeplayertosearch={changePlayerToSearch}
			// results={results}
			// playlist={playlist}
		>
			<Space style={{ marginBottom: "1px", alignSelf:"flex-start" }} >
				<Search
					placeholder="Procure sua Música Favorita"
					enterButton="Pesquisar"
					loading={loading}
					size="middle"
					onSearch={(e) => searchMusic(e, user)}
				/>
			</Space>

			<div className="list">
				{searchResults?.length > 0 ? (
					<List
						pagination={"bottom"}
						itemLayout="vertical"
						style={{ width: "100%" , overflow: "auto"}}
						size="small"
						dataSource={searchResults}
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
												playMusic(id,item);
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
											onClick={() => addTrack(item, id)}
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
				):(
					<Flex style={{ width: "100%" }} align="center" justify="center">
						<Empty
							description="Procure uma música"
							// image={emptyVideo}
							style={{ color: "black" }}
						/>
					</Flex>
				)}
			</div>
		</SpaceContainer>
	);
}
