import { ICreatePostDtoWithoutIdAndName } from "../interface/post.interface";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

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

    constructor(props: ICreatePostDtoWithoutIdAndName) {
        this.title = props.title;
        this.shortDescription = props.shortDescription;
        this.content = props.content;
    }
}

export class CreatePostDto extends CreatePostDtoWithoutIdAndName {
    @IsString()
    @IsNotEmpty()
    readonly blogId: string;

    constructor(props: ICreatePostDtoWithoutIdAndName, blogId: string) {
        super(props);
        this.blogId = blogId;
    }
}
