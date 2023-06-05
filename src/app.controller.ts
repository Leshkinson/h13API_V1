import { Controller, Delete } from "@nestjs/common";
import { BlogsService } from "./blogs/blogs.service";
import { UsersService } from "./users/users.service";
import { PostsService } from "./posts/posts.service";
import { CommentsService } from "./comments/comments.service";
import { QueryService } from "./sup-services/query/query.service";

@Controller()
export class AppController {
    constructor(
        private readonly blogService: BlogsService,
        private readonly usersService: UsersService,
        private readonly commentsService: CommentsService,
        private readonly postsService: PostsService,
        private readonly queryService: QueryService,
    ) {}

    @Delete("testing/all-data")
    async deleteAll(): Promise<void> {
        await this.blogService.testingDelete();
        await this.postsService.testingDelete();
        await this.usersService.testingDelete();
        await this.queryService.testingDelete();
        await this.commentsService.testingDelete();
    }
}
