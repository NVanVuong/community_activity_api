import { UserActivitiesService } from './user-activities.service';
import { UserActivitiesController } from './user-activities.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserActivity } from 'src/entity/user-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserActivity])],
  controllers: [UserActivitiesController],
  providers: [UserActivitiesService],
  exports: [UserActivitiesService],
})
export class UserActivitiesModule {}
