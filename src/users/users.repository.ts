import { Model, RefType, SortOrder } from "mongoose";
import { IUser } from "./interface/user.interface";
import { Inject, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersRepository {
    constructor(@Inject("USER_MODEL") private readonly userModel: Model<IUser>) {}

    public async create(createUserDto: CreateUserDto): Promise<IUser> {
        return await this.userModel.create({ createUserDto, isConfirmed: true });
    }

    public async findAll(
        sortBy: string = "createdAt",
        sortDirection: SortOrder = "desc",
        skip: number = 0,
        limit: number = 10,
        searchLoginTerm: { login: { $regex: RegExp } } | {} = {},
        searchEmailTerm: { email: { $regex: RegExp } } | {} = {},
    ): Promise<IUser[]> {
        return this.userModel
            .find({ $or: [searchLoginTerm, searchEmailTerm] })
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit);
    }

    public async delete(id: RefType) {
        return this.userModel.findOneAndDelete({ _id: id });
    }

    public async deleteAll() {
        return this.userModel.deleteMany();
    }
}
