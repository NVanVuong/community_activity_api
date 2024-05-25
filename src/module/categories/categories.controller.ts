import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto, SubcategoryDto } from './dto/category.dto';
import { ResponseMessage } from 'src/decorator/respone-message.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ResponseMessage('Categories retrieved successfully')
  async getCategories() {
    return await this.categoriesService.getCategories();
  }

  @Get(':categoryId')
  @ResponseMessage('Category retrieved successfully')
  async getCategory(@Param('categoryId') id: string) {
    return await this.categoriesService.getCategory(id);
  }

  @Get(':categoryId/subcategories')
  @ResponseMessage('Subcategories retrieved successfully')
  async getSubcategories(@Param('categoryId') id: string) {
    return await this.categoriesService.getSubcategoriesByCategoryId(id);
  }

  @Get('subcategories/:subcategoryId')
  @ResponseMessage('Subcategory retrieved successfully')
  async getSubcategory(@Param('subcategoryId') id: string) {
    return await this.categoriesService.getSubcategory(id);
  }

  @Post()
  @ResponseMessage('Category created successfully')
  async createCategory(@Body() categoryDto: CategoryDto) {
    return await this.categoriesService.createCategory(categoryDto);
  }

  @Post('bulk')
  @ResponseMessage('Categories created successfully')
  async createCategories(@Body() categories: CategoryDto[]) {
    return await this.categoriesService.createCategories(categories);
  }

  @Post('subcategories')
  @ResponseMessage('Subcategory created successfully')
  async createSubcategory(@Body() subcategoryDto: SubcategoryDto) {
    return await this.categoriesService.createSubcategory(subcategoryDto);
  }

  @Post('subcategories/bulk')
  @ResponseMessage('Subcategories created successfully')
  async createSubcategories(@Body() subcategories: SubcategoryDto[]) {
    return await this.categoriesService.createSubcategories(subcategories);
  }
}
