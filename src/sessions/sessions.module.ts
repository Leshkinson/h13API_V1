import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { sessionsProviders } from "./sessions.providers";
import { SessionsRepository } from "./sessions.repository";
import { SessionsController } from "./sessions.controller";
import { DatabaseModule } from "../database/database.module";

@Module({
    imports: [DatabaseModule],
    controllers: [SessionsController],
    providers: [
        SessionsService,
        {
            provide: "sessionRepository",
            useValue: SessionsRepository,
        },
        ...sessionsProviders,
    ],
})
export class SessionsModule {}
