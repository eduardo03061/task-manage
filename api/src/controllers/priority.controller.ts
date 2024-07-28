import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 
import { Priority } from 'src/entities/priority.entity';

@Controller('priorities')
export class PriorityController {
  constructor(
    @InjectRepository(Priority)
    private readonly priorityRepository: Repository<Priority>,
  ) {}


  @Get()
  async getPriority(): Promise<Priority[]> {
    try {
      return await this.priorityRepository.find();
    } catch (e) {
      return e;
    }
  }


  @Post()
  async createPriority(@Body() priority: Priority): Promise<Priority> {
    try {
      return await this.priorityRepository.save(priority);
    } catch (e) {
      return e;
    }
  }
}
