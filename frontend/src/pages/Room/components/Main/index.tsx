import {VideoPlayer} from "../../../../components/VideoPlayer";
import {SearchMusic} from "../../../../components/SearchMusic";
import {MainLayout, MainSpace} from "./styles.ts";

export function Main() {


	return (
		<MainLayout>
			<MainSpace>
				<VideoPlayer />
				<SearchMusic />
			</MainSpace>
		</MainLayout>
	);
}

