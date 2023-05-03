import { RefType, SortOrder } from 'mongoose';
import { IBlog } from './interface/blog.interface';
import { Injectable } from '@nestjs/common';
import { CreateBlogDto } from './dto/create-blog.dto';
//import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogsRepository } from './blogs.repository';
import { BlogModel } from './schema/blog.schema';

@Injectable()
export class BlogsService {
  constructor(private readonly blogRepository: BlogsRepository) {
    this.blogRepository = new BlogsRepository(BlogModel);
  }
  public async createBlog(createBlogDto: CreateBlogDto): Promise<IBlog> {
    return this.blogRepository.create(createBlogDto);
  }

  public async findAllBlogs(
    searchNameTerm: string | undefined | object,
    pageNumber: number = 1,
    pageSize: number = 10,
    sortBy: string = 'createdAt',
    sortDirection: SortOrder | undefined = 'desc',
  ): Promise<IBlog[]> {
    if (searchNameTerm)
      searchNameTerm = {
        name: { $regex: new RegExp(`.*${searchNameTerm}.*`, 'i') },
      };
    const skip: number = Number((pageNumber - 1) * pageSize);
    return this.blogRepository.findAll(
      searchNameTerm,
      skip,
      pageSize,
      sortBy,
      sortDirection,
    );
  }

  public async findOne(id: RefType): Promise<IBlog | undefined> {
    const blog = await this.blogRepository.find(id);
    if (!blog) throw new Error();

    return blog;
  }

  public async update(
    id: RefType,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<IBlog | undefined> {
    const updateBlog: IBlog | undefined | null = await this.blogRepository.updateBlog(id, name, description, websiteUrl);
    if (updateBlog) return updateBlog;
    throw new Error();
  }

  public async delete(id: RefType): Promise<IBlog> {
    const deleteBlog = await this.blogRepository.delete(id);
    if (deleteBlog) return deleteBlog;
    throw new Error();
  }

  public async testingDelete(): Promise<void> {
    await this.blogRepository.deleteAll();
  }
}
