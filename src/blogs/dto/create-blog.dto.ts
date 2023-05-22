export class CreateBlogDto {
    readonly name: string;
    readonly description: string;
    readonly websiteUrl: string;
    constructor(name, description, websiteUrl) {
        this.name = name;
        this.description = description;
        this.websiteUrl = websiteUrl;
    }
}
