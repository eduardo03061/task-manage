import { Module } from '@nestjs/common';
import { Task } from "./entities/task.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from "./controllers/task.controller";
import { ConfigModule } from '@nestjs/config';
import { User } from "./entities/user.entity";
import { Category } from "./entities/category.entity";
import { Status } from "./entities/status.entity";
import { UserController } from './controllers/user.controller';
import { CategoryController } from './controllers/category.controller';
import { Priority } from './entities/priority.entity';
import { PriorityController } from './controllers/priority.controller';
import { StatusController } from './controllers/status.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || '123456',
      database: process.env.DB_NAME || 'nwoork',
      entities: [Task, User, Category, Status, Priority],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Task,User, Category, Status, Priority]),
  ],
  controllers: [TaskController,UserController, CategoryController, StatusController, PriorityController],
})
export class AppModule {}
