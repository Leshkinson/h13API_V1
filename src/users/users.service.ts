import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";
import { RefType, SortOrder } from "mongoose";
import { IUser } from "./interface/user.interface";
import { UserModel } from "./schema/user.schema";
import * as bcrypt from "bcrypt";
import { uuid } from "uuidv4";
import { JwtPayload } from "jsonwebtoken";
import { IAuth } from "../auth/interface/auth.interface";
import { RegistrationDto } from "../auth/dto/auth.dto";
import { MailService } from "../sup-services/application/mailer/mail.service";
import {
    passwordConfirmedTemplate,
    userInvitationTemplate,
} from "../sup-services/application/mailer/templates/templates";

@Injectable()
export class UsersService {
    constructor(
        private readonly mailService: MailService,
        @Inject("userRepository") private readonly userRepository: UsersRepository,
    ) {
        this.userRepository = new UsersRepository(UserModel);
    }

    public async create(createUserDto: CreateUserDto) {
        return this.userRepository.create(createUserDto);
    }

    public async findAllUsers(
        sortBy: string = "createdAt",
        sortDirection: SortOrder | undefined = "desc",
        pageNumber: number = 1,
        pageSize: number = 10,
        searchLoginTerm: { login: { $regex: RegExp } } | NonNullable<unknown> = {},
        searchEmailTerm: { email: { $regex: RegExp } } | NonNullable<unknown> = {},
    ): Promise<IUser[]> {
        if (searchLoginTerm) searchLoginTerm = { login: { $regex: new RegExp(`.*${searchLoginTerm}.*`, "i") } };
        if (searchEmailTerm) searchEmailTerm = { email: { $regex: new RegExp(`.*${searchEmailTerm}.*`, "i") } };

        const skip: number = Number((pageNumber - 1) * pageSize);

        return await this.userRepository.findAll(
            sortBy,
            sortDirection,
            skip,
            pageSize,
            searchLoginTerm,
            searchEmailTerm,
        );
    }

    public async getUserByParam(param: string): Promise<IUser | null> {
        return await this.userRepository.findUserByParam(param);
    }

    public async getUserById(id: string | JwtPayload): Promise<IUser | null> {
        return await this.userRepository.find(id);
    }

    public async createByRegistration(registrationDto: RegistrationDto): Promise<IUser | null> {
        const hashPassword = await bcrypt.hash(registrationDto.password, 5);
        const code = uuid();
        const user = await this.userRepository.createUserByRegistration(
            registrationDto.login,
            hashPassword,
            registrationDto.email,
            code,
        );
        try {
            await this.mailService.sendConfirmMessage(registrationDto.email, code, userInvitationTemplate);
        } catch (error) {
            if (error instanceof Error) {
                await this.userRepository.delete(user._id.toString());
                console.log(error.message);
                return null;
            }
        }

        return user;
    }

    public async confirmUser(code: string): Promise<boolean | null | IUser> {
        const user = await this.getUserByParam(code);
        if (!user) return false;
        if (new Date(user.expirationDate).getTime() > new Date().getTime()) {
            return await this.userRepository.updateUserByConfirmed(user._id.toString());
        }
        await this.userRepository.delete(user._id.toString());

        return false;
    }

    public async confirmNewPassword(newPassword: string, recoveryCode: string): Promise<boolean | null | IUser> {
        const hashNewPassword = await bcrypt.hash(newPassword, 5);
        const user = await this.getUserByParam(recoveryCode);
        if (!user) return false;
        return await this.userRepository.updateUserByNewPassword(user._id.toString(), hashNewPassword);
    }

    public async resendConfirmByUser(email: string): Promise<void> {
        const user = await this.getUserByParam(email);
        if (user) {
            const code = uuid();
            await this.userRepository.updateUserByCode(user._id.toString(), code);
            await this.mailService.sendConfirmMessage(email, code, userInvitationTemplate);
        }
    }

    public async requestByRecovery(email: string) {
        const user = await this.getUserByParam(email);
        if (user && user.isConfirmed) {
            const recoveryCode = uuid();
            await this.userRepository.updateUserByCode(user._id.toString(), recoveryCode);
            await this.mailService.sendConfirmMessage(email, recoveryCode, passwordConfirmedTemplate);
        }
    }

    public async verifyUser(authDto: IAuth): Promise<IUser> {
        const consideredUser = await this.getUserByParam(authDto.loginOrEmail);
        if (!consideredUser) throw new Error();
        if (await bcrypt.compare(authDto.password, consideredUser.password)) return consideredUser;

        throw new Error();
    }

    public async delete(id: RefType): Promise<IUser> {
        const deleteUser = await this.userRepository.delete(id);
        if (deleteUser) return deleteUser;
        throw new Error();
    }

    public async testingDelete(): Promise<void> {
        await this.userRepository.deleteAll();
    }
}
