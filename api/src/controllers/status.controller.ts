import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from 'src/entities/status.entity';

@Controller('statuses')
export class StatusController {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}


  @Get()
  async getStatus(): Promise<Status[]> {
    try {
      return await this.statusRepository.find();
    } catch (e) {
      return e;
    }
  }
}
