import { IPost } from "./interface/post.interface";
import { Inject, Injectable } from "@nestjs/common";
import { Model, RefType, SortOrder } from "mongoose";
import { UpdatePostDto } from "./dto/update-post.dto";
import { CreatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostsRepository {
    constructor(@Inject("Post") private readonly postModel: Model<IPost>) {}

    public async create(createPostDto: CreatePostDto, blogName: string): Promise<IPost> {
        return this.postModel.create({ ...createPostDto, blogName });
    }

    public async findAll(
        blogId?: RefType,
        pageNumber: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        skip: number = 0,
        sortDirection: SortOrder = "desc",
    ): Promise<IPost[]> {
        if (blogId) {
            return this.postModel
                .find({ blogId })
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit);
        }
        return this.postModel
            .find()
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit);
    }

    public async find(id: RefType): Promise<IPost | null> {
        return this.postModel.findById({ _id: id });
    }

    public async updatePost(id: RefType, updatePostDto: UpdatePostDto): Promise<IPost | null> {
        return this.postModel.findOneAndUpdate({ _id: id }, updatePostDto);
    }

    public async deletePost(id: RefType) {
        return this.postModel.findOneAndDelete({ _id: id });
    }

    public async getTotalCount(): Promise<number> {
        return this.postModel.find().count();
    }

    public async getTotalCountWithFilter(param: string): Promise<number> {
        return this.postModel.find({ blogId: param }).count();
    }

    public async deleteAll() {
        return this.postModel.deleteMany();
    }
}
