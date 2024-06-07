import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
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

  @Put(':categoryId')
  @ResponseMessage('Category updated successfully')
  async updateCategory(
    @Param('categoryId') id: string,
    @Body() categoryDto: CategoryDto,
  ) {
    return await this.categoriesService.updateCategory(id, categoryDto);
  }

  @Delete(':categoryId')
  @ResponseMessage('Category deleted successfully')
  async deleteCategory(@Param('categoryId') id: string) {
    return await this.categoriesService.deleteCategory(id);
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

  @Put('subcategories/:subcategoryId')
  @ResponseMessage('Subcategory updated successfully')
  async updateSubcategory(
    @Param('subcategoryId') id: string,
    @Body() subcategoryDto: SubcategoryDto,
  ) {
    return await this.categoriesService.updateSubcategory(id, subcategoryDto);
  }

  @Delete('subcategories/:subcategoryId')
  @ResponseMessage('Subcategory deleted successfully')
  async deleteSubcategory(@Param('subcategoryId') id: string) {
    return await this.categoriesService.deleteSubcategory(id);
  }
}
