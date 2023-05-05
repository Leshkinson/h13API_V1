import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    readonly title: string;
    readonly shortDescription: string;
    readonly content: string;
    readonly blogId: string;
}
