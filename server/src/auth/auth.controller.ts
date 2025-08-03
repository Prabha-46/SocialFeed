import { Body, Controller, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequest } from "./requests/loginRequest";
import { User } from "src/user/user.entity";
import { UserService } from "src/user/user.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}
  @Post("login")
  async login(@Body() loginRequest: LoginRequest) {
    const user = await this.authService.validateUser(loginRequest);
    if (!user) {
      throw new HttpException("Invalid credentials", 401);
    }
    return this.authService.login(user);
  }
  @Post("signup")
  async createUser(@Body() user: User) {
    return this.userService.create(user);
  }
}
