import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Request, Response } from "express";
import { IUser } from "./interface/user.interface";
import { UsersRequest } from "./types/user.type";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    public async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const newUser: IUser = await this.usersService.create(createUserDto);
            res.status(201).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    @Get()
    getAllUsers(@Req() req: Request, @Res() res: Response) {
        try {
            let { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } =
                req.query as UsersRequest;
            pageNumber = Number(pageNumber ?? 1);
            pageSize = Number(pageSize ?? 10);

            const users: IUser[] = await this.usersService.findAllUsers(
                sortBy,
                sortDirection,
                pageNumber,
                pageSize,
                searchLoginTerm,
                searchEmailTerm,
            );
            const totalCount: number = await queryService.getTotalCountForUsers(searchLoginTerm, searchEmailTerm);

            res.status(200).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: users,
            });
        } catch (error) {
            if (error instanceof Error) throw new Error(error.message);
        }
    }

    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.usersService.findOne(+id);
    // }
    //
    // @Patch(":id")
    // update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    //     return this.usersService.update(+id, updateUserDto);
    // }

    @Delete(":id")
    delete(@Param("id") id: string, @Res() res: Response) {
        try {
            return this.usersService.delete(id);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(404);
                console.log(error.message);
            }
        }
    }
}
