import { Document } from "mongoose";
import * as mongoose from "mongoose";

export interface IPost extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    extendedLikesInfo: ExtendedLikesInfo;
}
