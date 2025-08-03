import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { LoginRequest } from "./requests/loginRequest";
import { User } from "src/user/user.entity";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(loginRequest: LoginRequest): Promise<any> {
    const user = await this.userService.findOneBy({
      username: loginRequest.username,
    });
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        loginRequest.password,
        user.password
      );
      if (isPasswordValid) {
        return user;
      }
    }
    return null;
  }
  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: secret,
        expiresIn: "1h",
      }),
      user: {
        id: user.id,
        username: user.username,
        gender: user.gender,
        age: user.age,
      },
    };
  }
}
