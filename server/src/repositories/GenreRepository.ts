import { CustomRepository, getRepository } from "fireorm";

import { Genre } from "../entities";

import { BaseRepository } from "./BaseRepository";

@CustomRepository(Genre)
class GenreRepository extends BaseRepository<Genre> {}

export const genreRepository = getRepository(Genre) as GenreRepository;
