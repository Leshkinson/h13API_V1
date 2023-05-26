import { IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { IsLoginExist } from "../../pipes/validation.pipes";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(10)
    @Matches("/^[a-zA-Z0-9_-]*$/")
    @IsLoginExist()
    readonly login: string;

    @MinLength(6)
    @MaxLength(20)
    readonly password: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    @Matches("/^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/")
    readonly email: string;

    constructor(name: string, description: string, websiteUrl: string) {
        this.login = name;
        this.password = description;
        this.email = websiteUrl;
    }
}
