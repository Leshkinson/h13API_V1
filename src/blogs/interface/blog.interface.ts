import * as mongoose from "mongoose";

export interface ICreateBlogDto {
    readonly name: string;
    readonly description: string;
    readonly websiteUrl: string;
}

export interface IBlog extends ICreateBlogDto {
    readonly _id: mongoose.Schema.Types.ObjectId;
}
