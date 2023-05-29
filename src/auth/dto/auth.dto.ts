import { IAuth, IEmail, INewPassword, IRegistration } from "../interface/auth.interface";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { IsConfirmedEmail, IsExistByParam, IsNotExistByParamAndConfirm } from "../../pipes/validation.pipes";

export class AuthDto implements IAuth {
    readonly loginOrEmail: string;
    readonly password: string;

    constructor(props: IAuth) {
        this.loginOrEmail = props.loginOrEmail;
        this.password = props.password;
    }
}

export class RegistrationDto implements IRegistration {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    @Matches(/^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/)
    @IsExistByParam({ message: "Login is exist. (This login already exists enter another login)" })
    readonly login: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @IsNotExistByParamAndConfirm({ message: "Email is not exist. (This email not exists enter another email)" })
    @IsConfirmedEmail({ message: "Email is confirmed. (This email already confirmed)" })
    readonly email: string;

    constructor(props: IRegistration) {
        this.login = props.login;
        this.password = props.password;
        this.email = props.email;
    }
}

export class EmailDto implements IEmail {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @IsNotExistByParamAndConfirm({ message: "Email is not exist. (This email not exists enter another email)" })
    @IsNotExistByParamAndConfirm({ message: "Email is confirmed. (This email already confirmed)" })
    readonly email: string;

    constructor(props: IEmail) {
        this.email = props.email;
    }
}

export class NewPasswordDto implements INewPassword {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    readonly newPassword: string;

    @IsString()
    @IsNotEmpty()
    @IsNotExistByParamAndConfirm({ message: "Code is confirmed. (This code already confirmed)" })
    @IsNotExistByParamAndConfirm({ message: "Code is not exist. (This Code not exists)" })
    readonly recoveryCode: string;

    constructor(props: INewPassword) {
        this.newPassword = props.newPassword;
        this.recoveryCode = props.recoveryCode;
    }
}
