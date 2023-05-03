import { Model, RefType, SortOrder } from "mongoose";
import { IBlog } from "./interface/blog.interface";
import { Inject, Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";

@Injectable()
export class BlogsRepository {
  constructor(@Inject("Blog") private readonly blogModel: Model<IBlog>) {
  }

  public async create(createBlogDto: CreateBlogDto): Promise<IBlog> {
    return this.blogModel.create(createBlogDto);
  }

  public async findAll(
    searchNameTerm: { name: { $regex: RegExp } } | {} = {},
    skip: number = 0,
    limit: number = 10,
    sortBy: string = "createdAt",
    sortDirection: SortOrder = "desc",
  ): Promise<IBlog[]> {
    return this.blogModel
      .find(searchNameTerm)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(limit);
  }

  public async find(id: RefType): Promise<IBlog | null> {
    return this.blogModel.findById({ _id: id });
  }

  public async updateBlog(
    id: RefType,
    name: string,
    description: string,
    websiteUrl: string,
  ): Promise<IBlog | null> {
    return this.blogModel.findOneAndUpdate({ _id: id }, {
        name,
        description,
        websiteUrl,
      },
    );
  }

  public async delete(id: RefType) {
    return this.blogModel.findOneAndDelete({ _id: id });
  }

  public async deleteAll() {
    return this.blogModel.deleteMany();
  }
}
