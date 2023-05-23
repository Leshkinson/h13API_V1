import { Controller, Get, Body, Param, Delete, Put, Res, HttpStatus } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { Response } from "express";
import { IComment } from "./interface/comment.interface";
import { LikesStatusCfgValues } from "../sup-services/query/types/like.type";
import { QueryService } from "../sup-services/query/query.service";
import { LIKE_STATUS, TAG_REPOSITORY } from "../const/const";
import { UsersService } from "../users/users.service";

@Controller("comments")
export class CommentsController {
    constructor(private readonly commentsService: CommentsService, private readonly queryService: QueryService, private readonly usersService: UsersService) {}

    @Get(":id")
    async findOne(@Param("id") id: string, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const findComment: IComment | undefined = await this.commentsService.getOne(id);
            if (findComment) {
                if (token) {
                    const payload = (await tokenService.getPayloadByAccessToken(token)) as JWT;
                    const user = await this.usersService.getUserById(payload.id);
                    if (user) {
                        findComment.likesInfo.likesCount = await this.queryService.getTotalCountLikeOrDislike(
                            id,
                            LIKE_STATUS.LIKE,
                            TAG_REPOSITORY.CommentsRepository,
                        );
                        findComment.likesInfo.dislikesCount = await this.queryService.getTotalCountLikeOrDislike(
                            id,
                            LIKE_STATUS.DISLIKE,
                            TAG_REPOSITORY.CommentsRepository,
                        );
                        const myStatus = (await this.queryService.getLikeStatus(
                            String(user._id),
                            String(findComment._id),
                        )) as LikesStatusCfgValues;
                        if (myStatus) findComment.likesInfo.myStatus = myStatus;
                        res.status(200).json(findComment);

                        return;
                    }
                }
                findComment.likesInfo.likesCount = await this.queryService.getTotalCountLikeOrDislike(
                    id,
                    LIKE_STATUS.LIKE,
                    TAG_REPOSITORY.CommentsRepository,
                );
                findComment.likesInfo.dislikesCount = await this.queryService.getTotalCountLikeOrDislike(
                    id,
                    LIKE_STATUS.DISLIKE,
                    TAG_REPOSITORY.CommentsRepository,
                );
                res.status(200).json(findComment);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    @Put(":id")
    async update(
        @Param("commentId") commentId: string,
        @Res() res: Response,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        try {
            if (token) {
                const payload = (await tokenService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);
                const comment: IComment | undefined = await this.commentsService.getOne(commentId);
                if (!user || !comment) {
                    res.sendStatus(404);

                    return;
                }
                if (comment?.commentatorInfo.userLogin !== user?.login) {
                    res.sendStatus(403);

                    return;
                }
                if (comment?.commentatorInfo.userId !== user?._id.toString()) {
                    res.sendStatus(403);

                    return;
                }
                const updatedComment: IComment | undefined = await this.commentsService.update(commentId, content);

                if (updatedComment) res.sendStatus(204);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    @Delete(":id")
    async delete(@Param("id") id: string, @Res() res: Response) {
        try {
            if (token) {
                const payload = (await tokenService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);

                if (!user) {
                    res.sendStatus(404);

                    return;
                }

                const comment: IComment | undefined = await this.commentsService.getOne(id);

                if (!comment) {
                    res.sendStatus(404);

                    return;
                }
                if (comment?.commentatorInfo.userLogin !== user?.login) {
                    res.sendStatus(403);

                    return;
                }

                if (comment?.commentatorInfo.userId !== user?._id.toString()) {
                    res.sendStatus(403);

                    return;
                }

                await this.commentsService.delete(id);

                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Put()
    async sendLikeOrDislikeStatus(
        @Param("commentId") commentId: string,
        @Res() res: Response,
        @Body() likeStatus: string,
    ) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                await this.queryService.setUpLikeOrDislikeStatus(token, commentId, likeStatus, TAG_REPOSITORY.CommentsRepository);

                res.sendStatus(204);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
