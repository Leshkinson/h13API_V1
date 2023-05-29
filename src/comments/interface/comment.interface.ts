import { LikeInfo } from "../../sup-services/query/interface/like.interface";
import mongoose from "mongoose";

export interface IContent {
    content: string;
}

export interface IComment extends IContent {
    _id: mongoose.Schema.Types.ObjectId;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    likesInfo: LikeInfo;
}