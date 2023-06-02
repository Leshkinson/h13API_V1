import { LikesStatusType } from "../sup-services/query/types/like.type";
import { JwtPayload } from "jsonwebtoken";

export const LIKE_STATUS: LikesStatusType = {
    LIKE: "Like",
    DISLIKE: "Dislike",
    NONE: "None",
};

export const TAG_REPOSITORY: TagRepositoryType = {
    PostsRepository: "PostsRepository",
    CommentsRepository: "CommentsRepository",
};

export type TagRepositoryType = {
    PostsRepository: "PostsRepository";
    CommentsRepository: "CommentsRepository";
};

const TagRepository_CFG = {
    PostsRepository: "PostsRepository",
    CommentsRepository: "CommentsRepository",
} as const;

type TagRepositoryTypeCfgKeys = keyof typeof TagRepository_CFG;
export type TagRepositoryTypeCfgValues = (typeof TagRepository_CFG)[TagRepositoryTypeCfgKeys];

export interface JWT extends JwtPayload {
    id: string;
    email: string;
    deviceId: string;
}

export const SETTINGS_TOKEN = {
    JWT_ACCESS_SECRET: "superpupersecret",
    JWT_REFRESH_SECRET: "superpupermegasecret",
    TOKEN_ACCESS_LIVE_TIME: "10m",
    TOKEN_REFRESH_LIVE_TIME: "100m",
};