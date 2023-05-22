import { Inject, Injectable } from "@nestjs/common";
import { PostsRepository } from "../../posts/posts.repository";
import { BlogsRepository } from "../../blogs/blogs.repository";
import { PostModel } from "../../posts/schema/post.schema";
import { BlogModel } from "../../blogs/schema/blog.schema";
import { LikesRepository } from "./like.repository";
import { LikeModel } from "./schema/like.schema";
import { RefType, SortOrder } from "mongoose";
import { CreatePostDto } from "../../posts/dto/create-post.dto";
import { IPost, ICreatePostDtoWithoutIdAndName } from "../../posts/interface/post.interface";
import { UsersRepository } from "../../users/users.repository";
import { UserModel } from "../../users/schema/user.schema";
import { IUser } from "../../users/interface/user.interface";
import { LikesStatusCfgValues } from "./types/like.type";
import { ILikeStatus, ILikeStatusWithoutId, UpgradeLikes } from "./interface/like.interface";
import { LIKE_STATUS } from "../../const/const";
import { CommentsRepository } from "../../comments/comments.repository";

@Injectable()
export class QueryService {
    constructor(
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
    }

    public async getTotalCountPostsForTheBlog(blogId: RefType): Promise<number> {
        const blog = await this.blogRepository.find(blogId);

        return this.postRepository.getTotalCountWithFilter(blog?._id?.toString());
    }

    public async createPostForTheBlog(
        createPostDtoWithoutIdAndName: ICreatePostDtoWithoutIdAndName,
        blogId: string,
    ): Promise<IPost> {
        const blog = await this.blogRepository.find(blogId);
        if (blog) {
            //const blogId = new mongoose.Types.ObjectId((blog?._id).toString());
            const createPostDto = new CreatePostDto(createPostDtoWithoutIdAndName, blogId, blog?.name);
            return await this.postRepository.create(createPostDto);
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

    public async getUpgradePosts(
        posts: IPost[] | IPost,
        token: string | undefined,
    ): Promise<IPost[] | IPost | undefined> {
        // const userService = new UserService();
        // const tokenService = new TokenService();
        if (token) {
            //const payload = await tokenService.getPayloadByAccessToken(token) as JWT;
            const user = await this.userRepository.find(payload.id);

            return await this.changerPosts(posts, user, this.postRepository);
        }

        return await this.changerPosts(posts, null, this.postRepository);
    }

    public async changerPosts(
        entityPost: IPost[] | IPost,
        user: IUser | null,
        postRepository: PostsRepository,
    ): Promise<IPost[] | IPost | undefined> {
        if (Array.isArray(entityPost)) {
            if (user) {
                return await Promise.all(
                    entityPost.map(async (post: IPost): Promise<IPost> => {
                        const myStatus = (await this.getLikeStatus(
                            String(user._id),
                            String(post._id),
                        )) as LikesStatusCfgValues;
                        return await this.postMapper(myStatus, post, postRepository);
                    }),
                );
            }

            return await Promise.all(
                entityPost.map(async (post: IPost): Promise<IPost> => {
                    return await this.postMapper(null, post, postRepository);
                }),
            );
        }
        if (user) {
            const myStatus = (await this.getLikeStatus(
                String(user._id),
                String(entityPost._id),
            )) as LikesStatusCfgValues;

            return await this.postMapper(myStatus, entityPost, postRepository);
        }

        return await this.postMapper(null, entityPost, postRepository);
    }

    public async postMapper(
        myStatus: LikesStatusCfgValues | null,
        post: IPost,
        postRepository: PostsRepository,
    ): Promise<IPost> {
        if (myStatus) {
            post.extendedLikesInfo.myStatus = myStatus;
        }
        const likes = (await this.getLikes(String(post._id))) as ILikeStatusWithoutId[];
        post.extendedLikesInfo.likesCount = await this.getTotalCountLikeOrDislike(
            String(post._id),
            LIKE_STATUS.LIKE,
            postRepository,
        );
        post.extendedLikesInfo.dislikesCount = await this.getTotalCountLikeOrDislike(
            String(post._id),
            LIKE_STATUS.DISLIKE,
            postRepository,
        );
        post.extendedLikesInfo.newestLikes = (await this.getUpgradeLikes(likes)) as UpgradeLikes[];

        return post;
    }

    public async getTotalCountLikeOrDislike(
        id: string,
        param: string,
        repository: CommentsRepository | PostsRepository,
    ) {
        const commentOrPost = await repository.find(id);
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
        //const userService = new UserService();
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
}
