import { Inject, Injectable } from "@nestjs/common";
import { CreateSessionDto } from "./dto/create-session.dto";
import { UpdateSessionDto } from "./dto/update-session.dto";
import { SessionsRepository } from "./sessions.repository";
import { ISession } from "./interface/session.interface";
import { SessionModel } from "./schema/session.schema";

@Injectable()
export class SessionsService {
    constructor(@Inject("sessionRepository") private readonly sessionRepository: SessionsRepository) {
        this.sessionRepository = new SessionsRepository(SessionModel);
    }
    public async generateSession(ip: string, title: string = "unKnown", userId: string): Promise<ISession> {
        const deviceId = uuidv4();
        return this.sessionRepository.createDeviceSession(ip, title, userId, new Date().toISOString(), deviceId);
    }

    public async findSession(deviceId: string): Promise<ISession | null> {
        return this.sessionRepository.find(deviceId);
    }

    public async updateSession(deviceId: string): Promise<ISession | null> {
        return this.sessionRepository.update(deviceId, new Date().toISOString());
    }

    public async getAllSessionByUser(userId: string): Promise<ISession[] | null> {
        return this.sessionRepository.findAll(userId);
    }

    public async deleteSessionWithExcept(userId: string, deviceId: string): Promise<void> {
        await this.sessionRepository.deleteAllWithExcept(userId, deviceId);
    }

    public async deleteTheSession(userId: string, deviceId: string): Promise<void> {
        await this.sessionRepository.deleteOne(userId, deviceId);
    }
}
