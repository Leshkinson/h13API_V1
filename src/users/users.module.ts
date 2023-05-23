import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { usersProviders } from "./users.providers";
import { UsersController } from "./users.controller";
import { UsersRepository } from "./users.repository";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [UsersController],
    providers: [
        UsersService,
        {
            provide: "userRepository",
            useValue: UsersRepository,
        },
        ...usersProviders,
    ],
})
export class UsersModule {}
