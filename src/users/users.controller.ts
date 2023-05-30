import { Controller, Get, Post, Body, Param, Delete, Res, Req, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Request, Response } from "express";
import { IUser } from "./interface/user.interface";
import { UsersRequest } from "./types/user.type";
import { QueryService } from "../sup-services/query/query.service";
import { AuthGuard } from "../auth.guard";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly queryService: QueryService) {}

    @Post()
    @AuthGuard()
    public async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const newUser: IUser = await this.usersService.create(createUserDto);
            res.status(HttpStatus.CREATED).json(newUser);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                throw new Error(error.message);
            }
        }
    }

    @Get()
    @AuthGuard()
    public async getAllUsers(@Req() req: Request, @Res() res: Response) {
        try {
            // eslint-disable-next-line prefer-const
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
            const totalCount: number = await this.queryService.getTotalCountForUsers(searchLoginTerm, searchEmailTerm);

            res.status(HttpStatus.OK).json({
                pagesCount: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                pageSize: pageSize,
                totalCount: totalCount,
                items: users,
            });
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(error.message);
            }
        }
    }

    @Delete(":id")
    @AuthGuard()
    public async delete(@Param("id") id: string, @Res() res: Response) {
        try {
            await this.usersService.delete(id);

            res.sendStatus(HttpStatus.NO_CONTENT);
        } catch (error) {
            if (error instanceof Error) {
                res.sendStatus(HttpStatus.NOT_FOUND);
                console.log(error.message);
            }
        }
    }
}
