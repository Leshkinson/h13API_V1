export interface IAuth {
    readonly loginOrEmail: string;
    readonly password: string;
}

export interface IEmail {
    readonly email: string;
}

export interface IRegistration extends IEmail {
    readonly login: string;
    readonly password: string;
}

export interface INewPassword {
    readonly newPassword: string;
    readonly recoveryCode: string;
}
