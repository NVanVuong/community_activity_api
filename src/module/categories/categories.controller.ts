import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  ActivityCategoryDto,
  ActivitySubcategoryDto,
} from './dto/category.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ResponseMessage('Categories retrieved successfully')
  async getCategories() {
    return await this.categoriesService.getActivityCategories();
  }

  @Get(':categoryId')
  @ResponseMessage('Category retrieved successfully')
  async getCategory(@Param('categoryId') id: string) {
    return await this.categoriesService.getActivityCategoryById(id);
  }

  @Get(':categoryId/subcategories')
  @ResponseMessage('Subcategories retrieved successfully')
  async getSubcategories(@Param('categoryId') id: string) {
    return await this.categoriesService.getActivitySubcategoriesByCategoryId(
      id,
    );
  }

  @Get('subcategories/:subcategoryId')
  @ResponseMessage('Subcategory retrieved successfully')
  async getSubcategory(@Param('subcategoryId') id: string) {
    return await this.categoriesService.getActivitySubcategoryById(id);
  }

  @Post()
  @ResponseMessage('Category created successfully')
  async createCategory(@Body() activityCategoryDto: ActivityCategoryDto) {
    return await this.categoriesService.createActivityCategory(
      activityCategoryDto,
    );
  }

  @Post('bulk')
  @ResponseMessage('Categories created successfully')
  async createCategories(@Body() activityCategories: ActivityCategoryDto[]) {
    return await this.categoriesService.createActivityCategories(
      activityCategories,
    );
  }

  @Post('subcategories')
  @ResponseMessage('Subcategory created successfully')
  async createSubcategory(
    @Body() activitySubcategoryDto: ActivitySubcategoryDto,
  ) {
    return await this.categoriesService.createActivitySubcategory(
      activitySubcategoryDto,
    );
  }

  @Post('subcategories/bulk')
  @ResponseMessage('Subcategories created successfully')
  async createSubcategories(
    @Body() activitySubcategories: ActivitySubcategoryDto[],
  ) {
    return await this.categoriesService.createActivitySubcategories(
      activitySubcategories,
    );
  }
}
