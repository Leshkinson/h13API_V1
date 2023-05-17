import {Module} from "@nestjs/common";
import {PostsService} from "./posts.service";
import {PostsController} from "./posts.controller";
import {PostsRepository} from "./posts.repository";
import {BlogsRepository} from "../blogs/blogs.repository";

@Module({
    controllers: [PostsController],
    providers: [PostsService, {
        provide: 'postRepository',
        useValue: PostsRepository,
    }, {
        provide: 'blogRepository',
        useValue: BlogsRepository,
    },
    ],
})
export class PostsModule {
}
