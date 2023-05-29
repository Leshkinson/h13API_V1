import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
import { IBlog, ICreateBlogDto } from "../interface/blog.interface";
export class CreateBlogDto implements ICreateBlogDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(15)
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Matches("/^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$/")
    readonly websiteUrl: string;

    constructor(props: ICreateBlogDto) {
        this.name = props.name;
        this.description = props.description;
        this.websiteUrl = props.websiteUrl;
    }
}
