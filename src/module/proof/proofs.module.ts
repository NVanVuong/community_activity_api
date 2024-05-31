import { TypeOrmModule } from '@nestjs/typeorm';
import { ProofsController } from './proofs.controller';
import { ProofsService } from './proofs.service';
import { Module } from '@nestjs/common';
import { Proof } from 'src/entity/proof.entity';
import { UserActivitiesModule } from '../user-activities/user-activities.module';
import { ActivitiesModule } from '../activities/activities.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { UserActivity } from 'src/entity/user-activity.entity';
import { User } from 'src/entity/user.entity';
import { Activity } from 'src/entity/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Proof, UserActivity, User, Activity]),
    AuthModule,
    UserActivitiesModule,
    ActivitiesModule,
    UsersModule,
  ],
  controllers: [ProofsController],
  providers: [ProofsService],
})
export class ProofsModule {}
