import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Like } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  @Get()
  async getUsers(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (e) {
      return e;
    }
  }
}
