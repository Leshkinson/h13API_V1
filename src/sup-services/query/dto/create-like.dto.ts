import { ILike } from "../interface/like.interface";
import { LikesStatusType } from "../types/like.type";
import { IsLikeStatusCheck } from "../../../pipes/validation.pipes";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLikeStatusDto implements ILike {
    @IsString()
    @IsNotEmpty()
    @IsLikeStatusCheck({ message: "LikeStatus does not match type. (LikeStatus have wrong type)" })
    readonly like: LikesStatusType;

    constructor(props: ILike) {
        this.like = props.like;
    }
}
