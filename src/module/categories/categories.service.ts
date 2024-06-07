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
    return await this.categoryRepository.find({
      order: { index: 'ASC' },
    });
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

  async createCategory(categoryDto: CategoryDto): Promise<Category> {
    const { index } = categoryDto;

    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ index: () => '"index" + 1' })
      .where('"index" >= :index', { index })
      .execute();

    const category = this.categoryRepository.create(categoryDto);
    return await this.categoryRepository.save(category);
  }

  async createCategories(categories: CategoryDto[]) {
    const createdCategories = [];

    for (const categoryDto of categories) {
      const createdCategory = await this.createCategory(categoryDto);
      createdCategories.push(createdCategory);
    }

    return createdCategories;
  }

  async createSubcategory(subcategoryDto: SubcategoryDto) {
    const { name, minScore, maxScore, categoryIndex } = subcategoryDto;
    const category = await this.categoryRepository.findOne({
      where: { index: categoryIndex },
    });

    if (minScore > maxScore) {
      throw new BadRequestException('Min score must be less than max score');
    }

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
    const category = await this.getCategory(id);

    const categoryIndex = category.index;

    await this.categoryRepository
      .createQueryBuilder()
      .update(Category)
      .set({ index: () => '"index" - 1' })
      .where('"index" > :index', { index: categoryIndex })
      .execute();

    return await this.categoryRepository.delete(id);
  }

  async deleteSubcategory(id: string) {
    return await this.subcategoryRepository.delete(id);
  }

  async updateCategory(
    id: string,
    categoryDto: CategoryDto,
  ): Promise<Category> {
    const { name, index: newIndex } = categoryDto;

    const category = await this.getCategory(id);

    const currentIndex = category.index;

    if (newIndex !== undefined && newIndex !== currentIndex) {
      if (newIndex < currentIndex) {
        await this.categoryRepository
          .createQueryBuilder()
          .update(Category)
          .set({ index: () => '"index" + 1' })
          .where('"index" >= :newIndex AND "index" < :currentIndex', {
            newIndex,
            currentIndex,
          })
          .execute();
      } else {
        await this.categoryRepository
          .createQueryBuilder()
          .update(Category)
          .set({ index: () => '"index" - 1' })
          .where('"index" > :currentIndex AND "index" <= :newIndex', {
            newIndex,
            currentIndex,
          })
          .execute();
      }
    }

    category.name = name;
    category.index = newIndex;

    return await this.categoryRepository.save(category);
  }

  async updateSubcategory(id: string, subcategoryDto: SubcategoryDto) {
    const { name, minScore, maxScore } = subcategoryDto;

    if (minScore > maxScore) {
      throw new BadRequestException('Min score must be less than max score');
    }

    return await this.subcategoryRepository.update(id, {
      name,
      minScore,
      maxScore,
    });
  }
}
