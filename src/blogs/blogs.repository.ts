import { Model, RefType, SortOrder } from "mongoose";
import { IBlog } from "./interface/blog.interface";
import { Inject, Injectable } from "@nestjs/common";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { UpdateBlogDto } from "./dto/update-blog.dto";
//import {InjectModel} from "@nestjs/mongoose";

@Injectable()
export class BlogsRepository {
    constructor(@Inject("BLOG_MODEL") private readonly blogModel: Model<IBlog>) {}

    public async create(createBlogDto: CreateBlogDto): Promise<IBlog> {
        return this.blogModel.create({ ...createBlogDto, isMembership: false });
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

    public async updateBlog(id: RefType, updateBlogDto: UpdateBlogDto): Promise<IBlog | null> {
        return this.blogModel.findOneAndUpdate({ _id: id }, updateBlogDto);
    }

    public async delete(id: RefType) {
        return this.blogModel.findOneAndDelete({ _id: id });
    }

    public async getBlogsCount(searchNameTerm: { name: { $regex: RegExp } } | {} = {}): Promise<number> {
        return this.blogModel.countDocuments(searchNameTerm);
    }

    public async deleteAll() {
        return this.blogModel.deleteMany();
    }
}
