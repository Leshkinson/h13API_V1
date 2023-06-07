//import { IContent } from "../interface/comment.interface";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(20)
    @MaxLength(300)
    readonly content: string;

    // constructor(props: IContent) {
    //     this.content = props.content;
    // }
}
