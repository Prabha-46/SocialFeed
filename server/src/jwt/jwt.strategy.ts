import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UserService } from "src/user/user.service";
import * as dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
    Logger.log("JwtStrategy registered!", "JwtStrategy");
  }

  async validate(payload: JwtPayload) {
    console.log(payload);
    console.log("payload");
    const user = await this.userService.findOneBy({ id: payload.sub });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
