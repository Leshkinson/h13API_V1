import { ICreateBlogDto } from "../interface/blog.interface";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
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
    @Matches(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/)
    readonly websiteUrl: string;
}
