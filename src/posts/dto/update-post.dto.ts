import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { IsNotEmpty, IsString, MaxLength, Validate } from "class-validator";
import { IsBlogIdCheck, TrimStringValidator } from "../../pipes/validation.pipes";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @MaxLength(30)
    @IsString()
    @IsNotEmpty()
    @Validate(TrimStringValidator)
    readonly title: string;

    @MaxLength(100)
    @IsString()
    @IsNotEmpty()
    @Validate(TrimStringValidator)
    readonly shortDescription: string;

    @MaxLength(1000)
    @IsString()
    @IsNotEmpty()
    @Validate(TrimStringValidator)
    readonly content: string;

    @IsBlogIdCheck({ message: "BlogId has incorrect value. (BlogId not found)" })
    @IsString()
    @IsNotEmpty()
    @Validate(TrimStringValidator)
    readonly blogId: string;
}
