import {VideoPlayer} from "../../../../components/VideoPlayer";
import {SearchMusic} from "../../../../components/SearchMusic";
import {MainLayout, MainSpace, PlayerSearchContainer} from "./styles.ts";

export function Main() {
	return (
		<MainLayout>
			<MainSpace>
				<PlayerSearchContainer>
					<VideoPlayer />
					<SearchMusic />
				</PlayerSearchContainer>
			</MainSpace>
		</MainLayout>
	);
}
