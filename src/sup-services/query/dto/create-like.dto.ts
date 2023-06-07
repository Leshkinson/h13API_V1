import { ILike } from "../interface/like.interface";
import { LikesStatusType } from "../types/like.type";
import { IsNotEmpty, IsString } from "class-validator";
import { IsLikeStatusCheck } from "../../../pipes/validation.pipes";

export class CreateLikeStatusDto implements ILike {
    @IsString()
    @IsNotEmpty()
    @IsLikeStatusCheck({ message: "LikeStatus does not match type. (LikeStatus have wrong type)" })
    readonly likeStatus: LikesStatusType;
}
