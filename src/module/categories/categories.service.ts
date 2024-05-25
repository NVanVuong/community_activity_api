import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Subcategory } from 'src/entity/subcategory.entity';
import { Repository } from 'typeorm';
import { CategoryDto, SubcategoryDto } from './dto/category.dto';
import { Category } from 'src/entity/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private subcategoryRepository: Repository<Subcategory>,
  ) {}

  async getCategories() {
    return await this.categoryRepository.find();
  }

  async getCategory(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async getSubcategory(id: string) {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id },
    });

    if (!subcategory) {
      throw new BadRequestException('Subcategory not found');
    }

    return subcategory;
  }

  async getSubcategoriesByCategoryId(categoryId: string) {
    return await this.subcategoryRepository.find({
      where: { category: { id: categoryId } },
    });
  }

  async createCategory(categoryDto: CategoryDto) {
    const Category = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(Category);
  }

  async createCategories(categories: CategoryDto[]) {
    const newCategories = categories.map((category) =>
      this.categoryRepository.create(category),
    );
    return await this.categoryRepository.save(newCategories);
  }

  async createSubcategory(subcategoryDto: SubcategoryDto) {
    const { name, minScore, maxScore, categoryIndex } = subcategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { index: categoryIndex },
    });
    const newSubcategory = this.subcategoryRepository.create({
      name,
      minScore,
      maxScore,
      category,
    });

    return await this.subcategoryRepository.save(newSubcategory);
  }

  async createSubcategories(subcategories: SubcategoryDto[]) {
    const createdSubcategories = await Promise.all(
      subcategories.map(async (subcategory) => {
        return this.createSubcategory(subcategory);
      }),
    );
    return createdSubcategories;
  }

  async deleteCategory(id: string) {
    return await this.categoryRepository.delete(id);
  }

  async deleteSubcategory(id: string) {
    return await this.subcategoryRepository.delete(id);
  }

  async updateCategory(id: string, name: string) {
    return await this.categoryRepository.update(id, { name });
  }

  async updateSubcategory(id: string, SubcategoryDto: SubcategoryDto) {
    const { name, minScore, maxScore, categoryIndex } = SubcategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { index: categoryIndex },
    });

    return await this.subcategoryRepository.update(id, {
      name,
      minScore,
      maxScore,
      category,
    });
  }
}
