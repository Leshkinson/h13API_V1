import { Controller, Get, Post, Body, Put, Param, Delete, Req, Res, HttpStatus } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { BlogsRequest, BlogsRequestWithoutSNT } from "./types/blog.type";
import { IBlog } from "./interface/blog.interface";
import { Request, Response } from "express";
import { UpdateBlogDto } from "./dto/update-blog.dto";
import { IPost } from "../posts/interface/post.interface";
import { CreatePostDto } from "../posts/dto/create-post.dto";

@Controller("blogs")
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @Post()
    public async create(@Body() createBlogDto: CreateBlogDto, @Res() res: Response) {
        try {
            const newBlog: IBlog = await this.blogsService.createBlog(createBlogDto);
            res.status(HttpStatus.CREATED).json(newBlog);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get()
    public async findAllBlogs(@Req() req: Request, @Res() res: Response) {
        try {
            let { pageNumber, pageSize, sortBy, searchNameTerm, sortDirection } = req.query as BlogsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);
            const blogs: IBlog[] = await this.blogsService.findAllBlogs(
                searchNameTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            );
            const totalCount: number = await this.blogsService.getTotalCountForBlogs(searchNameTerm);

            res.status(HttpStatus.OK).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogs,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get(":id")
    public async findOne(@Param("id") id: string, @Res() res: Response) {
        try {
            const findBlog: IBlog | undefined = await this.blogsService.findOne(id);
            res.status(HttpStatus.OK).json(findBlog);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Put(":id")
    public async update(@Param("id") id: string, @Res() res: Response, @Body() updateBlogDto: UpdateBlogDto) {
        try {
            const updateBlog = await this.blogsService.update(+id, updateBlogDto);
            if (updateBlog) res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Delete(":id")
    public async remove(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.blogsService.delete(id);
            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get()
    public async getAllPostForTheBlog(@Param("blogId") blogId: string, @Req() req: Request, @Res() res: Response) {
        try {
            let { pageNumber, pageSize, sortDirection, sortBy } = req.query as BlogsRequestWithoutSNT;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const posts: IPost[] = await queryService.getPostsForTheBlog(
                blogId,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            );
            const totalCount: number = await queryService.getTotalCountPostsForTheBlog(blogId);
            if (posts) {
                res.status(HttpStatus.CREATED).json({
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: await queryService.getUpgradePosts(posts, token, postService),
                });
            }
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    @Post()
    public async createPostTheBlog(
        @Param("blogId") blogId: string,
        @Body() createPostDto: CreatePostDto,
        @Req() req: Request,
        @Res() res: Response,
    ) {
        try {
            const newPost: IPost | undefined = await queryService.createPostForTheBlog(blogId, createPostDto);

            if (newPost) res.status(HttpStatus.CREATED).json(newPost);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
