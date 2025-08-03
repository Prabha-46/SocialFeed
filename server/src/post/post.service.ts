import { Injectable } from "@nestjs/common";
import { Post } from "./post.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { LikeService } from "src/like/like.service";
import { LikeType } from "src/like/like.entity";
import { S3Service } from "../s3.service";
import { File as MulterFile } from "multer";

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,

    private readonly likeService: LikeService,

    private readonly s3Service: S3Service
  ) {}
  async getPosts(userId?: number, page = 1, limit = 10) {
    const query = this.postRepository
      .createQueryBuilder("post")
      .leftJoinAndSelect("post.user", "user")
      .orderBy("post.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit);

    if (userId) {
      query.andWhere("post.userId = :userId", { userId });
    }

    const [posts, total] = await query.getManyAndCount();

    const updatedPosts = await Promise.all(
      posts.map(async (post) => {
        const likesData = await this.likeService.findByPostId(post.id);
        const presignedUrl = await this.s3Service.getPresignedUrl(
          post.imageUrl
        );
        return {
          ...post,
          user: {
            id: post.user?.id,
            username: post.user?.username,
          },
          likes: likesData.filter((like) => like.type === LikeType.LIKE).length,
          dislikes: likesData.filter((like) => like.type === LikeType.DISLIKE)
            .length,
          imageUrl: presignedUrl,
          userAction: likesData.find(
            (like) => Number(like.userId) === Number(userId)
          )?.type,
        };
      })
    );
    return {
      posts: updatedPosts,
      total,
      page,
      limit,
    };
  }
  async createPost(post: any, file?: MulterFile) {
    if (file) {
      const fileType = file.mimetype.split("/")[1];
      const s3Key = await this.s3Service.uploadImage(file.buffer, fileType);
      post.imageUrl = s3Key;
    }
    return await this.postRepository.save(post);
  }
  async deletePost(id: string) {
    return await this.postRepository.delete(id);
  }
}
