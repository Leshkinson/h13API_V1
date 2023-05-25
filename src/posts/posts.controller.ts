import { RefType } from "mongoose";
import { Request, Response } from "express";
import { PostsService } from "./posts.service";
import { JWT, LIKE_STATUS, TAG_REPOSITORY } from "../const/const";
import { PostsRequest } from "./types/post.types";
import { IPost } from "./interface/post.interface";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";
import { QueryService } from "../sup-services/query/query.service";
import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { IComment } from "../comments/interface/comment.interface";
import { CommentsRequest } from "../comments/types/comment.type";
import { LikesStatusCfgValues } from "../sup-services/query/types/like.type";
import { UsersService } from "../users/users.service";
import { AuthService } from "../auth/auth.service";

@Controller("posts")
export class PostsController {
    constructor(
        private readonly postsService: PostsService,
        private readonly queryService: QueryService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
    ) {}

    @Post()
    public async create(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
        try {
            const newPost: IPost | undefined = await this.postsService.create(createPostDto);
            if (newPost) {
                res.status(HttpStatus.CREATED).json(newPost);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get()
    public async getAllPosts(@Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            // eslint-disable-next-line prefer-const
            let { pageNumber, pageSize, sortBy, sortDirection } = req.query as PostsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const posts: IPost[] = await this.postsService.findAllPosts(pageNumber, pageSize, sortBy, sortDirection);

            const totalCount: number = await this.postsService.getTotalCountForPosts();
            if (posts) {
                res.status(HttpStatus.OK).json({
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: await this.queryService.getUpgradePosts(posts, token, TAG_REPOSITORY.PostsRepository),
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get(":id")
    public async getOne(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const findPost: IPost | undefined = await this.postsService.findOne(id);
            if (findPost) {
                const newFindPost = await this.queryService.getUpgradePosts(
                    findPost,
                    token,
                    TAG_REPOSITORY.PostsRepository,
                );

                res.status(HttpStatus.OK).json(newFindPost);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Put(":id")
    public async update(@Param("id") id: string, @Res() res: Response, @Body() updatePostDto: UpdatePostDto) {
        try {
            const updatePost: IPost | undefined = await this.postsService.update(id, updatePostDto);
            if (updatePost) {
                res.sendStatus(HttpStatus.NO_CONTENT);
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Delete(":id")
    public async delete(@Param("id") id: RefType, @Res() res: Response) {
        try {
            await this.postsService.delete(id);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    //@Delete

    @Post()
    public async createCommentThePost(
        @Param("postId") postId: string,
        @Body() content: string,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            // const queryService = new QueryService();
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                const newComment: IComment | undefined = await this.queryService.createCommentForThePost(
                    postId,
                    content,
                    token,
                );
                if (newComment) {
                    res.status(HttpStatus.CREATED).json(newComment);
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
    @Get(":id")
    public async getAllCommentsForThePost(@Param("postId") postId: string, @Req() req: Request, @Res() res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            // eslint-disable-next-line prefer-const
            let { pageNumber, pageSize, sortDirection, sortBy } = req.query as CommentsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const comments: IComment[] = await this.queryService.getCommentsForThePost(
                postId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            );
            const totalCount: number = await this.queryService.getTotalCountCommentsForThePost(postId);
            if (token) {
                const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
                const user = await this.usersService.getUserById(payload.id);
                if (user) {
                    const upgradeComments: Promise<IComment>[] = comments.map(async (comment: IComment) => {
                        comment.likesInfo.likesCount = await this.queryService.getTotalCountLikeOrDislike(
                            String(comment._id),
                            LIKE_STATUS.LIKE,
                            TAG_REPOSITORY.CommentsRepository,
                        );
                        comment.likesInfo.dislikesCount = await this.queryService.getTotalCountLikeOrDislike(
                            String(comment._id),
                            LIKE_STATUS.DISLIKE,
                            TAG_REPOSITORY.CommentsRepository,
                        );
                        const myStatus = (await this.queryService.getLikeStatus(
                            String(user._id),
                            String(comment._id),
                        )) as LikesStatusCfgValues;
                        if (myStatus) comment.likesInfo.myStatus = myStatus;

                        return comment;
                    });

                    res.status(200).json({
                        pagesCount: Math.ceil(totalCount / pageSize),
                        page: pageNumber,
                        pageSize: pageSize,
                        totalCount: totalCount,
                        items: await Promise.all(upgradeComments),
                    });

                    return;
                }
            }

            const upgradeComments = comments.map(async (comment) => {
                comment.likesInfo.likesCount = await this.queryService.getTotalCountLikeOrDislike(
                    String(comment._id),
                    LIKE_STATUS.LIKE,
                    TAG_REPOSITORY.CommentsRepository,
                );
                comment.likesInfo.dislikesCount = await this.queryService.getTotalCountLikeOrDislike(
                    String(comment._id),
                    LIKE_STATUS.DISLIKE,
                    TAG_REPOSITORY.CommentsRepository,
                );

                return comment;
            });
            res.status(200).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: await Promise.all(upgradeComments),
            });
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
    @Post()
    public async sendLikeOrDislikeStatus(req: Request, res: Response) {
        try {
            const { postId } = req.params;
            const { likeStatus } = req.body;
            const token = req.headers.authorization?.split(" ")[1];
            if (token) {
                await this.queryService.setUpLikeOrDislikeStatus(
                    token,
                    postId,
                    likeStatus,
                    TAG_REPOSITORY.PostsRepository,
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
