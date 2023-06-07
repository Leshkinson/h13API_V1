import { IAuth, ICode, IEmail, INewPassword, IRegistration } from "../interface/auth.interface";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsConfirmedEmail, IsExistByParam, IsNotExistByParamAndConfirm } from "../../pipes/validation.pipes";

export class AuthDto implements IAuth {
    readonly loginOrEmail: string;
    readonly password: string;
}

export class RegistrationDto implements IRegistration {
    @IsExistByParam({ message: "Login is exist. (This login already exists enter another login)" })
    @Matches(/^[a-zA-Z0-9_-]*$/)
    @MinLength(3)
    @MaxLength(10)
    @IsString()
    @IsNotEmpty()
    readonly login: string;

    @MinLength(6)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    //@Matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/)
    //@IsNotExistByParamAndConfirm({ message: "Email is not exist. (This email not exists enter another email)" })
    @IsExistByParam({ message: "Email is exist. (This email already exists enter another email)" })
    @IsConfirmedEmail({ message: "Email is confirmed. (This email already confirmed)" })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email: string;
}

export class EmailDto implements IEmail {
    @IsNotExistByParamAndConfirm({ message: "Email is not exist. (This email not exists enter another email)" })
    @IsConfirmedEmail({ message: "Email is confirmed. (This email already confirmed)" })
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    readonly email: string;
}

export class CodeDto implements ICode {
    @IsConfirmedEmail({ message: "Code is confirmed. (This code already confirmed)" })
    @IsNotExistByParamAndConfirm({ message: "Code is not exist. (This Code not exists)" })
    @IsString()
    @IsNotEmpty()
    readonly code: string;
}

export class NewPasswordDto implements INewPassword {
    @MinLength(6)
    @MaxLength(20)
    @IsString()
    @IsNotEmpty()
    readonly newPassword: string;

    @IsNotExistByParamAndConfirm({ message: "Code is confirmed. (This code already confirmed)" })
    @IsNotExistByParamAndConfirm({ message: "Code is not exist. (This Code not exists)" })
    @IsString()
    @IsNotEmpty()
    readonly recoveryCode: string;
}
