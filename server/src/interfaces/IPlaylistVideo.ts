import { User } from "../entities";
import { IVideo } from "./IVideo";

interface IPlaylistVideo {
  user: Partial<User>;
  video: IVideo;
}

export { IPlaylistVideo };
