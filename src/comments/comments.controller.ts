import { Response, Request } from "express";
import { AuthService } from "../auth/auth.service";
import { CommentsService } from "./comments.service";
import { UsersService } from "../users/users.service";
import { IComment } from "./interface/comment.interface";
//import { UpdateCommentDto } from "./dto/update-comment.dto";
import { JWT, LIKE_STATUS, TAG_REPOSITORY } from "../const/const";
import { QueryService } from "../sup-services/query/query.service";
import { LikesStatusCfgValues } from "../sup-services/query/types/like.type";
import { Controller, Get, Body, Param, Delete, Put, Res, HttpStatus, Req } from "@nestjs/common";

@Controller("comments")
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService,
        private readonly queryService: QueryService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Get(":id")
    async findOne(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const findComment: IComment | undefined = await this.commentsService.getOne(id);
            if (findComment) {
                if (token) {
                    const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
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
                        res.status(HttpStatus.OK).json(findComment);

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
                res.status(HttpStatus.OK).json(findComment);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Put(":commentId")
    async update(
        @Param("commentId") commentId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Body() content: string,
    ) {
        try {
            const token: string | undefined = req.headers.authorization?.split(" ")[1];
            if (token) {
                const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);
                const comment: IComment | undefined = await this.commentsService.getOne(commentId);
                if (!user || !comment) {
                    res.sendStatus(HttpStatus.NOT_FOUND);

                    return;
                }
                if (comment?.commentatorInfo.userLogin !== user?.login) {
                    res.sendStatus(HttpStatus.FORBIDDEN);

                    return;
                }
                if (comment?.commentatorInfo.userId !== user?._id.toString()) {
                    res.sendStatus(HttpStatus.FORBIDDEN);

                    return;
                }
                const updatedComment: IComment | undefined = await this.commentsService.update(commentId, content);

                if (updatedComment) res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Delete(":commentId")
    async delete(@Param("commentId") id: string, @Req() req: Request, @Res() res: Response) {
        try {
            const token: string | undefined = req.headers.authorization?.split(" ")[1];
            if (token) {
                const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);

                if (!user) {
                    res.sendStatus(HttpStatus.NOT_FOUND);

                    return;
                }

                const comment: IComment | undefined = await this.commentsService.getOne(id);

                if (!comment) {
                    res.sendStatus(HttpStatus.NOT_FOUND);

                    return;
                }
                if (comment?.commentatorInfo.userLogin !== user?.login) {
                    res.sendStatus(HttpStatus.FORBIDDEN);

                    return;
                }

                if (comment?.commentatorInfo.userId !== user?._id.toString()) {
                    res.sendStatus(HttpStatus.FORBIDDEN);

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

    @Put(":commentId/like-status")
    async sendLikeOrDislikeStatus(
        @Param("commentId") commentId: string,
        @Req() req: Request,
        @Res() res: Response,
        @Body() likeStatus: string,
    ) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                await this.queryService.setUpLikeOrDislikeStatus(
                    token,
                    commentId,
                    likeStatus,
                    TAG_REPOSITORY.CommentsRepository,
                );

                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
