import { Document } from "mongoose";
import * as mongoose from "mongoose";

export interface IBlog extends Document {
    readonly _id: mongoose.Schema.Types.ObjectId;
    readonly name: string;
    readonly description: string;
    readonly websiteUrl: string;
}
