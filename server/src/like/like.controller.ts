import { Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { LikeService } from "./like.service";
import { JwtAuthGuard } from "src/jwt/jwt-auth.guard";
import { LikeType } from "./like.entity";

@Controller("like")
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @UseGuards(JwtAuthGuard)
  @Post("like/:postId")
  async likePost(@Param("postId") postId: string, @Req() req: any) {
    return this.likeService.likePost(postId, req.user.id, LikeType.LIKE);
  }
  @UseGuards(JwtAuthGuard)
  @Post("dislike/:postId")
  async dislikePost(@Param("postId") postId: string, @Req() req: any) {
    return this.likeService.likePost(postId, req.user.id, LikeType.DISLIKE);
  }
}
