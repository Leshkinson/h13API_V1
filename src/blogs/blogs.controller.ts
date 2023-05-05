import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    Req,
    Res,
    HttpStatus,
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { BlogsRequest } from "./types/blog.type";
import { IBlog } from "./interface/blog.interface";
import { Request, Response } from "express";
import { UpdateBlogDto } from "./dto/update-blog.dto";

@Controller("blogs")
export class BlogsController {
    constructor(private readonly blogsService: BlogsService) {}

    @Post()
    public async create(
        @Body() createBlogDto: CreateBlogDto,
        @Res() res: Response,
    ) {
        try {
            return this.blogsService.createBlog(createBlogDto);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }

    @Get()
    public async getAllBlogs(@Req() req: Request, @Res() res: Response) {
        try {
            let {
                pageNumber,
                pageSize,
                sortBy,
                searchNameTerm,
                sortDirection,
            } = req.query as BlogsRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);
            const blogs: IBlog[] = await this.blogsService.findAllBlogs(
                searchNameTerm,
                pageNumber,
                pageSize,
                sortBy,
                sortDirection,
            );
            const totalCount: number = await queryService.getTotalCountForBlogs(
                searchNameTerm,
            );

            res.status(200).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: blogs,
            });
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.blogsService.findOne(+id);
    }

    @Put(":id")
    public async update(
        @Param("id") id: string,
        @Res() res: Response,
        @Body() updateBlogDto: UpdateBlogDto,
    ) {
        const updateBlog = await this.blogsService.update(+id, updateBlogDto);
        if (updateBlog) res.sendStatus(HttpStatus.NO_CONTENT);
    }

    @Delete(":id")
    public async remove(@Param("id") id: string, @Res() res: Response) {
        try {
            return this.blogsService.delete(id);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}
