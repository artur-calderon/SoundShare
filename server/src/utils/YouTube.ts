import { google, youtube_v3 } from "googleapis";

import { IVideo } from "../interfaces";

import { NotFoundError } from "./ServerErrors";

class YouTube {
    private static instance: YouTube;
    private youtube: youtube_v3.Youtube;

    constructor() {
        YouTube.instance = this;

        this.youtube = google.youtube({
            version: "v3",
            auth: process.env.GOOGLE_API_KEY,
        });

        console.info("YouTube iniciado.");
    }

    public static async Search(query: string): Promise<IVideo[]> {
        return new Promise<IVideo[]>(async (resolve, reject) => {
            return await YouTube.instance.youtube.search
                .list({
                    q: query,
                    type: ["video"],
                    videoCategoryId: "10",
                    part: ["id", "snippet"],
                    maxResults: 10,
                })
                .then((response) => {
                    const items = response.data.items;

                    if (!items) {
                        return reject(
                            new NotFoundError(
                                `Não foram encontrados vídeos para ${query}...`
                            )
                        );
                    }

                    return resolve(
                        items.map((video) => {
                            const title = video.snippet?.title;
                            const description = video.snippet?.description;
                            const url = `https://www.youtube.com/watch?v=${video.id?.videoId}`;
                            const thumbnail =
                                video.snippet?.thumbnails?.medium?.url;

                            return {
                                title,
                                description,
                                url,
                                thumbnail,
                            } as IVideo;
                        })
                    );
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }
}

export { YouTube };
