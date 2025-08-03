/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from "dotenv";
import * as mysql from "mysql2/promise";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { UserController } from "./user/user.controller";
import { User } from "./user/user.entity";
import { UserService } from "./user/user.service";
import { JwtService } from "@nestjs/jwt";
import { AuthModule } from "./auth/auth.module";
import { PostController } from "./post/post.controller";
import { LikeController } from "./like/like.controller";
import { PostService } from "./post/post.service";
import { LikeService } from "./like/like.service";
import { Post } from "./post/post.entity";
import { Like } from "./like/like.entity";
import { S3Service } from "./s3.service";
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          user: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
        });

        const database = process.env.DB_NAME ?? "affiliate";
        const result = await connection.query(
          `CREATE DATABASE IF NOT EXISTS \`${database}\`;`
        );
        console.log(result);
        await connection.end();

        return {
          type: "mysql",
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: database,
          entities: [join(__dirname, "**/*.entity{.ts,.js}")],
          synchronize: true,
        };
      },
    }),
    TypeOrmModule.forFeature([User, Post, Like]),
    AuthModule,
  ],
  controllers: [
    AppController,
    UserController,
    AuthController,
    PostController,
    LikeController,
  ],
  providers: [
    AppService,
    UserService,
    AuthService,
    JwtService,
    PostService,
    LikeService,
    S3Service,
  ],
})
export class AppModule {}
