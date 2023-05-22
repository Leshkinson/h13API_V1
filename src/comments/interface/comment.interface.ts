import { LikeInfo } from "../../sup-services/query/interface/like.interface";
import mongoose from "mongoose";

export interface IComment {
    _id: mongoose.Schema.Types.ObjectId;
    content: string;
    commentatorInfo: {
        userId: string;
        userLogin: string;
    };
    likesInfo: LikeInfo;
}
