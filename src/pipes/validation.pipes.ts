import { Injectable, Inject } from "@nestjs/common";
import { UserModel } from "../users/schema/user.schema";
import { BlogModel } from "../blogs/schema/blog.schema";
import { BlogsRepository } from "../blogs/blogs.repository";
import { UsersRepository } from "../users/users.repository";
import { registerDecorator, ValidationOptions, ValidatorConstraintInterface } from "class-validator";

@Injectable()
export class _IsExistByParam implements ValidatorConstraintInterface {
    constructor(@Inject("userRepository") private readonly userRepository: UsersRepository) {
        this.userRepository = new UsersRepository(UserModel);
    }

    async validate(value: string) {
        try {
            const user = await this.userRepository.findUserByParam(value);
            if (user) {
                throw new Error();
            }
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // defaultMessage(args: ValidationArguments) {
    //     return `User doesn't exist`;
    // }
}

@Injectable()
export class _IsNotExistByParamAndConfirm implements ValidatorConstraintInterface {
    constructor(@Inject("userRepository") private readonly userRepository: UsersRepository) {
        this.userRepository = new UsersRepository(UserModel);
    }

    async validate(value: string) {
        try {
            const user = await this.userRepository.findUserByParam(value);
            if (!user) {
                throw new Error();
            }
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // defaultMessage(args: ValidationArguments) {
    //     return `User doesn't exist`;
    // }
}

@Injectable()
export class _IsConfirmedEmail implements ValidatorConstraintInterface {
    constructor(@Inject("userRepository") private readonly userRepository: UsersRepository) {
        this.userRepository = new UsersRepository(UserModel);
    }

    async validate(value: string) {
        try {
            const user = await this.userRepository.findUserByParam(value);
            if (user?.isConfirmed) {
                throw new Error();
            }
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // defaultMessage(args: ValidationArguments) {
    //     return "Email is confirmed. (This email already confirmed)";
    // }
}

@Injectable()
export class _IsBlogIdCheck implements ValidatorConstraintInterface {
    constructor(@Inject("blogRepository") private readonly blogRepository: BlogsRepository) {
        this.blogRepository = new BlogsRepository(BlogModel);
    }

    async validate(value: string) {
        try {
            const blog = await this.blogRepository.find(value);
            if (!blog) {
                throw new Error();
            }
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // defaultMessage(args: ValidationArguments) {
    //     return "Email is confirmed. (This email already confirmed)";
    // }
}

export class _IsLikeStatusCheck implements ValidatorConstraintInterface {
    async validate(value: string) {
        try {
            if (value === "Like" || value === "Dislike" || value === "None") {
                return true;
            }
            throw new Error();
        } catch (error) {
            if (error instanceof Error) {
                return false;
            }
        }
    }
}

export function IsExistByParam(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsExistByParam",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: _IsExistByParam,
        });
    };
}

export function IsNotExistByParamAndConfirm(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsNotExistByParamAndConfirm",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: _IsNotExistByParamAndConfirm,
        });
    };
}

export function IsConfirmedEmail(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsConfirmedEmail",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: _IsConfirmedEmail,
        });
    };
}

export function IsLikeStatusCheck(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsLikeStatusCheck",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: _IsLikeStatusCheck,
        });
    };
}

export function IsBlogIdCheck(validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: "IsBlogIdCheck",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: _IsBlogIdCheck,
        });
    };
}
