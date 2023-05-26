import { Injectable, Inject } from "@nestjs/common";
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraintInterface,
} from "class-validator";
import { UsersRepository } from "../users/users.repository";
import { UserModel } from "../users/schema/user.schema";

@Injectable()
export class isExistByParam implements ValidatorConstraintInterface {
    constructor(@Inject("userRepository") private readonly userRepository: UsersRepository) {
        this.userRepository = new UsersRepository(UserModel);
    }

    async validate(value: string) {
        try {
            await this.userRepository.findUserByParam(value);
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    defaultMessage(args: ValidationArguments) {
        return `${args} doesn't exist`;
    }
}

export function IsLoginExist(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsLoginExist",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: isExistByParam,
        });
    };
}

export function IsNotExistByParamAndConfirm(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "isNotExistByParamAndConfirm",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: isExistByParam,
        });
    };
}

// export function IsConfirmedEmail(validationOptions?: ValidationOptions) {
//     return function (object: any, propertyName: string) {
//         registerDecorator({
//             name: "IsConfirmedEmail",
//             target: object.constructor,
//             propertyName: propertyName,
//             options: validationOptions,
//             validator: isExistByParam,
//         });
//     };
// }
