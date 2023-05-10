import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersRepository } from "./users.repository";
import { RefType, SortOrder } from "mongoose";
import { IUser } from "./interface/user.interface";
import { UserModel } from "./schema/user.schema";

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {
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
        searchLoginTerm: { login: { $regex: RegExp } } | {} = {},
        searchEmailTerm: { email: { $regex: RegExp } } | {} = {},
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

    // findOne(id: number) {
    //     return `This action returns a #${id} user`;
    // }
    //
    // update(id: number, updateUserDto: UpdateUserDto) {
    //     return `This action updates a #${id} user`;
    // }

    public async delete(id: RefType): Promise<IUser> {
        const deleteUser = await this.userRepository.delete(id);
        if (deleteUser) return deleteUser;
        throw new Error();
    }
}
