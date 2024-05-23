import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityCategory } from 'src/entity/activity-category.entity';
import { ActivitySubcategory } from 'src/entity/activity-subcategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityCategory, ActivitySubcategory])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
