import { ICreateBlogDto } from "../interface/blog.interface";
import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
export class CreateBlogDto implements ICreateBlogDto {
    @MaxLength(15)
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @MaxLength(500)
    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @Matches(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[^\s]*)?$/)
    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    readonly websiteUrl: string;
}
