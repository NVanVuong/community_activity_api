import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { OrganizationsModule } from '../organization/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
    CategoriesModule,
    UserActivitiesModule,
    CloudinaryModule,
    OrganizationsModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
