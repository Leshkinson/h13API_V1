import { Model, RefType, SortOrder } from "mongoose";
import { IPost } from "./interface/post.interface";
import { Inject, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./dto/create-post.dto";
import { UpdatePostDto } from "./dto/update-post.dto";

@Injectable()
export class PostsRepository {
    constructor(@Inject("IPost") private readonly postModel: Model<IPost>) {}

    public async create(createPostDto: CreatePostDto): Promise<IPost> {
        return this.postModel.create(createPostDto);
    }

    public async findAll(
        pageNumber: number = 1,
        limit: number = 10,
        sortBy: string = "createdAt",
        skip: number = 0,
        sortDirection: SortOrder = "desc",
    ): Promise<IPost[]> {
        return this.postModel
            .find()
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit);
    }

    public async find(id: RefType): Promise<IPost | null> {
        return this.postModel.findById({ _id: id });
    }

    public async updatePost(
        id: RefType,
        updatePostDto: UpdatePostDto,
    ): Promise<IPost | null> {
        return this.postModel.findOneAndUpdate({ _id: id }, updatePostDto);
    }

    public async deletePost(id: RefType) {
        return this.postModel.findOneAndDelete({ _id: id });
    }

    public async deleteAll() {
        return this.postModel.deleteMany();
    }
}
