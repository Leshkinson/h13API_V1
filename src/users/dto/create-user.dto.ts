import { ICreateUserDto } from "../interface/user.interface";
import { IsExistByParam } from "../../pipes/validation.pipes";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto implements ICreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    @Matches(/^[a-zA-Z0-9_-]*$/)
    @IsExistByParam({ message: "Login is exist. (This login already exists enter another login)" })
    readonly login: string;

    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    @IsExistByParam({ message: "Email is exist. (This email already exists enter another email)" })
    readonly email: string;
}
