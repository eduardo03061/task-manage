import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';

@Controller('tasks')
export class TaskController {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  @Get()
  async getTasks(@Query() params: any): Promise<{ tasks: Task[], total: number }> {
    try {
      const page = parseInt(params.page, 10) || 1;
      const limit = parseInt(params.limit, 10) || 5;
      const skip = (page - 1) * limit;

      const [tasks, total] = await this.taskRepository.findAndCount({
        relations: ['priority', 'user', 'category', 'status'],
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: limit,
        where: params.search ? {
          title: Like(`%${params.search}%`),
        } : {},
      });

      return { tasks, total };
    } catch (e) {
      throw new Error(`Error retrieving tasks: ${e.message}`);
    }
  }

  @Post()
  async createTask(@Body() task: Task): Promise<Task> {
    try {
      return await this.taskRepository.save(task);
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the task',
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: number,
    @Body() task: Partial<Task>,
  ): Promise<Task> {
    try {
      await this.taskRepository.update(id, task);
      const updatedTask = await this.taskRepository.findOne({
        where: { id },
        relations: ['priority', 'user', 'category', 'status'],
      });
      if (!updatedTask) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }
      return updatedTask;
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'There was a problem updating the task',
        message: e.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  @Delete(':id')
  async deleteTask(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const task = await this.taskRepository.findOne({
        where: { id },
      });

      if (!task) {
        throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
      }

      await this.taskRepository.remove(task);

      return { message: `Task with ID ${id} deleted successfully` };
    } catch (e) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'There was a problem deleting the task',
        message: e.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
