import { ICreatePostDtoWithoutIdAndName } from "../interface/post.interface";

export class CreatePostDtoWithoutIdAndName implements ICreatePostDtoWithoutIdAndName {
    readonly title: string;
    readonly shortDescription: string;
    readonly content: string;

    constructor(props: ICreatePostDtoWithoutIdAndName) {
        this.title = props.title;
        this.shortDescription = props.shortDescription;
        this.content = props.content;
    }
}

export class CreatePostDto extends CreatePostDtoWithoutIdAndName {
    readonly blogId: string;
    readonly blogName: string;

    constructor(props: ICreatePostDtoWithoutIdAndName, blogId: string, blogName: string) {
        super(props);
        this.blogId = blogId;
        this.blogName = blogName;
    }
}
