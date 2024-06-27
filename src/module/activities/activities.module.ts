import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/entity/activity.entity';
import { CategoriesModule } from '../categories/categories.module';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { OrganizationsModule } from '../organization/organizations.module';
import { RolesModule } from '../roles/roles.module';
import { Role } from 'src/entity/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Role]),
    CategoriesModule,
    UserActivitiesModule,
    CloudinaryModule,
    OrganizationsModule,
    RolesModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
