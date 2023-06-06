import { IsBlogIdCheck } from "../../pipes/validation.pipes";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ICreatePostDtoWithoutIdAndName } from "../interface/post.interface";

export class CreatePostDtoWithoutIdAndName implements ICreatePostDtoWithoutIdAndName {
    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    readonly shortDescription: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    readonly content: string;
}

export class CreatePostDto extends CreatePostDtoWithoutIdAndName {
    @IsString()
    @IsNotEmpty()
    @IsBlogIdCheck({ message: "BlogId has incorrect value. (BlogId not found)" })
    readonly blogId: string;
    constructor(blogId) {
        super();
        this.blogId = blogId;
    }
}
