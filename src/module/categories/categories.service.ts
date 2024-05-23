import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityCategory } from 'src/entity/activity-category.entity';
import { ActivitySubcategory } from 'src/entity/activity-subcategory.entity';
import { Repository } from 'typeorm';
import {
  ActivityCategoryDto,
  ActivitySubcategoryDto,
} from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(ActivityCategory)
    private activityCategoryRepository: Repository<ActivityCategory>,
    @InjectRepository(ActivitySubcategory)
    private activitySubcategoryRepository: Repository<ActivitySubcategory>,
  ) {}

  async getActivityCategories() {
    return await this.activityCategoryRepository.find();
  }

  async getActivityCategoryById(id: string) {
    console.log('id', id);

    return await this.activityCategoryRepository.findOne({ where: { id } });
  }

  async getActivitySubcategoryById(id: string) {
    return await this.activitySubcategoryRepository.findOne({ where: { id } });
  }

  async getActivitySubcategoriesByCategoryId(categoryId: string) {
    return await this.activitySubcategoryRepository.find({
      where: { activityCategory: { id: categoryId } },
    });
  }

  async createActivityCategory(activityCategoryDto: ActivityCategoryDto) {
    const activityCategory =
      this.activityCategoryRepository.create(activityCategoryDto);
    return await this.activityCategoryRepository.save(activityCategory);
  }

  async createActivityCategories(activityCategories: ActivityCategoryDto[]) {
    const newActivityCategories = activityCategories.map((category) =>
      this.activityCategoryRepository.create(category),
    );
    return await this.activityCategoryRepository.save(newActivityCategories);
  }

  async createActivitySubcategory(
    activitySubcategoryDto: ActivitySubcategoryDto,
  ) {
    const { name, minScore, maxScore, categoryIndex } = activitySubcategoryDto;
    const activityCategory = await this.activityCategoryRepository.findOne({
      where: { index: categoryIndex },
    });
    const newActivitySubcategory = this.activitySubcategoryRepository.create({
      name,
      minScore,
      maxScore,
      activityCategory,
    });
    return await this.activitySubcategoryRepository.save(
      newActivitySubcategory,
    );
  }

  async createActivitySubcategories(
    activitySubcategories: ActivitySubcategoryDto[],
  ) {
    return activitySubcategories.map((subcategory) =>
      this.createActivitySubcategory(subcategory),
    );
  }

  async deleteActivityCategory(id: string) {
    return await this.activityCategoryRepository.delete(id);
  }

  async deleteActivitySubcategory(id: string) {
    return await this.activitySubcategoryRepository.delete(id);
  }

  async updateActivityCategory(id: string, name: string) {
    return await this.activityCategoryRepository.update(id, { name });
  }

  async updateActivitySubcategory(
    id: string,
    activitySubcategoryDto: ActivitySubcategoryDto,
  ) {
    const { name, minScore, maxScore, categoryIndex } = activitySubcategoryDto;
    const activityCategory = await this.activityCategoryRepository.findOne({
      where: { index: categoryIndex },
    });

    return await this.activitySubcategoryRepository.update(id, {
      name,
      minScore,
      maxScore,
      activityCategory,
    });
  }
}
