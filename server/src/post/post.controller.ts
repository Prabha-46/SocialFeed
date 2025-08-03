import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
} from "@nestjs/common";
import { PostService } from "./post.service";
import { Post as PostEntity } from "./post.entity";
import { JwtAuthGuard } from "src/jwt/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { File as MulterFile } from "multer";

@Controller("post")
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getPosts(
    @Query("userId") userId?: number,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ) {
    return this.postService.getPosts(userId, page, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async createPost(@UploadedFile() file: MulterFile, @Body() post: any) {
    return this.postService.createPost(post, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deletePost(@Param("id") id: string) {
    return this.postService.deletePost(id);
  }
}
