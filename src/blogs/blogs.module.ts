import {Module} from "@nestjs/common";
import {BlogsService} from "./blogs.service";
import {BlogsController} from "./blogs.controller";
import {BlogsRepository} from "./blogs.repository";
import {INQUIRER} from "@nestjs/core";
import {blogsProviders} from "./blogs.providers";
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
