import { Module } from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { blogsProviders } from "./blogs.providers";
import { BlogsController } from "./blogs.controller";
import { BlogsRepository } from "./blogs.repository";
import { DatabaseModule } from "../database/database.module";
import { QueryService } from "../sup-services/query/query.service";
import { likesProviders } from "../sup-services/query/like.providers";
import { LikesRepository } from "../sup-services/query/like.repository";
import { PostsRepository } from "../posts/posts.repository";
import { postsProviders } from "../posts/posts.providers";

@Module({
    imports: [DatabaseModule],
    controllers: [BlogsController],
    providers: [
        BlogsService,
        QueryService,
        {
            provide: "blogRepository",
            useValue: BlogsRepository,
        },
        {
            provide: "postRepository",
            useValue: PostsRepository,
        },
        {
            provide: "likeRepository",
            useValue: LikesRepository,
        },
        ...blogsProviders,
        ...likesProviders,
        ...postsProviders,
    ],
})
export class BlogsModule {}
