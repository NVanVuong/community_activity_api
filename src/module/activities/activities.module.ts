import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UserActivitiesModule } from '../user-activities/user-activities.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    CategoriesModule,
    UserActivitiesModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
