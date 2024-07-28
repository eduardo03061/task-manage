import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from 'src/entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  @Get()
  async getCategories(
    @Query() params: any,
  ): Promise<{ categories: Category[]; total: number }> {
    try {
      // Extraer y convertir parámetros de consulta
      const page = parseInt(params.page, 10) || 1;
      const limit = params.limit
        ? parseInt(params.limit, 10)
        : Number.MAX_SAFE_INTEGER; // Devolver todos los registros si no se proporciona limit
      const skip = (page - 1) * limit;

      const [categories, total] = await this.categoryRepository.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        skip: limit === Number.MAX_SAFE_INTEGER ? undefined : skip, // No aplicar skip si limit es muy alto
        take: limit === Number.MAX_SAFE_INTEGER ? undefined : limit, // No aplicar limit si limit es muy alto
        where: params.search
          ? {
              name: Like(`%${params.search}%`),
            }
          : {},
      });

      return { categories, total };
    } catch (e) {
      // Manejar errores de forma apropiada
      throw new Error(`Error al obtener las categorías: ${e.message}`);
    }
  }

  @Post()
  async createCategory(@Body() category: Category): Promise<Category> {
    try {
      return await this.categoryRepository.save(category);
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem creating the category',
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async updateCategory(
    @Param('id') id: number,
    @Body() category: Partial<Category>,
  ): Promise<Category> {
    try {
      await this.categoryRepository.update(id, category);
      const updateCategory = await this.categoryRepository.findOne({
        where: { id },
      });
      if (!updateCategory) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }
      return updateCategory;
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem updating the category',
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number): Promise<{ message: string }> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
      }

      await this.categoryRepository.remove(category);

      return { message: `Category with ID ${id} deleted successfully` };
    } catch (e) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'There was a problem deleting the category',
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
