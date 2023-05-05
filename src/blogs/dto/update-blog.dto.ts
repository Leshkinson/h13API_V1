import { PartialType } from "@nestjs/mapped-types";
import { CreateBlogDto } from "./create-blog.dto";

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    readonly name: string;
    readonly description: string;
    readonly websiteUrl: string;
}
