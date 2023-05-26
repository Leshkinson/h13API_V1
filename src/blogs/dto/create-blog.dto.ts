import { IsNotEmpty, IsString, Matches, MaxLength } from "class-validator";
export class CreateBlogDto {
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

    constructor(name: string, description: string, websiteUrl: string) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}
