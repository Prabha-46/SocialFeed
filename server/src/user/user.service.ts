import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneBy(userRequest: any): Promise<User | null> {
    return await this.userRepository.findOneBy(userRequest);
  }
  async create(user: User): Promise<User> {
    console.log(user);
    user.password = await bcrypt.hash(user.password, 10);
    return await this.userRepository.save(user);
  }
}
