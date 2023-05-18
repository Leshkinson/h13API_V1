import {Module} from "@nestjs/common";
import {BlogsService} from "./blogs.service";
import {blogsProviders} from "./blogs.providers";
import {BlogsController} from "./blogs.controller";
import {BlogsRepository} from "./blogs.repository";
import {DatabaseModule} from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [BlogsController],
    providers: [BlogsService,
        {
            provide: 'blogRepository',
            useValue: BlogsRepository,
        }, ...blogsProviders,
    ],
})
export class BlogsModule {
}
