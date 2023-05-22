import { Controller, Get, Post, Body, Put, Param, Delete, Res, HttpStatus, Req } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { CreatePostDto } from "./dto/create-post.dto";
import { Request, Response } from "express";
import { UpdatePostDto } from "./dto/update-post.dto";
import { IPost } from "./interface/post.interface";
import { PostsRequest } from "./types/post.types";
import { RefType } from "mongoose";
import { QueryService } from "../sup-services/query/query.service";

@Controller("posts")
export class PostsController {
    constructor(private readonly postsService: PostsService, private readonly queryService: QueryService) {}

    @Post()
    public async create(@Body() createPostDto: CreatePostDto, @Res() res: Response) {
        try {
            return this.postsService.create(createPostDto);
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
                    items: await this.queryService.getUpgradePosts(posts, token),
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
    public async findOne(@Param("id") id: string) {
        return this.postsService.findOne(+id);
    }

    @Put(":id")
    public async update(@Param("id") id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postsService.update(+id, updatePostDto);
    }

    @Delete(":id")
    public async delete(@Param("id") id: string) {
        return this.postsService.delete(id);
    }

    //@Delete
}
