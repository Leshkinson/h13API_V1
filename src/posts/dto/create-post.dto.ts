import { IsBlogIdCheck } from "../../pipes/validation.pipes";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ICreatePostDtoWithoutIdAndName } from "../interface/post.interface";

export class CreatePostDtoWithoutIdAndName implements ICreatePostDtoWithoutIdAndName {
    @MaxLength(30)
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    readonly shortDescription: string;

    @MaxLength(1000)
    @IsString()
    @IsNotEmpty()
    readonly content: string;
    constructor(title, shortDescription, content) {
        this.title = title;
        this.shortDescription = shortDescription;
        this.content = content;
    }
}

export class CreatePostDto extends CreatePostDtoWithoutIdAndName {
    @IsBlogIdCheck({ message: "BlogId has incorrect value. (BlogId not found)" })
    @IsString()
    @IsNotEmpty()
    readonly blogId: string;
    constructor(title, shortDescription, content, blogId) {
        super(title, shortDescription, content);
        this.blogId = blogId;
    }
}
