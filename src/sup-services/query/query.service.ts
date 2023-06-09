import { RefType, SortOrder } from "mongoose";
import { LikeModel } from "./schema/like.schema";
import { LikesRepository } from "./like.repository";
import { Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../../auth/auth.service";
import { UserModel } from "../../users/schema/user.schema";
import { PostModel } from "../../posts/schema/post.schema";
import { BlogModel } from "../../blogs/schema/blog.schema";
import { IPost } from "../../posts/interface/post.interface";
import { IUser } from "../../users/interface/user.interface";
import { PostsRepository } from "../../posts/posts.repository";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { UsersRepository } from "../../users/users.repository";
import { CommentModel } from "../../comments/schema/comments.schema";
import { IComment } from "../../comments/interface/comment.interface";
import { CommentsRepository } from "../../comments/comments.repository";
import { LikesStatusCfgValues, LikesStatusType } from "./types/like.type";
import { JWT, LIKE_STATUS, TagRepositoryTypeCfgValues } from "../../const/const";
import { ILikeStatus, ILikeStatusWithoutId, UpgradeLikes } from "./interface/like.interface";
import { CreatePostDto, CreatePostDtoWithoutIdAndName } from "../../posts/dto/create-post.dto";

@Injectable()
export class QueryService {
    constructor(
        private readonly authService: AuthService,
        @Inject("postRepository") private readonly postRepository: PostsRepository,
        @Inject("blogRepository") private readonly blogRepository: BlogsRepository,
        @Inject("likeRepository") private readonly likeRepository: LikesRepository,
        @Inject("userRepository") private readonly userRepository: UsersRepository,
        @Inject("commentRepository") private readonly commentRepository: CommentsRepository,
    ) {
        this.postRepository = new PostsRepository(PostModel);
        this.blogRepository = new BlogsRepository(BlogModel);
        this.likeRepository = new LikesRepository(LikeModel);
        this.userRepository = new UsersRepository(UserModel);
        this.commentRepository = new CommentsRepository(CommentModel);
    }

    public async getTotalCountPostsForTheBlog(blogId: RefType): Promise<number> {
        const blog = await this.blogRepository.find(blogId);

        return this.postRepository.getTotalCountWithFilter(blog?._id?.toString());
    }

    public async createPostForTheBlog(
        createPostDtoWithoutIdAndName: CreatePostDtoWithoutIdAndName,
        blogId: string,
    ): Promise<IPost> {
        const blog = await this.blogRepository.find(blogId);
        if (blog) {
            //const blogId = new mongoose.Types.ObjectId((blog?._id).toString());
            const createPostDto = new CreatePostDto(
                createPostDtoWithoutIdAndName.title,
                createPostDtoWithoutIdAndName.shortDescription,
                createPostDtoWithoutIdAndName.content,
                blogId,
            );
            return await this.postRepository.create(createPostDto, blog.name);
        }
        throw new Error();
    }

    public async getPostsForTheBlog(
        blogId: RefType,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = "createdAt",
        sortDirection: SortOrder = "desc",
    ): Promise<IPost[]> {
        const blog = await this.blogRepository.find(blogId);
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (blog) {
            return this.postRepository.findAll(
                blog?._id?.toString(),
                pageNumber,
                pageSize,
                sortBy,
                skip,
                sortDirection,
            );
        }
        throw new Error();
    }

    public async getTotalCountForUsers(
        searchLoginTerm: string | undefined | object,
        searchEmailTerm: string | undefined | object,
    ): Promise<number> {
        if (searchLoginTerm) searchLoginTerm = { login: { $regex: new RegExp(`.*${searchLoginTerm}.*`, "i") } };
        if (searchEmailTerm) searchEmailTerm = { email: { $regex: new RegExp(`.*${searchEmailTerm}.*`, "i") } };

        return await this.userRepository.getUsersCount(searchLoginTerm, searchEmailTerm);
    }

    public async getUpgradePosts(
        posts: IPost[] | IPost,
        token: string | undefined,
        tag: TagRepositoryTypeCfgValues,
    ): Promise<IPost[] | IPost | undefined> {
        if (token) {
            const payload = (await this.authService.getPayloadByAccessToken(token)) as JWT;
            const user = await this.userRepository.find(payload.id);

            return await this.changerPosts(posts, user, tag);
        }

        return await this.changerPosts(posts, null, tag);
    }

    public async changerPosts(
        entityPost: IPost[] | IPost,
        user: IUser | null,
        tag: TagRepositoryTypeCfgValues,
    ): Promise<IPost[] | IPost | undefined> {
        if (Array.isArray(entityPost)) {
            if (user) {
                return await Promise.all(
                    entityPost.map(async (post: IPost): Promise<IPost> => {
                        const myStatus = (await this.getLikeStatus(
                            String(user._id),
                            String(post._id),
                        )) as LikesStatusCfgValues;
                        return await this.postMapper(myStatus, post, tag);
                    }),
                );
            }

            return await Promise.all(
                entityPost.map(async (post: IPost): Promise<IPost> => {
                    return await this.postMapper(null, post, tag);
                }),
            );
        }
        if (user) {
            const myStatus = (await this.getLikeStatus(
                String(user._id),
                String(entityPost._id),
            )) as LikesStatusCfgValues;

            return await this.postMapper(myStatus, entityPost, tag);
        }

        return await this.postMapper(null, entityPost, tag);
    }

    public async postMapper(
        myStatus: LikesStatusCfgValues | null,
        post: IPost,
        tag: TagRepositoryTypeCfgValues,
    ): Promise<IPost> {
        if (myStatus) {
            post.extendedLikesInfo.myStatus = myStatus;
        }
        const likes = (await this.getLikes(String(post._id))) as ILikeStatusWithoutId[];
        post.extendedLikesInfo.likesCount = await this.getTotalCountLikeOrDislike(
            String(post._id),
            LIKE_STATUS.LIKE,
            tag,
        );
        post.extendedLikesInfo.dislikesCount = await this.getTotalCountLikeOrDislike(
            String(post._id),
            LIKE_STATUS.DISLIKE,
            tag,
        );
        post.extendedLikesInfo.newestLikes = (await this.getUpgradeLikes(likes)) as UpgradeLikes[];

        return post;
    }

    public async getTotalCountLikeOrDislike(id: string, param: string, tag: TagRepositoryTypeCfgValues) {
        let commentOrPost: IPost | IComment;
        if (tag === "PostsRepository") {
            commentOrPost = await this.postRepository.find(id);
        }
        if (tag === "CommentsRepository") {
            commentOrPost = await this.commentRepository.find(id);
        }
        if (commentOrPost) {
            return await this.likeRepository.countingLikeOrDislike(String(commentOrPost._id), param);
        }

        throw new Error();
    }

    public async getLikeStatus(userId: string, commentId: string) {
        const like = await this.likeRepository.findLike(userId, commentId);
        if (like) return like.likeStatus;
    }

    public async getUpgradeLikes(likes: ILikeStatusWithoutId[]): Promise<(UpgradeLikes | undefined)[]> {
        const result: (UpgradeLikes | undefined)[] = await Promise.all(
            likes.map(async (like: ILikeStatusWithoutId): Promise<UpgradeLikes | undefined> => {
                const user = await this.userRepository.find(like.userId);
                if (user) {
                    return {
                        addedAt: like.createdAt,
                        userId: like.userId,
                        login: user.login,
                    };
                }
            }),
        );

        return result.filter((item: UpgradeLikes | undefined) => !!item);
    }

    public async getLikes(id: string): Promise<ILikeStatus[] | ILikeStatusWithoutId[] | null> {
        return await this.likeRepository.findLikes(id);
    }

    public async setUpLikeOrDislikeStatus(
        userId: string,
        commentOrPostId: string,
        likeStatus: LikesStatusType,
        tag: TagRepositoryTypeCfgValues,
    ): Promise<ILikeStatus | ILikeStatusWithoutId | null> {
        const user = await this.userRepository.find(userId);
        let commentOrPost: IPost | IComment | undefined;
        if (tag === "PostsRepository") {
            commentOrPost = await this.postRepository.find(commentOrPostId);
        }
        if (tag === "CommentsRepository") {
            commentOrPost = await this.commentRepository.find(commentOrPostId);
        }
        if (!user || !commentOrPost) {
            throw new Error();
        }
        return await this.makeLikeStatusForTheComment(likeStatus, commentOrPostId, String(user._id));
    }

    public async makeLikeStatusForTheComment(
        likeStatus: LikesStatusType,
        commentOrPostId: string,
        userId: string,
    ): Promise<ILikeStatus | ILikeStatusWithoutId | null> {
        const like = (await this.likeRepository.findLike(userId, commentOrPostId)) as ILikeStatus;
        if (like) {
            return await this.changeLikeStatusForTheComment(String(like._id), likeStatus);
        }

        return await this.likeRepository.createLike(commentOrPostId, userId, likeStatus);
    }

    public async changeLikeStatusForTheComment(
        likeId: string,
        likeStatus: LikesStatusType,
    ): Promise<ILikeStatus | ILikeStatusWithoutId | null> {
        const like = await this.likeRepository.findLikeById(likeId);
        if (like?.likeStatus !== String(likeStatus)) {
            return await this.likeRepository.updateLikeStatus(likeId, likeStatus);
        }

        return like;
    }
    public async createCommentForThePost(postId: RefType, content: string, userId: string): Promise<IComment> {
        const post = await this.postRepository.find(postId);
        if (post) {
            const user = await this.userRepository.find(userId);
            if (user) {
                return await this.commentRepository.create(content, postId, userId, user.login);
            }
        }

        throw new Error();
    }

    public async getCommentsForThePost(
        postId: RefType,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortBy: string = "createdAt",
        sortDirection: SortOrder = "desc",
    ): Promise<IComment[]> {
        const post = await this.postRepository.find(postId);
        const skip: number = (+pageNumber - 1) * +pageSize;
        if (post) {
            return await this.commentRepository.findAllForThePost(
                post?._id?.toString(),
                sortBy,
                sortDirection,
                skip,
                +pageSize,
            );
        }
        throw new Error();
    }

    public async getTotalCountCommentsForThePost(postId: RefType): Promise<number> {
        const post = await this.postRepository.find(postId);

        return this.commentRepository.getCount(post?._id?.toString());
    }

    public async testingDelete(): Promise<void> {
        await this.likeRepository.deleteAll();
    }
}
