import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";
import {UsersRepository} from "./users.repository";

@Module({
    controllers: [UsersController],
    providers: [UsersService, {
        provide: 'userRepository',
        useValue: UsersRepository,
    },
    ],
})
export class UsersModule {
}
