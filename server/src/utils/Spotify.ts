import SpotifyWebApi from "spotify-web-api-node";

import { IMusic } from "../interfaces";

import { NotFoundError } from "./ServerErrors";

class Spotify {
    private static instance: Spotify;
    private spotify: SpotifyWebApi;

    constructor() {
        Spotify.instance = this;

        this.spotify = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        });
    }

    public static async Start() {
        await Spotify.instance.spotify
            .clientCredentialsGrant()
            .then((response) => {
                Spotify.instance.spotify.setAccessToken(
                    response.body["access_token"]
                );

                console.info("Spotify iniciado.");
            })
            .catch((error) => {
                console.error(
                    `Houve um erro ao iniciar o Spotify...\nError: ${error}`
                );
            });
    }

    public static async Search(query: string): Promise<IMusic[]> {
        return new Promise<IMusic[]>(async (resolve, reject) => {
            return await Spotify.instance.spotify
                .searchTracks(query)
                .then((response) => {
                    const items = response.body.tracks?.items;

                    if (!items) {
                        return reject(
                            new NotFoundError(
                                `Musica ${query} não encontrada...`
                            )
                        );
                    }

                    return resolve(
                        items.map((track) => {
                            const name = track.name;
                            const artist = track.artists[0].name;

                            return { name, artist } as IMusic;
                        })
                    );
                })
                .catch((error) => {
                    return reject(error);
                });
        });
    }
}

export { Spotify };
