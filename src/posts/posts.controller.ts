import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Request, Response } from "express";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interface/post.interface";
import { PostsRequest } from "./types/post.types";
import { RefType } from "mongoose";
import { QueryService } from "../sup-services/query/query.service";
import { TAG_REPOSITORY } from "../const/const";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService, private readonly queryService: QueryService) {}

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
            let { pageNumber, pageSize, sortBy, sortDirection } = req.query as PostsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const posts: IPost[] = await this.postsService.findAllPosts( pageNumber, pageSize, sortBy, sortDirection);

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
    public async getOne(@Param("id") id: string, @Res() res: Response) {
        try {
            //const token = req.headers.authorization?.split(" ")[1];
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
}
