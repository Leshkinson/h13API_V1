import {Module} from "@nestjs/common";
import {PostsService} from "./posts.service";
import {postsProviders} from "./posts.providers";
import {PostsController} from "./posts.controller";
import {PostsRepository} from "./posts.repository";
import {BlogsRepository} from "../blogs/blogs.repository";
import {DatabaseModule} from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [PostsController],
    providers: [PostsService,
        {
            provide: 'postRepository',
            useValue: PostsRepository,
        }, {
            provide: 'blogRepository',
            useValue: BlogsRepository,
        }, ... postsProviders,
    ],
})
export class PostsModule {
}
