import mongoose from "mongoose";

export interface IUser {
    _id: mongoose.Schema.Types.ObjectId;
    login: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    code: string;
    expirationDate: Date;
}
