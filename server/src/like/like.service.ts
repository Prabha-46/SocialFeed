import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Like, LikeType } from "./like.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>
  ) {}
  async likePost(postId: string, userId: string, type: LikeType) {
    const like = new Like();
    like.postId = postId;
    like.userId = userId;
    like.type = type;
    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });
    if (existingLike) {
      if (existingLike.type === type) {
        return await this.likeRepository.delete(existingLike.id);
      }
      return await this.likeRepository.update(existingLike.id, {
        type: type,
      });
    }
    return await this.likeRepository.save(like);
  }
  async findByPostId(postId: string) {
    return await this.likeRepository.find({
      where: { postId },
    });
  }
}
