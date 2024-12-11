import { CustomRepository, getRepository } from "fireorm";

import { Badge } from "../entities";

import { BaseRepository } from "./BaseRepository";

@CustomRepository(Badge)
class BadgeRepository extends BaseRepository<Badge> {}

export const badgeRepository = getRepository(Badge) as BadgeRepository;
