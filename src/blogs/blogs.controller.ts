import { Controller, Get, Post, Body, Put, Param, Delete, Query, Req, Res } from "@nestjs/common";
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { BlogsRequest } from './types/blog.type';
import { IBlog } from './interface/blog.interface';
//import { UpdateBlogDto } from './dto/update-blog.dto';
import { Request, Response } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post()
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogsService.createBlog(createBlogDto);
  }

  @Get()
  public async getAllBlogs(@Req() req: Request, @Res() res: Response) {
    try {
      let { pageNumber, pageSize, sortBy, searchNameTerm, sortDirection } =
        req.query as BlogsRequest;
      pageNumber = Number(pageNumber ?? 1);
      pageSize = Number(pageSize ?? 10);
      const blogs: IBlog[] = await this.blogsService.findAllBlogs(
        searchNameTerm,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection,
      );
      const totalCount: number = await queryService.getTotalCountForBlogs(searchNameTerm);

      res.status(200).json({
        pagesCount: Math.ceil(totalCount / pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: blogs,
      });
    } catch (error) {
      if (error instanceof Error)
        throw new Error(error.message);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
  //   return this.blogsService.update(+id, updateBlogDto);
  // }
  //
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.blogsService.remove(+id);
  // }
}
