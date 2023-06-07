import { IContent } from "../interface/comment.interface";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCommentDto implements IContent {
    @MinLength(20)
    @MaxLength(300)
    @IsString()
    @IsNotEmpty()
    readonly content: string;

    // constructor(props: IContent) {
    //     this.content = props.content;
    // }
}
